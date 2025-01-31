from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from flask_cors import CORS
from pymongo import MongoClient
import random
import os
from bson import ObjectId
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = "mongodb+srv://aryan:aryanpass@cluster0.gknmk.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client['Smart_Parking_System']
users_collection = db['auth']
otp_collection = db['otp']
venues_collection = db['venues']

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'supersecretkey'

# Flask-Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'testmsc1234@gmail.com'
app.config['MAIL_PASSWORD'] = 'yjhigaknzouuoyof'

# Initialize Extensions
bcrypt = Bcrypt(app)
from bcrypt import hashpw, gensalt, checkpw
jwt = JWTManager(app)
mail = Mail(app)

# Helper: Generate OTP
def generate_otp():
    return str(random.randint(100000, 999999))

# Helper: Send OTP Email
def send_otp_email(email, otp):
    msg = Message('Your OTP Code', sender=app.config['MAIL_USERNAME'], recipients=[email])
    msg.body = f'Your OTP code is: {otp}. It expires in 10 minutes.'
    mail.send(msg)

def send_email_forgot(to_email, otp):
    msg = Message('Your OTP Code', sender=app.config['MAIL_USERNAME'], recipients=[to_email])
    msg.body = f'Your OTP code for changing the password is: {otp}. It expires in 10 minutes.'
    mail.send(msg)

# Route: Send OTP
@app.route('/auth/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')
    existing_user = users_collection.find_one({'email': email})
    if existing_user:
        return jsonify({'error': 'User already exists'}), 401
    # Generate OTP
    otp = generate_otp()
    expiry_time = datetime.utcnow() + timedelta(minutes=10)

    # Store OTP in `otp_collection`
    otp_collection.update_one(
        {'email': email},
        {'$set': {'otp': otp, 'expires_at': expiry_time}},
        upsert=True
    )

    # Send OTP
    send_otp_email(email, otp)
    return jsonify({'message': 'OTP sent successfully'}), 200

# Route: Sign Up (Verifies OTP)
@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json
    name, email, phone, password, otp = (
        data.get('name'),
        data.get('email'),
        data.get('phone'),
        data.get('password'),
        data.get('otp'),
    )

    # Verify OTP
    stored_otp = otp_collection.find_one({'email': email})
    if not stored_otp or stored_otp['otp'] != otp:
        return jsonify({'error': 'Invalid or expired OTP'}), 400

    # Delete OTP after successful verification
    otp_collection.delete_one({'email': email})

    # Hash password and store user
    hashed_password = bcrypt.generate_password_hash(password)  # Do not decode here
    user = {'name': name, 'email': email, 'phone': phone, 'password': hashed_password}
    users_collection.insert_one(user)

    return jsonify({'message': 'User registered successfully'}), 201

# Route: Login
@app.route('/auth/login', methods=['POST'])
def verify_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Basic validation
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Find the user from the database
    stored_user = users_collection.find_one({'email': email})
    
    if not stored_user:
        # Return 404 when the user is not found
        return jsonify({'error': 'User not found'}), 404
    
    # Check the hashed password
    if not checkpw(password.encode('utf-8'), stored_user['password']):
        # Return 401 for invalid password
        return jsonify({'error': 'Invalid password'}), 401
    
    return jsonify({'status': 'success', 'message': 'Logged in successfully'}), 200

# Route: Fetch all venues
@app.route('/venue', methods=['GET'])
def get_venues():
    try:
        venues = venues_collection.find()
        venue_list = []
        
        for venue in venues:
            # MongoDB object _id is not serializable by default, so convert it to string
            venue['_id'] = str(venue['_id'])
            venue_list.append(venue)
        
        return jsonify(venue_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route: Verify OTP
@app.route('/auth/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email, otp = data.get('email'), data.get('otp')

    stored_otp = otp_collection.find_one({'email': email})
    if not stored_otp or stored_otp['otp'] != otp:
        return jsonify({'error': 'Invalid OTP'}), 400

    otp_collection.delete_one({'email': email})
    return jsonify({'message': 'OTP verified successfully'}), 200


@app.route('/auth/forgot', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    # Check if the user exists
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Generate a 6-digit OTP
    otp = str(random.randint(100000, 999999))
    expiry_time = datetime.utcnow() + timedelta(minutes=10)  # OTP valid for 10 minutes

    # Save OTP in the database
    otp_collection.update_one(
        {"email": email},
        {"$set": {"otp": otp, "expires_at": expiry_time}},
        upsert=True
    )

    # Send OTP email
    send_email_forgot(email, otp)
    return jsonify({'message': 'OTP sent successfully'}), 200

@app.route('/auth/update', methods=['POST'])
def update_password():
    """API endpoint for updating user password"""
    data = request.json
    email = data.get('email')
    new_password = data.get('password')
    otp = data.get('otp')

    if not email or not new_password or not otp:
        return jsonify({'error': 'Email, OTP, and new password are required'}), 400

    # Find OTP record
    otp_record = otp_collection.find_one({"email": email})

    if not otp_record:
        return jsonify({'error': 'OTP not found'}), 404

    # Check OTP validity
    if otp_record["otp"] != otp:
        return jsonify({'error': 'Invalid OTP'}), 401

    if datetime.utcnow() > otp_record["expires_at"]:
        return jsonify({'error': 'OTP expired'}), 403

    # Hash the new password
    hashed_password = bcrypt.generate_password_hash(new_password)

    # Update user password in the database
    users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

    # Delete OTP after successful password reset
    otp_collection.delete_one({"email": email})

    return jsonify({'success': True, 'message': 'Password updated successfully'}), 200

@app.route('/venuebyID', methods=['GET'])
def get_venue_by_id():
    venue_id = request.args.get('venueId')  # Get venueId from query parameters
    print(venue_id)
    if not venue_id:
        return jsonify({'error': 'Venue ID is required'}), 400

    try:
        # Convert venueId to ObjectId
        venue_id = ObjectId(venue_id)

        venue = venues_collection.find_one({"_id": venue_id})
        if not venue:
            return jsonify({'error': 'Venue not found'}), 404

        venue['_id'] = str(venue['_id'])  # Convert ObjectId to string for JSON serialization
        return jsonify(venue), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

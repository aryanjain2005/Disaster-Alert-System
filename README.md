# Smart-Parking-System
## 1. Introduction
- **Project Name:** Smart Parking System  
- **Developed By:** Group No. 2    
- **Team Members:**    
    - Harmandeep Singh  B22208 <br />
    - Sanchitdeep Singh B22128 <br />
    - Kushal Singh Bijarniya  B22113 <br />
    - Gagandeep Singh  B22104 <br />
    - Aryan Jain  B22092 <br />
    - Eshaan  B22039 <br />
    - Siddharth Shainesh  B22135 <br />
    - E. Vrinchi  B22011 <br />

### Description
_The Smart Parking System Website is an intuitive online platform that allows users to easily search, reserve, and pay for parking slots in advance. Designed for convenience and efficiency, the website ensures hassle-free parking by providing real-time availability updates, secure digital payments, and automated entry systems._  

---

## 2. Tech Stack
- **Frontend:** ReactJS, Javascript, Typescript, Tailwind CSS
- **Backend:** Flask[Python]
- **Database:** MongoDB

## 3. Usage Guide
### 3.1 How to Create Account
1. Click on Sign up button.
![Sign Up](./images/login_page.png)

2. Enter your email and click on "Enter".
![Enter email](./images/signup_email.png)
3. You will receive OTP on your email. Enter the required details along with OTP and click on "Enter".
![Enter details](./images/signup_form.png)
Your account has been created and now are ready to login and book parking slots for your vehicles.
  

### 3.2 How to Book a Parking Slot
1. Login to your account by entering email and password.
2. Select venue where you want to book a parking slot.
![select venue](./images/main_screen.png)
3. Select date and time slot and click on Submit. Each time slot books a slot for exactly 1 hour. If you want to book for more than 1 hour select as many time slots as you require. For example, if you select 2:00 AM slot, then slot will be booked from 2:00 AM to 2:59 AM.
![Date and Time Slot](./images/slot_selection.png)
4. Select a Parking Slot which is available and click on Pay Now.
![Slot](./images/parking_slot.jpeg)
5. Proceed to pay.
![Payment](./images/payment.png)
6. After successful transaction, you will receive a message confirming your booking.
![Confirmation](./images/confirmation.png)
You will also receive confirmation mail along with 2 OTPs which will be required at the venue for entering and exiting the parking area.
In case you stay in the parking slot beyond your booked time slot, you have to pay extra which will be collected while exiting the parking area.

### 3.3 How to Reset Password
1. Click on forgot password.
![Login Page](./images/login_page.png)
2. Enter your email you used earlier for creating your account.
![Forgot Password](./images/forgot_pass.png)
3. You will receive OTP on your email. Enter OTP and new password and click on "Enter".
![enter Password](./images/enter_pass.png)
Now you are ready to login again.

---

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

## 3. User Guide
### 3.1 How to Create Account
1. Click on "Sign up" in the login page.
![Sign Up](./images/login_page.png)
2. Enter your email and press "Enter".
![Enter email](./images/signup_email.png)
3. You will receive an OTP on your email. Enter the required details along with the OTP and press "Enter".
![Enter details](./images/signup_form.png)
Your account has been created and you are now ready to login and book parking slots as per your requirement and the availability.
  

### 3.2 How to Book a Parking Slot
1. Login to your account using the registered email and password.
2. Select the required venue.
![select venue](./images/main_screen.png)
3. Select date and time slot and click on "Submit" (this button enables only when you select at least one date and one time slot). Each time slot blocks exactly 1 hour. For example, if you select the 2:00 AM slot, then the booking will be made from 2:00 AM to 2:59 AM only. If you want to book for more than 1 hour select as many time slots as you require.
![Date and Time Slot](./images/slot_selection.png)
4. Select desired Parking Slot(s) which is(are) available and click on "Pay Now". The total is calculated as per the previous(step 3) and present(step 4) selections.
![Slot](./images/parking_slot.jpeg)
5. Proceed to pay with your comfortable mode of payment.
![Payment](./images/payment.png)
6. After a successful transaction, you will receive a pop-up confirming your booking.
![Confirmation](./images/confirmation.png)
You will also receive a confirmation email with the booking details and 2 OTPs which will be required at the venue for entering and exiting the parking area.
In case you stay in the parking slot beyond your booked time slot, you have to pay extra which will be collected while exiting the parking area.
This extra payment will be calculated based on the time we enter the 2nd OTP while exiting.

### 3.3 How to Reset Password
1. Click on "Forgot Password?" in the login page.
![Login Page](./images/login_page.png)
2. Enter your registered email.
![Forgot Password](./images/forgot_pass.png)
3. You will receive an OTP on your email. Enter OTP and the new password and press "Enter".
![enter Password](./images/enter_pass.png)
The password has been reset. Now you are ready to login using the new reset password.

---

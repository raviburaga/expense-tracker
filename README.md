
# Live: 
  https://expense-tracker-ravi.vercel.app/

# Expense Tracker Application

## Overview

Welcome to the Expense Tracker application! This tool is designed to help you manage your finances by providing a seamless and intuitive way to track your expenses. With features like visual representation of expenses, authentication, and comprehensive expense management, you can easily monitor and analyze your spending patterns.

## How Expense Tracker Helps in Daily Life

Managing finances can be a daunting task, but with our Expense Tracker application, it becomes effortless and straightforward. The application helps you:

- **Track Spending:** Keep a detailed record of your daily, monthly, and yearly expenses.
- **Budget Management:** Monitor your spending habits and adjust your budget accordingly.
- **Financial Insights:** Gain insights into your spending patterns with visual summaries.
- **Expense Categorization:** Organize your expenses into different categories for better analysis.
- **Secure Data:** Keep your financial data secure with user authentication.

By using the Expense Tracker, you can take control of your finances, make informed decisions, and work towards your financial goals with confidence.

## Features

### Authentication
- **Login Page:** Secure login for returning users.
  ![Screenshot 2024-07-18 084327](https://github.com/user-attachments/assets/cef0fec3-792f-40ec-b6c7-1db439c52bd3)

- **Signup Page:** New users can create an account.
  ![Screenshot 2024-07-18 084515](https://github.com/user-attachments/assets/6d43c58e-e74e-4c7c-b9de-01f44c104c4e)

### HomePage

![Screenshot 2024-07-18 084636](https://github.com/user-attachments/assets/7fe37d13-cef9-4997-b8b2-c47f09454feb)

- **Add Expense**
  
![Screenshot 2024-07-18 084707](https://github.com/user-attachments/assets/9ca805ae-e5f3-4765-bf09-2ac8d66acfb6)

-**Exnpenses List**

![Screenshot 2024-07-18 084735](https://github.com/user-attachments/assets/a05f2c64-bf32-4475-9593-6f53ac144826)

- **Summary**

![Screenshot 2024-07-18 084749](https://github.com/user-attachments/assets/2e4e3081-a115-4e81-9010-2efbde8210dc)


- **Visual Representation**

![Screenshot 2024-07-18 084802](https://github.com/user-attachments/assets/6cde4138-bf58-4054-badf-f02c173a2d67)




    


### Protected Routing
- **Secure Access:** Only authenticated users can access the main features of the application. This ensures that your data is protected and only accessible to you.
- **User-Specific Data:** Each user has a personalized dashboard displaying their own expenses and summary.
- **Protected Routes:** Routes within the application are protected and can only be accessed after successful authentication. This adds an extra layer of security to ensure that user data is not compromised.

### Expense Management
- **Add Expense:** Users can add new expenses with ease.
- **Remove Expense:** Users can remove unwanted expenses.
- **Edit Expense:** Users can edit existing expenses to keep their records accurate.

### Visual Expense Representation
- **Summary Division:** Visual representation of expenses on a yearly, monthly, and daily basis enhances user experience and provides clear insights into spending habits.

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **Tailwind CSS**: For styling the application with a modern and responsive design.

### Backend
- **Node.js**: For building the backend server.
- **Express**: For creating RESTful APIs.
- **MongoDB**: For storing user and expense data.

## Deployment

### Backend Deployment on Render.com

We have deployed the backend of our Expense Tracker application on Render.com. Render.com provides a reliable and scalable platform for hosting web applications and APIs. Here’s how we did it:

1. **Create a Render Account:**
   - Sign up for an account on [Render.com](https://render.com/).

2. **Create a New Web Service:**
   - In the Render dashboard, click on "New" and select "Web Service".
   - Connect your GitHub repository containing the backend code.
   - Follow the prompts to configure the service (select the branch, set the build and start commands).

3. **Configure Environment Variables:**
   - In the Render service settings, add the necessary environment variables such as MongoDB URI, JWT secret, and other configuration settings.

4. **Deploy:**
   - Click on "Deploy" to start the deployment process. Render will build and deploy your backend service.
   - Once deployed, you will get a URL for your backend API.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB instance or account.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   - Create a `.env` file in the root of the project.
   - Add the following environment variables:
     ```
     MONGODB_URI=your-mongodb-uri
     JWT_SECRET=your-jwt-secret
     ```

4. **Run the application:**
   ```bash
   npm start
   ```

### Usage
- Open your browser and navigate to `http://localhost:3000`.
- Sign up for a new account or login with an existing account.
- Start managing your expenses!

## Contributing

We welcome contributions! If you would like to contribute, please fork the repository and submit a pull request.


```


# Kitchen Order Management System

## Overview

This project is a Kitchen Order Management System that allows users to place orders through a Point of Sale (POS) screen. The orders then appear on a Kitchen Display System (KDS) screen in the kitchen for the chef to process. The system is built using Firebase for real-time updates and authentication, with the server running on Node.js.

## Table of Contents

- [Installation](#installation)
- [Running the Server](#running-the-server)
- [Features](#features)
- [Admin Login](#admin-login)
- [Future Features](#future-features)

## Installation

1. Clone the repository to your local machine.
   
2. Navigate to the project directory:
    ```bash
    cd kitchen-system
    ```

3. Install the necessary dependencies:
    ```bash
    npm install
    ```

## Running the Server

To run the server, follow these steps:

1. Navigate to the server directory:
    ```bash
    cd src/assests/server
    ```

2. Start the server:
    ```bash
    node server.js
    ```

The server will be running, and you can now access the system.

## Features

- **POS Screen**: Users can place orders through the Point of Sale screen.
- **KDS Screen**: Orders placed by users appear in real-time on the Kitchen Display System for the chef to see and process.
- **Firebase Integration**: The system uses Firebase for real-time database updates and authentication.
- **Admin Login**: Admins can log in to view the kitchen screen and manage orders.

## Admin Login

To log in as an admin and access the kitchen screen, use the following credentials:

- **Email**: `aya@gmail.com`
- **Password**: [Your specified password]

Once logged in, you will be able to view the kitchen screen where orders placed by users will appear in real-time for the chef to process.


## Future Features

- **Payment Handling**: Implement payment processing for orders.
- **Product-Order Relations**: Create relationships between products and order items using a backend language and framework for more complex order management.




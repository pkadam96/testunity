# DevTools Network Monitor

This project is a replica of the network monitoring functionalities of Google Chrome's DevTools, implemented as part of a job screening round. The application is built using ReactJS and Puppeteer, and aims to provide request monitoring, detailed request information, and filtering capabilities.

## Demo

Frontend deployed link is [Here](https://devtools-beta.vercel.app/).
Backend deployed link is [Here](https://testunity-4.onrender.com/).

## Features

1. **Request Monitoring**
   - List all network requests made by the page.

2. **Request Details**
   - Show detailed information about each request.

3. **Filtering**
   - Allow filtering of network requests by type (XHR, JS, CSS, etc.).

## Tech Stack

- **Framework:** ReactJS
- **HTTP Client:** Axios
- **Backend:** Node.js with Puppeteer
- **CORS Handling:** Express with CORS middleware

## Setup Instructions

1. **Clone the repository:**

    ```bash
    git clone https://github.com/pkadam96/testunity.git
    cd testunity
    ```

2. **Install dependencies:**

    ```bash
    cd devtools
    npm install
    ```

3. **Run the backend server:**

    ```bash
   cd backend
   npm install
   npm start
    ```

4. **Run the frontend application:**

    ```bash
    npm run dev
    ```

## Usage

1. Open the application in your browser.
2. Enter the URL you want to monitor and submit.
3. View the network requests and their details.
4. Use filters to narrow down the requests by type.

# Thank You

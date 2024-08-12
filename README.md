# ClassMate

ClassMate is a web application exclusively for college students, designed to be a helpful companion in managing their academic life. It provides features like study planning, assignment tracking, note-sharing, forums, and more.

## Features

- User Registration and Authentication
- Email Verification
- Study Planner and Assignment Tracker
- Note-Sharing Platform
- Student Forums and Discussion Boards

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer

## Setup and Installation

### Prerequisites

- Node.js and npm installed
- MongoDB instance running
- Git installed

### Backend Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/LokeshVrma/ClassMate.git
    cd backend
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Create a `.env` file** in the root directory and add the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongo_db_connection_string
    JWT_SECRET=your_jwt_secret
    EMAIL_SERVICE=gmail
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_password
    NODE_ENV=development
    ```

4. **Run the backend server**:
    ```sh
    npm start
    ```

### Frontend Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/LokeshVrma/ClassMate.git
    cd frontend
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Create a `.env` file** in the root directory and add the following variable:
    ```env
    REACT_APP_API_BASE_URL=http://localhost:5000
    ```

4. **Run the frontend development server**:
    ```sh
    npm start
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any queries or support, please contact us at classmateonweb@gmail.com.

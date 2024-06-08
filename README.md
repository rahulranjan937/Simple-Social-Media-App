# Instagram-Clone-Backend

Welcome to Instagram-Clone-Backend, a dynamic and interactive social media app built with Node.js, TypeScript, Express, and MongoDB. This project empowers users to create accounts, share media, and connect by following each other. Designed using the robust MVC pattern, this app serves as an excellent learning tool for anyone interested in mastering the development of social media applications. Please note that this is a work in progress and is not intended for production use.

## 🚀 Getting Started

Ready to dive in? Follow these steps to get the project up and running on your local machine for development and testing purposes. For live system deployment, check out the deployment section.

## 🌟 Features

This project includes the following features to provide a comprehensive social media experience:

- **User Authentication**: Securely create accounts, log in, and manage user sessions.
- **Post Media**: Upload and share photos and videos with your followers.
- **Follow Users**: Follow other users to see their posts in your feed.
- **Feeds**: View a curated feed of posts from the users you follow.
- **Chat Function**: Real-time messaging with other users to stay connected.
- **Notifications**: Stay updated with notifications for likes, comments, and new followers (coming soon).

### Prerequisites

Ensure you have the following software installed:

- **Node.js** - Download and install from [Node.js](https://nodejs.org/en/).
- **Postman** - Download and install from [Postman](https://www.getpostman.com/). (Optional)
- **Docker** - Download and install from [Docker](https://www.docker.com/). (Optional)

### Installation Steps

Here’s how you can set up your development environment in just a few simple steps:

1. **Clone the repository**:

    ```sh
    git clone https://github.com/rahulranjan937/instagram-clone-backend.git
    cd Simple-Social-Media-App
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

3. **Set up environment variables**:

    ```sh
    cp .env.example .env
    ```

    Then, open the `.env` file and replace the placeholder values with your own.

4. **Start the server in development mode**:

    ```sh
    npm run dev
    ```

5. **Start the server in production mode**:

    Before starting the server in production mode, you need to build the TypeScript files:

    ```sh
    npm run build
    ```

    Then, start the server:

    ```sh
    npm start
    ```

### Running with Docker

If you prefer using Docker, follow these steps to get started:

1. **Build the Docker image**:

    ```sh
    docker build -t instagram-clone-backend .
    ```

2. **Run the Docker container**:

    ```sh
    docker run -d -p 3000:3000 --env-file .env instagram-clone-backend
    ```

## 📚 API Documentation

Detailed documentation for the API endpoints is available in the `API_Documentation.md` file. This will guide you through using the various features and endpoints of the app.

## 👥 Authors

Crafted with care by [Rahul Ranjan](https://github.com/rahulranjan937).

This project has been modified and adapted to create an engaging Instagram-Clone-Backend experience. Happy coding!

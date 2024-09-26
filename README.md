# Fullstack Project

## Project Description
This project is a fullstack application based on the MERN stack (MongoDB, Express, React, Node.js) with a Docker-based setup. Follow the README to setup environments dependencies and how to run the application in a Docker environment.

## Prerequisites
- Docker
- Docker Compose

## Setup Instruction
### 1. Clone the repository to your local machine.

### 2. Make a .env file in the backend folder. Make sure the file includes:
     MONGODB_URI=mongodb://mongo:27017/mainDB
     PORT=5000
     JWT_SECRET=superSecretKey123

### 3. Build and run with Docker by using this command:
     docker-compose up --build
    
### The command will:
- build Docker images for the frontend & backend.
- start a MongoDB container
- start a backend container on port 5000
- start a frontend container on port 6173

### 4. Access the containers by going into either: 
     http://localhost:5173 (frontend)
     http://localhost:5000/api (backend)
     
     For MongoDB use MongoDB Compass and connect to:

     localhost:27017

### 5. If you make changes to the project, simply run this command:
     docker-compose up

### 6. Any changes to the Dockerfile or package.json, simply run this:
     docker-compose up --build


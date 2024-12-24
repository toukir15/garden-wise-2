
# Garden-Wise

## Introduction
Garden Wise is a vibrant social media platform designed exclusively for gardening enthusiasts and professionals. It serves as a community hub where users can share their passion for plants, exchange gardening tips, and discover the joy of growing. Whether you’re a beginner looking for advice or an expert showcasing your garden, Garden Wise is the perfect platform to connect, learn, and inspire.
## Project Decription
### Purpose
The purpose of Garden Wise is to simplify gardening for everyone by providing a centralized platform that fosters knowledge sharing, problem-solving, and inspiration within the gardening community. Whether you’re a seasoned gardener or just starting, Garden Wise aims to:
Empower users to share tips, techniques, and seasonal gardening advice.
Offer solutions to common gardening challenges through shared experiences and professional insights.
Build a supportive community where enthusiasts and professionals can connect and collaborate.
Enhance learning with premium content for advanced gardening techniques and expert guidance.
Make gardening more accessible and enjoyable by promoting innovation and sustainable practices.
### Goals
1. **Foster a Thriving Gardening Community**: Build an engaging platform where gardening enthusiasts and professionals can share knowledge, tips, and experiences.
2. **Simplify Gardening Challenges**: Provide users with actionable solutions to common gardening problems through shared expertise and resources.
3. **Promote Knowledge Sharing:**: Encourage users to post high-quality gardening content, including seasonal guides, techniques, and care tips.
4. **Enable User Interaction**: Create a space for meaningful interactions through features like comments, likes, and content sharing.
5. **Deliver Premium Content**: Offer exclusive access to advanced gardening techniques and expert insights for users seeking deeper knowledge.

## Features

- **News Feed**: A dynamic feed where users can explore gardening tips, seasonal guides, and shared posts from the community.
- **Search and Filters**: Advanced search functionality with filters for topics, tags, and user interests to help users quickly discover relevant content.
- **Admin Dashboard**: A powerful admin panel to manage posts, monitor user activities, and oversee content and payment-related activities.
- **User Verification and Payments**:A secure payment system to verify users and provide access to exclusive premium gardening content.
- **Responsive Design**: A fully responsive design that ensures a seamless experience across devices, including desktops, tablets, and smartphones.
- **Token-Based Authentication**: A robust authentication system to secure user accounts, enabling safe login and role-based access control.

## Technology Stack

- **Frontend**:
  - HTML
  - CSS
  - Tailwind CSS
  - JavaScript
  - Next.js
  - TypeScript

- **Backend**:
  - Node.js
  - Express

- **Database**:
  - MongoDB
  - Mongoose

### Installation Guideline

Follow these instructions to set up the project locally on your machine.

#### Prerequisites

Make sure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (either local or using a cloud service like MongoDB Atlas)

#### Clone the Repository

1. Clone the repository from GitHub:

   ```bash
   git clone https://github.com/toukir15/Meeting-Room-Booking-System-Part-2.git
   ```

### Install server dependencies and start the backend server

   ```bash
   cd server
   ```
   ```bash
  npm install
   ```
   ```bash
  npm run start:dev
   ```

### Install client dependencies and Start the frontend development server

   ```bash
   cd client
   ```
   ```bash
  npm install
   ```
   ```bash
  npm run dev
   ```

## Configuration

To configure the project for local development or deployment, follow these steps:

### Setting up Environment Variables

1. Create a `.env` file inside the server directory of the project if it doesn't already exist.

2. Add the necessary configuration variables to the `.env` file. Here are the variables used in our project:

   ```bash
   PORT=5000
   DATABASE_URL=your_mongodb_uri
   CLOUDINARY_CLOUD_NAME=your_cludinay_name
   CLOUDINARY_API_KEY=your_cludinay_api_key
   CLOUDINARY_API_SECRET=your_cludinay_api_secret
   STRIPE_SECRET=your_stripe_secret
   NODE_ENV=production
   BCRYPT_SALT_ROUND=10
   SECRET_KEY=your secret_key
   CLIENT_URL=your_client_url
   STRIPE_CLI=your_stripe_cli
   STRIPE_ENDPOINT_SECRET= your_stripe_endpoint
   ```

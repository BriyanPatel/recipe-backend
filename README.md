# Recipe Finder Application

This project is a Recipe Finder application that uses the Spoonacular API to fetch recipes. Follow the step-by-step instructions below to set up the project and run it.

## Step 1: Clone the Repository

First, clone the repository to your local machine:

git clone https://github.com/your-username/recipe-finder.git
cd recipe-finder

## Step 2: install dependency

npm install

## Step 3: Create `.env` File and Add Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
PORT=8000
MONGODB_URI=<your uri>
ACCESS_TOKEN_SECRET=123456
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=9876543
REFRESH_TOKEN_EXPIRY=10d
SPOONACULAR_API_KEY=<your key>

```
## Step 4: Run the Application in Development Mode

npm run dev





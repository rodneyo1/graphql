# GraphQL Profile Page

A profile page that displays user information from a GraphQL API, including statistics visualized with SVG graphs.

## Features

- User authentication with JWT
- Display of user information from GraphQL API
- SVG-based statistics graphs:
  - XP progress over time
  - Project pass/fail ratio
- Responsive design

## Technologies Used

- HTML, CSS, JavaScript
- GraphQL for data fetching
- SVG for data visualization
- JWT for authentication

## Setup and Deployment

1. Clone this repository
2. Open `index.html` in your browser for local testing
3. Deploy to your preferred hosting service:
   - GitHub Pages
   - Netlify
   - Vercel
   - etc.

## API Endpoints

- Authentication: `https://learn.zone01kisumu.ke/api/auth/signin`
- GraphQL: `https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql`

## Project Structure

- `index.html` - Entry point
- `login.html` - Login page
- `profile.html` - Profile page with user data and graphs
- `css/` - Stylesheets
- `js/` - JavaScript files
  - `auth.js` - Authentication logic
  - `graphql.js` - GraphQL queries
  - `profile.js` - Profile page logic
  - `graphs.js` - SVG graph generation

## How to Use

1. Open the application
2. Log in with your Zone01 credentials
3. View your profile information and statistics
4. Log out when finished

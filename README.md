# FitHub - Personal Workout Journal

A MERN stack application for tracking workouts with GitHub-style contribution graphs.

## Project Structure

\`\`\`
fithub/
├── client/               # Next.js frontend
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── context/          # Context providers
│   ├── services/         # API services
│   └── ...
├── server/               # Express backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── .env              # Environment variables
│   ├── package.json      # Backend dependencies
│   └── server.js         # Entry point
└── README.md             # Project documentation
\`\`\`

## Features

- User authentication (register, login, logout)
- Workout tracking (create, read, update, delete)
- Exercise management with sets, reps, and weights
- GitHub-style contribution heatmap
- Dashboard with workout statistics
- Multiple theme options

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/fithub.git
cd fithub
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
   - Create a `.env` file in the server directory based on `.env.example`
   - Create a `.env.local` file in the client directory based on `.env.local.example`

4. Start the development servers:
\`\`\`bash
npm run dev
\`\`\`

This will start both the client (Next.js) and server (Express) concurrently.

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Deployment

### Backend

1. Deploy the server to a platform like Vercel, Railway, or Render
2. Set up the required environment variables
3. Connect to MongoDB Atlas for production

### Frontend

1. Deploy the Next.js client to Vercel
2. Set the `NEXT_PUBLIC_API_URL` environment variable to your deployed backend URL

## License

MIT

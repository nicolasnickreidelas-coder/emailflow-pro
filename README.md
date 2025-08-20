# EmailFlow Pro

Advanced email marketing platform with AI-powered campaigns, analytics, and automation.

## Features

- 🤖 AI-powered email generation with Groq/OpenAI
- 📧 Gmail API integration for seamless sending
- 📊 Advanced analytics and reporting
- 🎨 Beautiful React frontend with TypeScript
- ⚡ Fast Hono backend on Cloudflare Workers
- 🔐 Secure authentication system
- 📱 Responsive design with Tailwind CSS
- 📈 Real-time dashboard analytics

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation
- Axios for API calls

**Backend:**
- Hono framework on Cloudflare Workers
- SQLite database with D1
- JWT authentication
- Groq/OpenAI AI integration
- Gmail API integration

## Quick Start

1. Install dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
```bash
cp backend/.env.example backend/.env
# Fill in your API keys and configurations
```

3. Run development servers:
```bash
npm run dev
```

4. Deploy to production:
```bash
npm run deploy
```

## Environment Variables

See `backend/.env.example` for required environment variables.

## License

MIT License - see LICENSE file for details.

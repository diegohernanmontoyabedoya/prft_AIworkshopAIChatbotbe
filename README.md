# AI-Powered Chatbot Order Status Service

A Node.js/Express chatbot service for e-commerce order status, product info, and FAQs.  
Features authentication, chat with LLM integration, and knowledge base retrieval.

## Getting Started

1. Install dependencies:  
   `npm install`

2. Create a `.env` file with the following (replace with your own secrets):
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_here
   OPENAI_API_KEY=sk-...
   ```

3. Start the server:  
   `npm start`

## How to Get a JWT Token and Use the /chat Endpoint

1. **Register a user:**
   ```sh
   curl -X POST http://localhost:3000/users/register \
     -H "Content-Type: application/json" \
     -d '{"email":"testuser@example.com","password":"testpass123"}'
   ```

2. **Log in to get a JWT token:**
   ```sh
   curl -X POST http://localhost:3000/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"testuser@example.com","password":"testpass123"}'
   ```
   - The response will look like:
   ```
   { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..." }
   ```
   - Copy the `"token"` value from the response.

3. **Send a chat message using your JWT token:**
   ```sh
   curl -X POST http://localhost:3000/chat \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{"message": "Can you tell me the status of my order?"}'
   ```
   - Replace `YOUR_JWT_TOKEN_HERE` with the token you received from the login step.

## Endpoints

- `POST /users/register` — Register a new user
- `POST /users/login` — Login and receive a token
- `POST /chat` — Chat with the AI assistant (auth required)
- `GET /orders/:id` — Get order status
- `GET /products/:id` — Get product info
- `GET /faq?query=...` — Retrieve FAQ answers

## Project Structure

See `/routes`, `/controllers`, `/middleware`, `/models`, `/data`.
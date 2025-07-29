# User Stories for AI-Powered Chatbot Order Status Service

---

## 1. Online Shopper: Check Order Status

- **Persona:** Online Shopper
- **Story:** As a shopper, I want to check the status of my order so I know when to expect delivery.
- **Benefit:** Reduces uncertainty and improves customer satisfaction.
- **Acceptance Criteria:**
  - Shopper can enter an order ID.
  - Chatbot responds with current order status and estimated delivery date.
- **Endpoint:** `GET /orders/{id}`

---

## 2. New Customer: Product Inquiry

- **Persona:** Prospective Customer
- **Story:** As a new customer, I want to ask questions about a product so I can make an informed purchase.
- **Benefit:** Increases conversion by providing instant answers.
- **Acceptance Criteria:**
  - Customer can ask about product features, price, or availability.
  - Chatbot provides accurate, relevant information.
- **Endpoint:** `GET /products/{id}`

---

## 3. Registered User: Start a Chat Session

- **Persona:** Registered User
- **Story:** As a registered user, I want to chat with the AI assistant about my orders or products.
- **Benefit:** Provides a seamless support experience.
- **Acceptance Criteria:**
  - User can send messages to `/chat`.
  - Chatbot responds in a polite, customer-focused manner.
- **Endpoint:** `POST /chat`

---

## 4. Customer: Register and Login

- **Persona:** Customer
- **Story:** As a customer, I want to register and log in so my chats and orders are secure and personalized.
- **Benefit:** Protects user data and enables personalized service.
- **Acceptance Criteria:**
  - User can register with email and password.
  - User can log in and receive a session token.
- **Endpoints:** `POST /users/register`, `POST /users/login`

---

## 5. Customer: Retrieve FAQ

- **Persona:** Customer
- **Story:** As a customer, I want to get answers to common questions about shipping, returns, and payments.
- **Benefit:** Reduces support workload and improves user experience.
- **Acceptance Criteria:**
  - User can ask FAQ-style questions.
  - Chatbot retrieves and displays relevant FAQ entries.
- **Endpoint:** `GET /faq?query={question}`
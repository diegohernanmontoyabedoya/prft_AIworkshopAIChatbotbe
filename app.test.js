const request = require('supertest');
const app = require('./app');

// Helper to register and login a user, returns JWT
async function registerAndLogin(email = `test${Date.now()}@mail.com`, password = 'password123') {
  await request(app).post('/users/register').send({ email, password });
  const res = await request(app).post('/users/login').send({ email, password });
  return res.body.token;
}

describe('Auth endpoints', () => {
  it('should register and login a user', async () => {
    const email = `user${Date.now()}@mail.com`;
    const password = 'testpass';
    await request(app).post('/users/register').send({ email, password }).expect(200);
    const res = await request(app).post('/users/login').send({ email, password });
    expect(res.body.token).toBeDefined();
  });

  it('should reject invalid login', async () => {
    await request(app).post('/users/login').send({ email: 'no@user.com', password: 'bad' }).expect(400);
  });
});

describe('Chat endpoint', () => {
  it('should reject unauthenticated access', async () => {
    await request(app).post('/chat').send({ message: 'Hello' }).expect(401);
  });

  it('should accept authenticated chat and return polite reply', async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post('/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'What is the delivery time?' });
    expect(res.body.reply).toMatch(/thank you|order|product|faq/i);
  });

  it('should include relevant FAQ context if applicable', async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post('/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'What payment methods do you accept?' });
    // The reply should include FAQ context or the usedFaq field should be set
    expect(res.body.usedFaq).toMatch(/payment methods/i);
    expect(res.body.reply).toMatch(/visa|mastercard|paypal|apple pay/i);
  });

  it('should handle unknown queries gracefully', async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post('/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Tell me about Martian shipping policies.' });
    // Should not crash and should return a polite reply
    expect(res.body.reply).toMatch(/sorry|help|assist|thank you/i);
  });
});

describe('FAQ endpoint', () => {
  it('should return an FAQ answer', async () => {
    const res = await request(app).get('/faq').query({ query: 'delivery' });
    expect(res.body.answer).toMatch(/delivery time/i);
  });

  it('should handle unknown FAQ', async () => {
    const res = await request(app).get('/faq').query({ query: 'unknown question' });
    expect(res.body.answer).toMatch(/couldn't find|sorry/i);
  });

  it('should require a query parameter', async () => {
    const res = await request(app).get('/faq');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/query is required/i);
  });
});
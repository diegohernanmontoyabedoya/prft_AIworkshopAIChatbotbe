const service = require('../middleware/service');
const faqs = require('../data/faq.json');

const openai = service.createOpenAI();

function retrieveRelevantFAQ(message) {
  // Simple retrieval: find FAQ whose question or answer best matches the message
  const lowerMsg = message.toLowerCase();
  // Try to find the first FAQ where the question or answer contains a keyword from the message
  return (
    faqs.find(faq =>
      lowerMsg.includes(faq.question.toLowerCase()) ||
      faq.question.toLowerCase().split(' ').some(word => lowerMsg.includes(word))
    ) || null
  );
}

exports.handleChat = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Retrieve relevant FAQ context
  const relevantFaq = retrieveRelevantFAQ(message);
  let context = '';
  if (relevantFaq) {
    context = `\n\nRelevant FAQ:\nQ: ${relevantFaq.question}\nA: ${relevantFaq.answer}`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages: [
        {
          role: 'system',
          content:
            'You are a polite, customer-focused e-commerce assistant. Always provide helpful and accurate information about orders and products. If relevant, use the provided FAQ context to answer the user.',
        },
        {
          role: 'user',
          content: `${message}${context}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply, usedFaq: relevantFaq ? relevantFaq.question : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};
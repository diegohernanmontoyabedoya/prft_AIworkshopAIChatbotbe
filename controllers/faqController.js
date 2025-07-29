const service = require('../middleware/service');
const faqs = require('../data/faq.json');
const PropertiesReader = require('properties-reader');
const axios = require('axios');
const path = require('path');

// Load URLs from properties file
const properties = PropertiesReader(path.join(__dirname, '../data/rag_sources.properties'));
const sources = [];
properties.each((key, value) => {
  sources.push({ name: key, url: value });
});

// Helper to fetch and search external sources, aggregate all matches
async function searchExternalSources(query) {
  const matches = [];
  for (const source of sources) {
    try {
      const response = await axios.get(source.url, { timeout: 5000 });
      const content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      if (content.toLowerCase().includes(query.toLowerCase())) {
        // Return a snippet around the query
        const idx = content.toLowerCase().indexOf(query.toLowerCase());
        const snippet = content.substring(Math.max(0, idx - 50), idx + 150);
        matches.push({ source: source.url, snippet });
      }
    } catch (err) {
      // Ignore errors for unreachable sources
    }
  }
  return matches;
}

// Helper to summarize aggregated content using OpenAI
async function summarizeWithOpenAI(contexts, query) {
  if (!process.env.OPENAI_API_KEY) return null;
  const openai = service.createOpenAI();
  const contextText = contexts.map(
    (c, i) => `Source ${i + 1}: ${c.source}\n${c.snippet}`
  ).join('\n\n');
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes information from multiple sources for a user query.',
        },
        {
          role: 'user',
          content: `Summarize the following information for the question: "${query}".\n\n${contextText}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.5,
    });
    return completion.choices[0].message.content;
  } catch (err) {
    return null;
  }
}

exports.getFaq = async (req, res) => {
  const query = (req.query.query || '').toLowerCase();
  if (!query) return res.status(400).json({ error: 'Query is required' });

  // 1. Try local FAQ first
  const match = faqs.find(faq =>
    faq.question.toLowerCase().includes(query) ||
    faq.answer.toLowerCase().includes(query)
  );
  if (match) {
    return res.json({ answer: match.answer, source: 'local' });
  }

  // 2. Try external sources (aggregate all matches)
  const externals = await searchExternalSources(query);
  if (externals.length > 0) {
    // Summarize all snippets using OpenAI
    const summary = await summarizeWithOpenAI(externals, query);
    return res.json({
      answer: summary || externals.map(e => `Source: ${e.source}\n${e.snippet}`).join('\n\n'),
      sources: externals.map(e => e.source),
      summarized: !!summary
    });
  }

  // 3. Not found
  res.json({ answer: "Sorry, I couldn't find an answer to your question." });
};
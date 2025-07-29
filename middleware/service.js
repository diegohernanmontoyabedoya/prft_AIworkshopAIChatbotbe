const { OpenAI } = require('openai');

function createOpenAI() {
  console.log('Creating OpenAI client...');
  console.log('process.env.USE_LOCAL_MODEL:' + process.env.USE_LOCAL_MODEL);
  if (process.env.USE_LOCAL_MODEL === 'true') {
    console.log('using localModel');
    return  new OpenAI({
      baseURL: process.env.LOCAL_MODEL_BASE_URL,
      apiKey: process.env.LOCAL_MODEL_API_KEY,
    });
  } else {
    console.log('using OpenAI');
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}

module.exports = {
  createOpenAI
};
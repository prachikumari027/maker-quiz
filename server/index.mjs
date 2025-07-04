// index.mjs
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // allow frontend
app.use(express.json()); // built-in body parser

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route to generate quiz
app.post('/api/quiz', async (req, res) => {
  const { prompt, difficulty } = req.body;

  console.log("📩 Received:", { prompt, difficulty });

  const systemPrompt = `Generate 5 multiple choice questions on "${prompt}" with difficulty "${difficulty}". 
  Format the output as a JSON array with each item containing "question", "options", and "answer".`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: systemPrompt }],
    });

    const quizText = response.choices[0].message.content;
    console.log("✅ Quiz generated successfully!");
    res.json({ quiz: quizText });

  } catch (err) {
    console.error('❌ OpenAI API Error:', err);
    res.status(500).json({ error: 'Failed to generate quiz.' });
  }
});

// Start server
app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});

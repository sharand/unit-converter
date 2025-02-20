// import OpenAI from 'openai';
// import dotenv from 'dotenv';

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Store your API key in Vercel environment variables
// });

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { query } = req.body;

//   if (!query) {
//     return res.status(400).json({ error: 'Query is required' });
//   }

//   try {
//     const response = await openai.chat.completions.create({
//       model: "deepseek-chat",
//       messages: [
//         {
//           role: "system",
//           content: "You are a helpful assistant. Please help with unit conversions only, avoid other tasks like coding or writing.",
//         },
//         {
//           role: "user",
//           content: query,
//         },
//       ],
//       temperature: 1.0,
//       max_tokens: 100,
//     });

//     res.status(200).json({ result: response.choices[0].message.content });
//   } catch (err) {
//     console.error("Error with AI API:", err);
//     res.status(500).json({ error: "Something went wrong with the conversion." });
//   }
// }

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in Vercel environment variables
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Changing from "gpt-4-turbo" to "text-embedding-3-small" Using OpenAI's GPT-4 Turbo model
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Please help with unit conversions only, avoid other tasks like coding or writing.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 1.0,
      max_tokens: 100,
    });

    res.status(200).json({ result: response.choices[0].message.content });
  } catch (err) {
    console.error("Error with AI API:", err);
    res.status(500).json({ error: "Something went wrong with the conversion." });
  }
}

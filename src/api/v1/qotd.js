import { corsMiddleware, withCors } from '../../data/cors.js';
import { checkApiKey } from '../../data/auth.js';
import data from '../../data/codesave.js';

const { questions } = data;

export default function handler(request, response) {
  if (corsMiddleware(req, res)) return;
  
  if (!checkApiKey(request, response)) {
    return;
  }

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts GET requests'
    });
  }

  let { count } = request.query;
  let questionCount = 1; // Default to 1

  if (count !== undefined) {
    const parsedCount = parseInt(count, 10);
    if (!isNaN(parsedCount)) {
      if (parsedCount < 1) {
        questionCount = 1;
      } else if (parsedCount > 5) {
        questionCount = 5;
      } else {
        questionCount = parsedCount;
      }
    }
  }

  try {
    console.log('Questions:', questions);
    if (!Array.isArray(questions)) {
      throw new Error('Questions is not an array');
    }

    const shuffledQuestions = [...questions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, questionCount);

    response.status(200).json({
      questions: selectedQuestions,
      total_questions: questions.length,
      requested_count: questionCount,
      info: {
        credits: "Made by harys722, available for everyone!",
        support: "https://harys.is-a.dev/api"
      }
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    response.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'Failed to generate questions'
    });
  }
}

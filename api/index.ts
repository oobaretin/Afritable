// Vercel serverless function entry point
import { createServer } from 'http';
import { parse } from 'url';
import { handler } from '../backend/src/index';

export default async function(req: any, res: any) {
  // Convert Vercel request to Express-like request
  const url = parse(req.url || '', true);
  
  // Set up response headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Handle the request
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

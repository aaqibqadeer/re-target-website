import type { NextApiRequest, NextApiResponse } from 'next'

// API key is only accessible on the server side
const API_KEY = 'AIzaSyAxatIcgqwbrsFZLT2IhKgzJ2YajENAUQw'
const REFRESH_URL = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' })
    }

    // Forward request to Firebase token refresh endpoint
    const response = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    // Return the same data structure that Firebase would return
    return res.status(200).json(data)
  } catch (error) {
    console.error('Token refresh error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
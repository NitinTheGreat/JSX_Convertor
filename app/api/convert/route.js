// app/api/convert/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Extract data from the request body
    const { htmlCode, cssCode, language } = await request.json();

    // Validate input
    if (!htmlCode || !cssCode || !language) {
      console.error('Invalid input:', { htmlCode, cssCode, language });
      return NextResponse.json(
        { error: 'Invalid input: missing htmlCode, cssCode, or language' },
        { status: 400 }
      );
    }

    // Define the Gemini API endpoint
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Log the request being sent
    console.log('Sending request to Gemini API with payload:', {
      contents: [
        {
          parts: [
            {
              text: `Convert the following HTML and CSS into ${language} with Tailwind: ${htmlCode} ${cssCode}`,
            },
          ],
        },
      ],
    });

    // Send request to Gemini API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Convert the following HTML and CSS into ${language} with Tailwind: ${htmlCode} ${cssCode}`,
              },
            ],
          },
        ],
      }),
    });

    // Check for API response errors
    if (!response.ok) {
      const errorText = await response.text();  // Log the response body for debugging
      console.error('Gemini API response error:', errorText);
      throw new Error('Failed to fetch from Gemini API');
    }

    // Parse and return the response
    const result = await response.json();
    console.log('Received response from Gemini API:', result);

    // Check if the response structure matches expectations
    if (result.candidates && result.candidates.length > 0) {
      const candidate = result.candidates[0];
      if (candidate && candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const text = candidate.content.parts[0].text;
        return NextResponse.json(
          { result: text },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'Unexpected response format' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'No candidates returned from Gemini API' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in API route:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

'use client'
import { useState } from 'react';

export default function Home() {
  const [htmlCssCode, setHtmlCssCode] = useState('');
  const [language, setLanguage] = useState('JSX');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlCssCode, language }),
      });
      if (!res.ok) {
        throw new Error('Failed to generate code');
      }
      const data = await res.json();
      setGeneratedCode(data.result); // Display generated code
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold mb-8">HTML/CSS to {language} with Tailwind Generator</h1>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="htmlCssCode">
            Enter HTML and CSS
          </label>
          <textarea
            id="htmlCssCode"
            rows="6"
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            value={htmlCssCode}
            onChange={(e) => setHtmlCssCode(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Output Format</label>
          <div className="flex">
            <label className="mr-4">
              <input
                type="radio"
                value="JSX"
                checked={language === 'JSX'}
                onChange={() => setLanguage('JSX')}
              />
              <span className="ml-2">JSX with Tailwind</span>
            </label>
            <label>
              <input
                type="radio"
                value="TSX"
                checked={language === 'TSX'}
                onChange={() => setLanguage('TSX')}
              />
              <span className="ml-2">TSX with Tailwind</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {generatedCode && (
        <div className="mt-8 w-full max-w-lg bg-gray-100 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Generated {language} Code</h2>
          <pre className="whitespace-pre-wrap">{generatedCode}</pre>
        </div>
      )}
    </div>
  );
}

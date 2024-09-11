'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Star, Moon, Zap } from 'lucide-react'

export default function Home() {
  const [htmlCode, setHtmlCode] = useState('')
  const [cssCode, setCssCode] = useState('')
  const [language, setLanguage] = useState('JSX')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setResult('')

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlCode, cssCode, language }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate code')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      setError(err.message || 'An unknown error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-blue-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] bg-repeat opacity-20"></div>
      </div>
      
      <header className="relative z-10 p-6 bg-opacity-50 bg-blue-900 backdrop-blur-md">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-2 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          Cosmic Code Converter
        </motion.h1>
        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <Star className="text-yellow-300 animate-pulse" />
          <Moon className="text-blue-300 animate-spin-slow" />
          <Rocket className="text-red-300 animate-bounce" />
        </motion.div>
      </header>

      <main className="relative z-10 p-6 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <label className="block text-2xl" htmlFor="htmlCode">HTML Nebula</label>
              <textarea 
                id="htmlCode"
                className="w-full h-60 p-3 rounded-lg bg-gray-800 border-2 border-blue-500 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 font-mono text-green-400 placeholder-gray-500"
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="<div>Your HTML here</div>"
                style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
              />
            </motion.div>

            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <label className="block text-2xl" htmlFor="cssCode">CSS Constellation</label>
              <textarea 
                id="cssCode"
                className="w-full h-60 p-3 rounded-lg bg-gray-800 border-2 border-purple-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 font-mono text-purple-400 placeholder-gray-500"
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                placeholder=".class { color: #fff; }"
                style={{ boxShadow: '0 0 15px rgba(167, 139, 250, 0.5)' }}
              />
            </motion.div>
          </div>

          <div className="flex justify-center items-center space-x-4">
            <label className="text-xl" htmlFor="language">Target Language:</label>
            <motion.select
              id="language"
              className="bg-gray-800 text-white text-lg p-2 rounded-full border-2 border-yellow-500 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: '0 0 10px rgba(234, 179, 8, 0.5)' }}
            >
              <option value="JSX">JSX</option>
              <option value="TSX">TSX</option>
            </motion.select>
          </div>

          <div className="text-center">
            <motion.button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl font-bold py-3 px-8 rounded-full shadow-lg inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124, 58, 237, 0.7)' }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Zap className="animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Rocket />
                  <span>Launch Conversion</span>
                </>
              )}
            </motion.button>
          </div>
        </form>

        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-purple-400">Cosmic Conversion in Progress</h2>
                <div className="flex justify-center items-center space-x-4">
                  <Moon className="text-blue-400 animate-spin-slow" size={40} />
                  <Star className="text-yellow-400 animate-pulse" size={40} />
                  <Rocket className="text-red-400 animate-bounce" size={40} />
                </div>
                <p className="mt-4 text-lg text-green-400">Transforming your code into stellar JSX/TSX...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            className="mt-6 p-4 bg-red-900 bg-opacity-50 rounded-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-2">Generated Code:</h2>
            <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
              <code className="text-green-400">{result}</code>
            </pre>
          </motion.div>
        )}
      </main>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Newspaper, ExternalLink } from 'lucide-react'

interface NewsArticle {
  title: string
  source: string
  publishedAt: string
  url: string
}

interface NewsData {
  status: string
  totalResults: number
  articles: NewsArticle[]
  demo_mode?: boolean
}

export default function NewsTicker() {
  const [news, setNews] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/news/headlines')
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }
      const data = await response.json()
      setNews(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  const handleHeadlineClick = (url: string) => {
    if (url && url !== '#') {
      // Redirect to the news article URL
      window.location.href = url
    }
  }

  if (loading && !news) {
    return (
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white py-3 px-4 shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm font-medium">Loading financial news...</span>
        </div>
      </div>
    )
  }

  if (error && !news) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <TrendingDown className="h-4 w-4" />
          <span className="text-sm font-medium">News temporarily unavailable</span>
        </div>
      </div>
    )
  }

  if (!news?.articles?.length) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white py-3 overflow-hidden relative shadow-lg border-b border-blue-500">
      {/* News icon */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
        <Newspaper className="h-4 w-4" />
        <span className="text-xs font-bold tracking-wide">LIVE NEWS</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex items-center">
        <div className="animate-scroll flex space-x-8 ml-32">
          {news.articles.map((article, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 whitespace-nowrap group cursor-pointer"
              onClick={() => handleHeadlineClick(article.url)}
            >
              <div className="flex items-center space-x-2 group-hover:bg-white/10 px-2 py-1 rounded transition-all duration-200">
                <TrendingUp className="h-3 w-3 text-green-300 group-hover:text-green-200 transition-colors" />
                <span className="text-sm font-medium max-w-md truncate group-hover:text-blue-100 transition-colors">
                  {article.title}
                </span>
                {article.url !== '#' && (
                  <ExternalLink className="h-3 w-3 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <span className="text-xs text-blue-200 opacity-75 group-hover:opacity-100 transition-opacity">
                {article.source}
              </span>
              <div className="w-1 h-1 bg-white rounded-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
          ))}
        </div>
        
        {/* Duplicate for seamless loop */}
        <div className="animate-scroll flex space-x-8 ml-8">
          {news.articles.map((article, index) => (
            <div
              key={`duplicate-${index}`}
              className="flex items-center space-x-4 whitespace-nowrap group cursor-pointer"
              onClick={() => handleHeadlineClick(article.url)}
            >
              <div className="flex items-center space-x-2 group-hover:bg-white/10 px-2 py-1 rounded transition-all duration-200">
                <TrendingUp className="h-3 w-3 text-green-300 group-hover:text-green-200 transition-colors" />
                <span className="text-sm font-medium max-w-md truncate group-hover:text-blue-100 transition-colors">
                  {article.title}
                </span>
                {article.url !== '#' && (
                  <ExternalLink className="h-3 w-3 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <span className="text-xs text-blue-200 opacity-75 group-hover:opacity-100 transition-opacity">
                {article.source}
              </span>
              <div className="w-1 h-1 bg-white rounded-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo mode indicator */}
      {news.demo_mode && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          DEMO MODE
        </div>
      )}
    </div>
  )
} 
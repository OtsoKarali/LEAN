'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SentimentData {
  fear_greed_index: number
  vix: number
  market_mood: string
  timestamp: string
}

export default function MarketSentiment() {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSentiment()
    // Refresh every 10 minutes
    const interval = setInterval(fetchSentiment, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchSentiment = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/news/market-sentiment')
      if (!response.ok) {
        throw new Error('Failed to fetch sentiment')
      }
      const data = await response.json()
      setSentiment(data)
    } catch (err) {
      console.error('Failed to fetch market sentiment:', err)
    } finally {
      setLoading(false)
    }
  }

  const getFearGreedColor = (index: number) => {
    if (index >= 70) return 'text-green-600'
    if (index >= 50) return 'text-yellow-600'
    if (index >= 30) return 'text-orange-600'
    return 'text-red-600'
  }

  const getFearGreedLabel = (index: number) => {
    if (index >= 80) return 'Extreme Greed'
    if (index >= 70) return 'Greed'
    if (index >= 60) return 'Moderate Greed'
    if (index >= 50) return 'Neutral'
    if (index >= 40) return 'Moderate Fear'
    if (index >= 30) return 'Fear'
    return 'Extreme Fear'
  }

  const getVIXColor = (vix: number) => {
    if (vix >= 30) return 'text-red-600'
    if (vix >= 20) return 'text-orange-600'
    if (vix >= 15) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'bullish':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'bearish':
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <Activity className="h-5 w-5 text-blue-600" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Market Sentiment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!sentiment) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Market Sentiment</span>
        </CardTitle>
        <CardDescription>Real-time market mood indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fear & Greed Index */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Fear & Greed Index</p>
            <p className={`text-lg font-bold ${getFearGreedColor(sentiment.fear_greed_index)}`}>
              {sentiment.fear_greed_index}
            </p>
            <p className="text-xs text-gray-500">{getFearGreedLabel(sentiment.fear_greed_index)}</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
            <div 
              className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 flex items-center justify-center"
              style={{
                background: `conic-gradient(from 0deg, #ef4444 0deg, #f59e0b ${sentiment.fear_greed_index * 3.6}deg, #10b981 ${sentiment.fear_greed_index * 3.6}deg, #10b981 360deg)`
              }}
            >
              <span className="text-xs font-bold text-white">{sentiment.fear_greed_index}</span>
            </div>
          </div>
        </div>

        {/* VIX */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-sm font-medium text-gray-600">VIX (Volatility)</p>
            <p className={`text-lg font-bold ${getVIXColor(sentiment.vix)}`}>
              {sentiment.vix}
            </p>
            <p className="text-xs text-gray-500">
              {sentiment.vix >= 30 ? 'High Volatility' : 
               sentiment.vix >= 20 ? 'Moderate Volatility' : 'Low Volatility'}
            </p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Activity className={`h-6 w-6 ${getVIXColor(sentiment.vix)}`} />
          </div>
        </div>

        {/* Market Mood */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-sm font-medium text-gray-600">Market Mood</p>
            <div className="flex items-center space-x-2">
              {getMoodIcon(sentiment.market_mood)}
              <span className="text-lg font-bold capitalize">{sentiment.market_mood}</span>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(sentiment.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 
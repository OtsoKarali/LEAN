'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import MarketSentiment from '@/components/MarketSentiment'

export default function Dashboard() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/brokers/etrade/portfolio')
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please connect your E*TRADE account first')
        } else {
          throw new Error('Failed to fetch portfolio data')
        }
        return
      }
      
      const data = await response.json()
      setPortfolioData(data)
    } catch (err) {
      setError(err.message || 'Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Error Loading Portfolio</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => window.location.href = '/settings/broker'}>
                  Connect E*TRADE Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Portfolio Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Account: {portfolioData?.account_id}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Beta</CardTitle>
              <CardDescription>Current portfolio volatility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {(portfolioData?.beta || 1.0).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Value</CardTitle>
              <CardDescription>Current market value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${portfolioData?.portfolio?.AccountPortfolio?.totalValue || '0.00'}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-1">
            <MarketSentiment />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>Current positions and their market values</CardDescription>
          </CardHeader>
          <CardContent>
            {portfolioData?.portfolio?.AccountPortfolio?.Position ? (
              <div className="space-y-4">
                {portfolioData.portfolio.AccountPortfolio.Position.map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{position.symbolDescription || position.symbol}</h3>
                      <p className="text-sm text-gray-500">{position.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${position.marketValue}</p>
                      <p className="text-sm text-gray-500">{position.quantity} shares</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No positions found</p>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Educational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  )
} 
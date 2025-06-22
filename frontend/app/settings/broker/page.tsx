'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function BrokerSettings() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnectETrade = async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/v1/brokers/etrade/login')
      const data = await response.json()
      
      if (data.redirect) {
        window.location.href = data.redirect
      } else {
        throw new Error('Failed to get redirect URL')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to E*TRADE')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Connect Your Broker
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Link your E*TRADE account to start monitoring your portfolio
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <img 
                  src="https://www.etrade.com/favicon.ico" 
                  alt="E*TRADE" 
                  className="w-6 h-6"
                />
                E*TRADE Integration
              </CardTitle>
              <CardDescription>
                Securely connect your E*TRADE account using OAuth 1.0a authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              {isConnected ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 dark:text-green-300">
                    Successfully connected to E*TRADE
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <p>• Read-only access to your portfolio data</p>
                    <p>• Secure OAuth 1.0a authentication</p>
                    <p>• No trading permissions required</p>
                    <p>• Data is encrypted and stored securely</p>
                  </div>
                  
                  <Button 
                    onClick={handleConnectETrade}
                    disabled={isConnecting}
                    className="w-full"
                    size="lg"
                  >
                    {isConnecting ? (
                      'Connecting...'
                    ) : (
                      <>
                        Connect E*TRADE Account
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By connecting your account, you agree to our terms of service and privacy policy.
              <br />
              Educational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
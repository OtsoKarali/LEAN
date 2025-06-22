import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Adaptive Beta Portfolio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time portfolio beta management with intelligent hedging recommendations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Broker</CardTitle>
              <CardDescription>
                Link your E*TRADE account to start monitoring your portfolio beta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings/broker">
                <Button className="w-full" size="lg">
                  Connect E*TRADE
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Dashboard</CardTitle>
              <CardDescription>
                See your current portfolio holdings and beta calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Educational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  )
} 
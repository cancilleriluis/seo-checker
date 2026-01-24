'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  FileText, 
  Image as ImageIcon,
  Hash,
  Sparkles,
  BarChart3
} from 'lucide-react'

interface AnalysisResults {
  score: number
  title?: string
  titleLength?: number
  description?: string
  descriptionLength?: number
  h1Count: number
  h2Count: number
  totalImages: number
  imagesWithoutAlt: number
  ogTitle?: string
  ogDescription?: string
  issues: string[]
  recommendations: string[]
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResults | null>(null)

  const analyzeSEO = async () => {
    if (!url) return
    
    setLoading(true)
    setResults(null)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        alert('Error: ' + data.error)
      } else {
        setResults(data)
      }
    } catch (error) {
      alert('Failed to analyze. Please check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Needs Work'
    return 'Poor'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Free SEO Analysis Tool</span>
          </div>
          
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900">
            SEO Score Checker
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get instant insights into your website's SEO performance. 
            Analyze meta tags, headings, and get actionable recommendations.
          </p>
        </div>

        {/* Input Section */}
        <Card className="border-2 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Analyze Website
            </CardTitle>
            <CardDescription>
              Enter any URL to get a comprehensive SEO analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && analyzeSEO()}
                className="flex-1 h-12 text-lg"
              />
              <Button 
                onClick={analyzeSEO}
                disabled={loading || !url}
                size="lg"
                className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {loading ? (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results && (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Score Hero Card */}
            <Card className={`border-2 shadow-xl ${getScoreBgColor(results.score)} bg-white/80 backdrop-blur`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Overall SEO Score</p>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-7xl font-bold ${getScoreColor(results.score)}`}>
                        {results.score}
                      </span>
                      <span className="text-3xl text-slate-400">/100</span>
                    </div>
                    <Badge 
                      variant={results.score >= 80 ? 'default' : 'secondary'}
                      className="mt-3"
                    >
                      {getScoreLabel(results.score)}
                    </Badge>
                  </div>
                  
                  <div className="w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - results.score / 100)}`}
                        className={getScoreColor(results.score)}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Meta Tags Card */}
              <Card className="border shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Meta Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700">Title Tag</span>
                      <Badge variant="outline" className="text-xs">
                        {results.titleLength} chars
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border">
                      {results.title || 'No title found'}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700">Meta Description</span>
                      <Badge variant="outline" className="text-xs">
                        {results.descriptionLength} chars
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border">
                      {results.description || 'No description found'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Page Structure Card */}
              <Card className="border shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-purple-600" />
                    Page Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                    <span className="text-sm font-medium text-slate-700">H1 Headings</span>
                    <Badge variant={results.h1Count === 1 ? 'default' : 'destructive'}>
                      {results.h1Count}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                    <span className="text-sm font-medium text-slate-700">H2 Headings</span>
                    <Badge variant="secondary">
                      {results.h2Count}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                    <span className="text-sm font-medium text-slate-700">Images w/o Alt</span>
                    <Badge variant={results.imagesWithoutAlt === 0 ? 'default' : 'destructive'}>
                      {results.imagesWithoutAlt} / {results.totalImages}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Issues Card */}
            {results.issues && results.issues.length > 0 && (
              <Card className="border-l-4 border-l-red-500 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    Issues Found ({results.issues.length})
                  </CardTitle>
                  <CardDescription>
                    These issues are hurting your SEO performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations Card */}
            {results.recommendations && results.recommendations.length > 0 && (
              <Card className="border-l-4 border-l-green-500 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="w-5 h-5" />
                    Recommendations ({results.recommendations.length})
                  </CardTitle>
                  <CardDescription>
                    Follow these tips to improve your SEO score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

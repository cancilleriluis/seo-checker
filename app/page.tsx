'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Image as ImageIcon,
  Hash,
  Sparkles,
  BarChart3,
  Brain,
  Info
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
  // GEO Analysis
  geoScore: number
  geoIssues: string[]
  geoRecommendations: string[]
  geoMetrics: {
    headingHierarchyScore?: number
    totalParagraphs?: number
    optimalParagraphs?: number
    paragraphScore?: number
    lists?: number
    tables?: number
    contentToCodeRatio?: string
    readabilityScore?: string
    gradeLevel?: string
    entities?: {
      people: number
      places: number
      organizations: number
      total: number
    }
    entityDensity?: string
    questions?: number
    keywordDensity?: string
    structuredData?: {
      hasJsonLd: boolean
      scriptCount: number
      schemas: string[]
    }
    examples?: number
  }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 border border-blue-300 rounded-full text-sm text-blue-800 font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Free SEO Analysis Tool</span>
          </div>
          
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900">
            SEO Score Checker
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get instant insights into your website's SEO and GEO performance.
            Analyze meta tags, content structure, readability, and AI-friendliness.
          </p>
        </div>

        {/* Input Section */}
        <Card className="border-2 shadow-xl bg-white/90 backdrop-blur-sm">
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

            {/* Dual Score Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* SEO Score Card */}
              <Card className={`border-2 shadow-xl ${getScoreBgColor(results.score)} bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-200/50`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Traditional SEO Score
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span className={`text-6xl font-bold ${getScoreColor(results.score)}`}>
                          {results.score}
                        </span>
                        <span className="text-2xl text-slate-400">/100</span>
                      </div>
                      <Badge
                        variant={results.score >= 80 ? 'default' : 'secondary'}
                        className="mt-3"
                      >
                        {getScoreLabel(results.score)}
                      </Badge>
                    </div>

                    <div className="w-28 h-28">
                      <svg className="transform -rotate-90 w-28 h-28">
                        <circle
                          cx="56"
                          cy="56"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-blue-100"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 50}`}
                          strokeDashoffset={`${2 * Math.PI * 50 * (1 - results.score / 100)}`}
                          className={getScoreColor(results.score)}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* GEO Score Card */}
              <Card className={`border-2 shadow-xl ${getScoreBgColor(results.geoScore)} bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-200/50`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        GEO Score (AI Optimization)
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span className={`text-6xl font-bold ${getScoreColor(results.geoScore)}`}>
                          {results.geoScore}
                        </span>
                        <span className="text-2xl text-slate-400">/100</span>
                      </div>
                      <Badge
                        variant={results.geoScore >= 80 ? 'default' : 'secondary'}
                        className="mt-3"
                      >
                        {getScoreLabel(results.geoScore)}
                      </Badge>
                    </div>

                    <div className="w-28 h-28">
                      <svg className="transform -rotate-90 w-28 h-28">
                        <circle
                          cx="56"
                          cy="56"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-blue-100"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 50}`}
                          strokeDashoffset={`${2 * Math.PI * 50 * (1 - results.geoScore / 100)}`}
                          className={getScoreColor(results.geoScore)}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for detailed analysis */}
            <Tabs defaultValue="seo" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="seo">Traditional SEO</TabsTrigger>
                <TabsTrigger value="geo">GEO Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="seo" className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Meta Tags Card */}
              <Card className="border shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
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
              <Card className="border shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
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
              <Card className="border-l-4 border-l-red-500 shadow-lg bg-white/90 backdrop-blur-sm">
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
              <Card className="border-l-4 border-l-green-500 shadow-lg bg-white/90 backdrop-blur-sm">
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
            </TabsContent>

            {/* GEO Analysis Tab */}
            <TabsContent value="geo" className="space-y-6">
              {/* GEO Metrics Overview */}
              <div className="grid md:grid-cols-3 gap-6">
                {results.geoMetrics.readabilityScore && (
                  <Card className="border shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-slate-600">Readability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{results.geoMetrics.readabilityScore}</div>
                      <p className="text-xs text-slate-500 mt-1">Flesch Reading Ease</p>
                      <p className="text-sm text-slate-600 mt-2">Grade Level: {results.geoMetrics.gradeLevel}</p>
                    </CardContent>
                  </Card>
                )}

                {results.geoMetrics.entities && (
                  <Card className="border shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-slate-600">Entity Richness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">{results.geoMetrics.entities.total}</div>
                      <p className="text-xs text-slate-500 mt-1">Total Entities</p>
                      <div className="text-sm text-slate-600 mt-2 space-y-1">
                        <div>People: {results.geoMetrics.entities.people}</div>
                        <div>Places: {results.geoMetrics.entities.places}</div>
                        <div>Orgs: {results.geoMetrics.entities.organizations}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {results.geoMetrics.contentToCodeRatio && (
                  <Card className="border shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-slate-600">Content Ratio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{results.geoMetrics.contentToCodeRatio}</div>
                      <p className="text-xs text-slate-500 mt-1">Content-to-Code</p>
                      <p className="text-sm text-slate-600 mt-2">Paragraphs: {results.geoMetrics.totalParagraphs}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Structured Data */}
              {results.geoMetrics.structuredData && (
                <Card className="border shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                      Structured Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.geoMetrics.structuredData.hasJsonLd ? (
                      <div className="space-y-3">
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <AlertTitle>Schema.org Markup Found</AlertTitle>
                          <AlertDescription>
                            {results.geoMetrics.structuredData.scriptCount} JSON-LD script(s) detected
                          </AlertDescription>
                        </Alert>
                        {results.geoMetrics.structuredData.schemas.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Schema Types:</p>
                            <div className="flex flex-wrap gap-2">
                              {results.geoMetrics.structuredData.schemas.map((schema, idx) => (
                                <Badge key={idx} variant="outline">{schema}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <Info className="w-4 h-4 text-yellow-600" />
                        <AlertTitle>No Structured Data Found</AlertTitle>
                        <AlertDescription>
                          Consider adding Schema.org markup for better AI understanding
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* GEO Issues */}
              {results.geoIssues && results.geoIssues.length > 0 && (
                <Card className="border-l-4 border-l-red-500 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      GEO Issues ({results.geoIssues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {results.geoIssues.map((issue, index) => (
                        <AccordionItem key={index} value={`issue-${index}`}>
                          <AccordionTrigger className="text-sm">
                            {issue}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-slate-600">
                            This issue may affect how AI systems understand and extract information from your content.
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              {/* GEO Recommendations */}
              {results.geoRecommendations && results.geoRecommendations.length > 0 && (
                <Card className="border-l-4 border-l-green-500 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Brain className="w-5 h-5" />
                      GEO Recommendations ({results.geoRecommendations.length})
                    </CardTitle>
                    <CardDescription>
                      Optimize for AI search engines and LLMs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {results.geoRecommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          </div>
        )}

      </div>
    </div>
  )
}

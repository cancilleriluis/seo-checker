'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Hash,
  Sparkles,
  BarChart3,
  Brain,
  Info,
  LayoutGrid,
} from 'lucide-react'
import { PriorityMatrix, type PriorityIssue } from '@/components/priority-matrix'

interface IssueObject {
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'high' | 'medium' | 'low'
}

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
  issues: IssueObject[]
  recommendations: string[]
  // GEO Analysis
  geoScore: number
  geoIssues: IssueObject[]
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

export default function ResultsPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Read initial URL from the query string on the client
    const search = typeof window !== 'undefined' ? window.location.search : ''
    const params = new URLSearchParams(search)
    const initialUrl = params.get('url') || ''
    if (initialUrl) {
      setUrl(initialUrl)
      runAnalysis(initialUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const normalizeUrl = (raw: string) => {
    let value = raw.trim()
    if (!value) return ''
    if (!/^https?:\/\//i.test(value)) {
      value = `https://${value}`
    }
    return value
  }

  const runAnalysis = async (rawUrl?: string) => {
    const target = rawUrl ?? url
    const normalized = normalizeUrl(target)
    if (!normalized) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResults(data)
      }
    } catch (err) {
      setError('Failed to analyze. Please check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to overview
          </button>

          <span className="hidden text-xs text-slate-500 sm:inline">
            SEO & GEO report for{' '}
            <span className="font-medium text-slate-700">
              {url || '—'}
            </span>
          </span>
        </header>

        <main className="space-y-6">
          <Card className="border bg-white/80 shadow-sm backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Search className="h-4 w-4 text-blue-600" />
                Analyze another page
              </CardTitle>
              <CardDescription className="text-xs">
                Paste any URL to generate a fresh SEO + GEO report.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className="h-11 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none ring-0 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder="your-website.com/page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
                />
                <Button
                  onClick={() => runAnalysis()}
                  disabled={loading || !url}
                  size="sm"
                  className="h-11 px-5 text-sm font-semibold"
                >
                  {loading ? (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4 animate-pulse" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Run report
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-slate-500">
                We&apos;ll automatically add <span className="font-mono text-slate-700">https://</span> if it&apos;s missing.
              </p>
            </CardContent>
          </Card>

          {error && (
            <Alert className="border-red-100 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-xs font-semibold">
                Something went wrong
              </AlertTitle>
              <AlertDescription className="text-[11px]">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="space-y-6 py-2">
              <div className="grid gap-4 lg:grid-cols-[1.3fr,1fr]">
                {/* SEO Score Card */}
                <Card className={`border bg-white/90 shadow-sm ${getScoreBgColor(results.score)}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Search className="h-4 w-4" />
                          Traditional SEO score
                        </p>
                        <div className="flex items-baseline gap-3">
                          <span className={`text-5xl font-semibold ${getScoreColor(results.score)}`}>
                            {results.score}
                          </span>
                          <span className="text-lg text-slate-400">/100</span>
                        </div>
                        <Badge
                          variant={results.score >= 80 ? 'default' : 'secondary'}
                          className="mt-3"
                        >
                          {getScoreLabel(results.score)}
                        </Badge>
                      </div>

                      <div className="h-24 w-24">
                        <svg className="h-24 w-24 -rotate-90 transform">
                          <circle
                            cx="48"
                            cy="48"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-blue-100"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - results.score / 100)}`}
                            className={getScoreColor(results.score)}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* GEO Score Card */}
                <Card className={`border bg-white/90 shadow-sm ${getScoreBgColor(results.geoScore)}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Brain className="h-4 w-4" />
                          GEO score (AI optimization)
                        </p>
                        <div className="flex items-baseline gap-3">
                          <span className={`text-5xl font-semibold ${getScoreColor(results.geoScore)}`}>
                            {results.geoScore}
                          </span>
                          <span className="text-lg text-slate-400">/100</span>
                        </div>
                        <Badge
                          variant={results.geoScore >= 80 ? 'default' : 'secondary'}
                          className="mt-3"
                        >
                          {getScoreLabel(results.geoScore)}
                        </Badge>
                      </div>

                      <div className="h-24 w-24">
                        <svg className="h-24 w-24 -rotate-90 transform">
                          <circle
                            cx="48"
                            cy="48"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-blue-100"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - results.geoScore / 100)}`}
                            className={getScoreColor(results.geoScore)}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="seo" className="w-full">
                <TabsList className="mb-4 grid w-full grid-cols-3">
                  <TabsTrigger value="seo">Traditional SEO</TabsTrigger>
                  <TabsTrigger value="geo">GEO analysis</TabsTrigger>
                  <TabsTrigger value="priority">
                    <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                    Priority Guide
                  </TabsTrigger>
                </TabsList>

                {/* SEO tab */}
                <TabsContent value="seo" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Meta tags */}
                    <Card className="border bg-white/90 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Meta tags
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="font-medium text-slate-700">Title tag</span>
                            <Badge variant="outline" className="text-xs">
                              {results.titleLength} chars
                            </Badge>
                          </div>
                          <p className="rounded-lg border bg-slate-50 p-3 text-sm text-slate-600">
                            {results.title || 'No title found'}
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="font-medium text-slate-700">Meta description</span>
                            <Badge variant="outline" className="text-xs">
                              {results.descriptionLength} chars
                            </Badge>
                          </div>
                          <p className="rounded-lg border bg-slate-50 p-3 text-sm text-slate-600">
                            {results.description || 'No description found'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Structure */}
                    <Card className="border bg-white/90 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Hash className="h-5 w-5 text-purple-600" />
                          Page structure
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-3">
                          <span className="text-sm font-medium text-slate-700">H1 headings</span>
                          <Badge variant={results.h1Count === 1 ? 'default' : 'destructive'}>
                            {results.h1Count}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-3">
                          <span className="text-sm font-medium text-slate-700">H2 headings</span>
                          <Badge variant="secondary">
                            {results.h2Count}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-3">
                          <span className="text-sm font-medium text-slate-700">Images without alt</span>
                          <Badge variant={results.imagesWithoutAlt === 0 ? 'default' : 'destructive'}>
                            {results.imagesWithoutAlt} / {results.totalImages}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Issues */}
                  {results.issues && results.issues.length > 0 && (
                    <Card className="border-l-4 border-l-red-500 bg-white/90 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="h-5 w-5" />
                          Issues found ({results.issues.length})
                        </CardTitle>
                        <CardDescription>
                          These issues are likely hurting your SEO performance.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {results.issues.map((issue, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-3"
                            >
                              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                              <div>
                                <span className="text-sm font-medium text-slate-700">{issue.title}</span>
                                <p className="text-xs text-slate-500 mt-1">{issue.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommendations */}
                  {results.recommendations && results.recommendations.length > 0 && (
                    <Card className="border-l-4 border-l-green-500 bg-white/90 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700">
                          <TrendingUp className="h-5 w-5" />
                          Recommendations ({results.recommendations.length})
                        </CardTitle>
                        <CardDescription>
                          Quick wins and deeper fixes to raise your SEO score.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {results.recommendations.map((rec, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-3"
                            >
                              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                              <span className="text-sm text-slate-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* GEO tab */}
                <TabsContent value="geo" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    {results.geoMetrics.readabilityScore && (
                      <Card className="border bg-white/90 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-sm font-medium text-slate-600">
                            Readability
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-blue-600">
                            {results.geoMetrics.readabilityScore}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">Flesch reading ease</p>
                          <p className="mt-2 text-sm text-slate-600">
                            Grade level: {results.geoMetrics.gradeLevel}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {results.geoMetrics.entities && (
                      <Card className="border bg-white/90 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-sm font-medium text-slate-600">
                            Entity richness
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-purple-600">
                            {results.geoMetrics.entities.total}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">Total entities</p>
                          <div className="mt-2 space-y-1 text-sm text-slate-600">
                            <div>People: {results.geoMetrics.entities.people}</div>
                            <div>Places: {results.geoMetrics.entities.places}</div>
                            <div>Orgs: {results.geoMetrics.entities.organizations}</div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {results.geoMetrics.contentToCodeRatio && (
                      <Card className="border bg-white/90 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-sm font-medium text-slate-600">
                            Content ratio
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-green-600">
                            {results.geoMetrics.contentToCodeRatio}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">Content-to-code</p>
                          <p className="mt-2 text-sm text-slate-600">
                            Paragraphs: {results.geoMetrics.totalParagraphs}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Structured data */}
                  {results.geoMetrics.structuredData && (
                    <Card className="border bg-white/90 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-600" />
                          Structured data
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {results.geoMetrics.structuredData.hasJsonLd ? (
                          <div className="space-y-3">
                            <Alert className="border-green-200 bg-green-50">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <AlertTitle>Schema.org markup found</AlertTitle>
                              <AlertDescription>
                                {results.geoMetrics.structuredData.scriptCount} JSON-LD script(s) detected.
                              </AlertDescription>
                            </Alert>
                            {results.geoMetrics.structuredData.schemas.length > 0 && (
                              <div>
                                <p className="mb-2 text-sm font-medium">Schema types:</p>
                                <div className="flex flex-wrap gap-2">
                                  {results.geoMetrics.structuredData.schemas.map((schema, idx) => (
                                    <Badge key={idx} variant="outline">
                                      {schema}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Alert className="border-yellow-200 bg-yellow-50">
                            <Info className="h-4 w-4 text-yellow-600" />
                            <AlertTitle>No structured data found</AlertTitle>
                            <AlertDescription>
                              Consider adding Schema.org markup for better AI understanding.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* GEO Issues */}
                  {results.geoIssues && results.geoIssues.length > 0 && (
                    <Card className="border-l-4 border-l-red-500 bg-white/90 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="h-5 w-5" />
                          GEO issues ({results.geoIssues.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {results.geoIssues.map((issue, index) => (
                            <AccordionItem key={index} value={`issue-${index}`}>
                              <AccordionTrigger className="text-sm">
                                {issue.title}
                              </AccordionTrigger>
                              <AccordionContent className="text-sm text-slate-600">
                                {issue.description}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  )}

                  {/* GEO recommendations */}
                  {results.geoRecommendations && results.geoRecommendations.length > 0 && (
                    <Card className="border-l-4 border-l-green-500 bg-white/90 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700">
                          <Brain className="h-5 w-5" />
                          GEO recommendations ({results.geoRecommendations.length})
                        </CardTitle>
                        <CardDescription>
                          Optimize for AI search engines and LLMs.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {results.geoRecommendations.map((rec, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-3"
                            >
                              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                              <span className="text-sm text-slate-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Priority Guide tab */}
                <TabsContent value="priority" className="space-y-6">
                  <PriorityMatrix
                    issues={[
                      ...results.issues.map((issue): PriorityIssue => ({
                        ...issue,
                        source: 'seo',
                      })),
                      ...results.geoIssues.map((issue): PriorityIssue => ({
                        ...issue,
                        source: 'geo',
                      })),
                    ]}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}


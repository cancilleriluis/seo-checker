'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
    } catch {
      setError('Failed to analyze. Please check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-slate-100/70 blur-3xl" />
        <div className="absolute right-1/3 top-1/2 h-[300px] w-[300px] rounded-full bg-blue-50/50 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-16">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25">
              <Search className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              SEO Score Checker
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="hidden rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600 sm:inline-flex"
            >
              Blog
            </Link>
            <span className="hidden text-xs text-slate-400 sm:inline">
              Report for{' '}
              <span className="font-medium text-slate-700">{url || '\u2014'}</span>
            </span>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>
        </header>

        <main className="space-y-8">
          {/* Input bar */}
          <div className="space-y-2">
            <div className="flex max-w-2xl flex-col gap-3 sm:flex-row">
              <Input
                placeholder="example.com/page"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
                className="h-12 flex-1 rounded-xl border-slate-200 bg-slate-50/80 text-base placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-blue-500/20"
              />
              <Button
                onClick={() => runAnalysis()}
                disabled={loading || !url}
                className="h-12 cursor-pointer rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4 animate-pulse" />
                    Analyzing&hellip;
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Run report
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-400">
              We&apos;ll automatically add{' '}
              <span className="font-mono text-slate-500">https://</span> if
              it&apos;s missing.
            </p>
          </div>

          {/* Error */}
          {error && (
            <Alert className="rounded-xl border-red-200 bg-red-50/80">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-sm font-semibold">
                Something went wrong
              </AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading skeleton */}
          {loading && !results && (
            <div className="space-y-8 py-4">
              <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
                <div className="h-36 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-36 animate-pulse rounded-2xl bg-slate-100" />
              </div>
              <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-100" />
              <div className="space-y-4">
                <div className="h-48 animate-pulse rounded-2xl bg-slate-50" />
                <div className="h-48 animate-pulse rounded-2xl bg-slate-50" />
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-8 py-2">
              {/* Score cards */}
              <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
                {/* SEO Score */}
                <div
                  className={`animate-fade-up rounded-2xl border p-6 ${getScoreBgColor(results.score)}`}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Search className="h-4 w-4" />
                        Traditional SEO score
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`animate-score-pop text-5xl font-semibold ${getScoreColor(results.score)}`}
                        >
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
                          className="text-slate-200"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          className={`animate-draw-ring ${getScoreColor(results.score)}`}
                          style={{
                            strokeDashoffset:
                              2 * Math.PI * 42 * (1 - results.score / 100),
                          }}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* GEO Score */}
                <div
                  className={`animate-fade-up animation-delay-100 rounded-2xl border p-6 ${getScoreBgColor(results.geoScore)}`}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Brain className="h-4 w-4" />
                        GEO score (AI optimization)
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`animate-score-pop text-5xl font-semibold ${getScoreColor(results.geoScore)}`}
                        >
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
                          className="text-slate-200"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          className={`animate-draw-ring ${getScoreColor(results.geoScore)}`}
                          style={{
                            strokeDashoffset:
                              2 * Math.PI * 42 * (1 - results.geoScore / 100),
                          }}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="seo" className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-3 rounded-xl bg-slate-100/80 p-1">
                  <TabsTrigger
                    value="seo"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                  >
                    Traditional SEO
                  </TabsTrigger>
                  <TabsTrigger
                    value="geo"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                  >
                    GEO analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="priority"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                  >
                    <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                    Priority Guide
                  </TabsTrigger>
                </TabsList>

                {/* SEO tab */}
                <TabsContent value="seo" className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Meta tags */}
                    <div className="animate-fade-up rounded-2xl border border-slate-200 p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Meta tags
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="font-medium text-slate-700">
                              Title tag
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {results.titleLength} chars
                            </Badge>
                          </div>
                          <p className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-sm text-slate-500">
                            {results.title || 'No title found'}
                          </p>
                        </div>

                        <div className="border-t border-slate-100" />

                        <div>
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="font-medium text-slate-700">
                              Meta description
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {results.descriptionLength} chars
                            </Badge>
                          </div>
                          <p className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-sm text-slate-500">
                            {results.description || 'No description found'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Page structure */}
                    <div className="animate-fade-up animation-delay-100 rounded-2xl border border-slate-200 p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Hash className="h-4 w-4 text-blue-600" />
                        Page structure
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                          <span className="text-sm font-medium text-slate-700">
                            H1 headings
                          </span>
                          <Badge
                            variant={
                              results.h1Count === 1 ? 'default' : 'destructive'
                            }
                          >
                            {results.h1Count}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                          <span className="text-sm font-medium text-slate-700">
                            H2 headings
                          </span>
                          <Badge variant="secondary">{results.h2Count}</Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                          <span className="text-sm font-medium text-slate-700">
                            Images without alt
                          </span>
                          <Badge
                            variant={
                              results.imagesWithoutAlt === 0
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {results.imagesWithoutAlt} / {results.totalImages}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  {results.issues && results.issues.length > 0 && (
                    <div className="animate-fade-up animation-delay-200 rounded-2xl border border-slate-200 border-l-4 border-l-red-400 p-6">
                      <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        Issues found ({results.issues.length})
                      </h3>
                      <p className="mb-4 text-xs text-slate-500">
                        These issues are likely hurting your SEO performance.
                      </p>
                      <ul className="space-y-2.5">
                        {results.issues.map((issue, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-3"
                          >
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                            <div>
                              <span className="text-sm font-medium text-slate-800">
                                {issue.title}
                              </span>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {issue.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {results.recommendations &&
                    results.recommendations.length > 0 && (
                      <div className="animate-fade-up animation-delay-300 rounded-2xl border border-slate-200 border-l-4 border-l-emerald-400 p-6">
                        <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-green-700">
                          <TrendingUp className="h-4 w-4" />
                          Recommendations ({results.recommendations.length})
                        </h3>
                        <p className="mb-4 text-xs text-slate-500">
                          Quick wins and deeper fixes to raise your SEO score.
                        </p>
                        <ul className="space-y-2.5">
                          {results.recommendations.map((rec, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                              <span className="text-sm text-slate-700">
                                {rec}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </TabsContent>

                {/* GEO tab */}
                <TabsContent value="geo" className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-3">
                    {results.geoMetrics.readabilityScore && (
                      <div className="animate-fade-up rounded-2xl border border-slate-200 p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          Readability
                        </p>
                        <div className="mt-3 text-3xl font-bold text-blue-600">
                          {results.geoMetrics.readabilityScore}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Flesch reading ease
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Grade level: {results.geoMetrics.gradeLevel}
                        </p>
                      </div>
                    )}

                    {results.geoMetrics.entities && (
                      <div className="animate-fade-up animation-delay-100 rounded-2xl border border-slate-200 p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          Entity richness
                        </p>
                        <div className="mt-3 text-3xl font-bold text-blue-600">
                          {results.geoMetrics.entities.total}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Total entities
                        </p>
                        <div className="mt-2 space-y-1 text-sm text-slate-500">
                          <div>People: {results.geoMetrics.entities.people}</div>
                          <div>Places: {results.geoMetrics.entities.places}</div>
                          <div>
                            Orgs: {results.geoMetrics.entities.organizations}
                          </div>
                        </div>
                      </div>
                    )}

                    {results.geoMetrics.contentToCodeRatio && (
                      <div className="animate-fade-up animation-delay-200 rounded-2xl border border-slate-200 p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          Content ratio
                        </p>
                        <div className="mt-3 text-3xl font-bold text-blue-600">
                          {results.geoMetrics.contentToCodeRatio}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Content-to-code
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Paragraphs: {results.geoMetrics.totalParagraphs}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Structured data */}
                  {results.geoMetrics.structuredData && (
                    <div className="animate-fade-up animation-delay-300 rounded-2xl border border-slate-200 p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        Structured data
                      </h3>
                      {results.geoMetrics.structuredData.hasJsonLd ? (
                        <div className="space-y-3">
                          <Alert className="rounded-xl border-green-200 bg-green-50/80">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-sm font-semibold">
                              Schema.org markup found
                            </AlertTitle>
                            <AlertDescription className="text-xs">
                              {results.geoMetrics.structuredData.scriptCount}{' '}
                              JSON-LD script(s) detected.
                            </AlertDescription>
                          </Alert>
                          {results.geoMetrics.structuredData.schemas.length >
                            0 && (
                            <div>
                              <p className="mb-2 text-sm font-medium text-slate-700">
                                Schema types:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {results.geoMetrics.structuredData.schemas.map(
                                  (schema, idx) => (
                                    <Badge key={idx} variant="outline">
                                      {schema}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Alert className="rounded-xl border-yellow-200 bg-yellow-50/80">
                          <Info className="h-4 w-4 text-yellow-600" />
                          <AlertTitle className="text-sm font-semibold">
                            No structured data found
                          </AlertTitle>
                          <AlertDescription className="text-xs">
                            Consider adding Schema.org markup for better AI
                            understanding.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  {/* GEO Issues */}
                  {results.geoIssues && results.geoIssues.length > 0 && (
                    <div className="animate-fade-up animation-delay-400 rounded-2xl border border-slate-200 border-l-4 border-l-red-400 p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        GEO issues ({results.geoIssues.length})
                      </h3>
                      <Accordion type="single" collapsible className="w-full">
                        {results.geoIssues.map((issue, index) => (
                          <AccordionItem key={index} value={`issue-${index}`}>
                            <AccordionTrigger className="-mx-2 rounded-lg px-2 text-sm">
                              {issue.title}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-slate-500">
                              {issue.description}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}

                  {/* GEO recommendations */}
                  {results.geoRecommendations &&
                    results.geoRecommendations.length > 0 && (
                      <div className="animate-fade-up animation-delay-500 rounded-2xl border border-slate-200 border-l-4 border-l-emerald-400 p-6">
                        <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-green-700">
                          <Brain className="h-4 w-4" />
                          GEO recommendations (
                          {results.geoRecommendations.length})
                        </h3>
                        <p className="mb-4 text-xs text-slate-500">
                          Optimize for AI search engines and LLMs.
                        </p>
                        <ul className="space-y-2.5">
                          {results.geoRecommendations.map((rec, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                              <span className="text-sm text-slate-700">
                                {rec}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </TabsContent>

                {/* Priority Guide tab */}
                <TabsContent
                  value="priority"
                  className="animate-fade-up space-y-8"
                >
                  <PriorityMatrix
                    issues={[
                      ...results.issues.map(
                        (issue): PriorityIssue => ({
                          ...issue,
                          source: 'seo',
                        })
                      ),
                      ...results.geoIssues.map(
                        (issue): PriorityIssue => ({
                          ...issue,
                          source: 'geo',
                        })
                      ),
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

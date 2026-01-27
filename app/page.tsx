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
  Info,
  Quote
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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Top navigation */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                SEO Score Checker
              </p>
              <p className="text-xs text-slate-500">
                Instant SEO & GEO audits
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900">
              How it works
            </a>
            <a href="#reviews" className="hover:text-slate-900">
              Reviews
            </a>
          </nav>
        </header>

        {/* Hero */}
        <section className="mb-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Sparkles className="h-3 w-3" />
              <span>Free, no signup required</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Instant SEO & GEO audit for any URL.
              </h1>
              <p className="text-sm text-slate-600 sm:text-base">
                Paste a page URL and get a full report on meta tags, headings, content structure,
                readability, entities, and structured data—optimized for both search engines and AI systems.
              </p>
            </div>

            <Card className="border bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Search className="h-4 w-4 text-blue-600" />
                  Check a live page
                </CardTitle>
                <CardDescription className="text-xs">
                  Enter any public URL to run an instant SEO + GEO analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    placeholder="https://your-website.com/page"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && analyzeSEO()}
                    className="h-11 flex-1 text-sm"
                  />
                  <Button
                    onClick={analyzeSEO}
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
                        Analyze now
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-slate-500">
                  No crawling limits for personal use. Works best with full content pages like landing pages,
                  blog posts, or docs.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
              <span className="font-medium text-slate-600">Trusted by teams who care about:</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">On-page SEO</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Content design</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">AI search visibility</span>
            </div>
          </div>

          <Card className="border bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Snapshot of a typical audit
              </CardTitle>
              <CardDescription className="text-xs">
                See the kind of insights you&apos;ll get before you run your first check.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border bg-slate-50 p-3">
                  <p className="mb-1 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                    SEO score
                  </p>
                  <p className="text-2xl font-semibold text-green-600">88 / 100</p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Strong meta tags, clean headings, and descriptive URLs.
                  </p>
                </div>
                <div className="rounded-xl border bg-slate-50 p-3">
                  <p className="mb-1 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                    GEO score
                  </p>
                  <p className="text-2xl font-semibold text-blue-600">92 / 100</p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    High readability, rich entities, and helpful examples.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-medium text-slate-700">Highlights you might see:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Clear, descriptive H1 and section headings.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    JSON-LD schema for products, articles, or local business.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Balanced keyword usage and readable paragraphs.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features + Reviews section */}
        <section
          id="features"
          className="mb-10 grid gap-6 border-y border-slate-100 py-8 lg:grid-cols-[1.4fr_1fr]"
        >
          {/* Example Results & Use Cases */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900">
              Understand every part of your page
            </h2>
            <p className="text-xs text-slate-600">
              SEO Score Checker breaks your audit into focused sections so you know exactly what to fix first.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border bg-white p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Meta & search preview
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Titles, descriptions, and social share snippets at a glance.
                </p>
              </div>
              <div className="rounded-xl border bg-white p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Structure & accessibility
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Heading hierarchy, image alt text, and content-to-code ratio.
                </p>
              </div>
              <div className="rounded-xl border bg-white p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  GEO & AI readiness
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Readability, entities, questions, and structured data coverage.
                </p>
              </div>
            </div>

            <div
              id="how-it-works"
              className="grid gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 sm:grid-cols-[auto,1fr]"
            >
              <div className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <span>How it works</span>
              </div>
              <ol className="space-y-1.5">
                <li>1. Paste any public URL with meaningful content.</li>
                <li>2. We crawl the page and compute SEO + GEO scores.</li>
                <li>3. You get a prioritized checklist of fixes and opportunities.</li>
              </ol>
            </div>
          </div>

          {/* Social Proof / Reviews */}
          <div id="reviews" className="space-y-4">
            <Card className="border bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Quote className="h-4 w-4 text-indigo-600" />
                  What people say
                </CardTitle>
                <CardDescription className="text-xs">
                  Short, focused audits that slot straight into existing workflows.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-700">
                <div className="rounded-lg border bg-slate-50 p-3">
                  <p>
                    “We run every new landing page through this tool before it goes live. It catches missing
                    headings, weak meta tags, and schema gaps in seconds.”
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-slate-500">
                    Growth lead at a B2B SaaS
                  </p>
                </div>
                <div className="rounded-lg border bg-slate-50 p-3">
                  <p>
                    “The GEO score is the missing piece—finally a quick way to see if our content is easy for
                    AI systems to consume, not just search engines.”
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-slate-500">
                    Technical SEO consultant
                  </p>
                </div>
              </CardContent>
            </Card>

            <Alert className="border-blue-100 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-xs font-semibold">
                Ready when you are
              </AlertTitle>
              <AlertDescription className="text-[11px]">
                Paste a URL above and run your first audit in under 10 seconds. No login, no tracking, just a
                clean report you can share with your team.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Results Section */}
        {results && (
          <div className="space-y-6 py-8">

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

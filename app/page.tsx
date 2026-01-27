'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Search,
  CheckCircle2,
  Image as ImageIcon,
  Hash,
  Sparkles,
  BarChart3,
  Brain,
  Info,
  Quote,
  AlertCircle,
} from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const normalizeUrl = (raw: string) => {
    let value = raw.trim()
    if (!value) return ''
    if (!/^https?:\/\//i.test(value)) {
      value = `https://${value}`
    }
    return value
  }

  const goToResults = () => {
    const normalized = normalizeUrl(url)
    if (!normalized) return
    setLoading(true)
    router.push(`/results?url=${encodeURIComponent(normalized)}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with glass navigation */}
        <header className="mb-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/40">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                SEO Score Checker
              </p>
              <p className="text-xs text-slate-500">
                Instant SEO & GEO audits for any URL
              </p>
            </div>
          </div>

          <nav className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/80 px-2 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-xl">
            <ul className="flex items-center justify-center gap-2 sm:gap-4">
              <li>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 transition-colors hover:bg-slate-100"
                >
                  <Hash className="h-3 w-3 text-blue-500" />
                  <span>How it works</span>
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 transition-colors hover:bg-slate-100"
                >
                  <Quote className="h-3 w-3 text-emerald-500" />
                  <span>Reviews</span>
                </a>
              </li>
              <li>
                <a
                  href="#implementation"
                  className="inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 transition-colors hover:bg-slate-100"
                >
                  <Brain className="h-3 w-3 text-sky-500" />
                  <span>How to implement</span>
                </a>
              </li>
            </ul>
          </nav>
        </header>

        {/* Hero */}
        <section className="mb-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm">
              <Sparkles className="h-3 w-3" />
              <span>Made for modern SEO & AI search</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                See how AI and search engines really see your page.
              </h1>
              <p className="text-sm text-slate-600 sm:text-base">
                Paste a URL and get a side‑by‑side SEO and GEO report—meta tags, headings, content structure,
                entities, and structured data—so AI models can finally find and understand your brand.
              </p>
            </div>

            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-900">
                  <Search className="h-4 w-4 text-blue-500" />
                  Check a live page
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Enter any public URL to run an instant SEO + GEO analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    placeholder="your-website.com/page"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && goToResults()}
                    className="h-11 flex-1 border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:bg-white"
                  />
                  <Button
                    onClick={goToResults}
                    disabled={loading || !url}
                    size="sm"
                    className="h-11 px-5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500"
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
                  We&apos;ll automatically add <span className="font-mono text-slate-700">https://</span> if it&apos;s
                  missing. Works best with full content pages like landing pages, blog posts, or docs.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
              <span className="font-medium text-slate-700">Great for teams focused on:</span>
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                On‑page SEO
              </span>
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                Content design
              </span>
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                AI search visibility
              </span>
            </div>
          </div>

          {/* Before / After visual */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Before vs after implementing fixes
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                A simplified example of how your page can change once you ship the recommended updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 text-xs md:grid-cols-2">
                {/* Before */}
                <div className="space-y-2 rounded-2xl border border-red-200 bg-gradient-to-b from-red-50 to-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-medium uppercase tracking-wide text-red-600">
                      Before
                    </span>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-700">
                      SEO 42 · GEO 55
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-100 px-2 py-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="ml-2 text-[10px] text-slate-500">
                        your‑product.com
                      </span>
                    </div>
                    <div className="space-y-1 px-3 py-2 text-[11px] text-slate-600">
                      <p className="line-clamp-1 font-medium">
                        Home | Welcome | Company | Start
                      </p>
                      <p className="line-clamp-2">
                        We&apos;re passionate about excellence and innovation across multiple
                        verticals and paradigms…
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          <span>No H1, multiple H3s, scattered content.</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          <span>Generic meta, no schema, keyword stuffing.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="space-y-2 rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-medium uppercase tracking-wide text-emerald-600">
                      After
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">
                      SEO 88 · GEO 92
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white">
                    <div className="flex items-center gap-1 border-b border-emerald-200 bg-emerald-50 px-2 py-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                      <span className="h-2 w-2 rounded-full bg-emerald-200" />
                      <span className="ml-2 text-[10px] text-slate-500">
                        your‑product.com/ai‑seo‑platform
                      </span>
                    </div>
                    <div className="space-y-1 px-3 py-2 text-[11px] text-slate-800">
                      <p className="line-clamp-1 font-semibold">
                        AI‑ready SEO platform for product pages
                      </p>
                      <p className="line-clamp-2 text-slate-600">
                        Help search engines and AI assistants understand your product, pricing, and value
                        with structured, readable content.
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>Single H1, clear sections, FAQ block.</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>Product + Organization schema, clean meta.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-medium text-slate-800">Highlights you might see:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Clear, descriptive H1 and section headings.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    JSON-LD schema for products, articles, or local business.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
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
          className="mb-14 grid gap-6 border-y border-slate-200 py-8 lg:grid-cols-[1.4fr_1fr]"
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
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Meta & search preview
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Titles, descriptions, and social share snippets at a glance.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Structure & accessibility
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Heading hierarchy, image alt text, and content-to-code ratio.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
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
              className="grid gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-700 sm:grid-cols-[auto,1fr]"
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
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-900">
                  <Quote className="h-4 w-4 text-indigo-500" />
                  What people say
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Short, focused audits that slot straight into existing workflows.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-700">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p>
                    “We run every new landing page through this tool before it goes live. It catches missing
                    headings, weak meta tags, and schema gaps in seconds.”
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-slate-500">
                    Growth lead at a B2B SaaS
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
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

            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-xs font-semibold text-slate-900">
                Ready when you are
              </AlertTitle>
              <AlertDescription className="text-[11px] text-slate-600">
                Paste a URL above and run your first audit in under 10 seconds. No login, no tracking, just a
                clean report you can share with your team.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Implementation section */}
        <section
          id="implementation"
          className="mb-8 grid gap-8 lg:grid-cols-[1.3fr,1fr]"
        >
          <div className="space-y-4">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900">
              How to implement the fixes
            </h2>
            <p className="text-xs text-slate-600">
              Use the report as a practical checklist. Ship improvements in small batches and watch both SEO and
              GEO scores climb.
            </p>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  1 · Foundations
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-emerald-400" />
                    <span>Update your title and meta description to match a single, clear intent.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-emerald-400" />
                    <span>Restructure headings so each page has one H1 and logical H2 sections.</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  2 · Make it AI‑readable
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Brain className="mt-0.5 h-3.5 w-3.5 text-sky-400" />
                    <span>Shorten long paragraphs, add examples, and use FAQ blocks for direct answers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Brain className="mt-0.5 h-3.5 w-3.5 text-sky-400" />
                    <span>Add Schema.org JSON‑LD for your product, organization, and key content types.</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  3 · Monitor & repeat
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <BarChart3 className="mt-0.5 h-3.5 w-3.5 text-blue-400" />
                    <span>Re‑run the checker after each deployment to confirm scores are trending up.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart3 className="mt-0.5 h-3.5 w-3.5 text-blue-400" />
                    <span>Share reports with writers, SEOs, and engineers as a shared source of truth.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-900">
                <ImageIcon className="h-4 w-4 text-sky-500" />
                See your brand the way AI sees it
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Use before/after reports as visual proof that AI models can now understand and surface your
                product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-700">
              <p>
                Send a &quot;before&quot; screenshot with low scores and unclear content, then an &quot;after&quot;
                screenshot with improved SEO and GEO metrics. It makes the impact of your work obvious to
                stakeholders.
              </p>
              <Alert className="border-emerald-200 bg-emerald-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle className="text-[11px] font-semibold text-slate-900">
                  Result: AI models can actually find you
                </AlertTitle>
                <AlertDescription className="text-[11px] text-slate-600">
                  Clean structure + rich entities + schema markup make it dramatically easier for AI assistants
                  to recommend your product, quote your copy, and answer with your brand.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
  ArrowRight,
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
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-slate-100/70 blur-3xl" />
        <div className="absolute right-1/3 top-1/2 h-[300px] w-[300px] rounded-full bg-blue-50/50 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header — logo mark only */}
        <header className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25">
              <Search className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              SEO Score Checker
            </span>
          </div>
          <nav className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <Link
              href="/blog"
              className="rounded-full border border-slate-200 px-3 py-1.5 transition-colors hover:border-blue-200 hover:text-blue-600"
            >
              Blog
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <main className="flex flex-1 items-center px-6 pb-12 sm:px-10 lg:px-16">
          <section className="mx-auto grid w-full max-w-6xl gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left — CTA */}
            <div className="animate-fade-up space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-medium text-blue-700">
                <Sparkles className="h-3 w-3" />
                <span>SEO + GEO analysis</span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                See how search engines{' '}
                <span className="text-blue-600">really see</span> your page.
              </h1>

              <p className="max-w-md text-lg leading-relaxed text-slate-500">
                Paste any URL. Get an instant SEO and GEO audit with a prioritized fix list.
              </p>

              <div className="flex max-w-lg flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="example.com/page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && goToResults()}
                  className="h-12 flex-1 rounded-xl border-slate-200 bg-slate-50/80 text-base placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-blue-500/20"
                />
                <Button
                  onClick={goToResults}
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
                      Analyze now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-slate-400">
                Free, no login required. We add{' '}
                <span className="font-mono text-slate-500">https://</span>{' '}
                automatically.
              </p>
            </div>

            {/* Right — Before / After */}
            <div className="animate-fade-up animation-delay-200 space-y-5">
              <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                Before vs. after implementing fixes
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Before */}
                <div className="space-y-3 rounded-2xl border border-red-200/60 bg-gradient-to-b from-red-50/50 to-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-red-500">
                      Before
                    </span>
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-medium text-red-700">
                      SEO 42 · GEO 55
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="ml-2 truncate text-[10px] text-slate-400">
                        your-product.com
                      </span>
                    </div>
                    <div className="space-y-2 p-3 text-[11px]">
                      <p className="line-clamp-1 font-medium text-slate-700">
                        Home | Welcome | Company | Start
                      </p>
                      <p className="line-clamp-2 text-slate-500">
                        We&apos;re passionate about excellence and innovation across
                        multiple verticals&hellip;
                      </p>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-slate-500">
                          <AlertCircle className="h-3 w-3 shrink-0 text-red-400" />
                          <span>No H1, scattered content</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <AlertCircle className="h-3 w-3 shrink-0 text-red-400" />
                          <span>Generic meta, no schema</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="space-y-3 rounded-2xl border border-emerald-200/60 bg-gradient-to-b from-emerald-50/50 to-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                      After
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                      SEO 88 · GEO 92
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-emerald-200/50 bg-white shadow-sm">
                    <div className="flex items-center gap-1.5 border-b border-emerald-100 bg-emerald-50/50 px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                      <span className="h-2 w-2 rounded-full bg-emerald-200" />
                      <span className="ml-2 truncate text-[10px] text-slate-400">
                        your-product.com/ai-seo-platform
                      </span>
                    </div>
                    <div className="space-y-2 p-3 text-[11px]">
                      <p className="line-clamp-1 font-semibold text-slate-800">
                        AI-ready SEO platform for product pages
                      </p>
                      <p className="line-clamp-2 text-slate-500">
                        Help search engines and AI assistants understand your product
                        with structured content.
                      </p>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                          <span>Clear H1, logical sections</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                          <span>Product schema, clean meta</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="px-6 py-6 sm:px-10 lg:px-16">
          <p className="text-xs text-slate-400">
            Free and open source. No tracking, no login.
          </p>
        </footer>
      </div>
    </div>
  )
}

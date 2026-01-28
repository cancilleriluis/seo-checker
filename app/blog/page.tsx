import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, BookOpen, Brain, LineChart, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAllPosts } from '@/lib/posts'

export const revalidate = 60

const topics = [
  { label: 'GEO Basics', icon: Brain },
  { label: 'AI Search Trends', icon: LineChart },
  { label: 'Optimization Guides', icon: Sparkles },
  { label: 'Editorial Deep Dives', icon: BookOpen },
]

export default function BlogPage() {
  const posts = getAllPosts()
  const featuredPosts = posts.filter((post) => post.featured).slice(0, 2)
  const latestPosts = posts.filter((post) => !post.featured)
  const fallbackPosts = featuredPosts.length ? latestPosts : posts

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-32 -top-24 h-[460px] w-[460px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-slate-100/70 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-[280px] w-[280px] rounded-full bg-blue-50/60 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-16">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to checker
          </Link>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            New: GEO insights
          </Badge>
        </header>

        <main className="space-y-12">
          <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                SEO Score Checker Journal
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
                Essays, definitions, and statistics for the AI search era.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-500">
                Learn how search engines and answer engines read your content. Short, direct
                articles that help you optimize for humans and machines.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="rounded-full bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500">
                  Explore latest
                </Button>
                <Button variant="outline" className="rounded-full px-6 text-sm">
                  Subscribe to updates
                </Button>
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Topics we cover
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {topics.map((topic) => {
                  const Icon = topic.icon
                  return (
                    <div
                      key={topic.label}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{topic.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            {featuredPosts.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
                Add your first post in <span className="font-mono">content/posts</span> to populate
                this section.
              </div>
            )}
            {featuredPosts.map((post) => (
              <article
                key={post.slug}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/60 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                {post.category && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                    {post.category}
                  </Badge>
                )}
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">{post.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {post.excerpt || 'Add an excerpt in the post frontmatter.'}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                  <span>{post.readTime || 'Read time'}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-blue-600"
                  >
                    Read story
                    <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Latest articles</h3>
              <Button variant="ghost" className="text-sm text-blue-600">
                View archive
              </Button>
            </div>
            <div className="grid gap-4">
              {fallbackPosts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-5 text-sm text-slate-500">
                  No posts yet. Add an MDX file to <span className="font-mono">content/posts</span>.
                </div>
              )}
              {fallbackPosts.map((post) => (
                <article
                  key={post.slug}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:border-blue-200 hover:bg-white"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {post.category && (
                        <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px]">
                          {post.category}
                        </Badge>
                      )}
                      <span>{post.readTime || 'Read time'}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900">{post.title}</h4>
                    <p className="text-sm text-slate-500">
                      {post.excerpt || 'Add an excerpt in the post frontmatter.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Published{' '}
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : 'soon'}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-blue-600"
                    >
                      Read more
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-slate-900">Stay ahead of AI search shifts.</h3>
              <p className="text-sm text-slate-500">
                Get practical GEO playbooks, ranking signals, and new research delivered once a month.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="you@company.com"
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400"
              />
              <Button className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-500">
                Join the list
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

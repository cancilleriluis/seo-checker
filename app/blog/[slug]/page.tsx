import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import { Badge } from '@/components/ui/badge'
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts'

export const revalidate = 60

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()
  const { frontmatter, content } = post
  const { content: mdxContent } = await compileMDX({
    source: content,
    options: { parseFrontmatter: false },
    components: {
      h2: ({ children }) => (
        <h2 className="mt-8 text-2xl font-semibold text-slate-900">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-6 text-xl font-semibold text-slate-900">
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p className="mt-4 text-base leading-relaxed text-slate-700">
          {children}
        </p>
      ),
      ul: ({ children }) => (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
          {children}
        </ol>
      ),
      a: ({ children, href }) => (
        <a className="text-blue-600 underline-offset-4 hover:underline" href={href}>
          {children}
        </a>
      ),
    },
  })

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 sm:px-10 lg:px-0">
      <div className="space-y-4">
        {frontmatter.category && (
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            {frontmatter.category}
          </Badge>
        )}
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          {frontmatter.title}
        </h1>
        <p className="text-sm text-slate-500">
          {frontmatter.publishedAt
            ? new Date(frontmatter.publishedAt).toLocaleDateString()
            : 'Draft'}{' '}
          · {frontmatter.readTime || 'Read time'}
        </p>
        {frontmatter.excerpt && (
          <p className="text-lg text-slate-600">{frontmatter.excerpt}</p>
        )}
      </div>

      <div className="mt-10">{mdxContent}</div>
    </article>
  )
}

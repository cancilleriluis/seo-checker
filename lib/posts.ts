import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

export type PostFrontmatter = {
  title: string
  excerpt?: string
  category?: string
  readTime?: string
  publishedAt?: string
  featured?: boolean
}

export type PostSummary = PostFrontmatter & {
  slug: string
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx') && !file.startsWith('_'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    content,
    frontmatter: data as PostFrontmatter,
  }
}

export function getAllPosts(): PostSummary[] {
  const slugs = getAllPostSlugs()
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug)
      if (!post) return null
      return {
        slug,
        ...post.frontmatter,
      }
    })
    .filter(Boolean) as PostSummary[]

  return posts.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
    return dateB - dateA
  })
}

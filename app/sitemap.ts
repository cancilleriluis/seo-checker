import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://seo-checker-three.vercel.app'

  const posts = getAllPosts()

  const base: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/results`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...base, ...postEntries]
}

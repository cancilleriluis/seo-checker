import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOChecker/1.0)',
      },
    })
    
    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract SEO elements
    const title = $('title').text() || ''
    const description = $('meta[name="description"]').attr('content') || ''
    const ogTitle = $('meta[property="og:title"]').attr('content') || ''
    const ogDescription = $('meta[property="og:description"]').attr('content') || ''
    const h1Count = $('h1').length
    const h2Count = $('h2').length
    const imagesWithoutAlt = $('img:not([alt])').length
    const totalImages = $('img').length

    // Calculate score
    let score = 100
    let issues = []
    let recommendations = []

    // Title checks
    if (!title) {
      score -= 15
      issues.push('Missing title tag')
      recommendations.push('Add a descriptive title tag')
    } else if (title.length < 30) {
      score -= 10
      issues.push('Title is too short (should be 50-60 characters)')
      recommendations.push('Expand your title to 50-60 characters for better visibility')
    } else if (title.length > 60) {
      score -= 5
      issues.push('Title is too long (may be truncated in search results)')
      recommendations.push('Shorten title to 50-60 characters')
    }

    // Description checks
    if (!description) {
      score -= 15
      issues.push('Missing meta description')
      recommendations.push('Add a compelling meta description (150-160 characters)')
    } else if (description.length < 120) {
      score -= 10
      issues.push('Meta description is too short')
      recommendations.push('Expand description to 150-160 characters')
    } else if (description.length > 160) {
      score -= 5
      issues.push('Meta description is too long')
      recommendations.push('Shorten description to 150-160 characters')
    }

    // Open Graph checks
    if (!ogTitle || !ogDescription) {
      score -= 10
      issues.push('Missing Open Graph tags for social sharing')
      recommendations.push('Add Open Graph meta tags for better social media previews')
    }

    // Heading checks
    if (h1Count === 0) {
      score -= 10
      issues.push('No H1 heading found')
      recommendations.push('Add exactly one H1 heading with your main keyword')
    } else if (h1Count > 1) {
      score -= 5
      issues.push(`Multiple H1 headings found (${h1Count})`)
      recommendations.push('Use only one H1 heading per page')
    }

    // Image alt text checks
    if (imagesWithoutAlt > 0) {
      score -= 10
      issues.push(`${imagesWithoutAlt} images missing alt text`)
      recommendations.push('Add descriptive alt text to all images for accessibility and SEO')
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score)

    return NextResponse.json({
      score,
      title,
      titleLength: title.length,
      description,
      descriptionLength: description.length,
      ogTitle,
      ogDescription,
      h1Count,
      h2Count,
      imagesWithoutAlt,
      totalImages,
      issues,
      recommendations,
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze URL. Make sure it is accessible and valid.' },
      { status: 500 }
    )
  }
}

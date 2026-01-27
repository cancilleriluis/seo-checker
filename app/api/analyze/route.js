import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import nlp from 'compromise'
import { fleschReadingEase, fleschKincaidGrade } from 'readability-scores'

// Helper function to analyze GEO metrics
function analyzeGEO($, html, bodyText) {
  let geoScore = 100
  const geoIssues = []
  const geoRecommendations = []
  const geoMetrics = {}

  // 1. Content Structure Analysis (30 points)
  const headings = {
    h1: $('h1'),
    h2: $('h2'),
    h3: $('h3'),
    h4: $('h4'),
    h5: $('h5'),
    h6: $('h6')
  }

  // Check heading hierarchy
  const h1Count = headings.h1.length
  const h2Count = headings.h2.length
  const h3Count = headings.h3.length
  let hierarchyScore = 10

  if (h1Count === 0) {
    hierarchyScore -= 10
    geoIssues.push({ title: 'No H1 heading for topic clarity', description: 'A missing H1 prevents AI from identifying the main topic of the page.', impact: 'high', effort: 'low' })
    geoRecommendations.push('Add a clear H1 heading to establish the main topic')
  } else if (h1Count > 1) {
    hierarchyScore -= 5
    geoIssues.push({ title: 'Multiple H1 headings may confuse topic identification', description: 'Having more than one H1 dilutes the primary topic signal for AI systems.', impact: 'medium', effort: 'low' })
    geoRecommendations.push('Use only one H1 heading per page')
  }

  if (h2Count === 0 && bodyText.length > 500) {
    hierarchyScore -= 3
    geoIssues.push({ title: 'No H2 headings to structure content', description: 'H2 headings help AI break content into logical sections for extraction.', impact: 'medium', effort: 'low' })
    geoRecommendations.push('Add H2 headings to break content into clear sections')
  }

  geoMetrics.headingHierarchyScore = Math.max(0, hierarchyScore)
  geoScore -= (10 - hierarchyScore)

  // Paragraph analysis
  const paragraphs = $('p').toArray().map(p => $(p).text().trim()).filter(text => text.length > 0)
  const paragraphWordCounts = paragraphs.map(p => p.split(/\s+/).length)
  const optimalParagraphs = paragraphWordCounts.filter(count => count >= 40 && count <= 150).length
  const paragraphScore = paragraphs.length > 0 ? Math.min(10, (optimalParagraphs / paragraphs.length) * 10) : 0

  geoMetrics.totalParagraphs = paragraphs.length
  geoMetrics.optimalParagraphs = optimalParagraphs
  geoMetrics.paragraphScore = paragraphScore

  if (paragraphScore < 5) {
    geoIssues.push({ title: 'Many paragraphs are too long or too short', description: 'Paragraphs outside the 40-150 word range are harder for AI to parse and summarize.', impact: 'medium', effort: 'medium' })
    geoRecommendations.push('Aim for 40-150 words per paragraph for better AI comprehension')
  }
  geoScore -= (10 - paragraphScore)

  // Lists and tables (structured data)
  const lists = $('ul, ol').length
  const tables = $('table').length
  let structuredContentScore = 0

  if (lists > 0) structuredContentScore += 3
  if (tables > 0) structuredContentScore += 2

  geoMetrics.lists = lists
  geoMetrics.tables = tables
  geoMetrics.structuredContentScore = structuredContentScore

  if (lists === 0 && bodyText.length > 1000) {
    geoIssues.push({ title: 'No lists found for information extraction', description: 'Lists help AI systems quickly extract key points and structured information.', impact: 'low', effort: 'low' })
    geoRecommendations.push('Use bullet points or numbered lists for key information')
  }
  geoScore -= (5 - structuredContentScore)

  // Content-to-code ratio
  const textLength = bodyText.length
  const htmlLength = html.length
  const contentRatio = textLength / htmlLength
  let contentRatioScore = contentRatio > 0.25 ? 5 : Math.max(0, contentRatio * 20)

  geoMetrics.contentToCodeRatio = (contentRatio * 100).toFixed(1) + '%'
  geoMetrics.contentRatioScore = contentRatioScore

  if (contentRatio < 0.25) {
    geoIssues.push({ title: 'Low content-to-code ratio', description: 'Too much HTML markup relative to text content reduces AI extraction quality.', impact: 'medium', effort: 'high' })
    geoRecommendations.push('Increase meaningful text content relative to HTML markup')
  }
  geoScore -= (5 - contentRatioScore)

  // 2. Natural Language Quality (35 points)
  if (bodyText.length > 100) {
    // Readability score (Flesch Reading Ease)
    try {
      const readabilityScore = fleschReadingEase(bodyText)
      const gradeLevel = fleschKincaidGrade(bodyText)

      geoMetrics.readabilityScore = readabilityScore.toFixed(1)
      geoMetrics.gradeLevel = gradeLevel.toFixed(1)

      let readabilityPoints = 0
      if (readabilityScore >= 60 && readabilityScore <= 80) {
        readabilityPoints = 15
      } else if (readabilityScore >= 50 && readabilityScore < 60) {
        readabilityPoints = 12
        geoIssues.push({ title: 'Content is slightly difficult to read', description: 'A Flesch score below 60 means the content may be hard for AI to summarize clearly.', impact: 'medium', effort: 'high' })
        geoRecommendations.push('Simplify sentence structure for better accessibility')
      } else if (readabilityScore >= 80) {
        readabilityPoints = 12
        geoIssues.push({ title: 'Content may be too simple', description: 'Overly simple content may lack the depth AI needs to generate authoritative answers.', impact: 'low', effort: 'medium' })
      } else {
        readabilityPoints = 8
        geoIssues.push({ title: 'Content is difficult to read', description: 'Complex language significantly reduces AI comprehension and summarization quality.', impact: 'high', effort: 'high' })
        geoRecommendations.push('Break down complex sentences and use simpler language')
      }

      geoScore -= (15 - readabilityPoints)
    } catch (e) {
      // Readability calculation failed
      geoScore -= 10
    }

    // Entity extraction using NLP
    const doc = nlp(bodyText)
    const people = doc.people().out('array')
    const places = doc.places().out('array')
    const organizations = doc.organizations().out('array')
    const totalEntities = people.length + places.length + organizations.length
    const wordCount = bodyText.split(/\s+/).length
    const entityDensity = (totalEntities / wordCount) * 500 // entities per 500 words

    geoMetrics.entities = {
      people: people.length,
      places: places.length,
      organizations: organizations.length,
      total: totalEntities
    }
    geoMetrics.entityDensity = entityDensity.toFixed(1)

    let entityScore = Math.min(10, entityDensity * 2)
    if (entityDensity < 5) {
      geoIssues.push({ title: 'Low entity richness may reduce context for AI', description: 'Named entities (people, places, organizations) help AI ground content in factual context.', impact: 'medium', effort: 'medium' })
      geoRecommendations.push('Include more specific names, places, and organizations')
    }
    geoScore -= (10 - entityScore)

    // Question-answer patterns
    const questions = doc.questions().out('array')
    geoMetrics.questions = questions.length

    let qaScore = questions.length > 0 ? 5 : 0
    if (questions.length === 0 && bodyText.length > 1000) {
      geoIssues.push({ title: 'No question-answer patterns found', description: 'FAQ-style content is heavily favored by AI for direct answer extraction.', impact: 'high', effort: 'medium' })
      geoRecommendations.push('Consider adding FAQ sections for common questions')
    }
    geoScore -= (5 - qaScore)

    // Keyword density (avoid over-optimization)
    const terms = doc.terms().out('array')
    const uniqueTerms = new Set(terms.map(t => t.toLowerCase()))
    const keywordDensity = ((terms.length - uniqueTerms.size) / terms.length) * 100

    geoMetrics.keywordDensity = keywordDensity.toFixed(1) + '%'

    let keywordScore = 5
    if (keywordDensity > 3) {
      keywordScore = 2
      geoIssues.push({ title: 'High keyword density suggests over-optimization', description: 'Keyword stuffing can cause AI to flag content as low quality or spammy.', impact: 'high', effort: 'medium' })
      geoRecommendations.push('Write more naturally and avoid keyword stuffing')
    } else if (keywordDensity < 1) {
      keywordScore = 3
      geoIssues.push({ title: 'Very low keyword repetition', description: 'Some keyword repetition helps AI identify topic relevance.', impact: 'low', effort: 'low' })
    }
    geoScore -= (5 - keywordScore)
  } else {
    geoScore -= 35
    geoIssues.push({ title: 'Insufficient content for natural language analysis', description: 'Less than 100 words of text is too thin for AI to meaningfully analyze or cite.', impact: 'high', effort: 'high' })
    geoRecommendations.push('Add more substantial text content (at least 100 words)')
  }

  // 3. Structured Data Analysis (25 points)
  const jsonLdScripts = $('script[type="application/ld+json"]')
  const hasStructuredData = jsonLdScripts.length > 0

  geoMetrics.structuredData = {
    hasJsonLd: hasStructuredData,
    scriptCount: jsonLdScripts.length,
    schemas: []
  }

  let structuredDataScore = 0
  if (hasStructuredData) {
    structuredDataScore = 15
    jsonLdScripts.each((i, script) => {
      try {
        const data = JSON.parse($(script).html())
        const schemaType = data['@type'] || 'Unknown'
        geoMetrics.structuredData.schemas.push(schemaType)

        // Check for specific schemas
        if (schemaType === 'FAQPage' || data['@type'] === 'Question') {
          structuredDataScore += 5
        }
        if (schemaType === 'Article' || schemaType === 'BlogPosting') {
          structuredDataScore += 5
        }
        if (schemaType === 'HowTo') {
          structuredDataScore += 5
        }
      } catch (e) {
        // Invalid JSON-LD
      }
    })
  } else {
    geoIssues.push({ title: 'No structured data (Schema.org) found', description: 'JSON-LD markup is critical for AI systems to understand page semantics and entity relationships.', impact: 'high', effort: 'high' })
    geoRecommendations.push('Add JSON-LD structured data for better AI understanding')
  }

  structuredDataScore = Math.min(25, structuredDataScore)
  geoScore -= (25 - structuredDataScore)

  // 4. AI-Friendly Signals (10 points)
  // Check for definition patterns
  const definitions = bodyText.match(/(?:is|are|means|refers to|defined as)\s+(?:a|an|the)?\s*[\w\s]+/gi) || []
  let definitionScore = Math.min(3, definitions.length * 0.5)

  if (definitions.length === 0) {
    geoIssues.push({ title: 'No clear definitions found', description: 'Explicit definitions help AI extract and present accurate information about key concepts.', impact: 'medium', effort: 'low' })
    geoRecommendations.push('Include clear definitions of key terms')
  }
  geoScore -= (3 - definitionScore)

  // Check for examples
  const examples = bodyText.match(/(?:for example|for instance|such as|like|e\.g\.)/gi) || []
  let exampleScore = Math.min(2, examples.length * 0.5)

  geoMetrics.examples = examples.length
  if (examples.length === 0 && bodyText.length > 800) {
    geoIssues.push({ title: 'No examples or illustrations found', description: 'Concrete examples improve AI understanding and make content more citable.', impact: 'low', effort: 'low' })
    geoRecommendations.push('Add concrete examples to clarify concepts')
  }
  geoScore -= (2 - exampleScore)

  // Topic sentences (first sentence of paragraphs should be clear)
  let topicSentenceScore = 5
  if (paragraphs.length > 3) {
    const firstSentences = paragraphs.map(p => {
      const sentences = p.split(/[.!?]+/)
      return sentences[0] || ''
    }).filter(s => s.length > 0)

    const shortFirstSentences = firstSentences.filter(s => s.split(/\s+/).length < 5).length
    if (shortFirstSentences / firstSentences.length > 0.5) {
      topicSentenceScore = 2
      geoIssues.push({ title: 'Many paragraphs lack clear topic sentences', description: 'AI systems rely on leading sentences to understand paragraph purpose and extract summaries.', impact: 'medium', effort: 'medium' })
      geoRecommendations.push('Start paragraphs with clear, descriptive topic sentences')
    }
  }
  geoScore -= (5 - topicSentenceScore)

  // Ensure score stays within bounds
  geoScore = Math.max(0, Math.min(100, geoScore))

  return {
    geoScore: Math.round(geoScore),
    geoIssues,
    geoRecommendations,
    geoMetrics
  }
}

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

    // Extract body text for GEO analysis
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim()

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

    // Perform GEO analysis
    const geoAnalysis = analyzeGEO($, html, bodyText)

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
      // GEO Analysis results
      geoScore: geoAnalysis.geoScore,
      geoIssues: geoAnalysis.geoIssues,
      geoRecommendations: geoAnalysis.geoRecommendations,
      geoMetrics: geoAnalysis.geoMetrics,
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze URL. Make sure it is accessible and valid.' },
      { status: 500 }
    )
  }
}

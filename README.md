# SEO & GEO Checker

A comprehensive website analysis tool that evaluates both traditional SEO and GEO (Generative Engine Optimization) metrics to help you optimize your content for both search engines and AI systems.

## Features

### Traditional SEO Analysis
- **Meta Tags Validation**: Analyze title tags, meta descriptions, and Open Graph tags
- **Page Structure**: Validate heading hierarchy (H1, H2, etc.)
- **Image Accessibility**: Check for missing alt text
- **SEO Scoring**: Get a 0-100 score with actionable recommendations

### GEO (Generative Engine Optimization) Analysis
- **Content Structure**: Analyze heading hierarchy, paragraph length, and content organization
- **Readability Metrics**: Flesch Reading Ease and grade level scoring
- **Entity Extraction**: Identify people, places, and organizations mentioned
- **Structured Data**: Detect and validate Schema.org JSON-LD markup
- **AI-Friendly Signals**: Check for definitions, examples, and clear topic sentences
- **GEO Scoring**: Separate 0-100 score for AI/LLM optimization

## Live Demo

🚀 **Production URL**: https://seo-checker-three.vercel.app

## Tech Stack

- **Framework**: Next.js 15.1.4 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui with Radix UI primitives
- **NLP**: Compromise for entity extraction
- **Readability**: readability-scores for Flesch metrics
- **HTML Parsing**: Cheerio

## Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cancilleriluis/seo-checker.git
cd seo-checker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

**Your changes will appear instantly with hot-reload!** You don't need to deploy to see what you're building.

### Building for Production

Test the production build locally:
```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel

The easiest way to deploy:

```bash
vercel deploy --prod
```

Or connect your GitHub repository to Vercel for automatic deployments on every push.

### Environment Variables

No environment variables required! The app works out of the box.

## Development Workflow

1. **Make changes** to your code (e.g., update UI, add features)
2. **Preview locally** with `npm run dev` at http://localhost:3000
3. **Iterate** - changes appear instantly with hot-reload
4. **Build** with `npm run build` to ensure no errors
5. **Deploy** to Vercel when ready

## License

This project is open source and available under the MIT License.

## Author

Luis Cancilleri

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- **Start development server**: `npm run dev` - Compiles TypeScript and starts Next.js dev server
- **Build production**: `npm run build` - Creates optimized production build  
- **Start production**: `npm start` - Serves production build
- **Type checking**: `tsc` - Manual TypeScript compilation/checking

### Code Quality
- **Linting**: No direct lint script defined, but ESLint is configured with Airbnb standards
- **Formatting**: Prettier is configured (2 spaces, single quotes, no semicolons, ES5 trailing commas)

## Architecture Overview

### Project Structure
This is a **Next.js 14 + TypeScript personal website/blog** that uses **Notion as a headless CMS**.

### Key Components

**Blog System (`/src/pages/articles/`)**:
- `index.tsx` - Article listing page with infinite scroll pagination
- `[title].tsx` - Individual article pages with dynamic routing
- `/api/articles/more.ts` - API endpoint for loading additional articles

**Notion Integration (`/src/components/notion.tsx`)**:
- Central module for all Notion API interactions
- Key functions: `getDatabase()`, `getPageTitle()`, `getPageDate()`, `getBlocks()`, `getOpeningSentence()`
- Handles pagination, filtering by publish date, and content rendering
- Supports OGP data fetching for link previews

**Content Rendering (`/src/components/renderNotionBlock.tsx`)**:
- Converts Notion blocks to React components
- Supports headings, paragraphs, images, lists, code blocks, bookmarks
- Handles nested content and table of contents generation

**Homepage (`/src/pages/index.tsx`)**:
- Portfolio sections: Profile, Skills, Career, Works, Activities
- Each section is a separate component in `/src/components/`

### Data Flow
1. **Static Generation**: Uses `getStaticProps()` and `getStaticPaths()` for blog pages
2. **Notion CMS**: Blog content fetched from Notion database via `@notionhq/client`
3. **Pagination**: Client-side infinite scroll with server-side API endpoint
4. **Image Handling**: Blog images saved locally via `saveImageIfNeeded()`

### Environment Variables Required
- `NOTION_TOKEN` - Notion integration token
- `NOTION_DATABASE_ID` - Database ID for blog articles
- Additional tracking/analytics tokens (referenced in components)

### Styling Approach
- **CSS Modules** for component styling (`*.module.css`)
- **Responsive design** with mobile-first approach
- **No CSS framework** - custom styles throughout

### Key Technical Decisions
- **TypeScript strict mode** enabled
- **ESLint + Prettier** with Airbnb configuration
- **Incremental Static Regeneration** (ISR) with 1-second revalidation
- **Client-side pagination** for performance on article listing
- **Semantic HTML** using proper elements (`<time>`, `<article>`, etc.)

### Blog Article Workflow
When working with blog functionality:
1. Articles are filtered by `isPublishDate()` - only published articles shown
2. Article dates use `getPageDate()` which prefers "publish date" over "last_edited_time"
3. Article rendering supports nested content, code blocks, and OGP link previews
4. Images are automatically downloaded and served locally
5. Table of contents is auto-generated from headings

## Global Rule

- [MANDATORY] Answer in Japanese 

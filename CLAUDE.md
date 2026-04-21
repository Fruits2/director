# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Academic Dashboard** project - a web application for visualizing and tracking academic work metrics (publications, research funding, student guidance, teaching load, conference presentations, etc.). The dashboard is being built as a personal project management tool.

**Tech Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS

## Development Environment Setup

### Key Commands

**From the `academic-dashboard/` directory:**

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint and type-check
npm run lint
```

### Project Structure

```
academic-dashboard/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page (currently boilerplate)
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles (Tailwind)
├── public/                # Static assets
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies & scripts
└── [components/utils/etc] # To be created
```

### Root-Level Files

- **`create_clinical_data.py`**: Python script that generates sample clinical/medical data. Outputs an Excel file at `C:\workspace\순환기계_임상데이터.xlsx`. This is likely test data for the dashboard.
- **`index.html`, `style.css`, `script.js`**: Legacy static files - likely not part of the Next.js project (consider removing if no longer needed).

## Implementation Roadmap

The dashboard needs:

1. **Data visualization components**:
   - Data tables (for detailed views of publications, projects, students, etc.)
   - Bar charts (publications/funding by year)
   - Line charts (cumulative trends)
   - Pie charts (category breakdowns)

2. **Dashboard pages**:
   - Overview (summary metrics + key trends)
   - Publications (table + year-over-year chart)
   - Research (funding status + project breakdown)
   - Students (guidance metrics + completion rates)
   - Settings (data management)

3. **Data handling**:
   - Decide on data storage (PostgreSQL + Prisma, Supabase, or local JSON)
   - Support CSV/Excel import for initial data
   - API endpoints for CRUD operations

## Recommended Libraries (Not Yet Added)

- **Charts**: `recharts` (lightweight, React-friendly) or `chart.js`
- **Tables**: `@tanstack/react-table` (flexible, headless) or `shadcn/ui` with built-in table
- **UI Components**: `shadcn/ui` (copy-paste component library over Tailwind) or stick with Tailwind only
- **Database ORM**: `prisma` + PostgreSQL or Supabase

## Key Implementation Notes

- All new features go in the `academic-dashboard/` directory - this is the main Next.js app
- Use TypeScript for type safety
- Tailor chart components and tables to academic metrics (not generic)
- Consider adding data export (PDF, Excel) for reports
- The Python data generation script can be referenced for understanding sample data structure

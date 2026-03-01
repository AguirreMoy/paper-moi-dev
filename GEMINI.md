# Gemini CLI Mandates for AstroPaper

This document outlines project-specific rules for Gemini CLI when working on the AstroPaper codebase. These instructions take precedence over general defaults.

## General Workflows

### Pre-push Validation
- **Mandatory Formatting:** ALWAYS run `npm run format` (Prettier) before pushing changes to the remote repository.
- **Linting:** Ensure changes pass `npm run lint` if applicable.

### Source Control
- Work in feature branches (e.g., `blog/`, `feature/`, `chore/`).
- Do not commit directly to `main`.

## Blog Post Standards

### Format & Structure
All new blog posts must be placed in `src/data/blog/` and adhere to the following frontmatter and structure:

```markdown
---
author: Moises Aguirre
pubDatetime: YYYY-MM-DDTHH:mm:ssZ
title: "Your Post Title"
postSlug: your-post-slug
featured: false
draft: false
tags:
  - tag1
  - tag2
description: "A brief, compelling description for SEO and previews."
linkedin_share: true
---

# Your Post Title

[Content begins here...]
```

### Conventions
- **Slug Management:** Ensure `postSlug` is unique and matches the file name (without the `.md`).
- **Date:** Use the current date in ISO 8601 format for `pubDatetime`.
- **Images:** If using images, place them in `src/assets/images/` and reference them correctly.
- **Tone:** Maintain a professional yet accessible tone, as seen in existing posts.

## Tooling
- **Prettier:** Use `npm run format`.
- **Development:** Use `npm run dev` to preview changes locally if requested.

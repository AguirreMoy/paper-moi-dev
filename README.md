# Moises Aguirre - Personal Blog 📄

This is my personal blog and portfolio, built with [Astro](https://astro.build/) using the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## 🚀 Features

- **Blog**: Technical articles and workshops (e.g., Kubernetes, Cloud Architecture).
- **Portfolio**: Showcase of my resume, philosophies, and interests.
- **LinkedIn Integration**: Automated sharing of new blog posts to LinkedIn.
- **Custom Theme**: "Pastel Pink" aesthetic with light/dark mode support.

## 📝 LinkedIn Auto-Posting

This project includes a GitHub Action to automatically post new blog posts to LinkedIn.

### How it Works

1.  When a **new** markdown file is added to `src/data/blog/` and pushed to the `main` branch...
2.  The GitHub Action checks if the frontmatter contains `linkedin_share: true`.
3.  If true, it constructs a post using the title, description, and tags, and publishes it to your LinkedIn profile via the API.

### Configuration

To enable this feature, you must set the following **GitHub Secrets** in your repository:

- `LINKEDIN_ACCESS_TOKEN`: An OAuth 2.0 Access Token with `w_member_social` scope.
- `LINKEDIN_USER_URN`: Your LinkedIn Person URN (e.g., `urn:li:person:12345`).

**Frontmatter Example:**

```yaml
---
title: "My New Post"
description: "An exciting update."
linkedin_share: true
tags:
  - astro
  - coding
---
```

## 💻 Tech Stack

- **Framework:** Astro
- **Styling:** TailwindCSS
- **Search:** FuseJS / Pagefind
- **Automation:** GitHub Actions, Node.js (axios, gray-matter)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |
| `npm run format`  | Format code with Prettier                    |
| `npm run lint`    | Lint with ESLint                             |

## 📜 License

This project is based on [AstroPaper](https://github.com/satnaing/astro-paper).

Licensed under the MIT License.

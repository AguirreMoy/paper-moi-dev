---
author: Moises Aguirre
pubDatetime: 2026-02-11T10:00:00Z
title: "Building My First Gemini CLI Skill: A Journey into AI Automation"
postSlug: building-my-first-gemini-skill
featured: true
draft: false
tags:
  - Gemini
  - AI
  - LinkedIn
  - JavaScript
  - Automation
description: "Lessons learned from bridging AI prompts with real-world APIs to automate LinkedIn sharing."
linkedin_share: true
---

# Building My First Gemini CLI Skill: A Journey into AI Automation

Recently, I decided to dive deep into the [Gemini CLI](https://github.com/google/gemini-cli) ecosystem by building my first custom skill: the [Gemini LinkedIn Skill](https://github.com/AguirreMoy/gemini-linkedin-skill).

The goal was simple: enable Gemini to generate, format, and publish high-quality LinkedIn posts directly from the terminal. But as with any integration involving OAuth and specialized APIs, the "simple" goal turned into a series of valuable engineering lessons.

## Lesson 1: Bridging Prompts and APIs

The biggest challenge wasn't getting the AI to write a good post—it was getting that post into the right hands (or rather, the right API endpoint).

LinkedIn’s API uses a unique URN (Uniform Resource Name) system for identifying members. I quickly realized that asking users to find their own URN was a non-starter. Instead, I built an auto-discovery mechanism that queries the OpenID `userinfo` and `me` endpoints.

**The takeaway:** When building AI tools, the agent needs to handle the "boring" infrastructure so the user can focus on the creative input.

## Lesson 2: AI-Procedural Design with SKILL.md

The Gemini CLI uses a `SKILL.md` file to define how a skill behaves. I learned that treating this file like a set of "Standard Operating Procedures" (SOPs) is crucial.

By explicitly defining the workflow—validate environment, gather context, generate content, review, and finally execute—I ensured that the agent remains reliable. It’s not just about a single prompt; it’s about defining a robust process that the AI can follow consistently.

## Lesson 3: The Power of Local Context

One of the coolest features of the Gemini CLI is its ability to interact with your local environment. My skill leverages this by allowing the agent to run a local Node.js script (`scripts/share.cjs`) to perform the final API call.

This hybrid approach—AI for generation and reasoning, local scripts for execution—is a powerful pattern for modern developer tools.

## Conclusion

Building this skill was a great reminder that the best AI tools are those that seamlessly bridge the gap between human intent and technical execution. If you're interested in automating your LinkedIn presence or building your own Gemini skills, check out the repository!

**Repo:** [AguirreMoy/gemini-linkedin-skill](https://github.com/AguirreMoy/gemini-linkedin-skill)

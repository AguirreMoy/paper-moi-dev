---
author: Moises Aguirre
pubDatetime: 2026-06-16T17:12:54Z
title: "Flamethrowers and Ant Hills: Why Simple Agentic Scripts Beat $20/mo Subscriptions"
postSlug: flamethrowers-and-ant-hills-simple-agentic-scripts
featured: true
draft: false
tags:
  - ai
  - obsidian
  - docker
  - automation
description: "Do you really need full agentic solutions? How I ditched my $20/mo Claude subscription for a $1/mo homelab script that runs my life."
linkedin_share: true
---

# Flamethrowers and Ant Hills: Why Simple Agentic Scripts Beat $20/mo Subscriptions

So before you sign up for another $20/mo subscription or try to install an AGI on your Macbook to summarize your emails... ask yourself if you just need a flamethrower or a really good magnifying glass. 🔍

🔥🐜 Let's be real for a second. Do you _really_ need Claude Code? Do you _really_ need a massive, full-blown agentic solution running locally and devouring your RAM? Are you taking a flamethrower to an ant hill when all you really need is a simple script with just a _sprinkle_ of agentic magic?

Lately, I found myself paying $20 a month for a Claude subscription just to act as my daily morning assistant. It was cool, sure, but it felt incredibly overkill. I realized that a few API calls costing me maybe $1 a month in Gemini AI credits could do _exactly_ what I needed. Plus, I could guide it perfectly to fit my existing workflow in Obsidian for note tracking, instead of wrestling with a one-size-fits-all $20/mo chatbot.

**Here's what that actually looks like in practice:** Every morning, `moi-assistant` wakes up before I do. It quietly connects to my Google Calendar to grab my agenda and scans my inbox, filtering out the newsletters to find the emails that actually matter. It then reads my previous daily note from Obsidian so it knows exactly what I left off on yesterday. Finally, it takes all that context, formats it into a pristine markdown summary—complete with backlinks—and uses Templater logic to drop the file directly into my `Daily Notes` folder. By the time I sit down with my coffee, my entire day is mapped out.

Don't get me wrong, I love my Gemini AI subscription too, but out of the box, it doesn't play nicely with my Obsidian vault in the background. If I wanted my daily agenda or context summaries, I had to manually open up `agy-cli` or `gemini-cli` and tell it to do the thing. Manual labor? In this economy? No thanks.

## Enter `moi-assistant` 🚀

Instead of paying a premium for manual CLI typing, I decided to build my own Python/Docker/Homelab solution: **`moi-assistant`**.

It’s a lightweight, modular script that runs silently in the background on my Docker stack (`cloudmoi-stacks`). Here's what this "glorified script" actually does for me for pennies on the dollar:

- **Google Integration without the Fluff:** It checks my Google Calendar and scans my emails, smartly omitting empty data sources and ignoring the trivial junk mail.
- **Deep Obsidian Synergy:** It fetches my historical Vault notes for context and drops its outputs right into my Obsidian folders using advanced Templater logic and date path formatting.
- **Automated Weekly Routines:** It knows my split weekly routines (shoutout to ISO weeks) and dynamically injects the right prompts for the right days.

It just runs. It syncs the output directly to my Obsidian vault seamlessly, accommodating my appended vault names with separate environment variables so Docker knows exactly where to read and write.

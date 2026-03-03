---
author: Moises Aguirre
pubDatetime: 2026-03-02T10:00:00Z
title: "Embracing the AI Hype: Why I’m Not Being Replaced (Yet)"
postSlug: embracing-ai-hype-feb-2026
featured: true
draft: false
tags:
  - AI
  - careergrowth
  - productivity
  - modernization
  - ARM
description: "Reflections on a month of leaning into AI, automation, and the massive ongoing transition to ARM-based hardware."
linkedin_share: true
---

I spent February leaning into the AI hype to see if it actually lived up to the noise. In our industry, it’s easy to get caught up in the binary debate of "AI is everything" versus "AI is just an autocomplete." This month, I decided to treat it as a literal member of my team. By building custom Copilot CLI skills and Python agents to automate "high-toil" tasks like OKR tracking, service reporting, and telemetry validation, I managed to reclaim about 8 hours of my week.

It’s one thing to use LLMs for boilerplate or quick shell commands, but it’s another to watch a tool I built autonomously validate OTLP (OpenTelemetry Protocol) emissions across our cloud infrastructure. This automation ensured 100% build stability even as we navigated a massive, ongoing transition to ARM-based hardware—a move that requires precise observability to prevent performance regressions.

However, this month was also a reality check on why AI isn't a replacement for an engineer. While my agents were great at the "how"—generating scripts and flagging potential issues—they couldn't replace the need for critical human oversight. For instance, when it came to correcting misleading architectural guidance on Kubernetes arch taints for ARM clusters, a script alone wouldn't have caught the nuance required to prevent scheduling errors. Nor could an AI step into a technical sync to negotiate the "Sidecar" bridge strategy that was stalling our modernization. AI can scale my execution, but it still lacks the nuance to navigate cross-team friction or turn a messy technical debt discussion into a clear path forward.

The biggest takeaway? Embracing AI hasn't made my job "simpler"—it’s just allowed me to focus on the high-leverage work that actually matters. By offloading the administrative and repetitive technical overhead, I finally have the bandwidth to tackle the architectural gaps and infrastructure alignment that a script just can't solve. AI is the engine, but you still need an engineer to know where to drive it.

If you're still on the fence about AI, my advice is simple: stop worrying about it replacing you and start using it to unblock you. Besides, until an LLM can figure out how to navigate a multi-team consensus meeting without hallucinating a reason to leave early, our jobs are probably safe. I’ll take the extra bandwidth for the ARM transition—I've got enough real-world bugs to deal with without the "AI-generated" ones.

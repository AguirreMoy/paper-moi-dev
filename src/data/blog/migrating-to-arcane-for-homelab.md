---
author: Moises Aguirre
pubDatetime: 2026-02-28T10:00:00Z
title: "Practicing What I Preach: Migrating My Homelab from Portainer to Arcane"
postSlug: migrating-to-arcane-for-homelab
featured: true
draft: false
tags:
  - homelab
  - docker
  - infrastructure-as-code
  - devops
  - linkedin
description: "Why I finally ditched Portainer for Arcane to bring true Infrastructure as Code (IaC) to my homelab container management."
linkedin_share: true
---

# Practicing What I Preach: Migrating My Homelab from Portainer to Arcane

In the professional world, I am constantly talking about the virtues of Infrastructure as Code (IaC). "Everything should be declarative!" I proclaim in meetings. "Your git repository is the source of truth!" I preach on code reviews. "ClickOps is the enemy of reproducibility!" 

I am, by all accounts, an IaC evangelist.

But if you peeked behind the curtain into my own homelab recently, you'd find a slightly different story. It was less "GitOps" and more "HopeOps." For a long time, my homelab infrastructure was a glaring, hypocritical black box of manual clicking.

I relied heavily on **Portainer**. Don't get me wrong—Portainer is a fantastic tool. It dramatically lowered the barrier to entry for managing my Docker containers and made spinning up new services incredibly easy. Too easy, in fact. Over time, it became a crutch. I found myself making configuration changes directly in the UI at 2 AM, whispering "I'll put this in a docker-compose file later." 

Spoiler alert: "Later" never came. My homelab had become a stateful, untrackable Jenga tower. If my server ever died, my disaster recovery plan was essentially just crying.

It was time to stop being a fraud. That's why I recently migrated my homelab container management from Portainer to **Arcane**.

## Why Arcane? The Case for a Compose-First Workflow

Moving to Arcane wasn't just about changing tools; it was about changing my mindset back to a declarative approach and restoring my professional honor. Here is what I learned and why Arcane has proven to be a significantly better fit for a proper IaC homelab setup:

### 1. YAML-Based Project Tracking (Ultimate Transparency)
Portainer hides its state within its own internal database. If you lose that volume, recreating your exact setup is basically a forensic investigation into your own bad decisions.

Arcane takes a completely different approach: it is **Compose-first**. It treats your `docker-compose.yml` files as the absolute source of truth. It tracks projects based on the YAML files sitting on your filesystem. This transparency means I can manage my infrastructure files via Git, deploy them to the server, and Arcane simply reads and executes them. If Arcane goes down, my stacks are still perfectly defined in plain text, mocking me in standard YAML format.

### 2. No Database Dependency for State
Because Arcane relies on the filesystem and the Docker daemon itself as the source of truth, it's incredibly lightweight. It doesn't need to maintain a complex internal database to know what's running. It parses your YAML and talks to Docker. Simple, elegant, and far less likely to spontaneously combust when you look at it wrong.

### 3. Built for GitOps (For Real This Time)
With Portainer, setting up a GitOps flow felt clunky and often required complex webhooks that I was too lazy to maintain. Because Arcane's primary language is the Compose file on disk, integrating it with a simple `git pull` cronjob or a lightweight CI/CD pipeline is trivial. I make a change in my repository, the file syncs to my server, and my infrastructure updates. I finally feel like a real engineer at home.

### 4. A Cleaner, Modern UI
While secondary to the architectural benefits, Arcane's UI is incredibly clean and focused. It provides real-time monitoring, CPU/RAM stats, and log viewing without the overwhelming enterprise-focused clutter that Portainer has accumulated over the years. It gives me exactly what I need for a homelab and nothing I don't. No, I don't need Kubernetes cluster federation for my Pi-hole, thank you very much.

## What I Learned: The Value of Alignment

The biggest takeaway from this migration wasn't just learning a new tool. It was realizing the cognitive dissonance of evangelizing a practice while ignoring it at home. It's like a dentist who never flosses.

Migrating to Arcane forced me to audit every single container I was running. I had to actually write the YAML for services I had previously just clicked into existence. It took a solid weekend of work (and facing my demons), but the result is a homelab that is finally reproducible, transparent, and resilient.

If your homelab is currently suffering from "ClickOps" drift, I highly recommend checking out Arcane. It’s the perfect bridge between the convenience of a UI and the rigor of Infrastructure as Code. And it might just save you from having to explain to your colleagues why your personal website has been down for three weeks.

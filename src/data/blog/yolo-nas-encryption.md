---
author: Moises Aguirre
pubDatetime: 2026-03-06T18:00:00Z
title: "YOLO Encryption: How I Finally Secured My 2022 NAS (and My Dignity)"
postSlug: yolo-nas-encryption
featured: false
draft: false
tags:
  - Homelab
  - Security
  - Synology
  - NAS
  - YOLO
description: "A tale of hypocrisy, a broken RAID, and why the best time to encrypt your data was yesterday."
linkedin_share: true
---

# YOLO Encryption: How I Finally Secured My 2022 NAS (and My Dignity)

We’ve all been there. You’re the person in the room—or the one on the blog—preaching about the absolute necessity of data security. "Encrypt your drives!" "Use MFA!" "If your data isn't encrypted, is it even yours?"

Meanwhile, sitting in the corner of my apartment, my 2022 Synology NAS was humming along, holding my most sensitive files, completely unencrypted.

## The Hypocrisy of 2022

When I first set up this NAS in 2022, Synology didn't offer native whole-disk encryption. You could do per-share encryption, but that felt like a half-measure (or, if I'm being honest, it felt like "too much work" for my weekend-warrior brain). I told myself I’d get around to it eventually.

Fast forward to 2026, and the guilt finally caught up with me. I was a security hypocrite, and it was time for a change.

## The "YOLO" Strategy

Since I didn't have enough spare drives to do a proper "safe" migration, I decided to go with what I like to call the **YOLO Migration Strategy**. Here was the plan:

1.  **Break the RAID:** I had a standard SHR (Synology Hybrid RAID) setup with two drives mirroring each other. I pulled the metaphorical pin and "broke" the raid.
2.  **Sacrificial Backup:** I formatted the second drive (the former mirror) as a new, standalone volume and backed up the entire primary volume onto it.
3.  **The Point of No Return:** I reformatted the first drive from scratch, this time enabling the glorious full-disk encryption Synology now supports.
4.  **The Long Wait:** I restored all the data from the backup volume on the second drive back to the newly encrypted first drive.
5.  **Rebuild the RAID:** Finally, I wiped the second drive again and added it back to the SHR array, letting it rebuild.

## The Nervous Sweat

There is a very specific type of adrenaline that comes from looking at a Synology Dashboard that says "Volume Degraded" while your only copy of ten years of photos is sitting on a single, un-mirrored disk.

But it worked.

I spent the weekend watching progress bars, but for the first time in years, I can look my NAS in the eye. It’s encrypted. It’s secure. My dignity is (mostly) restored.

## The Moral of the Story

If you’re sitting on an unencrypted drive because "it’s a hassle to change it now," take it from me: the best time to secure your data was yesterday. The second best time is today.

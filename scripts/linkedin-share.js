/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import axios from "axios";

// Environment variables
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const USER_URN = process.env.LINKEDIN_USER_URN; // e.g., 'urn:li:person:123456789'
const SITE_URL = "https://moises-aguirre.com"; // Your deployed site URL

if (!ACCESS_TOKEN || !USER_URN) {
  console.error("Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_USER_URN environment variables.");
  process.exit(1);
}

// Get files from arguments (passed by the GitHub Action)
const files = process.argv.slice(2);

if (files.length === 0) {
  console.log("No new files to process.");
  process.exit(0);
}

async function postToLinkedIn(post) {
  const { title, description, postSlug, tags } = post.data;
  
  // Construct the URL
  // Prefer postSlug if available, otherwise use filename (passed in as part of the 'post' object context if needed, but let's assume postSlug is best practice here)
  const slug = postSlug || path.basename(post.filePath, '.md');
  const articleUrl = `${SITE_URL}/posts/${slug}/`;

  // Construct hashtags
  const hashtags = tags ? tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') : "";

  // Construct the message text
  const message = `🚀 New Blog Post: ${title}

${description}

Read more here: ${articleUrl}

${hashtags}`;

  // LinkedIn API Payload
  // Using the text-only share or article share structure.
  // Article share is better for previews.
  const payload = {
    author: USER_URN,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: message,
        },
        shareMediaCategory: "ARTICLE",
        media: [
          {
            status: "READY",
            description: {
              text: description.substring(0, 200), // Limit description length
            },
            originalUrl: articleUrl,
            title: {
              text: title,
            },
          },
        ],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      payload,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Successfully posted: "${title}" to LinkedIn. Post ID: ${response.data.id}`);
  } catch (error) {
    console.error(`Failed to post "${title}":`, error.response ? error.response.data : error.message);
    // Don't exit process, try other files if any
  }
}

async function main() {
  console.log(`Checking ${files.length} files for LinkedIn sharing...`);

  for (const filePath of files) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const parsed = matter(fileContent);
      
      // Check for opt-in
      if (parsed.data.linkedin_share === true) {
        console.log(`Processing opt-in file: ${filePath}`);
        await postToLinkedIn({ ...parsed, filePath });
      } else {
        console.log(`Skipping (no opt-in): ${filePath}`);
      }
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err.message);
    }
  }
}

main();

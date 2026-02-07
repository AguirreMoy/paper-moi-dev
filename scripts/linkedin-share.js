/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import axios from "axios";

// Environment variables
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const USER_URN = process.env.LINKEDIN_USER_URN; // e.g., 'urn:li:person:ACoA...'
const SITE_URL = "https://moises-aguirre.com"; // Your deployed site URL
const API_VERSION = "202512"; // Using a known active version

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
  const slug = postSlug || path.basename(post.filePath, ".md");
  const articleUrl = `${SITE_URL}/posts/${slug}/`;

  // Construct hashtags
  const hashtags = tags
    ? tags.map(tag => `#${tag.replace(/\s+/g, "")}`).join(" ")
    : "";

  // Construct the message text
  const message = `🚀 New Blog Post: ${title}\n\n${description}\n\nRead more here: ${articleUrl}\n\n${hashtags}`;

  // Minimal LinkedIn API Payload (/rest/posts)
  const payload = {
    author: USER_URN,
    commentary: message,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
    },
    content: {
      article: {
        source: articleUrl,
        title: title,
        description: description.substring(0, 200),
      },
    },
    lifecycleState: "PUBLISHED",
  };

  try {
    const response = await axios.post("https://api.linkedin.com/rest/posts", payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "LinkedIn-Version": API_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
    });
    // LinkedIn returns 201 Created with an 'x-restli-id' header
    const postId = response.headers["x-restli-id"] || response.data.id;
    console.log(`Successfully posted: "${title}" to LinkedIn. Post ID: ${postId}`);
  } catch (error) {
    console.error(`Failed to post "${title}":`);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
      console.error("Headers:", JSON.stringify(error.response.headers, null, 2));
    } else {
      console.error("Error Message:", error.message);
    }
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

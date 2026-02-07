/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import axios from "axios";

// Environment variables
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const USER_URN_OVERRIDE = process.env.LINKEDIN_USER_URN;
const SITE_URL = "https://moises-aguirre.com";
const API_VERSION = "202601"; // Latest active version as per docs

if (!ACCESS_TOKEN) {
  console.error("Missing LINKEDIN_ACCESS_TOKEN environment variable.");
  process.exit(1);
}

// Get files from arguments
const files = process.argv.slice(2);

if (files.length === 0) {
  console.log("No new files to process.");
  process.exit(0);
}

/**
 * Attempts to get the current member's URN from LinkedIn API.
 * This is more reliable than manually providing it.
 */
async function getMyUrn() {
  if (USER_URN_OVERRIDE) {
    console.log(`Using provided URN: ${USER_URN_OVERRIDE}`);
    return USER_URN_OVERRIDE;
  }

  try {
    console.log("Attempting to auto-discover User URN...");
    const response = await axios.get("https://api.linkedin.com/userinfo", {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });
    const urn = `urn:li:person:${response.data.sub}`;
    console.log(`Auto-discovered URN: ${urn}`);
    return urn;
  } catch (error) {
    console.error("Failed to auto-discover URN. Please provide LINKEDIN_USER_URN secret.");
    if (error.response) {
      console.error("Status:", error.response.status, error.response.data);
    }
    return null;
  }
}

async function postToLinkedIn(post, authorUrn) {
  const { title, description, postSlug, tags } = post.data;
  const slug = postSlug || path.basename(post.filePath, ".md");
  const articleUrl = `${SITE_URL}/posts/${slug}/`;
  const hashtags = tags ? tags.map(tag => `#${tag.replace(/\s+/g, "")}`).join(" ") : "";
  const message = `🚀 New Blog Post: ${title}\n\n${description}\n\nRead more here: ${articleUrl}\n\n${hashtags}`;

  // Modern LinkedIn Post Payload
  const payload = {
    author: authorUrn,
    commentary: message,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: {
      article: {
        source: articleUrl,
        title: title,
        description: description.substring(0, 200),
      },
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  try {
    console.log(`Posting "${title}" to LinkedIn...`);
    const response = await axios.post("https://api.linkedin.com/rest/posts", payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Linkedin-Version": API_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
    });
    const postId = response.headers["x-restli-id"] || response.data.id;
    console.log(`✅ Successfully posted! Post ID: ${postId}`);
  } catch (error) {
    console.error(`❌ Failed to post "${title}":`);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error Detail:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Message:", error.message);
    }
  }
}

async function main() {
  const authorUrn = await getMyUrn();
  if (!authorUrn) {
    console.error("Cannot proceed without a valid User URN.");
    process.exit(1);
  }

  console.log(`Checking ${files.length} files for LinkedIn sharing...`);

  for (const filePath of files) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const parsed = matter(fileContent);

      if (parsed.data.linkedin_share === true) {
        console.log(`Processing: ${filePath}`);
        await postToLinkedIn({ ...parsed, filePath }, authorUrn);
      } else {
        console.log(`Skipping (no opt-in): ${filePath}`);
      }
    } catch (err) {
      console.error(`Error processing ${filePath}:`, err.message);
    }
  }
}

main();

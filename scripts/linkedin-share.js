/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import axios from "axios";

// --- Local Testing Support ---
const envPath = path.resolve(".env.local");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");
  envFile.split("\n").forEach(line => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
    }
  });
}
// -----------------------------

// Environment variables
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const USER_URN_OVERRIDE = process.env.LINKEDIN_USER_URN;
const SITE_URL = "https://moi.dev";
const API_VERSION = "202601";

if (!ACCESS_TOKEN) {
  console.error("❌ Missing LINKEDIN_ACCESS_TOKEN environment variable.");
  process.exit(1);
}

const files = process.argv.slice(2);

/**
 * Discovers the correct Member URN using the OpenID UserInfo endpoint.
 */
async function getMyUrn() {
  if (USER_URN_OVERRIDE && USER_URN_OVERRIDE.startsWith("urn:li:")) {
    console.log(`Using provided URN: ${USER_URN_OVERRIDE}`);
    return USER_URN_OVERRIDE;
  }

  const endpoints = [
    "https://api.linkedin.com/v2/userinfo",
    "https://api.linkedin.com/v2/me",
  ];

  console.log("🔍 Attempting to auto-discover User URN...");

  for (const url of endpoints) {
    try {
      console.log(`Trying endpoint: ${url}`);
      const response = await axios.get(url, {
        headers: { 
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "X-Restli-Protocol-Version": "2.0.0"
        },
      });
      
      const id = response.data.sub || response.data.id;
      if (id) {
        const urn = `urn:li:person:${id}`;
        console.log(`✅ Auto-discovered URN: ${urn}`);
        return urn;
      }
    } catch (error) {
      console.warn(`⚠️ Endpoint ${url} failed: ${error.response?.status || error.message}`);
    }
  }

  console.error("❌ All discovery endpoints failed. Please provide LINKEDIN_USER_URN in GitHub Secrets.");
  return null;
}

async function postToLinkedIn(post, authorUrn) {
  const { data, content } = post;
  const { title, description, postSlug, tags } = data;
  
  const slug = postSlug || path.basename(post.filePath, ".md");
  const articleUrl = `${SITE_URL}/posts/${slug}/`;
  const hashtags = tags ? tags.map(tag => `#${tag.replace(/\s+/g, "")}`).join(" ") : "";

  // Prepare full content for LinkedIn
  // Remove markdown headers and excessive whitespace
  const cleanBody = content
    .replace(/^#+ .*\n/gm, "") // Remove headers
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Simplify links
    .replace(/(\r\n|\n|\r)/gm, "\n") // Normalize newlines
    .trim();

  const header = `🚀 New Post: ${title}\n\n`;
  const footer = `\n\n👇 Read the full article and see the workflow at:\n${articleUrl}\n\n${hashtags}`;
  
  // LinkedIn limit is 3000 chars. 
  // We leave buffer for the link and tags.
  const maxBodyLength = 3000 - header.length - footer.length - 20;
  let finalBody = cleanBody;
  let isTruncated = false;
  
  if (finalBody.length > maxBodyLength) {
    finalBody = finalBody.substring(0, maxBodyLength).trim() + "... (truncated)";
    isTruncated = true;
  }

  const message = `${header}${finalBody}${footer}`;

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
    console.log(`📤 Posting content of "${title}" to LinkedIn as ${authorUrn}...`);
    if (isTruncated) console.log("⚠️ Content was truncated to fit LinkedIn limit.");
    
    const response = await axios.post("https://api.linkedin.com/rest/posts", payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Linkedin-Version": API_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
    });
    
    const postId = response.headers["x-restli-id"] || response.data.id;
    console.log(`🚀 Successfully posted! Post ID: ${postId}`);
  } catch (error) {
    console.error(`❌ Failed to post "${title}":`);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Full Error Details:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error Message:", error.message);
    }
  }
}

async function main() {
  const authorUrn = await getMyUrn();
  if (!authorUrn) {
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("ℹ️ No files provided.");
    return;
  }

  for (const filePath of files) {
    try {
      if (!fs.existsSync(filePath)) {
        console.error(`Missing file: ${filePath}`);
        continue;
      }
      const fileContent = fs.readFileSync(filePath, "utf8");
      const parsed = matter(fileContent);

      if (parsed.data.linkedin_share === true) {
        await postToLinkedIn({ ...parsed, filePath }, authorUrn);
      } else {
        console.log(`⏭️ Skipping (linkedin_share not true): ${filePath}`);
      }
    } catch (err) {
      console.error(`❌ Error processing ${filePath}:`, err.message);
    }
  }
}

main();

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

/**
 * Triggers the news ingestor action every 60 minutes.
 * Fetches from NewsAPI and upserts into content table.
 */
crons.interval(
  "news agency ingestion",
  { minutes: 60 },
  internal.newsIngestor.run,
);

export default crons;

import { Post } from "../../types/agent";
import { ScrapedComment } from "../scraping/types";
import getActorStatus from "../apify/getActorStatus";
import getDataset from "../apify/getDataset";
import getFormattedComments from "./getFormattedComments";
import startCommentsScraping from "./startCommentsScraping";

const MAX_ATTEMPTS = 30;
const POLLING_INTERVAL = 3000; // 3 seconds

const getVideoComments = async (
  scraping_posts: Post[]
): Promise<ScrapedComment[]> => {
  const postUrls = scraping_posts.map(
    (scraping_post) => scraping_post.post_url
  );

  try {
    const runInfo = await startCommentsScraping(postUrls);
    if (!runInfo) {
      console.error("Failed to start video comments scraping");
      return [];
    }

    const { runId, datasetId } = runInfo;
    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));

      const { status } = await getActorStatus(runId);

      if (status === "FAILED") {
        console.error("Video comments scraping failed");
        return [];
      }

      if (status === "SUCCEEDED" || attempts === MAX_ATTEMPTS) {
        const data = await getDataset(datasetId);
        if (!data?.length) {
          console.error("No data returned from dataset");
          return [];
        }

        return getFormattedComments(data, scraping_posts);
      }
    }

    console.error("Video comments scraping timed out");
    return [];
  } catch (error) {
    console.error("Error in getVideoComments:", error);
    return [];
  }
};

export default getVideoComments;

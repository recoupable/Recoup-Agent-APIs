import getActorStatus from "../lib/apify/getActorStatus";
import getDataset from "../lib/apify/getDataset";
import supabase from "../lib/supabase/serverClient";
import getSocialHandles from "../lib/getSocialHandles";
import { Stagehand } from "@browserbasehq/stagehand";
import { Request, Response } from "express";
import { z } from "zod";
import { Scraper } from "agent-twitter-client";
import getFanSegments from "../lib/getFanSegments";
import getTikTokFanProfile from "../lib/tiktok/getFanProfile";
import getTwitterFanProfile from "../lib/twitter/getProfile";
import getSegments from "../lib/getSegments";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons";
import getPostComments from "../lib/agent/getPostComments";
import isAgentRunning from "../lib/isAgentRunning";
import connectFansSegmentsToArtist from "../lib/supabase/connectFansSegmentsToArtist";

export const get_fans_segments = async (req: Request, res: Response) => {
  try {
    const { segmentNames, commentIds } = req.body;
    const comments = [];
    const chunkSize = 100;
    const chunkCount =
      parseInt(Number(commentIds.length / chunkSize).toFixed(0), 10) + 1;
    for (let i = 0; i < chunkCount; i++) {
      const chunkCommentIds = commentIds.slice(
        chunkSize * i,
        chunkSize * (i + 1),
      );
      const { data: post_comments } = await supabase
        .from("post_comments")
        .select("*, social:socials(*)")
        .in("id", chunkCommentIds);
      if (post_comments) {
        comments.push(post_comments.flat());
        if (comments.flat().length > 500) break;
      }
    }

    while (1) {
      const fansSegments = await getFanSegments(
        segmentNames,
        comments.flat().slice(0, 500),
      );
      if (fansSegments.length) {
        return res.status(200).json({ data: fansSegments });
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const connect_fans_segments_to_artist = async (
  req: Request,
  res: Response,
) => {
  const { fansSegments, artistId } = req.body;
  try {
    await connectFansSegmentsToArtist(fansSegments, artistId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_tiktok_profile = async (req: Request, res: Response) => {
  const { handle } = req.query;
  try {
    const profile = await getTikTokFanProfile(handle as string);
    return res.status(200).json({ profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_twitter_profile = async (req: Request, res: Response) => {
  const { handle } = req.query;
  const scraper = new Scraper();
  try {
    const profile = await getTwitterFanProfile(scraper, handle as string);
    return res.status(200).json({ profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_profile = async (req: Request, res: Response) => {
  const { handle, type } = req.query;

  try {
    const stagehand = new Stagehand({
      env: "LOCAL",
      verbose: 1,
      debugDom: true,
      enableCaching: false,
      headless: true,
      modelName: "gpt-4o-mini",
    });

    await stagehand.init();
    let profileUrl = "";
    if (type === "tiktok") profileUrl = `https://tiktok.com/@${handle}`;

    if (!profileUrl) throw new Error("Invalid handle");

    await stagehand.page.goto(profileUrl);

    const { bio, username, followers, email } = await stagehand.page.extract({
      instruction: "Extract the email, bio, username, followers, of the page.",
      schema: z.object({
        bio: z.string(),
        username: z.string(),
        followers: z.number(),
        email: z.string(),
      }),
    });

    return res.status(200).json({
      success: true,
      data: {
        bio,
        username,
        followers,
        email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_dataset_status = async (req: Request, res: Response) => {
  const { datasetId } = req.query;

  try {
    const data = await getActorStatus(datasetId as string);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_dataset_items = async (req: Request, res: Response) => {
  const { datasetId } = req.query;

  try {
    const data: any = await getDataset(datasetId as string);
    if (data?.[0]?.error)
      return res.status(500).json({ error: data?.[0]?.error });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_social_handles = async (req: Request, res: Response) => {
  const { handle } = req.query;
  try {
    const handles = await getSocialHandles(handle as string);

    return res.status(200).json({
      data: handles,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_agent = async (req: Request, res: Response) => {
  const { agentId } = req.query;
  try {
    const { data: agent } = await supabase
      .from("agents")
      .select(
        `
        *,
        agent_status (
          *,
          social:socials (
            *
          )
        )
      `,
      )
      .eq("id", agentId)
      .single();
    if (isAgentRunning(agent.agent_status))
      return res.status(200).json({ agent });
    const comments = await getPostComments(agent.agent_status);
    return res.status(200).json({ agent, comments });
  } catch (error) {
    console.error("Error in get_autopilot:", error);
    return res.status(500).json({ error });
  }
};

export const get_segments = async (req: Request, res: Response) => {
  try {
    const { comments } = req.body;
    const segments = await getSegments(comments);
    const segments_with_icons = await getSegmentsWithIcons(segments);
    return res.status(200).json({ segments_with_icons });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

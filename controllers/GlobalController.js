import getActorStatus from "../lib/apify/getActorStatus.js";
import getDataset from "../lib/apify/getDataset.js";
import supabase from "../lib/supabase/serverClient.js";
import getSocialHandles from "../lib/getSocialHandles.js";
import { Stagehand } from "@browserbasehq/stagehand";

const stagehand = new Stagehand({
  env: "LOCAL",
  verbose: 1,
  debugDom: true,
  enableCaching: false,
});

export const get_tiktok_profile = async (req, res) => {
  const { handle } = req.query;

  try {
    stagehand.init({ modelName: "gpt-4o" });

    await stagehand.page.goto(`https://tiktok.com/@${handle}`);

    const data = await stagehand.page.extract({
      instruction: "extract the bio of the page",
      schema: z.object({
        bio: z.string(),
      }),
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_dataset_status = async (req, res) => {
  const { datasetId } = req.query;

  try {
    const data = await getActorStatus(datasetId);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_dataset_items = async (req, res) => {
  const { datasetId } = req.query;

  try {
    const data = await getDataset(datasetId);
    if (data?.[0]?.error)
      return res.status(500).json({ error: data?.[0]?.error });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_social_handles = async (req, res) => {
  const { handle } = req.query;
  try {
    const handles = await getSocialHandles(handle);

    return res.status(200).json({
      data: handles,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_autopilot = async (req, res) => {
  const { pilotId } = req.query;
  try {
    const { data } = await supabase
      .from("funnel_analytics")
      .select(
        `*,
      funnel_analytics_segments (
        *
      ),
      funnel_analytics_profile (
        *,
        artists (
          *,
          artist_social_links (
            *
          )
        )
      )`,
      )
      .eq("chat_id", pilotId);

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

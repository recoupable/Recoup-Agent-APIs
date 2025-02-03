import { instructions } from "../lib/instructions";
import {
  FULL_REPORT_NOTE,
  HTML_RESPONSE_FORMAT_INSTRUCTIONS,
  ICONS,
  REPORT_NEXT_STEP_NOTE,
} from "../lib/consts";
import getChatCompletions from "../lib/getChatCompletions";
import sendReportEmail from "../lib/email/sendReportEmail";
import { Request, Response } from "express";
import supabase from "../lib/supabase/serverClient";

export const get_full_report = async (req: Request, res: Response) => {
  try {
    const {
      segments,
      commentIds,
      segmentName,
      segmentSize,
      artistImage,
      artistName,
      email,
    } = req.body;

    const comments = await supabase
      .from("post_comments")
      .select("*")
      .in("id", commentIds || []);

    const context = {
      segments,
      comments,
      segmentName,
      segmentSize,
      artistName,
    };
    const content = await getChatCompletions(
      [
        {
          role: "user",
          content: `
        Context: ${JSON.stringify(context)}
        Question: Please, create a fan segment report.`,
        },
        {
          role: "system",
          content: `${instructions.get_segements_report}
        ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}
        NOTE: ${FULL_REPORT_NOTE}`,
        },
      ],
      2222,
    );

    sendReportEmail(
      content,
      artistImage,
      artistName,
      email || "",
      `${segmentName} Report`,
    );
    if (content) return res.status(200).json({ content });
    return res.status(500).json({ error: "No content received from OpenAI" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "API request failed" });
  }
};

export const get_pitch_report = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const content = await getChatCompletions(
      [
        {
          role: "user",
          content: `
        Context: ${JSON.stringify(data)}
        Question: Please create a pitch HTML report if the pitch name is ${data?.pitch_name}.`,
        },
        {
          role: "system",
          content: `${instructions.get_pitch_report}
        ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}
        NOTE: ${FULL_REPORT_NOTE}`,
        },
      ],
      2222,
    );

    sendReportEmail(
      content,
      data?.artistImage,
      data?.artistName,
      data?.email || "",
      `${data?.segment_name} Report`,
    );
    if (content) return res.status(200).json({ content });
    return res.status(500).json({ error: "No content received from OpenAI" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "API request failed" });
  }
};

export const get_next_steps = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const content = await getChatCompletions([
      {
        role: "user",
        content: `Context: ${JSON.stringify(body)}`,
      },
      {
        role: "system",
        content: `${instructions.get_segments_report_next_step}
          ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}
          NOTE: ${REPORT_NEXT_STEP_NOTE}`,
      },
    ]);
    if (content) return res.status(200).json({ data: content });
    return res.status(500).json({ error: "No content received from OpenAI" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "API request failed" });
  }
};

export const get_segments_icons = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const content = await getChatCompletions([
      {
        role: "user",
        content: `**Icon Names**: ${JSON.stringify(ICONS)}\n
        **Segment Names**: ${JSON.stringify(body)}`,
      },
      {
        role: "system",
        content: `${instructions.get_segments_icons} \n Response should be in JSON format. {"data": {"segment_name1": "icon_name1", "segment_name2": "icon_name2", ...}}`,
      },
    ]);

    if (content)
      return res.status(200).json({
        data:
          JSON.parse(
            content
              ?.replace(/\n/g, "")
              ?.replace(/json/g, "")
              ?.replace(/```/g, ""),
          )?.data || [],
      });
    return res.status(500).json({ error: "No content received from OpenAI" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "API request failed" });
  }
};

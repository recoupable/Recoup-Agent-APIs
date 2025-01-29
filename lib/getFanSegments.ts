import getChatCompletions from "./getChatCompletions";
import { instructions } from "./instructions";

const getFanSegments = async (segments: any, comments: any) => {
  try {
    const segmentsNames = segments.map((segment: any) => segment.name);
    const latestComments = comments
      .map((comment: any) => ({
        username: comment.username,
        comment: comment.comment,
      }))
      .slice(0, 500);

    const content = await getChatCompletions(
      [
        {
          role: "user",
          content: `
            [COMMENTS]: ${JSON.stringify(latestComments.slice(0, 500))}
            [SEGMENTS]: ${JSON.stringify(segmentsNames)}`,
        },
        {
          role: "system",
          content: `${instructions.sort_fans_on_segments} \n **IMPORTANT**: Response MUST be formatted in only JSON. {"data": [{ "string": string }, { "string": string }]}.\n Please, don't use any other explaining or sentences in response.`,
        },
      ],
      2222,
    );

    let fansSegments = [];
    if (content)
      fansSegments =
        JSON.parse(
          content
            ?.replace(/\n/g, "")
            ?.replace(/json/g, "")
            ?.replace(/```/g, ""),
        )?.data || [];

    return fansSegments;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getFanSegments;

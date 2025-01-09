import getSegments from "../lib/getSegments.js";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons.js";
import trackFunnelAnalysisChat from "../lib/stack/trackFunnelAnalysisChat.js";
import beginAnalysis from "../lib/supabase/beginAnalysis.js";
import saveFunnelProfile from "../lib/supabase/saveFunnelProfile.js";
import saveFunnelSegments from "../lib/supabase/saveFunnelSegments.js";
import getAnalyses from "../lib/supabase/getAnalyses.js";
import checkWrappedCompleted from "../lib/agent/checkWrappedCompleted.js";
import getAggregatedArtist from "../lib/agent/getAggregatedArtist.js";
import getArtist from "../lib/supabase/getArtist.js";
import getAggregatedProfile from "../lib/agent/getAggregatedProfile.js";
import updateArtistProfile from "../lib/supabase/updateArtistProfile.js";
import createSocialLink from "../lib/supabase/createSocialLink.js";
import getComments from "../lib/agent/getComments.js";
import getAggregatedSocialProfile from "../lib/agent/getAggregatedSocialProfile.js";

const createWrappedAnalysis = async (
  handle,
  chat_id,
  account_id,
  address,
  existingArtistId,
) => {
  const wrappedCompleted = checkWrappedCompleted(funnel_analyses);
  if (!wrappedCompleted) return;
  const newAnalysis = await beginAnalysis(chat_id, handle);
  const analysisId = newAnalysis.id;
  try {
    const funnel_analyses = await getAnalyses(chat_id);
    const artist = getAggregatedArtist(funnel_analyses);
    const existingArtist = await getArtist(existingArtistId);
    console.log("ZIAD", existingArtistId);
    const aggregatedArtistProfile = getAggregatedProfile(
      artist,
      existingArtist,
    );

    const artistId = await updateArtistProfile(
      account_id,
      aggregatedArtistProfile.image,
      aggregatedArtistProfile.name,
      aggregatedArtistProfile.instruction,
      aggregatedArtistProfile.label,
      aggregatedArtistProfile.knowledges,
      existingArtistId,
    );

    console.log("ZIAD", existingArtistId);

    console.log("ZIAD", artistId);
    aggregatedArtistProfile.artist_social_links.forEach(async (link) => {
      await createSocialLink(artistId, link.type, link.link);
    });

    const aggregatedSocialProfile = getAggregatedSocialProfile(funnel_analyses);
    await saveFunnelProfile({
      ...aggregatedSocialProfile,
      name: aggregatedArtistProfile.name,
      nickname: aggregatedArtistProfile.name,
      avatar: aggregatedArtistProfile.image,
      analysis_id: analysisId,
      artistId: artistId,
    });

    const comments = getComments(funnel_analyses);
    const segments = await getSegments(comments);
    const segmentsWithIcons = await getSegmentsWithIcons(segments, analysisId);
    await saveFunnelSegments(segmentsWithIcons);

    if (address) {
      await trackFunnelAnalysisChat(
        address,
        handle,
        artistId,
        chat_id,
        "Wrapped",
      );
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

export default createWrappedAnalysis;

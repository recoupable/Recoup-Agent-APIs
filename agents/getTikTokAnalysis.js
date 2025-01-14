import { Funnel_Type } from "../lib/funnels.js";
import getSegments from "../lib/getSegments.js";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons.js";
import uploadPfpToIpfs from "../lib/ipfs/uploadPfpToIpfs.js";
import trackFunnelAnalysisChat from "../lib/stack/trackFunnelAnalysisChat.js";
import { STEP_OF_ANALYSIS } from "../lib/step.js";
import beginAnalysis from "../lib/supabase/beginAnalysis.js";
import getArtist from "../lib/supabase/getArtist.js";
import saveFunnelArtist from "../lib/supabase/saveFunnelArtist.js";
import saveFunnelComments from "../lib/supabase/saveFunnelComments.js";
import saveFunnelProfile from "../lib/supabase/saveFunnelProfile.js";
import saveFunnelSegments from "../lib/supabase/saveFunnelSegments.js";
import updateAnalysisStatus from "../lib/supabase/updateAnalysisStatus.js";
import getProfile from "../lib/tiktok/getProfile.js";
import getProfileDatasetId from "../lib/tiktok/getProfileDatasetId.js";
import getVideoComments from "../lib/tiktok/getVideoComments.js";
import createWrappedAnalysis from "./createWrappedAnalysis.js";

const getTikTokAnalysis = async (
  handle,
  chat_id,
  account_id,
  address,
  isWrapped,
  existingArtistId,
) => {
  const newAnalysis = await beginAnalysis(chat_id, handle, Funnel_Type.TIKTOK);
  const analysisId = newAnalysis.id;
  try {
    const existingArtist = await getArtist(existingArtistId);
    const profileDatasetId = await getProfileDatasetId(handle);
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      Funnel_Type.TIKTOK,
      STEP_OF_ANALYSIS.PROFILE,
    );
    const accountData = await getProfile(profileDatasetId);
    console.log("ZIAD", accountData);
    const profile = accountData?.profile?.[0];
    const videoUrls = accountData?.videoUrls;
    const avatar = await uploadPfpToIpfs(profile.avatar);
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      Funnel_Type.TIKTOK,
      STEP_OF_ANALYSIS.CREATING_ARTIST,
    );
    const newArtist = await saveFunnelArtist(
      Funnel_Type.TIKTOK,
      existingArtist?.name || profile?.nickname,
      existingArtist?.image || avatar,
      existingArtist?.instruction || "",
      existingArtist?.label || "",
      existingArtist?.knowledges || [],
      `https://tiktok.com/@${profile?.name}`,
      account_id,
      existingArtistId,
    );

    await saveFunnelProfile({
      ...profile,
      avatar,
      type: "TIKTOK",
      analysis_id: analysisId,
      artistId: newArtist.id,
    });
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      Funnel_Type.TIKTOK,
      STEP_OF_ANALYSIS.CREATED_ARTIST,
      0,
      newArtist,
    );
    const videoComments = await getVideoComments(
      videoUrls,
      chat_id,
      analysisId,
    );
    await saveFunnelComments(videoComments);
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      Funnel_Type.TIKTOK,
      STEP_OF_ANALYSIS.SEGMENTS,
    );
    const segments = await getSegments(videoComments);
    const segmentsWithIcons = await getSegmentsWithIcons(segments, analysisId);
    await saveFunnelSegments(segmentsWithIcons);
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      Funnel_Type.TIKTOK,
      STEP_OF_ANALYSIS.SAVING_ANALYSIS,
    );
    await trackFunnelAnalysisChat(
      address,
      handle,
      newArtist?.id,
      chat_id,
      isWrapped ? "Wrapped" : "TikTok",
    );
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      Funnel_Type.TIKTOK,
      STEP_OF_ANALYSIS.FINISHED,
    );
    if (isWrapped)
      await createWrappedAnalysis(
        handle,
        chat_id,
        account_id,
        address,
        existingArtistId,
      );
    return;
  } catch (error) {
    console.error(error);
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      Funnel_Type.TIKTOK,
      STEP_OF_ANALYSIS.ERROR,
    );
  }
};

export default getTikTokAnalysis;

import uploadPfpToIpfs from "./ipfs/uploadPfpToIpfs.js";
import { STEP_OF_ANALYSIS } from "./step.js";
import getArtist from "./supabase/getArtist.js";
import saveFunnelArtist from "./supabase/saveFunnelArtist.js";
import saveFunnelProfile from "./supabase/saveFunnelProfile.js";
import updateAnalysisStatus from "./supabase/updateAnalysisStatus.js";

const createArtist = async (
  chat_id: string | null,
  analysisId: string,
  account_id: string | null,
  existingArtistId: string | null,
  profile: any,
  funnel_type: string,
  socialUrl: any,
) => {
  try {
    const existingArtist = await getArtist(existingArtistId);
    const avatar = await uploadPfpToIpfs(profile.avatar);
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      funnel_type,
      STEP_OF_ANALYSIS.CREATING_ARTIST,
    );
    const newArtist = await saveFunnelArtist(
      funnel_type,
      existingArtist?.name || profile?.nickname,
      existingArtist?.image || avatar,
      existingArtist?.instruction || "",
      existingArtist?.label || "",
      existingArtist?.knowledges || [],
      socialUrl,
      account_id,
      existingArtistId,
    );

    await saveFunnelProfile({
      ...profile,
      avatar,
      type: funnel_type.toUpperCase(),
      analysis_id: analysisId,
      artistId: newArtist.id,
    });
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      funnel_type,
      STEP_OF_ANALYSIS.CREATED_ARTIST,
      0,
      newArtist,
    );

    return newArtist;
  } catch (error) {
    console.error(error);
    throw Error(error as string);
  }
};

export default createArtist;

import { STEP_OF_ANALYSIS } from "../lib/step.js";
import beginAnalysis from "../lib/supabase/beginAnalysis.js";
import updateAnalysisStatus from "../lib/supabase/updateAnalysisStatus.js";
import getSegments from "../lib/getSegments.js";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons.js";
import saveFunnelSegments from "../lib/supabase/saveFunnelSegments.js";
import { Funnel_Type } from "../lib/funnels.js";
import saveFunnelProfile from "../lib/supabase/saveFunnelProfile.js";
import trackFunnelAnalysisChat from "../lib/stack/trackFunnelAnalysisChat.js";
import saveFunnelArtist from "../lib/supabase/saveFunnelArtist.js";
import { getProfile } from "../lib/spotify/getProfile.js";
import getAccessToken from "../lib/supabase/getAccessToken.js";
import getAlbums from "../lib/spotify/getAlbums.js";
import getTopTracks from "../lib/spotify/getTopTracks.js";
import saveSpotifyAlbums from "../lib/supabase/saveSpotifyAlbums.js";
import saveSpotifyTracks from "../lib/supabase/saveSpotifyTracks.js";

const getSpotifyAnalysis = async (handle, chat_id, account_id, address) => {
  try {
    const newAnalysis = await beginAnalysis(chat_id, handle);
    const analysisId = newAnalysis.id;
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.PROFILE);
    const accessToken = await getAccessToken();
    const data = await getProfile(handle, accessToken);
    const profile = data.profile;
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      STEP_OF_ANALYSIS.CREATING_ARTIST,
    );
    const newArtist = await saveFunnelArtist(
      Funnel_Type.SPOTIFY,
      profile?.nickname,
      profile?.avatar,
      `https://open.spotify.com/artist/${artistUri}`,
      account_id,
    );
    await saveFunnelProfile({
      ...profile,
      type: "SPOTIFY",
      analysis_id: analysisId,
      artistId: newArtist.id,
    });
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      STEP_OF_ANALYSIS.CREATED_ARTIST,
      0,
      newArtist,
    );
    const artistUri = data.artistId;
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.ALBUMS);
    const albums = await getAlbums(artistUri, accessToken, analysisId);
    await saveSpotifyAlbums(albums);
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.TRACKS);
    const tracks = await getTopTracks(artistUri, accessToken, analysisId);
    await saveSpotifyTracks(tracks);
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.SEGMENTS);
    const segments = await getSegments([...tracks, ...albums]);
    const segmentsWithIcons = await getSegmentsWithIcons(segments, analysisId);
    await saveFunnelSegments(segmentsWithIcons);
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      STEP_OF_ANALYSIS.SAVING_ANALYSIS,
    );
    await trackFunnelAnalysisChat(
      address,
      handle,
      newArtist?.id,
      chat_id,
      "Spotify",
    );
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.FINISHED);
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export default getSpotifyAnalysis;

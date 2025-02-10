import { STEP_OF_AGENT } from "../lib/step";
import createSocial from "../lib/supabase/createSocial";
import createAgentStatus from "../lib/supabase/createAgentStatus";
import getProfile from "../lib/instagram/getProfile";
import updateAgentStatus from "../lib/supabase/updateAgentStatus";
import setArtistImage from "../lib/supabase/setArtistImage";
import updateSocial from "../lib/supabase/updateSocial";
import connectSocialToArtist from "../lib/supabase/connectSocialToArtist";
import setNewPosts from "../lib/supabase/setNewPosts";
import connectPostsToSocial from "../lib/supabase/connectPostsToSocial";
import getScrapingPosts from "../lib/supabase/getScrapingPosts";
import connectCommentsToSocial from "../lib/supabase/connectCommentsToSocial";
import getPostComments from "../lib/instagram/getPostComments";
import uploadPfpToArweave from "../lib/arweave/uploadPfpToArweave";

const runInstagramAgent = async (
  agent_id: string,
  handle: string,
  artist_id: string,
) => {
  try {
    const { profile, postUrls } = await getProfile(handle);
    if (!profile) {
      console.error(`Profile not found for handle: ${handle}`);
      return;
    }

    const avatarUrl = await uploadPfpToArweave(profile.avatar);
    if (!avatarUrl) {
      console.log(`Avatar upload to Arweave failed for ${handle}, will try IPFS fallback`);
    }

    const { social } = await createSocial({
      username: handle,
      profile_url: `https://instagram.com/${handle}`,
      avatar: avatarUrl || profile.avatar,
      bio: profile.bio,
      followerCount: profile.followerCount,
      followingCount: profile.followingCount,
    });
    if (!social?.id) {
      console.error(`Failed to create social record for ${handle}`);
      return;
    }

    const { agent_status } = await createAgentStatus(
      agent_id,
      social.id,
      STEP_OF_AGENT.PROFILE,
    );
    if (!agent_status?.id) {
      console.error(`Failed to create agent status for ${handle}`);
      return;
    }

    await updateAgentStatus(agent_status.id, STEP_OF_AGENT.SETTING_UP_ARTIST);
    const newImage = await setArtistImage(artist_id, profile.avatar);
    
    if (newImage && newImage !== avatarUrl) {
      await updateSocial(social.id, {
        avatar: newImage,
      });
    }
    
    await connectSocialToArtist(artist_id, social);

    if (!postUrls?.length) {
      await updateAgentStatus(agent_status.id, STEP_OF_AGENT.MISSING_POSTS);
      return;
    }

    await updateAgentStatus(agent_status.id, STEP_OF_AGENT.POSTURLS);
    await setNewPosts(postUrls);
    await connectPostsToSocial(social, postUrls);
    const scrapingPosts = await getScrapingPosts(postUrls);

    if (scrapingPosts.length) {
      const comments = await getPostComments(agent_status.id, scrapingPosts);
      await connectCommentsToSocial(comments);
    }

    await updateAgentStatus(agent_status.id, STEP_OF_AGENT.FINISHED);
  } catch (error) {
    console.error(`Error in runInstagramAgent for ${handle}:`, error);
  }
};

export default runInstagramAgent;

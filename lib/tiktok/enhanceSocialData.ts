import scrapeTikTokProfile from "../scraping/platforms/tiktok/scrapeTikTokProfile";
import uploadPfpToArweave from "../arweave/uploadPfpToArweave";
import { Database } from "../../types/database.types";
import randomDelay from "../utils/randomDelay";

type Social = Database["public"]["Tables"]["socials"]["Row"];

/**
 * Enhances TikTok social profiles with additional data like avatars, follower counts, following counts, and bios
 *
 * @param profiles - Array of social profiles to enhance
 * @returns Enhanced profiles with additional data where available
 */
export async function enhanceTikTokProfiles(profiles: Social[]): Promise<{
  enhancedProfiles: Social[];
}> {
  if (!profiles.length) {
    return {
      enhancedProfiles: [],
    };
  }

  const enhancedProfiles: Social[] = [];

  console.log(`Enhancing ${profiles.length} TikTok profiles`);

  // Process profiles sequentially to avoid triggering anti-bot measures
  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    const username = profile.username.replace(/^@/, "");

    console.log(
      `[${i + 1}/${profiles.length}] Processing TikTok profile: ${username}`
    );

    // Add delay between requests (except for the first one)
    if (i > 0) {
      await randomDelay();
    }

    try {
      // Fetch profile data
      const { avatar, followerCount, followingCount, bio, error } =
        await scrapeTikTokProfile(username);

      // Track what data was found
      let dataFound = false;
      const enhancedProfile = { ...profile };

      if (avatar) {
        // Upload avatar to Arweave to avoid caching issues
        console.log(`Uploading avatar for ${username} to Arweave...`);
        const arweaveUrl = await uploadPfpToArweave(avatar);

        if (arweaveUrl) {
          enhancedProfile.avatar = arweaveUrl;
          console.log(
            `✅ Uploaded avatar to Arweave for TikTok user: ${username}`
          );
          console.log(`   Original URL: ${avatar}`);
          console.log(`   Arweave URL: ${arweaveUrl}`);
        } else {
          // Fallback to original URL if Arweave upload fails
          enhancedProfile.avatar = avatar;
          console.log(
            `⚠️ Arweave upload failed for ${username}, using original URL`
          );
        }

        dataFound = true;
        console.log(`✅ Found avatar for TikTok user: ${username}`);
      }

      if (followerCount !== null) {
        enhancedProfile.followerCount = followerCount;
        dataFound = true;
        console.log(
          `✅ Found follower count for TikTok user: ${username}: ${followerCount}`
        );
      }

      if (followingCount !== null) {
        enhancedProfile.followingCount = followingCount;
        dataFound = true;
        console.log(
          `✅ Found following count for TikTok user: ${username}: ${followingCount}`
        );
      }

      if (bio) {
        enhancedProfile.bio = bio;
        dataFound = true;
        console.log(`✅ Found bio for TikTok user: ${username}`);
      }

      if (!dataFound) {
        if (error) {
          console.warn(
            `⚠️ Error fetching TikTok profile data for ${username}:`,
            error.message
          );
        } else {
          console.warn(`⚠️ No profile data found for TikTok user: ${username}`);
        }
      }

      enhancedProfiles.push(enhancedProfile);
    } catch (profileError) {
      console.error("Failed to fetch TikTok profile data:", profileError);
      enhancedProfiles.push(profile);
    }
  }

  return {
    enhancedProfiles,
  };
}

export default enhanceTikTokProfiles;

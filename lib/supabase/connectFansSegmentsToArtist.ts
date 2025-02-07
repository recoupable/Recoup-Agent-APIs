import getSocialPlatformByLink from "../getSocialPlatformByLink";
import getUserNameSegment from "../getUserNameSegment";
import getTikTokFanProfile from "../tiktok/getFanProfile";
import getTwitterFanProfile from "../twitter/getProfile";
import supabase from "./serverClient";
import { Scraper } from "agent-twitter-client";

const scraper = new Scraper();

const connectFansSegmentsToArtist = async (
  fansSegments: any,
  artistId: string,
) => {
  try {
    const { data: account_socials } = await supabase
      .from("account_socials")
      .select("*, social:socials(*)")
      .eq("account_id", artistId);

    if (!account_socials) return;
    const artist_socials: any = {};
    account_socials.map((account_social) => {
      artist_socials[
        `${getSocialPlatformByLink(account_social.social.profile_url).toLowerCase()}`
      ] = account_social.social.id;
    });
    const connectPromise = fansSegments.map(async (fanSegment: any) => {
      try {
        const { username, segmentName } = getUserNameSegment(fanSegment);
        if (!segmentName || !username) return;
        const { data: social } = await supabase
          .from("socials")
          .select("*")
          .eq("username", username)
          .single();

        if (!social) return;
        const socialPlatform = getSocialPlatformByLink(social.profile_url);
        let fanProfile: any = {
          profile: social,
        };
        if (socialPlatform === "TWITTER")
          fanProfile = await getTwitterFanProfile(scraper, username);
        if (socialPlatform === "TIKTOK")
          fanProfile = await getTikTokFanProfile(username);
        const profile = fanProfile?.profile || social;
        await supabase
          .from("socials")
          .update({
            ...social,
            ...profile,
          })
          .eq("id", social.id)
          .select("*")
          .single();

        if (artist_socials[`${socialPlatform.toLowerCase()}`]) {
          await supabase
            .from("artist_fan_segment")
            .delete()
            .eq(
              "artist_social_id",
              artist_socials[`${socialPlatform.toLowerCase()}`],
            )
            .eq("fan_social_id", social.id);
          await supabase
            .from("artist_fan_segment")
            .insert({
              segment_name: segmentName,
              artist_social_id:
                artist_socials[`${socialPlatform.toLowerCase()}`],
              fan_social_id: social.id,
            })
            .select("*")
            .single();
        }
      } catch (error) {
        console.error(error);
      }
    });

    await Promise.all(connectPromise);
    return;
  } catch (error) {
    console.error(error);
    return;
  }
};

export default connectFansSegmentsToArtist;

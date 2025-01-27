import getFanProfile from "./getFanProfile";

const getSocialProfiles = async (
  scraper: any,
  fansSegments: any,
  artistId: string,
) => {
  const socialProfilesPromise = fansSegments.map(async (fanSegment: any) => {
    try {
      const handle = Object.keys(fanSegment)[0];
      const segment = Object.values(fanSegment)[0];
      const profile = await getFanProfile(scraper, handle);

      console.log("ZIAD", handle, segment, profile);
      return {
        ...profile,
        segment,
        artistId,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const socialProfiles = await Promise.all(socialProfilesPromise);

  return socialProfiles.filter((profile: any) => profile);
};

export default getSocialProfiles;

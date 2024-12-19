import { UNKNOWN_PROFILE_ERROR } from "../twitter/errors.js";

const searchArtist = async (handle, accessToken) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(`artist:${handle}`)}&type=artist`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) return { error: true };
    const data = await response.json();

    if (data.artists.items.length === 0)
      return { error: UNKNOWN_PROFILE_ERROR };
    return data.artists.items?.[0];
  } catch (error) {
    return { error };
  }
};

export default searchArtist;

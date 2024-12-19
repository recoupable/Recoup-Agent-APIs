import getFormattedTracks from "./getFormattedTracks.js";

const getTopTracks = async (artistId, accessToken) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();
    const topTracks = data?.tracks || [];
    const formattedTracks = getFormattedTracks(topTracks);
    return formattedTracks;
  } catch (error) {
    console.error(error);
    return { error };
  }
};

export default getTopTracks;

const getFormattedTracks = (tracks) => {
  return tracks.map((track) => ({
    uri: track.uri,
    name: track.name,
    popularity: track.popularity,
    artist: track.artists?.[0]?.name || track.album.artists?.[0]?.name,
  }));
};

export default getFormattedTracks;

const getFormattedTracks = (tracks, analysis_id) => {
  return tracks.map((track) => ({
    uri: track.uri,
    name: track.name,
    popularity: track.popularity,
    artist_name: track.artists?.[0]?.name || track.album.artists?.[0]?.name,
    analysis_id,
  }));
};

export default getFormattedTracks;

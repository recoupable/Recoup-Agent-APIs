const getFormattedAlbums = (albums) => {
  return albums.map((album) => ({
    name: album.name,
    uri: album.uri,
    release_date: album.release_date,
    artist: album.artists?.[0]?.name,
  }));
};

export default getFormattedAlbums;

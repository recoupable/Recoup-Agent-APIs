const getFormattedAccount = (data) => {
  const videoUrls = [];
  const aggregatedData = data.reduce((acc, item) => {
    const existingAuthor = acc.find(
      (author) => author.name === item.authorMeta.name,
    );

    videoUrls.push(item.webVideoUrl);
    if (!existingAuthor) {
      acc.push({
        name: item.authorMeta.name,
        nickname: item.authorMeta.nickName,
        region: item.authorMeta.region,
        avatar: item.authorMeta.avatar,
        bio: item.authorMeta.signature,
        followers: item.authorMeta.fans,
        followings: item.authorMeta.following,
      });
    }
    return acc;
  }, []);

  return {
    profile: Object.values(aggregatedData),
    videoUrls,
  };
};

export default getFormattedAccount;

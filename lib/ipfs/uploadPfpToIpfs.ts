import getBlob from "./getBlob.js";
import { uploadToIpfs } from "./ipfs.js";

const uploadPfpToIpfs = async (image: string) => {
  if (!image) return "";
  const { blob, type } = await getBlob(image);
  const avatarBlob = new Blob([blob], { type });
  const fileName = "avatar.png";
  const avatarFile = new File([avatarBlob], fileName, { type });
  const avatarCid = await uploadToIpfs(avatarFile);

  if (!avatarCid) return "";
  return `https://ipfs.decentralized-content.com/ipfs/${avatarCid}`;
};

export default uploadPfpToIpfs;

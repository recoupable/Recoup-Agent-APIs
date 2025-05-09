import { Request, Response } from "express";
import getSearch from "../lib/spotify/getSearch";
import generateAccessToken from "../lib/spotify/generateAccessToken";

export const getSpotifySearchHandler = async (req: Request, res: Response) => {
  try {
    const { q, type, market, limit, offset } = req.query;
    if (!q || !type) {
      return res.status(400).json({ status: "error" });
    }

    const tokenResult = await generateAccessToken();
    if (!tokenResult || tokenResult.error || !tokenResult.access_token) {
      return res.status(500).json({ status: "error" });
    }

    const { data, error } = await getSearch({
      q: String(q),
      type: String(type),
      market: market ? String(market) : undefined,
      limit: limit ? String(limit) : undefined,
      offset: offset ? String(offset) : undefined,
      accessToken: tokenResult.access_token,
    });

    if (error) {
      return res.status(502).json({ status: "error" });
    }

    return res.status(200).json({ status: "success", ...data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error" });
  }
};

import { Database } from "../../types/database.types";
import supabase from "./serverClient";

type Social = Database["public"]["Tables"]["socials"]["Row"];

interface CreateSocialsResponse {
  socialMap: { [username: string]: string };
  error: Error | null;
}

/**
 * Creates or updates social records for the given authors
 *
 * @param authors - Array of author objects containing username and profile_url
 * @returns Object mapping usernames to created or updated social IDs
 *
 * @example
 * ```typescript
 * const authors = [{
 *   username: "user1",
 *   profile_url: "https://instagram.com/user1"
 * }];
 * const { socialMap, error } = await createSocials(authors);
 * if (error) {
 *   console.error("Failed to create socials:", error);
 *   return;
 * }
 * // socialMap = { "user1": "social_id_1" }
 * ```
 */
const createSocials = async (
  authors: Social[]
): Promise<CreateSocialsResponse> => {
  try {
    if (!authors.length) {
      return { socialMap: {}, error: null };
    }

    const { data: upsertedSocials, error: upsertError } = await supabase
      .from("socials")
      .upsert(authors, {
        onConflict: "profile_url",
        ignoreDuplicates: false, // Update existing records
      })
      .select("id, username");

    if (upsertError) {
      console.error("Failed to create/update socials:", upsertError);
      return {
        socialMap: {},
        error: new Error("Failed to create/update socials"),
      };
    }

    const socialMap = (upsertedSocials || []).reduce<{
      [username: string]: string;
    }>((acc, social) => {
      acc[social.username] = social.id;
      return acc;
    }, {});

    return { socialMap, error: null };
  } catch (error) {
    console.error("Error in createSocials:", error);
    return {
      socialMap: {},
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};

export default createSocials;

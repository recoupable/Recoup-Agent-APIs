import supabase from "./serverClient";

interface SegmentResponse {
  name: string | null;
  error: Error | null;
}

/**
 * Gets the segment name by its ID
 * @param segmentId The ID of the segment
 * @returns The segment name and any error that occurred
 */
const getSegmentById = async (segmentId: string): Promise<SegmentResponse> => {
  try {
    console.log("[DEBUG] Getting segment name for:", segmentId);

    const { data, error } = await supabase
      .from("segments")
      .select("name")
      .eq("id", segmentId)
      .single();

    if (error) {
      console.error("[ERROR] Failed to get segment:", error);
      return {
        name: null,
        error: new Error("Failed to get segment"),
      };
    }

    if (!data) {
      console.log("[DEBUG] No segment found for ID:", segmentId);
      return {
        name: null,
        error: new Error("No segment found"),
      };
    }

    console.log("[DEBUG] Found segment name:", data.name);
    return {
      name: data.name,
      error: null,
    };
  } catch (error) {
    console.error("[ERROR] Unexpected error in getSegmentById:", error);
    return {
      name: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};

export default getSegmentById;

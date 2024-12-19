import supabase from "./serverClient.js";

const getAdminPresave = async () => {
  const { data, error } = await supabase
    .from("presave")
    .select()
    .eq("id", "admin")
    .single();
  if (error) return { error };
  return data;
};

export default getAdminPresave;

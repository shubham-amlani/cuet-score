import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    // Simple security check: add ?token=your_secret to the URL
    if (req.query.token !== "amlani_boss") return res.status(401).send("Unauthorized");

    const { data, error } = await supabase
        .from("cuet_scores")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
}
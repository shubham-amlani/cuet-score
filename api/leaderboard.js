import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    const { data, error } = await supabase
        .from("cuet_scores")
        .select("candidate_name, total_score, subject")
        .order("total_score", { ascending: false })
        .limit(50);

    if (error) return res.status(500).json({ error: error.message });

    // Privacy Masking Logic: Shubham Amlani -> S***m A.
    const maskedData = data.map(item => ({
        ...item,
        candidate_name: item.candidate_name.split(' ').map(n => n[0] + "****" + n.slice(-1)).join(' ')
    }));

    res.status(200).json(maskedData);
}
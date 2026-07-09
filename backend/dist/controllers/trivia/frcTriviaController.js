import { supabaseClient } from "../../supabase.js";
export const getTriviaQuestions = async (req, res) => {
    const { category, era, difficulty, answerType } = req.query;
    if (category?.length === 0 ||
        era?.length === 0 ||
        difficulty?.length === 0 ||
        answerType?.length === 0) {
        return res.status(400).json({ data: [], message: "Missing fields" });
    }
    const categories = (Array.isArray(category) ? category : [category]);
    const eras = (Array.isArray(era) ? era : [era]);
    const difficulties = (Array.isArray(difficulty) ? difficulty : [difficulty]);
    const answerTypes = (Array.isArray(answerType) ? answerType : [answerType]);
    const { data, error } = await supabaseClient
        .from("frc_trivia")
        .select("*")
        .in("core_category", categories)
        .in("era", eras)
        .in("difficulty", difficulties)
        .in("answer_type", answerTypes);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
};

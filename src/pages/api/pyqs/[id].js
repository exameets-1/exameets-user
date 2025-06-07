import { catchAsync } from "@/lib/middlewares/catchAsync";
import { PreviousYear } from "@/lib/models/PreviousYear";
import dbConnect from "@/lib/dbConnect";

export default catchAsync(async (req, res) => {
    if (req.method === "GET") {
        try {
            await dbConnect();
            const { id } = req.query;
            
            const paper = await PreviousYear.findById(id);
            if (!paper) {
                return res.status(404).json({ error: "Paper not found" });
            }
            
            return res.status(200).json(paper);
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
    return res.status(405).json({ error: "Method not allowed" });
});
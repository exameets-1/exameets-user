import dbConnect from '@/lib/dbConnect';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { PreviousYear } from '@/lib/models/PreviousYear';

export default catchAsync(async (req, res) => {
    if (req.method === 'GET') {
        try {
            await dbConnect();
            const { subject } = req.query;

            if (subject) {
                // Get all papers for a specific subject
                const papers = await PreviousYear.find({ subject: subject })
                    .select('title year exam_name _id')
                    .sort({ year: -1 });
                return res.status(200).json(papers);
            } else {
                // Get unique subjects
                const subjects = await PreviousYear.distinct('subject');
                return res.status(200).json(subjects);
            }
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    }
    return res.status(405).json({ error: "Method not allowed" });
});
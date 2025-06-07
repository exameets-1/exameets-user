import dbConnect from '@/lib/dbConnect';
import { Team } from '@/lib/models/Team';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export default catchAsync(async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    await dbConnect();
    const teams = await Team.find();

    res.status(200).json({
        success: true,
        teams
    });
})
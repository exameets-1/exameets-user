import dbConnect from '@/lib/dbConnect';
import {Team} from '@/lib/models/Team';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export default catchAsync(async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    await dbConnect();
    const team = await Team.findById(req.query.id);
    if (!team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.status(200).json({
        success: true,
        team
    });
});
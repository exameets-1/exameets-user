import dbConnect from "@/lib/dbConnect";
import { GovtJob } from "@/lib/models/GovtJob";
import { catchAsync } from "@/lib/middlewares/catchAsync";


export default catchAsync(async (req, res) => {
    if(req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    await dbConnect();
    const govtjobs = await GovtJob.find()
        .sort({ createdAt: -1 })  
        .limit(5);  

    res.status(200).json({
        success: true,
        govtjobs
    })
});
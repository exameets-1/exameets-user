import dbConnect from '@/lib/dbConnect';
import  {AdmitCard} from '@/lib/models/AdmitCard';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export default catchAsync(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();
  const admitCards = await AdmitCard.find()
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    admitCards
  });
});
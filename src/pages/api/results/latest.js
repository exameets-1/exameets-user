import dbConnect from '@/lib/dbConnect';
import  {Result} from '@/lib/models/Result';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export default catchAsync(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();
  const results = await Result.find()
    .sort({ _id: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    results
  });
});
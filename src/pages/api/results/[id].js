import dbConnect from '@/lib/dbConnect';
import { Result } from '@/lib/models/Result';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import mongoose from 'mongoose';

export default catchAsync(async (req, res) => {
  try {
    await dbConnect();
    const { method } = req;
    const { id } = req.query;

    if (method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({
        success: false,
        message: `Method ${method} Not Allowed`
      });
    }

    let result;
    if (mongoose.Types.ObjectId.isValid(id)) {
      result = await Result.findById(id);
    } else {
      result = await Result.findOne({ slug: id });
    }
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    return res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
});
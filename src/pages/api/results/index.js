import dbConnect from '@/lib/dbConnect';
import { Result} from '@/lib/models/Result';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export default catchAsync(async (req, res) => {
  try {
    await dbConnect();

    const { method } = req;

    if (method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      throw new Error(`Method ${method} Not Allowed`);
    }

    const { searchKeyword, page = 1, limit = 8 } = req.query;

    const query = {};

    if (searchKeyword) {
      query.$or = [
        { role: { $regex: searchKeyword, $options: "i" } },
        { organization: { $regex: searchKeyword, $options: "i" } },
        { location: { $regex: searchKeyword, $options: "i" } },
        { experience_required: { $regex: searchKeyword, $options: "i" } },
        { skills_required: { $in: [new RegExp(searchKeyword, 'i')] } },
        { job_type: { $regex: searchKeyword, $options: "i" } }
      ];
    }

    const totalResults = await Result.countDocuments(query);

    if (searchKeyword) {
      query.$or = [
        { exam_title: { $regex: searchKeyword, $options: "i" } },
        { organization: { $regex: searchKeyword, $options: "i" } },
        { description: { $regex: searchKeyword, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const results = await Result.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      results,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalResults / parseInt(limit)),
      totalResults,
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
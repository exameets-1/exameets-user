import dbConnect from '@/lib/dbConnect';
import { Scholarship } from '@/lib/models/Scholarship';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import mongoose from 'mongoose';

export default catchAsync(async (req, res) => {
  await dbConnect();

  const {method} = req;
  const {id} = req.query;

  if(method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }

  let scholarship;
  if (mongoose.Types.ObjectId.isValid(id)) {
      scholarship = await Scholarship.findById(id);
  } else {
      scholarship = await Scholarship.findOne({ slug: id });
  }
  if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
  }

  scholarship._id = scholarship._id.toString();
  if (scholarship.start_date) {
      scholarship.start_date = new Date(scholarship.start_date).toISOString();
  }
  if (scholarship.last_date) {
      scholarship.last_date = new Date(scholarship.last_date).toISOString();
  }
  if (scholarship.post_date) {
      scholarship.post_date = new Date(scholarship.post_date).toISOString();
  }

  return res.status(200).json({ success: true, scholarship });
});
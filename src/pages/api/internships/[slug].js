import dbConnect from '@/lib/dbConnect';
import { Internship } from '@/lib/models/Internship';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) return res.status(400).json({ error: 'Slug is required' });

  await dbConnect();
  const internship = await Internship.findOne({ slug }).lean();

  if (!internship) return res.status(404).json({ error: 'Internship not found' });

  res.status(200).json(internship);
}

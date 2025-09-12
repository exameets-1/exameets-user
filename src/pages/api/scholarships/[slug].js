import dbConnect from '@/lib/dbConnect';
import { Scholarship } from '@/lib/models/Scholarship';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) return res.status(400).json({ error: 'Slug is required' });

  await dbConnect();
  const scholarship = await Scholarship.findOne({ slug }).lean();

  if (!scholarship) return res.status(404).json({ error: 'Scholarship not found' });

  res.status(200).json(scholarship);
}

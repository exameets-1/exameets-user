import dbConnect from '@/lib/dbConnect';
import { Admission } from '@/lib/models/Admission';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) return res.status(400).json({ error: 'Slug is required' });

  await dbConnect();
  const admission = await Admission.findOne({ slug }).lean();

  if (!admission) return res.status(404).json({ error: 'Admission not found' });

  res.status(200).json(admission);
}

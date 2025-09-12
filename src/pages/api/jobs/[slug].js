import dbConnect from '@/lib/dbConnect';
import { Job } from '@/lib/models/Job';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) return res.status(400).json({ error: 'Slug is required' });

  await dbConnect();
  const job = await Job.findOne({ slug }).lean();

  if (!job) return res.status(404).json({ error: 'Job not found' });

  res.status(200).json(job);
}

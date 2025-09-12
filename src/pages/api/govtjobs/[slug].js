import dbConnect from '@/lib/dbConnect';
import { GovtJob } from '@/lib/models/GovtJob';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) return res.status(400).json({ error: 'Slug is required' });

  await dbConnect();
  const govtJob = await GovtJob.findOne({ slug }).lean();

  if (!govtJob) return res.status(404).json({ error: 'GovtJob not found' });

  res.status(200).json(govtJob);
}

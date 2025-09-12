import dbConnect from '@/lib/dbConnect';
import { Result } from '@/lib/models/Result';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) return res.status(400).json({ error: 'Slug is required' });

  await dbConnect();
  const result = await Result.findOne({ slug }).lean();

  if (!result) return res.status(404).json({ error: 'Result not found' });

  res.status(200).json(result);
}

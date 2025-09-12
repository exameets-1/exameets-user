import dbConnect from '@/lib/dbConnect';
import { AdmitCard } from '@/lib/models/AdmitCard';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) return res.status(400).json({ error: 'Slug is required' });

  await dbConnect();
  const admitCard = await AdmitCard.findOne({ slug }).lean();

  if (!admitCard) return res.status(404).json({ error: 'AdmitCard not found' });

  res.status(200).json(admitCard);
}

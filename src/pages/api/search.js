import { Job } from '@/lib/models/Job';
import { Internship } from '@/lib/models/Internship';
// import { GovtJob } from '@/lib/models/GovtJob';
// import { Scholarship } from '@/lib/models/Scholarship';
// import { Result } from '@/lib/models/Result';
// import { AdmitCard } from '@/lib/models/AdmitCard';
// import { Admission } from '@/lib/models/Admission';
// import { PreviousYear } from '@/lib/models/PreviousYear';

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: 'Search query is required'
            });
        }

        const searchRegex = new RegExp(q, 'i');

        // Perform parallel searches across all collections
        const [jobs, 
            internships,
            // govtjobs, 
            //  scholarships, results, admitcards, admissions, previousYears
            ] = await Promise.all([
            Job.find({ 
                $or: [
                    { role: searchRegex },
                    { organization: searchRegex },
                    { description: searchRegex },
                    { job_type: searchRegex },
                    { location: searchRegex },
                    { eligibility_criteria: searchRegex },
                    { skills_required: searchRegex }
                ]
            }).sort({ post_date: -1 }).limit(5),
            
            Internship.find({
                $or: [
                    { title: searchRegex },
                    { organization: searchRegex },
                    { description: searchRegex },
                    { location: searchRegex },
                    { eligibility_criteria: searchRegex },
                    { internship_type: searchRegex },
                    { skills_required: searchRegex },
                    { qualification: searchRegex }
                ]
            }).sort({ post_date: -1 }).limit(5),

            // GovtJob.find({
            //     $or: [
            //         { job_type: searchRegex },
            //         { department: searchRegex },
            //         { organization: searchRegex },
            //         { location: searchRegex },
            //         { eligibility_criteria: searchRegex },
            //         { description: searchRegex }
            //     ]
            // }).sort({ post_date: -1 }).limit(5),


            // Scholarship.find({
            //     $or: [
            //         { title: searchRegex },
            //         { organization: searchRegex },
            //         { description: searchRegex },
            //         { eligibility_criteria: searchRegex },
            //         { category: searchRegex }
            //     ]
            // }).sort({ start_date: -1 }).limit(5),

            // Result.find({
            //     $or: [
            //         { exam_title: searchRegex },
            //         { organization: searchRegex },
            //         { description: searchRegex }
            //     ]
            // }).sort({ result_date: -1 }).limit(5),

            // AdmitCard.find({
            //     $or: [
            //         { title: searchRegex },
            //         { organization: searchRegex },
            //         { description: searchRegex },
            //         { eligibility_criteria: searchRegex }
            //     ]
            // }).sort({ exam_date: -1 }).limit(5),

            // Admission.find({
            //     $or: [
            //         { title: searchRegex },
            //         { institute: searchRegex },
            //         { description: searchRegex },
            //         { eligibility_criteria: searchRegex },
            //         { course: searchRegex },
            //         { category: searchRegex }
            //     ]
            // }).sort({ start_date: -1 }).limit(5),

            // PreviousYear.find({
            //     $or: [
            //         { title: searchRegex },
            //         { exam_name: searchRegex },
            //         { description: searchRegex },
            //         { subject: searchRegex },
            //         { category: searchRegex },
            //         { difficulty_level: searchRegex }
            //     ]
            // }).sort({ year: -1 }).limit(5)
        ]);

        // Combine and format results
        const allResults = [
            ...jobs.map(item => ({ ...item.toObject(), type: 'job' })),
            ...internships.map(item => ({ ...item.toObject(), type: 'internship' })),
            // ...govtjobs.map(item => ({ ...item.toObject(), type: 'govtjob' })),
            // ...scholarships.map(item => ({ ...item.toObject(), type: 'scholarship' })),
            // ...results.map(item => ({ ...item.toObject(), type: 'result' })),
            // ...admitcards.map(item => ({ ...item.toObject(), type: 'admitcard' })),
            // ...admissions.map(item => ({ ...item.toObject(), type: 'admission' })),
            // ...previousYears.map(item => ({ ...item.toObject(), type: 'previousyear' }))
        ];

        // Sort by the most relevant date field for each type
        const sortedResults = allResults
            .sort((a, b) => {
                const getDate = (item) => {
                    switch(item.type) {
                        case 'job':
                        case 'internship':
                            return new Date(item.post_date);
                        // case 'govtjob':
                        // case 'scholarship':
                        // case 'admission':
                        //     return new Date(item.start_date);
                        // case 'result':
                        //     return new Date(item.result_date);
                        // case 'admitcard':
                        //     return new Date(item.exam_date);
                        // case 'previousyear':
                        //     return new Date(item.year, 0, 1); // Convert year to date
                        default:
                            return new Date(0);
                    }
                };
                return getDate(b) - getDate(a);
            })
            .slice(0, 5);

        return res.status(200).json(sortedResults);
    } catch (error) {
        console.error('Search API Error:', error);
        return res.status(500).json({
            message: 'Error performing global search',
            error: error.message
        });
    }
}
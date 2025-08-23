// import Link from "next/link";
// import { PreviousYear } from "@/lib/models/PreviousYear";
// import dbConnect from "@/lib/dbConnect";

// const SubjectPapers = ({ subject, papersByYear, error }) => {
//     // First, handle potential errors
//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//                 <div className="max-w-7xl mx-auto">
//                     <h1 className="text-3xl font-bold text-[#015990] dark:text-white mb-8">
//                         Error
//                     </h1>
//                     <div className="text-center text-red-500">
//                         {error}
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//             <div className="max-w-7xl mx-auto">
//                 <h1 className="text-3xl font-bold text-[#015990] dark:text-white mb-8">
//                     {subject} Previous Year Papers
//                 </h1>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                     {Object.keys(papersByYear || {}).length === 0 ? (
//                         <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
//                             No papers found for this subject.
//                         </div>
//                     ) : (
//                         Object.keys(papersByYear)
//                             .sort((a, b) => b - a)
//                             .map((year) =>
//                                 papersByYear[year].map((paper) => (
//                                     <div
//                                         key={paper._id}
//                                         className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-600 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
//                                     >
//                                         {/* Title Section */}
//                                         <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
//                                             {paper.title}
//                                         </h3>

//                                         {/* Exam with Border */}
//                                         <div className="text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3 line-clamp-1">
//                                             Exam: {paper.exam_name}
//                                         </div>

//                                         {/* Content Section */}
//                                         <div className="grid gap-2 mb-4">
//                                             <div className="text-sm text-gray-600 dark:text-gray-300">
//                                                 Difficulty: {paper.difficulty_level}
//                                             </div>
//                                             <div className="text-sm text-gray-600 dark:text-gray-300">
//                                                 Year: {year}
//                                             </div>
//                                         </div>

//                                         {/* Footer Section */}
//                                         <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
//                                             <span className="bg-[#015990] dark:bg-gray-700 text-white text-xs px-3 py-1 rounded">
//                                                 {paper.category || "General"}
//                                             </span>
//                                             <Link 
//                                                 href={`/papers/${encodeURIComponent(subject)}/${year}`}
//                                             >
//                                                 <span className="text-[#015990] dark:text-blue-400 font-medium hover:underline cursor-pointer">
//                                                     View Details →
//                                                 </span>
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 ))
//                             )
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export async function getServerSideProps(context) {
//     const { subjectSlug } = context.params;
//     const decodedSubject = decodeURIComponent(subjectSlug).trim();
//     try {
//         await dbConnect();
        
//         // Add console logs for debugging
//         console.log(`Searching for papers with subject: ${decodedSubject}`);
        
//         const papers = await PreviousYear.find({
//             subject: { $regex: new RegExp(`^${decodedSubject}$`, 'i') } // Case-insensitive match
//           }).sort({ year: -1 }).lean();

//         console.log(`Found ${papers?.length || 0} papers`);

//         if (!papers || papers.length === 0) {
//             return {
//                 props: {
//                     subject: decodedSubject,
//                     papersByYear: {},
//                     error: `No papers found for this subject: ${decodedSubject}`
//                 }
//             };
//         }

//         // Group papers by year
//         const papersByYear = papers.reduce((acc, paper) => {
//             // Convert MongoDB document to plain object and handle _id
//             const plainPaper = {
//                 ...paper,
//                 _id: paper._id.toString(),
//                 createdAt: paper.createdAt ? paper.createdAt.toISOString() : null
//             };

//             if (!acc[paper.year]) {
//                 acc[paper.year] = [];
//             }
//             acc[paper.year].push(plainPaper);
//             return acc;
//         }, {});

//         return {
//             props: {
//                 subject: decodedSubject,
//                 papersByYear: JSON.parse(JSON.stringify(papersByYear)),
//                 error: null
//             }
//         };
//     } catch (error) {
//         console.error("Failed to fetch papers by subject:", error);
//         return {
//             props: {
//                 subject: decodedSubject,
//                 papersByYear: {},
//                 error: error.message || "Error fetching papers"
//             }
//         };
//     }
// }

// export default SubjectPapers;

import Link from "next/link";
import { PreviousYear } from "@/lib/models/PreviousYear";
import dbConnect from "@/lib/dbConnect";

const SubjectPapers = ({ subject, papersByYear, error }) => {
    // First, handle potential errors
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-[#015990] dark:text-white mb-8">
                        Error
                    </h1>
                    <div className="text-center text-red-500">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-[#015990] dark:text-white mb-8">
                    {subject} Previous Year Papers
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Object.keys(papersByYear || {}).length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
                            No papers found for this subject.
                        </div>
                    ) : (
                        Object.keys(papersByYear)
                            .sort((a, b) => b - a)
                            .map((year) =>
                                papersByYear[year].map((paper) => (
                                    <div
                                        key={paper._id}
                                        className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-600 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
                                    >
                                        {/* Title Section */}
                                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
                                            {paper.title}
                                        </h3>

                                        {/* Exam with Border */}
                                        <div className="text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3 line-clamp-1">
                                            Exam: {paper.exam_name}
                                        </div>

                                        {/* Content Section */}
                                        <div className="grid gap-2 mb-4">
                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                Difficulty: {paper.difficulty_level}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                Year: {year}
                                            </div>
                                        </div>

                                        {/* Footer Section */}
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <span className="bg-[#015990] dark:bg-gray-700 text-white text-xs px-3 py-1 rounded">
                                                {paper.category || "General"}
                                            </span>
                                            <Link 
                                                href={`/papers/${encodeURIComponent(subject)}/${paper.slug}`}
                                            >
                                                <span className="text-[#015990] dark:text-blue-400 font-medium hover:underline cursor-pointer">
                                                    View Details →
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )
                    )}
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { subjectSlug } = context.params;
    const decodedSubject = decodeURIComponent(subjectSlug).trim();
    try {
        await dbConnect();
        
        // Add console logs for debugging
        console.log(`Searching for papers with exam: ${decodedSubject}`);
        
        const papers = await PreviousYear.find({
            subject: { $regex: new RegExp(`^${decodedSubject}$`, 'i') } // Case-insensitive match
          }).sort({ year: -1 }).lean();

        console.log(`Found ${papers?.length || 0} papers`);

        if (!papers || papers.length === 0) {
            return {
                props: {
                    subject: decodedSubject,
                    papersByYear: {},
                    error: `No papers found for this exam: ${decodedSubject}`
                }
            };
        }

        // Group papers by year
        const papersByYear = papers.reduce((acc, paper) => {
            // Convert MongoDB document to plain object and handle _id
            const plainPaper = {
                ...paper,
                _id: paper._id.toString(),
                createdAt: paper.createdAt ? paper.createdAt.toISOString() : null
            };

            if (!acc[paper.year]) {
                acc[paper.year] = [];
            }
            acc[paper.year].push(plainPaper);
            return acc;
        }, {});

        return {
            props: {
                subject: decodedSubject,
                papersByYear: JSON.parse(JSON.stringify(papersByYear)),
                error: null
            }
        };
    } catch (error) {
        console.error("Failed to fetch papers by exam:", error);
        return {
            props: {
                subject: decodedSubject,
                papersByYear: {},
                error: error.message || "Error fetching papers"
            }
        };
    }
}

export default SubjectPapers;
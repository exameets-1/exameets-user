// import { PreviousYear } from "@/lib/models/PreviousYear";
// import dbConnect from "@/lib/dbConnect";

// const YearPapers = ({ subject, year, papers, error }) => {


//     return (
//         <div className="min-h-screen bg-white dark:bg-gray-900">
//             <div className="max-w-7xl mx-auto px-5 py-10">
//                 <header className="mb-10 text-center">
//                     <h1 className="text-4xl font-bold text-[#015990] dark:text-white mb-2">
//                         {subject} - {year} Papers
//                     </h1>
//                     <p className="text-lg text-gray-600 dark:text-gray-300">Detailed view of all question papers</p>
//                 </header>

//                 {papers.map((paper) => (
//                     <div key={paper._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8 p-8">
//                         {/* Header Section */}
//                         <div className="flex justify-between items-center mb-6">
//                             <div>
//                                 <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{paper.title}</h2>
//                                 <div className="flex items-center gap-3">
//                                     <span
//                                         className={`px-3 py-1 rounded-full text-sm ${
//                                             paper.is_featured
//                                                 ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
//                                                 : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
//                                         }`}
//                                     >
//                                         {paper.is_featured ? "⭐ Featured Paper" : "Standard Paper"}
//                                     </span>
//                                     <span className="text-sm text-gray-500 dark:text-gray-400">
//                                         Added on {new Date(paper.createdAt).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Main Content */}
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                             {/* Left Column */}
//                             <div className="lg:col-span-2">
//                                 <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
//                                     <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4">Paper Overview</h3>
//                                     <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                                         {paper.description || "No description available"}
//                                     </p>

//                                     <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4 mt-6">Search Information</h3>
//                                     <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                                         {paper.searchDescription || "No search description available"}
//                                     </p>
//                                 </div>

//                                 <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
//                                     <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4">Exam Details</h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {["exam_name", "subject", "year"].map((field) => (
//                                             <div key={field} className="bg-white dark:bg-gray-800 p-4 rounded-lg">
//                                                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 capitalize">
//                                                     {field.replace("_", " ")}
//                                                 </p>
//                                                 <p className="font-bold text-gray-800 dark:text-gray-200">{paper[field]}</p>
//                                             </div>
//                                         ))}

//                                         {/* Category Field */}
//                                         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
//                                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
//                                             <p className="font-bold text-gray-800 dark:text-gray-200">{paper.category}</p>
//                                         </div>

//                                         {/* Slug Field */}
//                                         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
//                                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Slug</p>
//                                             <p className="font-bold text-gray-800 dark:text-gray-200">{paper.slug}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Right Column */}
//                             <div className="lg:col-span-1">
//                                 <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
//                                     <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4">Keywords</h3>
//                                     <div className="flex flex-wrap gap-2">
//                                         {paper.keywords?.map((keyword, keywordIndex) => (
//                                             <span
//                                                 key={keywordIndex}
//                                                 className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300"
//                                             >
//                                                 #{keyword}
//                                             </span>
//                                         ))}
//                                         {(!paper.keywords || paper.keywords.length === 0) && (
//                                             <span className="text-gray-500 dark:text-gray-400">No keywords available</span>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}

//                 {papers.length === 0 && (
//                     <div className="text-center py-20">
//                         <div className="text-2xl text-gray-500 dark:text-gray-400 mb-4">No papers found for {year}</div>
//                         <p className="text-gray-600 dark:text-gray-300">Please check back later or try a different year</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export async function getServerSideProps(context) {
//     const { subjectSlug, year } = context.params;
//     const decodedSubject = decodeURIComponent(subjectSlug);
//     const yearInt = parseInt(year);

//     try {
//         await dbConnect();
//         const papers = await PreviousYear.find({ 
//             subject: decodedSubject, 
//             year: yearInt 
//         }).lean();

//         if (!papers || papers.length === 0) {
//             return {
//                 props: {
//                     subject: decodedSubject,
//                     year: yearInt,
//                     papers: [],
//                     error: "No papers found for this subject and year"
//                 }
//             };
//         }

//         // Convert the MongoDB documents to plain objects
//         const serializedPapers = papers.map(paper => ({
//             ...paper,
//             _id: paper._id.toString(),
//             createdAt: paper.createdAt ? paper.createdAt.toISOString() : null
//         }));

//         return {
//             props: {
//                 subject: decodedSubject,
//                 year: yearInt,
//                 papers: JSON.parse(JSON.stringify(serializedPapers)),
//                 error: null
//             }
//         };
//     } catch (error) {
//         console.error("Failed to fetch papers by subject and year:", error);
//         return {
//             props: {
//                 subject: decodedSubject,
//                 year: yearInt,
//                 papers: [],
//                 error: error.message || "Error fetching papers"
//             }
//         };
//     }
// }

// export default YearPapers;

import { PreviousYear } from "@/lib/models/PreviousYear";
import dbConnect from "@/lib/dbConnect";

const SlugPaper = ({ paper, subject, slug, error }) => {
    // Handle errors
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-red-500 dark:text-red-400 mb-8">
                        Error
                    </h1>
                    <div className="text-center text-red-500">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!paper) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="text-2xl text-gray-500 dark:text-gray-400 mb-4">
                            Paper not found
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                            The requested paper could not be found.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-5 py-10">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-[#015990] dark:text-white mb-2">
                        {paper.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        {paper.subject} - {paper.year}
                    </p>
                </header>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                {paper.title}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        paper.is_featured
                                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    {paper.is_featured ? "⭐ Featured Paper" : "Standard Paper"}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Added on {new Date(paper.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                                <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4">
                                    Paper Overview
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {paper.description || "No description available"}
                                </p>

                                <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4 mt-6">
                                    Search Information
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {paper.searchDescription || "No search description available"}
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4">
                                    Exam Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {["exam_name", "subject", "year", "difficulty_level"].map((field) => (
                                        <div key={field} className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 capitalize">
                                                {field.replace("_", " ")}
                                            </p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">
                                                {paper[field]}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Category Field */}
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">
                                            {paper.category || "Not specified"}
                                        </p>
                                    </div>

                                    {/* Slug Field */}
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Slug</p>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">
                                            {paper.slug}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4">
                                    Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {paper.keywords?.map((keyword, keywordIndex) => (
                                        <span
                                            key={keywordIndex}
                                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            #{keyword}
                                        </span>
                                    ))}
                                    {(!paper.keywords || paper.keywords.length === 0) && (
                                        <span className="text-gray-500 dark:text-gray-400">
                                            No keywords available
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { subjectSlug, slug } = context.params;
    const decodedSubject = decodeURIComponent(subjectSlug);
    const decodedSlug = decodeURIComponent(slug);

    try {
        await dbConnect();
        
        console.log(`Searching for paper with slug: ${decodedSlug} and subject: ${decodedSubject}`);
        
        // Search for the paper by slug
        const paper = await PreviousYear.findOne({ 
            slug: decodedSlug,
            subject: { $regex: new RegExp(`^${decodedSubject}$`, 'i') } // Also match subject for extra validation
        }).lean();

        console.log(`Found paper:`, paper ? 'Yes' : 'No');

        if (!paper) {
            return {
                props: {
                    paper: null,
                    subject: decodedSubject,
                    slug: decodedSlug,
                    error: `No paper found with slug: ${decodedSlug}`
                }
            };
        }

        // Convert the MongoDB document to plain object
        const serializedPaper = {
            ...paper,
            _id: paper._id.toString(),
            createdAt: paper.createdAt ? paper.createdAt.toISOString() : null
        };

        return {
            props: {
                paper: JSON.parse(JSON.stringify(serializedPaper)),
                subject: decodedSubject,
                slug: decodedSlug,
                error: null
            }
        };
    } catch (error) {
        console.error("Failed to fetch paper by slug:", error);
        return {
            props: {
                paper: null,
                subject: decodedSubject,
                slug: decodedSlug,
                error: error.message || "Error fetching paper"
            }
        };
    }
}

export default SlugPaper;
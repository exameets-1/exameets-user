import { useState, useRef} from "react";
import { useRouter } from "next/router";
import { PreviousYear } from "@/lib/models/PreviousYear";
import dbConnect from "@/lib/dbConnect";

const PreviousYearPage = ({ subjects, error }) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const searchInputRef = useRef(null);
    const router = useRouter();

    const handleViewDetails = (subject) => {
        console.log("Looking papers for", subject);
        router.push(`/papers/${encodeURIComponent(subject)}`);
    }

    // Filtered subjects based on search keyword
    const filteredSubjects = subjects?.filter(subject => 
        subject.toLowerCase().includes(searchKeyword.toLowerCase())
    ) || [];

    if (error) {
        toast.error(error);
        return <div className="text-center text-red-500 p-10">Error loading subjects: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Top Section */}
            <div className="w-full bg-[#DFF1FF] dark:bg-gray-800 py-10 px-5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-[25px] font-semibold text-[#015990] dark:text-white">
                            Previous Year Question Papers
                        </h1>
                    </div>
                    <div className="flex items-center relative">
                        <input
                            id="paper-search"
                            name="paper-search"
                            type="text"
                            placeholder="Search subjects..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            ref={searchInputRef}
                            className="w-full md:w-[600px] h-[45px] px-4 rounded-md border border-gray-300 focus:outline-none focus:border-[#015990] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>
    
            {/* Subject Cards Container */}
            <div className="max-w-7xl mx-auto px-5 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredSubjects.map((subject) => (
                            
                            <div
                                key={subject}
                                className="group h-[200px] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg overflow-hidden shadow-md flex flex-col transition-transform duration-300 hover:scale-105 cursor-pointer"
                            >
                                <div className="flex-grow flex items-center justify-center p-5">
                                    <h2 className="text-[23px] font-semibold text-center text-[#015990] dark:text-white">
                                        {subject}
                                    </h2>
                                </div>
                                <button onClick={() => handleViewDetails(subject)} className="bg-[#015990] dark:bg-gray-950 h-[50px] flex items-center justify-center text-white text-[20px] font-bold">
                                    View Papers
                                </button>
                            </div>
                    
                    ))}
                </div>
    
                {filteredSubjects.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-300 mt-8">
                        No subjects found {searchKeyword ? "matching your search" : "available"}
                    </div>
                )}
            </div>
        </div>
    );
};

export async function getServerSideProps() {
    try {
        await dbConnect();
        const subjects = await PreviousYear.distinct("subject");

        if (!subjects || subjects.length === 0) {
            return {
                props: {
                    subjects: [],
                    error: "No subjects found"
                }
            };
        }

        return {
            props: {
                subjects: JSON.parse(JSON.stringify(subjects)),
                error: null
            }
        };
    } catch (error) {
        console.error("Failed to fetch subjects:", error);
        return {
            props: {
                subjects: [],
                error: error.message || "Error fetching subjects"
            }
        };
    }
}

export default PreviousYearPage;
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import useScrollToTop from "@/hooks/useScrollToTop";
import dbConnect from "@/lib/dbConnect";
import { Team } from "@/lib/models/Team";

const Teams = ({ teams: initialTeams, error: initialError }) => {
    useScrollToTop();
    const router = useRouter();
    const [teams, setTeams] = useState(initialTeams || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(initialError || null);
    const {isAuthenticated} = useSelector((state) => state.user);

    const handleVerify = (name, e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.info("Please login to verify team member", {
                position: "top-center",
                autoClose: 2000,
            });
            localStorage.setItem('pendingTeamVerification', name);
            setTimeout(() => {
                router.push('/login');
            }, 1000);
            return;
        }
        localStorage.setItem('teamScrollPosition', window.scrollY.toString());
        router.push(`/teams/${name}`);
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-5">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Team Members</h1>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#005792] dark:bg-gray-950 text-white">
                                    <th className="p-3 text-left font-semibold">Sl.No</th>
                                    <th className="p-3 text-left font-semibold">Name</th>
                                    <th className="p-3 text-left font-semibold">Role</th>
                                    <th className="p-3 text-left font-semibold">Verify</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="p-4 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No team members found
                                        </td>
                                    </tr>
                                ) : (
                                    teams?.map((team, index) => (
                                        <tr
                                            key={team._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-blue-50 dark:even:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                                        >
                                            <td className="p-3 dark:text-white">{index + 1}</td>
                                            <td className="p-3 dark:text-white">{team.name}</td>
                                            <td className="p-3 dark:text-white">{team.position}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={(e) => handleVerify(team.name, e)}
                                                    className="bg-[#005792] dark:bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-[#004579] dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    Verify
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Data fetching directly in the component
export async function getServerSideProps(context) {
    try {
        // Connect to database
        await dbConnect();
        
        const page = parseInt(context.query.page) || 1;
        const limit = 100;
        const skip = (page - 1) * limit;

        // Set up query parameters
        let query = { approved: true }; // Default to show only approved teams

        if (context.query.keyword) {
            query.$or = [
                {name: {$regex: context.query.keyword, $options: 'i'}}
            ];
        }

        // Execute database queries
        const totalTeams = await Team.countDocuments(query);
        const teams = await Team.find(query)
            .select('_id name position image')
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalTeams/limit);
        
        // Return formatted data for the component
        return {
            props: {
                teams: JSON.parse(JSON.stringify(teams)), // Serialize MongoDB objects
                totalTeams,
                currentPage: page,
                totalPages,
            },
        };
    } catch (error) {
        console.error('Error fetching teams:', error);
        return {
            props: {
                teams: [],
                error: error.message || 'Failed to fetch teams',
            },
        };
    }
}

export default Teams;
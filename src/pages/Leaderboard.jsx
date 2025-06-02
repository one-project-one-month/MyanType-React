import { useState } from "react";
import { Loader2 } from "lucide-react";
import CountdownWithPagination from "@/components/leaderboard/CountdownWithPagination.jsx";
import SessionFilter from "@/components/leaderboard/SessionFilter.jsx";
import Table from "@/components/common/Table.jsx";
import { useLeaderboard } from "../../hooks/useLeaderboard.jsx";
import Navbar from '../components/NavBar'; // Import Navbar

export default function Leaderboard() {
    const [mode, setMode] = useState(15);
    const [language, setLanguage] = useState('English');
    const { table, isLoading, isError } = useLeaderboard(mode, language);

    return (
        <div className="min-h-screen p-4 text-white flex flex-col">
            <Navbar /> {/* Add Navbar */}
            <div className="flex-grow mx-auto p-4 flex flex-col md:flex-row md:px-16 md:pt-10">
                <aside className="w-full mb-8 mr-8 md:w-1/4 space-y-6">
                    <SessionFilter mode={mode} setMode={setMode} language={language} setLanguage={setLanguage} />
                </aside>

                <section className="w-full md:w-3/4 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <h1 className="text-3xl font-medium">{language} Time {mode} Leaderboard</h1>
                    </div>

                    {isLoading ? (
                        <Loader2 className="mx-auto h-14 w-14 my-16 animate-spin text-slate-500" />
                    ) : isError ? (
                        <p className="text-lg text-red-500 py-6">Failed to load data. Please try again.</p>
                    ) : (
                        <div>
                            <CountdownWithPagination table={table} />
                            <Table table={table} />
                        </div>
                    )}
                </section>
            </div>
            <footer className="py-4 border-t border-gray-700 text-center">
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} Myan-Type. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
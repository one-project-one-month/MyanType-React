import {useState} from "react";
import {useLeaderboard} from "../../../hooks/useLeaderboard.jsx";
import SessionFilter from "@/components/leaderboard/SessionFilter.jsx";
import CountdownWithPagination from "@/components/leaderboard/CountdownWithPagination.jsx";
import Table from "@/components/common/Table.jsx";

export default function Leaderboard() {
    const [mode, setMode] = useState(15);
    const [language, setLanguage] = useState('English');
    const table = useLeaderboard(mode, language);

    return (
        <div className={'text-white max-w-7xl mx-auto flex flex-col md:flex-row'}>
            <aside className={'w-full mb-8 mr-8 md:w-1/4 space-y-6'}>
                <SessionFilter mode={mode} setMode={setMode} language={language} setLanguage={setLanguage} />
            </aside>

            <section className={'w-full md:w-3/4 space-y-6'}>
                <div className={'flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0'}>
                    <h1 className="text-3xl font-medium">{language} Time {mode} Leaderboard</h1>
                </div>
                <CountdownWithPagination table={table} />
                <Table table={table} />
            </section>
        </div>
    )
}
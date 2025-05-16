import LeaderboardTable from "@/components/LeaderboardTable.jsx";
import HistoryTable from "@/components/HistoryTable.jsx";


export default function App() {
    return (
        <div className={'pt-4 min-h-screen bg-gray-800'}>
            <LeaderboardTable />
            <HistoryTable />
        </div>
    );
}
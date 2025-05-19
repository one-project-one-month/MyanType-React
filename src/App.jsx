import Leaderboard from "@/components/leaderboard/Leaderboard.jsx";
import Profile from "@/components/profile/Profile.jsx";

export default function App() {
    return (
        <div className={'pt-4 min-h-screen bg-[#0E0F15]'}>
            <Leaderboard />
            <Profile />
        </div>
    );
}
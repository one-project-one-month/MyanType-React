import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Leaderboard from "../pages/Leaderboard.jsx";
import Profile from "../pages/Profile.jsx";

export const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient} >

        </QueryClientProvider>
    );
}
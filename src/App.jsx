import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {UserStatProvider} from './context/UserStatProvider.jsx';
import {TestProvider} from './context/TestContextProvider.jsx';
import {SettingsProvider} from './context/SettingProvider.jsx';
import "./App.css";
import {Toaster} from 'sonner';
import RootLayout from "./layout/RootLayout";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import HomePage from './pages/Home.jsx';
import TypingResults from './pages/TypingResults.jsx';
import TypingTestUI from './pages/TypingTestUI.jsx';
import Profile from "@/pages/Profile.jsx";
import Leaderboard from "@/pages/Leaderboard.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { AuthProvider } from './context/AuthProvider.jsx';
import { TypingTestProvider } from './context/TypingTestContext.jsx';
import { DataProvider } from './context/DataProvider.jsx';
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <DataProvider>
        <TypingTestProvider>
            <AuthProvider>
            <SettingsProvider>
                <UserStatProvider>
                    <TestProvider>
                        <Router>
                            <Routes>
                                <Route path="/" element={<RootLayout/>}>
                                    <Route index element={<HomePage/>}/>
                                    <Route path="sign-up" element={<Register/>}/>
                                    <Route path="login" element={<Login/>}/>
                                    <Route path="results" element={<TypingResults/>}/>
                                    <Route path="test" element={<TypingTestUI/>}/>
                                    <Route path="leaderboard" element={<Leaderboard/>}/>
                                    <Route path="profile" element={<Profile/>}/>
                                </Route>
                            </Routes>
                            <Toaster richColors position="bottom-center" />
                        </Router>
                    </TestProvider>
                </UserStatProvider>
            </SettingsProvider>
            </AuthProvider>
            </TypingTestProvider>
            </DataProvider>
        </QueryClientProvider>
    );
}

export default App;
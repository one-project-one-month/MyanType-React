import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserStatProvider } from './context/UserStatProvider.jsx';
import { TestProvider } from './context/TestContextProvider.jsx';
import { SettingsProvider } from './context/SettingProvider.jsx';
import "./App.css";
import { Toaster } from 'sonner';
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import HomePage from './pages/Home.jsx';
import TypingResults from './pages/TypingResults.jsx';
import TypingTestUI from './pages/TypingTestUI.jsx';
import Profile from "@/pages/Profile.jsx";
import Leaderboard from "@/pages/Leaderboard.jsx";
import { AuthProvider } from './context/AuthProvider.jsx';
import { TypingTestProvider } from './context/TypingTestContext.jsx';
import { DataProvider } from './context/DataProvider.jsx';
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/queryClient.js";

function App() {
    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <DataProvider>
                    <TypingTestProvider>
                        <AuthProvider>
                            <SettingsProvider>
                                <UserStatProvider>
                                    <TestProvider>
                                        {/* Add the section wrapper from RootLayout */}
                                        <section className="mx-auto max-w-7xl my-2">
                                            {/* Use Toaster settings from RootLayout */}
                                            <Toaster
                                                position="top-center"
                                                closeButton
                                                richColors
                                                duration={3000}
                                                expand={true}
                                            />
                                            <Routes>
                                                <Route path="/" element={<HomePage/>}/>
                                                <Route path="sign-up" element={<Register/>}/>
                                                <Route path="login" element={<Login/>}/>
                                                <Route path="results" element={<TypingResults/>}/>
                                                <Route path=":mode" element={<TypingTestUI/>}/>
                                                <Route path="leaderboard" element={<Leaderboard/>}/>
                                                <Route path="profile" element={<Profile/>}/>
                                            </Routes>
                                        </section>
                                    </TestProvider>
                                </UserStatProvider>
                            </SettingsProvider>
                        </AuthProvider>
                    </TypingTestProvider>
                </DataProvider>
            </QueryClientProvider>
        </Router>
    );
}

export default App;
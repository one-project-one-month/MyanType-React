import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserStatProvider } from './context/UserStatProvider.jsx';
import { TestProvider } from './context/TestContextProvider.jsx';
import { SettingsProvider } from './context/SettingProvider.jsx';
import './App.css';
import { Toaster } from 'sonner';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import HomePage from './pages/Home.jsx';
import TypingResults from './pages/TypingResults.jsx';
import TypingTestUI from './pages/TypingTestUI.jsx';
import Profile from '@/pages/Profile.jsx';
import About from './pages/About.jsx';
import Leaderboard from '@/pages/Leaderboard.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthProvider.jsx';
import { TypingTestProvider } from './context/TypingTestContext.jsx';
import { DataProvider } from './context/DataProvider.jsx';
import NotFound from './pages/NotFound.jsx';

const queryClient = new QueryClient();

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
                    <section className="mx-auto max-w-7xl my-2">
                      <Toaster
                        position="top-center"
                        closeButton
                        richColors
                        duration={3000}
                        expand={true}
                      />
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/sign-up" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/results" element={<TypingResults />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/test" element={<TypingTestUI />} />
                        <Route path="/words" element={<TypingTestUI />} />
                        <Route path="/time" element={<TypingTestUI />} />
                        <Route path="/quote" element={<TypingTestUI />} />
                        <Route path="/custom" element={<TypingTestUI />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<NotFound />} />
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
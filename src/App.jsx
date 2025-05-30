import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserStatProvider } from './context/UserStatProvider.jsx';
import { TestProvider } from './context/TestContextProvider.jsx';
import { SettingsProvider } from './context/SettingProvider.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx'; 
import './App.css';
import { Toaster } from 'sonner';
import RootLayout from './layout/RootLayout';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import HomePage from './pages/Home.jsx';
import TypingResults from './pages/TypingResults.jsx';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <UserStatProvider>
          <TestProvider>
            <ThemeProvider> {/* Add ThemeProvider here */}
              <Router>
                <Routes>
                  <Route path="/" element={<RootLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="sign-up" element={<Register />} />
                    <Route path="login" element={<Login />} />
                    <Route path="results" element={<TypingResults />} />
                  </Route>
                </Routes>
                <Toaster richColors position="bottom-center" />
              </Router>
            </ThemeProvider>
          </TestProvider>
        </UserStatProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserStatProvider } from './context/UserStatProvider.jsx';
import { TestProvider } from './context/TestContextProvider.jsx';
import { SettingsProvider } from './context/SettingProvider.jsx';
import Compete from './pages/Compete';
import "./App.css";
import { Toaster } from 'sonner';
import RootLayout from "./layout/RootLayout";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Challenge from './pages/Challenge';
import TypingResults from './pages/TypingResults.jsx';
import TestModeSelector from './pages/TestModeSelector.jsx';
function App() {
  return (
    <SettingsProvider>
      <UserStatProvider>
        <TestProvider>
          <Router>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route path="sign-up" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="compete" element={<Compete />} />
                <Route path="/challenge" element={<Challenge />} />
                <Route path="/results" element={<TypingResults />} />
                <Route path="/test" element={<TestModeSelector />} />
              </Route>
            </Routes>
            <Toaster richColors position="bottom-center" />
          </Router>
        </TestProvider>
      </UserStatProvider>
    </SettingsProvider>
  );
}

export default App;

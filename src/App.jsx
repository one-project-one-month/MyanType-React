import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserStatProvider } from './context/UserStatProvider.jsx';
import { TestProvider } from './context/TestContextProvider.jsx';
import { SettingsProvider } from './context/SettingProvider.jsx';
import Compete from './pages/Compete';
import "./App.css"
import { Toaster } from 'sonner';
function App() {
  return (
    <SettingsProvider>
      <UserStatProvider>
        <TestProvider>
          <Router>
            <Routes>
              <Route path="/Compete" element={<Compete />} />
            </Routes>
            <Toaster richColors position="bottom-center" />
          </Router>
        </TestProvider>
      </UserStatProvider>
    </SettingsProvider>
  );
}

export default App;
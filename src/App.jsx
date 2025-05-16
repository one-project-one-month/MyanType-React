import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserStatProvider } from './context/UserStatProvider';
import { TestProvider } from './context/TestContextProvider';
import { SettingsProvider } from './context/SettingsProvider';


function App() {
  return (
    <SettingsProvider>
      <UserStatProvider>
        <TestProvider>
          <Router>
            <Routes>
              {/* <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leader-board" element={<Leader-board />} />
              <Route path="/Compete" element={<Compete />} /> */}
            </Routes>
          </Router>
        </TestProvider>
      </UserStatProvider>
    </SettingsProvider>
  );
}

export default App;
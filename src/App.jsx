import { Route, BrowserRouter as Router, Routes } from "react-router";
import "./App.css";
import { SettingsProvider } from "./context/SettingProvider.jsx";
import { TestProvider } from "./context/TestContextProvider.jsx";
import { UserStatProvider } from "./context/UserStatProvider.jsx";
import RootLayout from "./layout/RootLayout";
import Compete from "./pages/Compete";
import HomePage from "./pages/Home";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

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
                <Route index element={<HomePage />} />
                <Route path="compete" element={<Compete />} />
              </Route>
            </Routes>
          </Router>
        </TestProvider>
      </UserStatProvider>
    </SettingsProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserHomePage from './pages/UserHomePage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserHomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
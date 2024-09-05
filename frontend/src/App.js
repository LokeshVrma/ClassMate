import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ForgotPassword from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PingBackend from './pages/PingBackend';

import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:userId' element={<ResetPasswordPage />} />
          <Route path='/login' element={<LoginPage />} />
          {/* Protect the routes that require authentication */}
          <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path='/pingbackend' element={<ProtectedRoute><PingBackend /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

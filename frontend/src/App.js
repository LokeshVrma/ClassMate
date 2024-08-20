import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PingBackend from './pages/PingBackend';
import './assets/styles/Auth.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/pingbackend' element={<PingBackend />} />
      </Routes>
    </Router>
  );
}

export default App;

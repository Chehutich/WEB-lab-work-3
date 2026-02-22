import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Register from './pages/Register';
import Participants from './pages/Participants';
import './styles/main.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="register/:eventId" element={<Register />} />
        <Route path="participants/:eventId" element={<Participants />} />
      </Route>
    </Routes>
  );
}

export default App;

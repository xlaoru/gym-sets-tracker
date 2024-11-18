import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProgramFormPage from './pages/ProgramFormPage';
import ProgramListPage from './pages/ProgramListPage';

import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProgramListPage />} />
        <Route path="/add" element={<ProgramFormPage />} />
      </Routes>
    </Router>
  )
}

export default App;

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProgramFormPage from './pages/ProgramFormPage';
import ProgramListPage from './pages/ProgramListPage';

import './styles/App.css';
import Header from "./components/Header";
import PreEditPage from "./pages/PreEditPage";

function App() {
  const [hasPreEditInfo, setPreEditInfo] = useState(false);

  useEffect(() => {
    const storedProgram = localStorage.getItem('program');
    if (storedProgram) {
      const parsedProgram = JSON.parse(storedProgram);
      if (parsedProgram.dayName && parsedProgram.dayName !== "") {
        setPreEditInfo(true);
      }
    }
  }, []);

  return (
    <Router>
      <Header hasPreEditInfo={hasPreEditInfo} setPreEditInfo={setPreEditInfo} />
      <Routes>
        <Route path="/" element={<ProgramListPage />} />
        <Route path="/add" element={<ProgramFormPage setPreEditInfo={setPreEditInfo} />} />
        <Route path="/pre-edit" element={<PreEditPage />} />
      </Routes>
    </Router>
  )
}

export default App;

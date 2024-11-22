import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProgramFormPage from './pages/ProgramFormPage';
import ProgramListPage from './pages/ProgramListPage';

import './styles/App.css';
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProgramListPage />} />
        <Route path="/add" element={<ProgramFormPage />} />
      </Routes>
    </Router>
  )
}

export default App;

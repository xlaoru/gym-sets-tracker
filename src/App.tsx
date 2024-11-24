import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProgramFormPage from './pages/ProgramFormPage';
import ProgramListPage from './pages/ProgramListPage';

import './styles/App.css';
import Header from "./components/Header";
import PreEditPage from "./pages/PreEditPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProgramListPage />} />
        <Route path="/add" element={<ProgramFormPage />} />
        <Route path="/pre-edit" element={<PreEditPage />} />
      </Routes>
    </Router>
  )
}

export default App;

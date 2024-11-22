import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate()
    return (
        <header className="header">
            <h1 className="header-title" onClick={() => navigate("/")}>GYM TRACKER</h1>
            <button className="header-button" onClick={() => navigate("/add")}>+</button>
        </header>
    );
}

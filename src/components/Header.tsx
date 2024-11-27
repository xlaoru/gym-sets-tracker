import { Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IHeaderProps {
    hasPreEditInfo: boolean
}

export default function Header({ hasPreEditInfo }: IHeaderProps) {
    const navigate = useNavigate()
    return (
        <header className="header">
            <h1 className="header-title" onClick={() => navigate("/")}>GYM TRACKER</h1>
            <div style={{ display: "flex", gap: "4px" }}>
                {hasPreEditInfo && <button className="header-button icon-button" onClick={() => navigate("/pre-edit")}><Pencil color="white" /></button>}
                <button className="header-button icon-button" onClick={() => navigate("/add")}><Plus color="white" /></button>
            </div>
        </header>
    );
}

import { useState, useEffect } from "react";
import ProgramTable from "../components/ProgramTable";

import { getPrograms } from "../services";

import { Program } from "../utils/models";

export default function ProgramListPage() {

    const [programs, setPrograms] = useState<Program[] | []>([]);

    useEffect(() => {
        getPrograms().then((response) => {
            setPrograms(response.data);
        });
    }, []);

    return (
        <>
            {programs && programs.map((program, index) => (
                <div className="container" key={index}>
                    <ProgramTable program={program} />
                    <hr className="separator" />
                </div>
            ))}
        </>
    )
}

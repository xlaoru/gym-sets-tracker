import { useState, useEffect } from "react";
import ProgramTable from "../components/ProgramTable";

import axios from "axios";

import { Program } from "../utils/models";

export default function ProgramListPage() {

    const [programs, setPrograms] = useState<Program[] | []>([]);

    useEffect(() => {
        axios.get("http://localhost:3001/api")
            .then(response => {
                setPrograms(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, []);

    return (
        <>
            {programs && programs.map((program, index) => <div key={index}><ProgramTable program={program} /></div>)}
        </>
    )
}

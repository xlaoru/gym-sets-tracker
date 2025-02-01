import { useState, useEffect } from "react";
import ProgramTable from "../components/ProgramTable";

import { getPrograms } from "../services";

import { Program } from "../utils/models";
import Loader from "../components/Loader";

export default function ProgramListPage() {
    const [programs, setPrograms] = useState<Program[] | []>([]);
    const [hasLoaded, setLoaded] = useState(false)

    useEffect(() => {
        getPrograms().then((response) => {
            setPrograms(response.data);
            setLoaded(true)
        });
    }, []);

    return (
        <>
            {(programs && hasLoaded)
                ? programs.map((program, index) => (
                    <div className="container" key={index}>
                        <ProgramTable program={program} />
                        <hr className="separator" />
                    </div>
                ))
                : <Loader />
            }
        </>
    )
}

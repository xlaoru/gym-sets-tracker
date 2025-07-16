import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getPrograms, selectPrograms } from "../store/ProgramSlice";
import { AppDispatch } from "../store";

import ProgramTable from "../components/ProgramTable";

import Loader from "../components/Loader";

export default function ProgramListPage() {
    const [hasLoaded, setLoaded] = useState(false)

    const programs = useSelector(selectPrograms)
    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        dispatch(getPrograms()).then(() => {
            setLoaded(true)
        })
    }, [dispatch])

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

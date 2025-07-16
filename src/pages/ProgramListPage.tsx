import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getPrograms, selectPrograms, selectPage } from "../store/ProgramSlice";
import { AppDispatch } from "../store";

import ProgramTable from "../components/ProgramTable";
import PaginationFooter from "../components/PaginationFooter";
import Loader from "../components/Loader";

export default function ProgramListPage() {
    const [hasLoaded, setLoaded] = useState(false);
    const page = useSelector(selectPage);

    const programs = useSelector(selectPrograms);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(getPrograms({ page, limit: 10 })).then(() => {
            setLoaded(true);
        });
    }, [dispatch, page]);

    return (
        <>
            {programs && hasLoaded ? (
                <div>
                    {programs.map((program, index) => (
                        <div className="container" key={index}>
                            <ProgramTable program={program} />
                            <hr className="separator" />
                        </div>
                    ))}
                    <div className="container">
                        <PaginationFooter />
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </>
    );
}

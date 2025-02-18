import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Program, ProgramState } from "../utils/models";
import ExerciseSetInputs from "../components/ExerciseSetInputs";

import Loader from "../components/Loader";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { editProgram } from "../store/ProgramSlice";

export default function ProgramEditModePage() {
    const navigate = useNavigate();

    const dispatch: AppDispatch = useDispatch()

    const location = useLocation();
    const program = location.state.program;

    useEffect(() => {
        localStorage.setItem("program", JSON.stringify(program))
    }, [program])

    const [dayName, setDayName] = useState(program.dayName);
    const [exerciseList, setExerciseList] = useState<ProgramState[]>(program.exercises);

    const [isLoading, setLoading] = useState(false)

    function handleDayNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDayName(event.target.value)

        const parsedProgram = JSON.parse(localStorage.getItem("program") || "{}")

        const program: Program = {
            ...parsedProgram,
            dayName: event.target.value
        }

        localStorage.setItem("program", JSON.stringify(program))
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true)

        const updatedProgram = {
            _id: program._id,
            dayName: dayName,
            exercises: exerciseList,
            date: new Date()
        }

        dispatch(editProgram(updatedProgram)).then(() => {
            localStorage.setItem("program", JSON.stringify({ dayName: "", exercises: [], date: "" }))
            setDayName("")
            setExerciseList([])
            setLoading(false)
            navigate("/")
        })
    }

    return (
        <div className="container-absolute-center">
            {
                isLoading
                    ? <Loader />
                    : <form className="form" onSubmit={handleSubmit}>
                        <input
                            style={{ border: "2.5px solid #ffde21", fontSize: "20px" }}
                            value={dayName}
                            onChange={handleDayNameChange}
                        />
                        <ExerciseSetInputs exerciseList={exerciseList} setExerciseList={setExerciseList} />
                    </form>
            }
        </div>
    );
}

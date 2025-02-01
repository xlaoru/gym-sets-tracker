import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IExercise, Program } from "../utils/models";
import { editProgram } from "../services";
import ExerciseSetInputs from "../components/ExerciseSetInputs";

export default function ProgramEditModePage() {
    const navigate = useNavigate();

    const location = useLocation();
    const program = location.state.program;

    useEffect(() => {
        localStorage.setItem("program", JSON.stringify(program))
    }, [program])

    const [dayName, setDayName] = useState(program.dayName);
    const [exerciseList, setExerciseList] = useState<IExercise[]>(program.exercises);

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

        const updatedProgram = {
            dayName: dayName,
            exercises: exerciseList,
            date: new Date()
        }

        editProgram(updatedProgram, program._id).then(() => {
            localStorage.setItem("program", JSON.stringify({ dayName: "", exercises: [], date: "" }))
            setDayName("")
            setExerciseList([])
            navigate("/")
        })
    }

    return (
        <div className="container-absolute-center">
            <form className="form" onSubmit={handleSubmit}>
                <input
                    style={{ border: "2.5px solid #ffde21", fontSize: "20px" }}
                    value={dayName}
                    onChange={handleDayNameChange}
                />
                <ExerciseSetInputs exerciseList={exerciseList} setExerciseList={setExerciseList} />
            </form>
        </div>
    );
}

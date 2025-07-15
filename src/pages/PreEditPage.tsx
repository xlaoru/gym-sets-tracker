import { useState } from "react";
import { IPreEditPageProps, Program, ProgramState } from "../utils/models";

import ExerciseSetInputs from "../components/ExerciseSetInputs";
import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { createProgram } from "../store/ProgramSlice";

export default function PreEditPage({ setPreEditInfo }: IPreEditPageProps) {
    const navigate = useNavigate()

    const dispatch: AppDispatch = useDispatch()

    const program = localStorage.getItem("program") ?? ""

    const programDayName = JSON.parse(program)?.dayName
    const programExerciseList = JSON.parse(program)?.exercises

    const [dayName, setDayName] = useState<string>(programDayName)
    const [exerciseList, setExerciseList] = useState<ProgramState[]>(programExerciseList)

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
        event?.preventDefault()

        setLoading(true)
        setPreEditInfo(false)

        const program: Program = {
            ...JSON.parse(localStorage.getItem("program") ?? ""),
            date: new Date()
        }

        dispatch(createProgram(program)).then(() => {
            localStorage.setItem("program", JSON.stringify({ dayName: "", exercises: [], date: "" }))
            setPreEditInfo(false)
            setDayName("")
            setExerciseList([])
            setLoading(false)
            navigate("/")
        }).catch((error) => {
            setLoading(false);
            setPreEditInfo(true)
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
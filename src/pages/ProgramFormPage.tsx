import { useEffect, useState } from "react";
import ExerciseNameInputs from "../components/ExerciseNameInputs";
import ExerciseSetInputs from "../components/ExerciseSetInputs";

import { IExercise, IProgramFormPageProps, Program } from "../utils/models";
import { createProgram } from "../services";
import { useNavigate } from "react-router-dom";

export default function ProgramFormPage({ setPreEditInfo }: IProgramFormPageProps) {
    const navigate = useNavigate()

    useEffect(() => {
        localStorage.setItem("program", JSON.stringify({ dayName: "", exercises: [], date: "" }))
        setPreEditInfo(false)
    }, [setPreEditInfo])

    const [exerciseList, setExerciseList] = useState<IExercise[]>([])
    const [isExerciseNameMode, setExerciseNameMode] = useState(true)
    const [dayName, setDayName] = useState("")

    function handleNextFormStep() {
        setExerciseNameMode(false)
    }

    function handleDayNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDayName(event.target.value)
        const parsedProgram = JSON.parse(localStorage.getItem("program") || "{}")
        const program: Program = {
            ...parsedProgram,
            dayName: event.target.value
        }
        localStorage.setItem("program", JSON.stringify(program))
        setPreEditInfo(true)
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault()
        const program: Program = {
            dayName,
            exercises: exerciseList,
            date: new Date()
        }
        createProgram(program).then(() => {
            localStorage.setItem("program", JSON.stringify({ dayName: "", exercises: [], date: "" }))
            setPreEditInfo(false)
            setExerciseList([])
            setExerciseNameMode(true)
            setDayName("")
            navigate("/")
        })
    }

    return (
        <div className="container-absolute-center">
            <form
                className="form"
                style={{ display: "flex", flexDirection: "column", textAlign: "center", }}
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    placeholder="Day Name"
                    list="program-types"
                    style={{ border: "2.5px solid #ffde21", fontSize: "20px" }}
                    value={dayName}
                    onChange={handleDayNameChange}
                />
                <datalist id="program-types">
                    <option value="Ноги + Біцепси">Ноги + Біцепси</option>
                    <option value="Груди (верх) + Плечі">Груди (верх) + Плечі</option>
                    <option value="Груди (середина) + Плечі">Груди (середина) + Плечі</option>
                    <option value="Груди (низ) + Плечі">Груди (низ) + Плечі</option>
                    <option value="Спина + Тріцепси">Спина + Тріцепси</option>
                </datalist>
                {
                    isExerciseNameMode
                        ? <ExerciseNameInputs setPreEditInfo={setPreEditInfo} exerciseList={exerciseList} setExerciseList={setExerciseList} handleNextFormStep={handleNextFormStep} />
                        : <ExerciseSetInputs setPreEditInfo={setPreEditInfo} exerciseList={exerciseList} setExerciseList={setExerciseList} />
                }
            </form>
        </div>
    );
}
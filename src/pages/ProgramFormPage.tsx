import { useRef, useState } from "react";
import ExerciseNameInputs from "../components/ExerciseNameInputs";
import ExerciseSetInputs from "../components/ExerciseSetInputs";

import { IExercise } from "../utils/models";

export default function ProgramFormPage() {
    const [exerciseList, setExerciseList] = useState<IExercise[]>([])
    const [isExerciseNameMode, setExerciseNameMode] = useState(true)

    const dayName = useRef<HTMLInputElement>(null)

    function handleNextFormStep() {
        setExerciseNameMode(false)
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault()
        console.log({
            dayName: dayName.current?.value,
            exerciseList,
            date: new Date()
        });
    }

    return (
        <div className="container-absolute-center">
            <form
                className="form"
                style={{ display: "flex", flexDirection: "column", textAlign: "center", width: "500px", margin: "auto", }}
                onSubmit={handleSubmit}
            >
                <input type="text" placeholder="Day Name" list="program-types" ref={dayName} style={{ border: "2.5px solid #ffde21", fontSize: "20px" }} />
                <datalist id="program-types">
                    <option value="Ноги + Біцепси">Ноги + Біцепси</option>
                    <option value="Груди (верх) + Плечі">Груди (верх) + Плечі</option>
                    <option value="Груди (середина) + Плечі">Груди (середина) + Плечі</option>
                    <option value="Груди (низ) + Плечі">Груди (низ) + Плечі</option>
                    <option value="Спина + Тріцепси">Спина + Тріцепси</option>
                </datalist>
                {
                    isExerciseNameMode
                        ? <ExerciseNameInputs exerciseList={exerciseList} setExerciseList={setExerciseList} handleNextFormStep={handleNextFormStep} />
                        : <ExerciseSetInputs exerciseList={exerciseList} setExerciseList={setExerciseList} />
                }
            </form>
        </div>
    );
}
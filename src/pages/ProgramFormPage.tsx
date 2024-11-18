import { useState } from "react";

import ProgramBaseInfoInputs from '../components/ProgramBaseInfoInputs';
import ProgramRepsInfoInputs from '../components/ProgramRepsInfoInputs';

import { Exercises, ExerciseSet } from '../utils/models';
import { createProgram } from "../services";

export default function ProgramFormPage() {
    const [isBaseInfoFilled, setBaseInfoFilled] = useState(false)
    const [exercises, setExercise] = useState<Exercises>({})

    const handleChange = (exerciseName: string, setIndex: number, field: keyof ExerciseSet, value: string) => {
        setExercise((prevExercises) => {
            const newExercises = { ...prevExercises };
            if (!newExercises[exerciseName]) {
                newExercises[exerciseName] = [];
            }
            if (!newExercises[exerciseName][setIndex]) {
                newExercises[exerciseName][setIndex] = { reps: 0, weight: 0 };
            }
            newExercises[exerciseName][setIndex][field] = Number(value);
            return newExercises;
        });
    };

    function handleSubmit(e: any) {
        createProgram({
            dayName: e.target.elements[0].value,
            exercises: exercises,
            date: new Date()
        })
    }

    return (
        <div className="container-absolute-center">
            <form className="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Day Name"
                    style={{ padding: "8px 8px" }}
                    list="program-types"
                />
                <datalist id="program-types">
                    <option value="Ноги + Біцепси">Ноги + Біцепси</option>
                    <option value="Груди + Плечі">Груди + Плечі</option>
                    <option value="Спина + Тріцепси">Спина + Тріцепси</option>
                </datalist>
                {
                    isBaseInfoFilled
                        ?
                        (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <ProgramRepsInfoInputs exercises={exercises} handleChange={handleChange} />
                            </div>
                        )
                        :
                        (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {
                                    Object.keys(exercises).map((exercise, index) => {
                                        return <input key={index} defaultValue={exercise} />
                                    })
                                }
                                <ProgramBaseInfoInputs exercises={exercises} setExercise={setExercise} />
                                <button type="button" onClick={() => { setBaseInfoFilled(!isBaseInfoFilled); localStorage.setItem("exercises", JSON.stringify(exercises)) }} style={{ backgroundColor: "#fff", color: "#1e1e1e" }}>Next</button>
                            </div>
                        )
                }
            </form>
        </div >
    );
}

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import ProgramRepsInfoInputs from "../components/ProgramRepsInfoInputs"
import { Exercises, Program, ExerciseSet } from "../utils/models";

import { createProgram } from "../services";

export default function PreEditPage() {
    const program: Program = JSON.parse(localStorage.getItem("exercises") as string);

    const [exercises, setExercises] = useState<Exercises>(program.exercises)

    const navigate = useNavigate()

    useEffect(() => {
        const preProgramInfo: Program = {
            dayName: program.dayName,
            exercises: exercises,
            date: new Date()
        }
        localStorage.setItem("exercises", JSON.stringify(preProgramInfo))
    })

    function handleChange(exerciseName: string, setIndex: number, field: keyof ExerciseSet, value: string) {
        setExercises((prevExercises) => {
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
        e.preventDefault();
        createProgram({
            dayName: program.dayName,
            exercises: exercises,
            date: new Date()
        }).then(() => {
            navigate("/")
            localStorage.removeItem("exercises")
        })
    }

    return (
        <div className="container-absolute-center">
            <form className="form" onSubmit={handleSubmit}>
                <h3>{program.dayName}</h3>
                <ProgramRepsInfoInputs exercises={program.exercises} handleChange={handleChange} />
            </form>
        </div>
    )
}

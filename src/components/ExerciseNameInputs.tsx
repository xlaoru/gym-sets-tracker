import React, { useRef, useEffect } from "react";

import { IExerciseNameInputsProps, IExercise } from "../utils/models";

export default function ExerciseNameInputs({ exerciseList, setExerciseList, handleNextFormStep, setPreEditInfo }: IExerciseNameInputsProps) {
    const newExerciseName = useRef<HTMLInputElement>(null)

    function addExercise(event: React.MouseEvent<HTMLButtonElement>) {
        event?.preventDefault()
        if (newExerciseName.current) {
            const newExercise: Omit<IExercise, "sets"> = {
                name: newExerciseName.current.value
            }
            setExerciseList([...exerciseList, { name: newExercise.name, sets: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }] }])
            newExerciseName.current.value = ""
        }
        setPreEditInfo(true)
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (index === i) {
                return { ...exercise, name: event.target.value }
            }
            return exercise
        })
        setExerciseList(updatedExerciseList)
        setPreEditInfo(true)
    }

    useEffect(() => {
        const parsedProgram = JSON.parse(localStorage.getItem("program") || "{}")
        const dayName = parsedProgram.dayName ? parsedProgram.dayName : ""
        const program = {
            dayName,
            exercises: exerciseList,
            date: new Date()
        }
        localStorage.setItem("program", JSON.stringify(program))
    }, [exerciseList])

    return (
        <>
            {exerciseList.map((exercise, index) => (
                <input
                    key={index}
                    type="text"
                    value={exercise.name}
                    onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)
                    }
                />
            ))}
            <input type="text" placeholder="Exercise Name" ref={newExerciseName} />
            <button onClick={addExercise} style={{ backgroundColor: "#fff", color: "#1e1e1e" }}>New Exercise</button>
            <button type="button" onClick={handleNextFormStep}>Next</button>
        </>
    )
}

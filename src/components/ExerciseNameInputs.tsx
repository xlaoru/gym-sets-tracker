import React, { useRef } from "react";

import { IExerciseNameInputsProps, IExercise } from "../utils/models";

export default function ExerciseNameInputs({ exerciseList, setExerciseList, handleNextFormStep }: IExerciseNameInputsProps) {
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
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (index === i) {
                return { ...exercise, name: event.target.value }
            }
            return exercise
        })
        setExerciseList(updatedExerciseList)
    }

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
            <button onClick={addExercise}>New Exercise</button>
            <button type="button" onClick={handleNextFormStep}>Next</button>
        </>
    )
}

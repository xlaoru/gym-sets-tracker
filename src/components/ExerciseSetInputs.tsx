import React from "react";

import { IExerciseSetInputsProps } from "../utils/models";

export default function ExerciseSetInputs({ exerciseList, setExerciseList }: IExerciseSetInputsProps) {
    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (index === i) {
                return { ...exercise, name: event.target.value }
            }
            return exercise
        })
        setExerciseList(updatedExerciseList)
    }

    function handleWeightOrRepChange(
        event: React.ChangeEvent<HTMLInputElement>,
        cellType: "weight" | "rep",
        setIndex: number,
        rowIndex: number
    ) {
        const updatedExerciseList = exerciseList.map((exercise, index) => {
            if (rowIndex === index) {
                if (cellType === "weight") {
                    return {
                        ...exercise,
                        sets:
                            exercise.sets.map((set, jndex) =>
                                setIndex === jndex ? {
                                    ...set, weight: Number(event.target.value)
                                } : set
                            )
                    }
                } else {
                    return {
                        ...exercise,
                        sets:
                            exercise.sets.map((set, jndex) =>
                                setIndex === jndex ? {
                                    ...set, reps: Number(event.target.value)
                                } : set
                            )
                    }
                }
            }
            return exercise
        })
        setExerciseList(updatedExerciseList)
    }

    return (
        <>
            {exerciseList.map((exercise, rowIndex) => (
                <div
                    key={rowIndex}
                    style={{ display: "flex", flexDirection: "column", margin: "10px 0" }}
                >
                    <input
                        style={{ border: "1.6px solid black", marginBottom: "5px" }}
                        value={exercise.name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleNameChange(event, rowIndex)}
                    />
                    {
                        exercise.sets.map((set, setIndex) => (
                            <div
                                key={setIndex}
                                style={{ display: "flex", justifyContent: "space-between", margin: "2.5px 0", gap: "2.5px" }}>
                                <input
                                    style={{ width: "50%" }}
                                    type="number"
                                    value={set.weight}
                                    onChange={(event) => handleWeightOrRepChange(event, "weight", setIndex, rowIndex)}
                                />
                                <input
                                    style={{ width: "50%" }}
                                    type="number"
                                    value={set.reps}
                                    onChange={(event) => handleWeightOrRepChange(event, "rep", setIndex, rowIndex)}
                                />
                            </div>
                        ))
                    }
                </div>
            ))}
            <button type="submit" style={{ width: "100%" }}>Submit</button>
        </>
    )
}

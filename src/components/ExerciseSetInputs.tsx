import React, { useEffect } from "react";

import { IExerciseSetInputsProps } from "../utils/models";
import { Program } from "../utils/models";

export default function ExerciseSetInputs({ exerciseList, setExerciseList, setPreEditInfo }: IExerciseSetInputsProps) {
    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (index === i) {
                return { ...exercise, name: event.target.value }
            }
            return exercise
        })
        setExerciseList(updatedExerciseList)
        setPreEditInfo(true)
    }

    function handleWeightOrRepChange(
        event: React.ChangeEvent<HTMLInputElement>,
        cellType: "weight" | "reps",
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
        setPreEditInfo(true)
    }

    useEffect(() => {
        const parsedProgram = JSON.parse(localStorage.getItem("program") || "{}")
        const dayName = parsedProgram.dayName ? parsedProgram.dayName : ""
        const program: Program = {
            dayName,
            exercises: exerciseList,
            date: new Date()
        }
        localStorage.setItem("program", JSON.stringify(program))
    }, [exerciseList])

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
                                    onChange={(event) => handleWeightOrRepChange(event, "reps", setIndex, rowIndex)}
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

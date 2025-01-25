import React, { useEffect } from "react";

import { IExerciseSetInputsProps } from "../utils/models";
import { Program } from "../utils/models";

import { ChevronDown, ChevronUp, Trash } from "lucide-react";

export default function ExerciseSetInputs({ exerciseList, setExerciseList, setPreEditInfo }: IExerciseSetInputsProps) {
    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (index === i) {
                return { ...exercise, name: event.target.value }
            }
            return exercise
        })
        setExerciseList(updatedExerciseList)

        const parsedProgram = JSON.parse(localStorage.getItem("program") || "{}")
        if (parsedProgram.dayName !== "") {
            setPreEditInfo(true)
        }
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

        const parsedProgram = JSON.parse(localStorage.getItem("program") || "{}")
        if (parsedProgram.dayName !== "") {
            setPreEditInfo(true)
        }
    }

    function removeExercise(index: number) {
        const updatedExerciseList = exerciseList.filter((exercise, i) => index !== i)
        setExerciseList(updatedExerciseList)

        const parsedProgram = JSON.parse(localStorage.getItem("program") || "{}")
        if (parsedProgram.dayName !== "") {
            setPreEditInfo(true)
        }
    }

    function moveExerciseUp(index: number) {
        if (index === 0) {
            return
        }
        const updatedExerciseList = [...exerciseList]
        const tempExercise = updatedExerciseList[index]
        updatedExerciseList[index] = updatedExerciseList[index - 1]
        updatedExerciseList[index - 1] = tempExercise
        setExerciseList(updatedExerciseList)

        const parsedProgram = JSON.parse(localStorage.getItem("program") || "{}")
        if (parsedProgram.dayName !== "") {
            setPreEditInfo(true)
        }
    }

    function moveExerciseDown(index: number) {
        if (index === (exerciseList.length - 1)) {
            return
        }
        const updatedExerciseList = [...exerciseList]
        const tempExercise = updatedExerciseList[index]
        updatedExerciseList[index] = updatedExerciseList[index + 1]
        updatedExerciseList[index + 1] = tempExercise
        setExerciseList(updatedExerciseList)

        const parsedProgram = JSON.parse(localStorage.getItem("program") || "{}")
        if (parsedProgram.dayName !== "") {
            setPreEditInfo(true)
        }
    }

    function renderChevrons(index: number) {
        if (exerciseList.length === 1) {
            return null
        }

        if (index === (exerciseList.length - 1)) {
            return (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "4px" }}>
                    <button onClick={() => moveExerciseUp(index)} type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none", color: "#1e1e1e", padding: 0 }} ><ChevronUp size="18px" /></button>
                </div>
            )
        } else if (index === 0) {
            return (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "4px" }}>
                    <button onClick={() => moveExerciseDown(index)} type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none", color: "#1e1e1e", padding: 0 }} ><ChevronDown size="18px" /></button>
                </div>
            )
        } else {
            return (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "4px" }}>
                    <button onClick={() => moveExerciseUp(index)} type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none", color: "#1e1e1e", padding: 0 }} ><ChevronUp size="18px" /></button>
                    <button onClick={() => moveExerciseDown(index)} type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none", color: "#1e1e1e", padding: 0 }} ><ChevronDown size="18px" /></button>
                </div>
            )
        }
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {renderChevrons(rowIndex)}
                        <input
                            style={{ border: "1.6px solid black" }}
                            value={exercise.name}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleNameChange(event, rowIndex)}
                        />
                        <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => removeExercise(rowIndex)}>
                            <Trash color="#da3633" />
                        </button>
                    </div>
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

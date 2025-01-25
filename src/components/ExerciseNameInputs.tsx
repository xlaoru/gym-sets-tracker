import React, { useRef, useEffect } from "react";

import { IExerciseNameInputsProps, IExercise } from "../utils/models";

import { ChevronDown, ChevronUp, X } from "lucide-react";

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

    function removeExercise(index: number) {
        const updatedExerciseList = exerciseList.filter((exercise, i) => index !== i)
        setExerciseList(updatedExerciseList)

        if (exerciseList.length === 1) {
            setPreEditInfo(false)
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

    function moveExerciseUp(index: number) {
        if (index === 0) {
            return
        }
        const updatedExerciseList = [...exerciseList]
        const tempExercise = updatedExerciseList[index]
        updatedExerciseList[index] = updatedExerciseList[index - 1]
        updatedExerciseList[index - 1] = tempExercise
        setExerciseList(updatedExerciseList)
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

    return (
        <>
            <div>
                {exerciseList.map((exercise, index) => (
                    <div
                        key={index}
                        style={{ display: "flex", margin: "5px 0", alignItems: "center" }}
                    >
                        {renderChevrons(index)}
                        <input
                            type="text"
                            value={exercise.name}
                            onChange={
                                (event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)
                            }
                            style={{ width: "100%", padding: "8px 8px" }}
                        />
                        <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => removeExercise(index)}>
                            <X color="#da3633" />
                        </button>
                    </div>
                ))}
            </div>
            <input type="text" placeholder="Exercise Name" ref={newExerciseName} />
            <button onClick={addExercise} style={{ backgroundColor: "#fff", color: "#1e1e1e" }}>New Exercise</button>
            <button type="button" onClick={handleNextFormStep}>Next</button>
        </>
    )
}

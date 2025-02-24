import React, { useState, useEffect, useRef } from "react";

import { v4 as uuidv4 } from 'uuid';

import { IExerciseSetInputsProps } from "../utils/models";
import { Program } from "../utils/models";

import { ChevronDown, ChevronUp, MinusCircle, Plus, PlusCircle, Trash } from "lucide-react";

export default function ExerciseSetInputs({ exerciseList, setExerciseList, setPreEditInfo }: IExerciseSetInputsProps) {
    const newExerciseRef = useRef<HTMLInputElement>(null)

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (index === i) {
                return { ...exercise, name: event.target.value }
            }
            return exercise
        })
        setExerciseList(updatedExerciseList)

        if (setPreEditInfo) {
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
            if ("sets" in exercise) {
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
            } else {
                return exercise
            }
        })
        setExerciseList(updatedExerciseList)

        if (setPreEditInfo) {
            setPreEditInfo(true)
        }
    }

    function removeExercise(index: number) {
        const updatedExerciseList = exerciseList.filter((exercise, i) => index !== i)
        setExerciseList(updatedExerciseList)

        setSetCount((prevSetCount) => {
            return prevSetCount.filter((_, i) => i !== index)
        });

        if (exerciseList.length === 1) {
            if (setPreEditInfo) {
                setPreEditInfo(true)
            }
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
        setSetCount((prevSetCount) => {
            const newSetCount = [...prevSetCount];
            const tempSetCount = newSetCount[index];

            const updatedSetCount = newSetCount.map((item, i) => {
                if (i === index) {
                    return newSetCount[index - 1]
                }
                if (i === index - 1) {
                    return tempSetCount
                }
                return item
            });
            return updatedSetCount;
        });
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
        setSetCount((prevSetCount) => {
            const newSetCount = [...prevSetCount];
            const tempSetCount = newSetCount[index];

            const updatedSetCount = newSetCount.map((item, i) => {
                if (i === index) {
                    return newSetCount[index + 1]
                }
                if (i === index + 1) {
                    return tempSetCount
                }
                return item
            });
            return updatedSetCount;
        });
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

    function handleNewExercise() {
        if (newExerciseRef.current) {
            const newExerciseName = newExerciseRef.current.value
            if (newExerciseName.trim() === "") {
                return
            }
            const updatedExerciseList = [...exerciseList, { _id: uuidv4(), name: newExerciseName, sets: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }], isSelected: false }]
            setExerciseList(updatedExerciseList)
            setSetCount((prevSetCount) => {
                return [...prevSetCount, { count: 1 }];
            });
            newExerciseRef.current.value = ""
        }
    }

    const [setCount, setSetCount] = useState(() => {
        const exercisesSetCount = exerciseList.map(() => {
            return { count: 1 }
        })

        return exercisesSetCount
    })

    function handleNewSetItem(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        setSetCount((prevSetCount) => {
            return prevSetCount.map((item, i) => {
                if (i === index) {
                    return { count: Number(event.target.value) };
                }
                return item;
            });
        });
    }

    function handleSetCounter(rowIndex: number, type: "increase" | "decrease") {
        const exercise = exerciseList[rowIndex];

        if ("exercises" in exercise) {
            return null;
        }

        const queryExerciseSet = exercise.sets;
        const currentSetCount = setCount[rowIndex].count

        if (type === "increase") {
            const newSets = Array(currentSetCount).fill(null).map(() => ({ weight: 0, reps: 0 }));

            setExerciseList((prevExerciseList) => {
                const updatedSets = [...queryExerciseSet, ...newSets];

                const updatedExerciseList = prevExerciseList.map((exercise, index) => {
                    if (index === rowIndex) {
                        return { ...exercise, sets: updatedSets };
                    }
                    return exercise;
                });

                return updatedExerciseList;
            });
        } else {
            if (currentSetCount >= queryExerciseSet.length) {
                return;
            } else {
                setExerciseList((prevExerciseList) => {
                    const updatedSets = queryExerciseSet.slice(0, queryExerciseSet.length - currentSetCount)

                    const updatedExerciseList = prevExerciseList.map((exercise, index) => {
                        if (index === rowIndex) {
                            return { ...exercise, sets: updatedSets };
                        }
                        return exercise;
                    });
                    return updatedExerciseList;
                });
            }
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
                    <div>
                        {
                            "sets" in exercise
                                ? exercise.sets.map((set, setIndex) => (
                                    <div
                                        key={setIndex}
                                        style={{ display: "flex", justifyContent: "space-between", margin: "2.5px 0", gap: "2.5px" }}>
                                        <label style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px", fontWeight: "bold", width: "50%", textAlign: "left" }}>
                                            weight (kg)
                                            <input
                                                type="text"
                                                value={set.weight}
                                                onChange={(event) => handleWeightOrRepChange(event, "weight", setIndex, rowIndex)}
                                                placeholder="weight (kg)"
                                            />
                                        </label>
                                        <label style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px", fontWeight: "bold", width: "50%", textAlign: "left" }}>
                                            reps
                                            <input
                                                type="text"
                                                value={set.reps}
                                                onChange={(event) => handleWeightOrRepChange(event, "reps", setIndex, rowIndex)}
                                                placeholder="reps"
                                            />
                                        </label>
                                    </div>
                                ))
                                : null
                        }
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px 0 0 0" }}>
                            <PlusCircle className="icon" color="#1e1e1e" onClick={() => handleSetCounter(rowIndex, "increase")} />
                            <input type="text" value={setCount[rowIndex].count} onChange={(event) => handleNewSetItem(event, rowIndex)} style={{ width: "15px", textAlign: "center", border: "1.6px solid #1e1e1e" }} />
                            <MinusCircle className="icon" color="#1e1e1e" onClick={() => handleSetCounter(rowIndex, "decrease")} />
                        </div>
                    </div>
                </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <input type="text" ref={newExerciseRef} style={{ border: "1.6px solid #1e1e1e" }} placeholder="New Exercise Name..." />
                <button
                    type="button"
                    className="icon-button"
                    style={{ backgroundColor: "transparent", border: "1px solid #1e1e1e", width: "100%", margin: "10px 0", display: "flex", justifyContent: "center" }}
                    onClick={handleNewExercise}
                >
                    <Plus size="24px" color="#1e1e1e" />
                </button>
            </div>
            <button type="submit" style={{ width: "100%" }}>Submit</button>
        </>
    )
}

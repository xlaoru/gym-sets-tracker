import React, { useState, useEffect, useRef } from "react";

import { v4 as uuidv4 } from 'uuid';

import { IExerciseSetInputsProps, ISuperset } from "../../utils/models";
import { Program } from "../../utils/models";

import ChevronsForExercise from "../Chevrons/ChevronsForExercise";
import ChevronsForSuperSet from "../Chevrons/ChevronsForSuperSet";

import { MinusCircle, Plus, PlusCircle, Trash } from "lucide-react";

export default function ExerciseSetInputs({ exerciseList, setExerciseList, setPreEditInfo }: IExerciseSetInputsProps) {
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

    function handleChangeSuperSetExerciseName(event: React.ChangeEvent<HTMLInputElement>, superSet: ISuperset, index: number) {
        const updatedSuperSetExerciseList = superSet.exercises.map((exercise, i) => {
            if (index === i) {
                return { ...exercise, name: event.target.value };
            }
            return exercise;
        });

        const updatedSuperSet = { ...superSet, exercises: updatedSuperSetExerciseList };

        const updatedExerciseList = exerciseList.map((exercise) => {
            if (exercise._id === superSet._id) {
                return updatedSuperSet;
            }
            return exercise;
        });

        setExerciseList(updatedExerciseList);
    }

    function removeExerciseFromSuperSet(superSet: ISuperset, index: number) {
        const updatedSuperSetExerciseList = superSet.exercises.filter((exercise, i) => index !== i);
        const updatedSuperSet = { ...superSet, exercises: updatedSuperSetExerciseList };

        const updatedExerciseList = exerciseList.map((exercise) => {
            if (exercise._id === superSet._id) {
                return updatedSuperSet;
            }
            return exercise;
        });

        setExerciseList(updatedExerciseList);
    }

    function handleSuperSetExerciseWeightOrRepChange(
        event: React.ChangeEvent<HTMLInputElement>,
        cellType: "weight" | "reps",
        superSet: ISuperset,
        setIndex: number,
        rowIndex: number
    ) {
        const updatedSuperSetExerciseList = superSet.exercises.map((exercise, i) => {
            if (rowIndex === i) {
                return {
                    ...exercise,
                    sets:
                        exercise.sets.map((set, jndex) =>
                            setIndex === jndex ? {
                                ...set, [cellType]: Number(event.target.value)
                            } : set
                        )
                }
            }
            return exercise
        })

        const updatedSuperSet = { ...superSet, exercises: updatedSuperSetExerciseList }

        const updatedExerciseList = exerciseList.map((exercise) => {
            if (exercise._id === superSet._id) {
                return updatedSuperSet
            }
            return exercise
        })

        setExerciseList(updatedExerciseList)
    }

    // TODO: Create counter for sub-exercises

    return (
        <>
            {exerciseList.map((exercise, rowIndex) => {
                if ("sets" in exercise) {
                    return (
                        <div key={rowIndex} style={{ padding: "10px", border: "2.5px solid #1e1e1e", borderRadius: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <ChevronsForExercise index={rowIndex} exerciseList={exerciseList} setExerciseList={setExerciseList} />
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
                                    exercise.sets.map((set, setIndex) => (
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
                                }
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px 0 0 0" }}>
                                    <PlusCircle className="icon" color="#1e1e1e" onClick={() => handleSetCounter(rowIndex, "increase")} />
                                    <input type="text" value={setCount[rowIndex].count} onChange={(event) => handleNewSetItem(event, rowIndex)} style={{ width: "15px", textAlign: "center", border: "1.6px solid #1e1e1e" }} />
                                    <MinusCircle className="icon" color="#1e1e1e" onClick={() => handleSetCounter(rowIndex, "decrease")} />
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={rowIndex} style={{ margin: "5px 0", padding: "5px", border: "2.5px solid #aaa", borderRadius: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <ChevronsForExercise index={rowIndex} exerciseList={exerciseList} setExerciseList={setExerciseList} />
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
                                {exercise.exercises.map((subExercise, subIndex) => (
                                    <div key={subIndex} style={{ margin: "10px", padding: "10px", border: "2.5px solid #1e1e1e", borderRadius: "4px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <ChevronsForSuperSet index={subIndex} exercise={exercise} exerciseList={exerciseList} setExerciseList={setExerciseList} />
                                            <input
                                                style={{ border: "1.6px solid black" }}
                                                value={subExercise.name}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeSuperSetExerciseName(event, exercise, subIndex)}
                                            />
                                            <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => removeExerciseFromSuperSet(exercise, subIndex)}>
                                                <Trash color="#da3633" />
                                            </button>
                                        </div>
                                        <div>
                                            {
                                                subExercise.sets.map((set, setIndex) => (
                                                    <div
                                                        key={setIndex}
                                                        style={{ display: "flex", justifyContent: "space-between", margin: "2.5px 0", gap: "2.5px" }}>
                                                        <label style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px", fontWeight: "bold", width: "50%", textAlign: "left" }}>
                                                            weight (kg)
                                                            <input
                                                                type="text"
                                                                value={set.weight}
                                                                onChange={(event) => handleSuperSetExerciseWeightOrRepChange(event, "weight", exercise, setIndex, subIndex)}
                                                                placeholder="weight (kg)"
                                                            />
                                                        </label>
                                                        <label style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px", fontWeight: "bold", width: "50%", textAlign: "left" }}>
                                                            reps
                                                            <input
                                                                type="text"
                                                                value={set.reps}
                                                                onChange={(event) => handleSuperSetExerciseWeightOrRepChange(event, "reps", exercise, setIndex, subIndex)}
                                                                placeholder="reps"
                                                            />
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px 0 0 0" }}>
                                                <PlusCircle className="icon" color="#1e1e1e" /* onClick={() => handleSetCounter(rowIndex, "increase")} */ />
                                                <input type="text" value={setCount[rowIndex].count} onChange={(event) => handleNewSetItem(event, rowIndex)} style={{ width: "15px", textAlign: "center", border: "1.6px solid #1e1e1e" }} />
                                                <MinusCircle className="icon" color="#1e1e1e" /* onClick={() => handleSetCounter(rowIndex, "decrease")} */ />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            })}
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
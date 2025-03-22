import React, { useState, useEffect, useRef } from "react";

import { v4 as uuidv4 } from 'uuid';

import { IExercise, IExerciseSetInputsProps, ISuperset, ProgramState } from "../../utils/models";
import { Program } from "../../utils/models";

import ChevronsForExercise from "../Chevrons/ChevronsForExercise";
import ChevronsForSuperSet from "../Chevrons/ChevronsForSuperSet";

import { MinusCircle, Pencil, Plus, PlusCircle, Trash } from "lucide-react";

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
    const newSuperSetName = useRef<HTMLInputElement>(null)

    const [mainExerciseList, setMainExerciseList] = useState<ProgramState[]>(exerciseList)

    const [isSuperSetMode, setSuperSetMode] = useState(false)
    const [isSuperSetEditMode, setSuperSetEditMode] = useState(false)

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
            const updatedExerciseList = [...exerciseList, { _id: uuidv4(), name: newExerciseName, sets: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }], isSelected: false, setQuantity: 1 }]
            setExerciseList(updatedExerciseList)

            newExerciseRef.current.value = ""
        }
    }

    function handleExerciseSetCountChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (index === i) {
                if ("sets" in exercise) {
                    const newSetQuantity = Number(event.target.value);
                    return { ...exercise, setQuantity: newSetQuantity };
                } else {
                    return exercise
                }
            }
            return exercise
        })

        setExerciseList(updatedExerciseList)
    }

    function handleExerciseSetCounter(rowIndex: number, type: "increase" | "decrease") {
        const updatedExerciseList = exerciseList.map((exercise, index) => {
            if (index === rowIndex) {
                if ("sets" in exercise) {
                    const updatedSetQuantity = exercise.setQuantity
                    if (type === "increase") {
                        const newSets = Array(updatedSetQuantity).fill(null).map(() => ({ weight: 0, reps: 0 }));
                        const updatedSets = [...exercise.sets, ...newSets];
                        return { ...exercise, sets: updatedSets };
                    } else {
                        const updatedSets = exercise.sets.slice(0, exercise.sets.length - updatedSetQuantity);

                        if (exercise.setQuantity >= exercise.sets.length) {
                            return exercise;
                        }

                        return { ...exercise, sets: updatedSets };
                    }
                } else {
                    return exercise
                }
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

    function handleSuperSetSetCountChange(event: React.ChangeEvent<HTMLInputElement>, rowIndex: number, subIndex: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (rowIndex === i) {
                if ("exercises" in exercise) {
                    const updatedSuperSetExerciseList = exercise.exercises.map((subExercise, j) => {
                        if (subIndex === j) {
                            const newSetQuantity = Number(event.target.value);
                            return { ...subExercise, setQuantity: newSetQuantity };
                        }
                        return subExercise;
                    });

                    return { ...exercise, exercises: updatedSuperSetExerciseList };
                } else {
                    return exercise
                }
            }
            return exercise
        })

        setExerciseList(updatedExerciseList)
    }

    function handleSuperSetSetCounter(rowIndex: number, subIndex: number, type: "increase" | "decrease") {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (i === rowIndex) {
                if ("exercises" in exercise) {
                    const updatedSuperSetExerciseList = exercise.exercises.map((subExercise, j) => {
                        if (j === subIndex) {
                            const updatedSetQuantity = subExercise.setQuantity;
                            if (type === "increase") {
                                const newSets = Array(updatedSetQuantity).fill(null).map(() => ({ weight: 0, reps: 0 }));
                                const updatedSets = [...subExercise.sets, ...newSets];
                                return { ...subExercise, sets: updatedSets };
                            } else {
                                const updatedSets = subExercise.sets.slice(0, subExercise.sets.length - updatedSetQuantity);

                                if (subExercise.setQuantity >= subExercise.sets.length) {
                                    return subExercise;
                                }

                                return { ...subExercise, sets: updatedSets };
                            }
                        }
                        return subExercise;
                    });

                    return { ...exercise, exercises: updatedSuperSetExerciseList };
                } else {
                    return exercise
                }
            }
            return exercise;
        });
        setExerciseList(updatedExerciseList);
    }

    function toggleExerciseSelectionForNewSuperSet(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if ("sets" in exercise && index === i) {
                return { ...exercise, isSelected: event.target.checked }
            }
            return exercise
        })

        setExerciseList(updatedExerciseList)
    }

    function addSuperSet() {
        const selectedExercises: IExercise[] = exerciseList.filter((exercise): exercise is IExercise => "sets" in exercise && exercise.isSelected);

        if (selectedExercises.length < 2) {
            return
        }

        const updatedSelectedExercises = selectedExercises.map((exercise) => ({
            ...exercise,
            isSelected: false
        }));

        setExerciseList((prevValue) => {
            const newSuperSet: ISuperset = {
                _id: uuidv4(),
                name: newSuperSetName.current?.value || "New Super Set",
                exercises: updatedSelectedExercises
            };

            const updatedExerciseList = prevValue.filter(
                (exercise) => !selectedExercises.includes(exercise as IExercise)
            );

            return [...updatedExerciseList, newSuperSet];
        });

        setSuperSetMode(false);
    }

    function cancelSuperSetAddingMode() {
        setSuperSetMode(false)
        const updatedExerciseList = exerciseList.map((exercise) => {
            if ("sets" in exercise) {
                return { ...exercise, isSelected: false }
            }
            return exercise
        })
        setExerciseList(updatedExerciseList)
    }

    function startSuperSetEditMode(index: number) {
        setSuperSetEditMode(true);

        setMainExerciseList(exerciseList);

        const currentExerciseList = exerciseList.filter((exercise, i) => {
            if ("sets" in exercise) {
                return exercise
            }

            if (index === i) {
                return exercise.exercises.map((exercise) => {
                    return exercise.isSelected = true
                })
            }

            return false
        })

        setExerciseList(currentExerciseList)
    }

    function toggleExerciseSelectionForEditingSuperSet(event: React.ChangeEvent<HTMLInputElement>, isSubIndex: boolean, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (isSubIndex && "exercises" in exercise) {
                exercise.exercises[index].isSelected = event.target.checked;
            } else if (!isSubIndex && "sets" in exercise && index === i) {
                exercise.isSelected = event.target.checked;
            }

            return exercise;
        });

        setExerciseList(updatedExerciseList);
    }

    function editSuperSet() {
        const selectedSuperSet = exerciseList.filter((exercise): exercise is ISuperset => "exercises" in exercise)[0]

        const selectedExercises = exerciseList.filter((exercise): exercise is IExercise => "sets" in exercise && exercise.isSelected)
        const deselectedExercises = selectedSuperSet.exercises.filter((exercise) => !exercise.isSelected);

        const updatedSelectedSuperSet = {
            ...selectedSuperSet,
            exercises: [...selectedSuperSet.exercises.filter((exercise) => exercise.isSelected), ...selectedExercises]
        }

        if (updatedSelectedSuperSet.exercises.length === 1) {
            return
        }

        const updatedMainExerciseList = mainExerciseList
            .filter((exercise) => {
                if ("sets" in exercise) {
                    return !exercise.isSelected;
                }
                return true;
            })
            .map((exercise) => {
                if ("exercises" in exercise && exercise._id === updatedSelectedSuperSet._id) {
                    return updatedSelectedSuperSet;
                }
                return exercise;
            })
            .filter((exercise) => {
                if ("exercises" in exercise) {
                    return exercise.exercises.length > 0;
                }
                return true;
            })

        setExerciseList([...updatedMainExerciseList, ...deselectedExercises]);
        setExerciseList((prevValue) => {
            return prevValue.map((exercise) => {
                if ("sets" in exercise) {
                    return { ...exercise, isSelected: false };
                } else {
                    return {
                        ...exercise,
                        exercises: exercise.exercises.map((subExercise) => ({
                            ...subExercise,
                            isSelected: false
                        }))
                    };
                }
            }
            );
        })

        setSuperSetEditMode(false);
    }

    function cancelSuperSetEditMode() {
        setSuperSetEditMode(false);
        setExerciseList(mainExerciseList)
        setExerciseList((prevValue) => {
            return prevValue.map((exercise) => {
                if ("sets" in exercise) {
                    return { ...exercise, isSelected: false };
                } else {
                    return {
                        ...exercise,
                        exercises: exercise.exercises.map((subExercise) => ({
                            ...subExercise,
                            isSelected: false
                        }))
                    };
                }
            }
            );
        })
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

    function renderProgramDisplay() {
        if (isSuperSetMode) {
            return exerciseList.map((exercise, index) => {
                if ("sets" in exercise) {
                    return <div key={index}><input type="checkbox" onChange={(event) => toggleExerciseSelectionForNewSuperSet(event, index)} />{exercise.name}</div>
                } else {
                    return null
                }
            })
        }

        if (isSuperSetEditMode) {
            return exerciseList.map((exercise, index) => {
                if ("sets" in exercise) {
                    return <div key={index}><input type="checkbox" onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleExerciseSelectionForEditingSuperSet(event, false, index)} /> {exercise.name}</div>
                } else {
                    return exercise.exercises.map((subExercise, subIndex) => {
                        return <div key={subIndex}><input type="checkbox" checked={subExercise.isSelected} onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleExerciseSelectionForEditingSuperSet(event, true, subIndex)} />{subExercise.name}</div>
                    })
                }
            })
        }

        return exerciseList.map((exercise, rowIndex) => {
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
                                <PlusCircle className="icon" color="#1e1e1e" onClick={() => handleExerciseSetCounter(rowIndex, "increase")} />
                                <input type="text" value={exercise.setQuantity} onChange={(event) => handleExerciseSetCountChange(event, rowIndex)} style={{ width: "15px", textAlign: "center", border: "1.6px solid #1e1e1e" }} />
                                <MinusCircle className="icon" color="#1e1e1e" onClick={() => handleExerciseSetCounter(rowIndex, "decrease")} />
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
                            <div style={{ display: "flex" }}>
                                <button className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} type="button" onClick={() => startSuperSetEditMode(rowIndex)}><Pencil color="#1e1e1e" /></button>
                                <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => removeExercise(rowIndex)}><Trash color="#da3633" /></button>
                            </div>
                        </div>
                        <div>
                            {exercise.exercises.map((subExercise, subIndex) => {
                                return (
                                    <div key={subIndex} style={{ margin: "10px", padding: "10px", border: "2.5px solid #1e1e1e", borderRadius: "4px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <ChevronsForSuperSet index={subIndex} exercise={exercise} exerciseList={exerciseList} setExerciseList={setExerciseList} />
                                            <input
                                                style={{ border: "1.6px solid black" }}
                                                value={subExercise.name}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeSuperSetExerciseName(event, exercise, subIndex)}
                                            />
                                            <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => removeExerciseFromSuperSet(exercise, subIndex)}><Trash color="#da3633" /></button>
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
                                                <PlusCircle className="icon" color="#1e1e1e" onClick={() => handleSuperSetSetCounter(rowIndex, subIndex, "increase")} />
                                                <input type="text" value={subExercise.setQuantity} onChange={(event) => handleSuperSetSetCountChange(event, rowIndex, subIndex)} style={{ width: "15px", textAlign: "center", border: "1.6px solid #1e1e1e" }} />
                                                <MinusCircle className="icon" color="#1e1e1e" onClick={() => handleSuperSetSetCounter(rowIndex, subIndex, "decrease")} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            }
        })
    }

    return (
        <>
            {isSuperSetMode && <input placeholder="Super Set Name..." ref={newSuperSetName} defaultValue="New Super Set" />}
            {renderProgramDisplay()}
            {
                isSuperSetMode &&
                (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <button type="button" style={{ color: "#1e1e1e", backgroundColor: "#f8f6f6", border: "1px solid #aaa" }} onClick={addSuperSet}>Submit New Super Set</button>
                        <button type="button" style={{ backgroundColor: "#da3633", border: "1px solid #b62324" }} onClick={cancelSuperSetAddingMode}>Cancel</button>
                    </div>
                )
            }
            {
                isSuperSetEditMode &&
                (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <button type="button" style={{ color: "#1e1e1e", backgroundColor: "#f8f6f6", border: "1px solid #aaa" }} onClick={editSuperSet}>Edit Super Set</button>
                        <button type="button" style={{ backgroundColor: "#da3633", border: "1px solid #b62324" }} onClick={cancelSuperSetEditMode}>Cancel</button>
                    </div>
                )
            }
            {
                !(isSuperSetMode || isSuperSetEditMode) &&
                (
                    <div>
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
                            {
                                !isSuperSetMode && <button type="button"
                                    style={{ backgroundColor: "#fff", color: "#1e1e1e", marginBottom: "10px" }}
                                    onClick={() => setSuperSetMode(true)}
                                >Create Super Set</button>
                            }
                        </div>
                        <button type="submit" style={{ width: "100%" }}>Submit</button>
                    </div>
                )
            }

        </>
    )
}
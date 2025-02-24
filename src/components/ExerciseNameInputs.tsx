import React, { useRef, useEffect, useState } from "react";

import { IExerciseNameInputsProps, IExercise, ISuperset, ProgramState } from "../utils/models";

import { ChevronDown, ChevronUp, Pencil, X } from "lucide-react";

export default function ExerciseNameInputs({ exerciseList, setExerciseList, handleNextFormStep, setPreEditInfo }: IExerciseNameInputsProps) {
    const [isSuperSetMode, setSuperSetMode] = useState(false)
    const [isSuperSetEditMode, setSuperSetEditMode] = useState(false)

    const [mainExerciseList, setMainExerciseList] = useState<ProgramState[]>([])

    const newExerciseName = useRef<HTMLInputElement>(null)
    const newSuperSetName = useRef<HTMLInputElement>(null)
    const superSetEditedName = useRef<HTMLInputElement>(null)

    function addExercise(event: React.MouseEvent<HTMLButtonElement>) {
        event?.preventDefault()
        if (newExerciseName.current) {
            const newExercise: Pick<IExercise, "name"> = {
                name: newExerciseName.current.value
            }
            setExerciseList([...exerciseList, { name: newExercise.name, sets: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }], isSelected: false }])
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

    function startSuperSetMode() {
        setSuperSetMode(true)
    }

    function handleChangeSuperSet(event: React.ChangeEvent<HTMLInputElement>, index: number) {
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

        const updatedSelectedExercises = selectedExercises.map((exercise) => ({
            ...exercise,
            isSelected: false
        }));

        setExerciseList((prevValue) => {
            const newSuperSet: ISuperset = {
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

    function handleChangeSuperSetEditing(event: React.ChangeEvent<HTMLInputElement>, isSubIndex: boolean, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if ("sets" in exercise) {
                if (!isSubIndex && index === i) {
                    exercise.isSelected = event.target.checked;
                    return exercise;
                }
            }

            if ("exercises" in exercise) {
                if (isSubIndex) {
                    exercise.exercises[index].isSelected = event.target.checked;
                    return exercise;
                }
            }

            return exercise;
        });

        setExerciseList(updatedExerciseList);
    }

    function editSuperSet() {
        setSuperSetEditMode(false);

        const selectedSuperSet = exerciseList.filter((exercise): exercise is ISuperset => "exercises" in exercise)[0]

        const selectedExercises = exerciseList.filter((exercise): exercise is IExercise => "sets" in exercise && exercise.isSelected)
        const deselectedExercises = selectedSuperSet.exercises.filter((exercise) => !exercise.isSelected);

        const updatedSelectedSuperSet = {
            ...selectedSuperSet,
            exercises: [...selectedSuperSet.exercises.filter((exercise) => exercise.isSelected), ...selectedExercises]
        }

        const updatedMainExerciseList = mainExerciseList
            .filter((exercise) => {
                if ("sets" in exercise) {
                    return !exercise.isSelected;
                }

                return true;
            })
            .map((exercise) => {
                if ("exercises" in exercise && exercise.name === updatedSelectedSuperSet.name) {
                    return updatedSelectedSuperSet;
                }
                return exercise;
            });

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

    return (
        <>
            <div>
                {isSuperSetMode && <input placeholder="Super Set Name..." ref={newSuperSetName} />}
                {exerciseList.map((exercise, index) => (
                    "sets" in exercise
                        ? <div
                            key={index}
                            style={{ display: "flex", margin: "5px 0", alignItems: "center" }}
                        >
                            {isSuperSetMode && <input type="checkbox" checked={exercise.isSelected} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeSuperSet(event, index)} />}
                            {isSuperSetEditMode && <input type="checkbox" checked={exercise.isSelected} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeSuperSetEditing(event, false, index)} />}
                            {!isSuperSetMode && renderChevrons(index)}
                            <input
                                type="text"
                                value={exercise.name}
                                onChange={
                                    (event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)
                                }
                                disabled={isSuperSetMode || isSuperSetEditMode}
                                style={{ width: "100%", padding: "8px 8px" }}
                            />
                            {!isSuperSetMode && <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => removeExercise(index)}>
                                <X color="#da3633" />
                            </button>}
                        </div>
                        : !isSuperSetMode &&
                        <div key={index}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "5px", backgroundColor: "#f7f7f7", borderRadius: "4px", padding: "8px" }}>
                                {!isSuperSetMode && renderChevrons(index)}
                                <div>
                                    <input style={{ textAlign: "center" }} disabled={true} value={exercise.name} />
                                    <div>
                                        {exercise.exercises.map((subExercise, subIndex) => {
                                            return (
                                                <div key={subIndex} style={{ display: "flex", justifyContent: "center" }}>
                                                    {isSuperSetEditMode && <input type="checkbox" checked={subExercise.isSelected} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeSuperSetEditing(event, true, subIndex)} />}
                                                    {isSuperSetMode && <input type="checkbox" checked={subExercise.isSelected} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeSuperSet(event, index)} />}
                                                    <p style={{ margin: "4px 0 0 0" }}>{subExercise.name}</p>
                                                </div>
                                            )
                                        })}
                                    </div></div>
                                {!isSuperSetEditMode && <button className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} type="button" onClick={() => startSuperSetEditMode(index)}><Pencil color="#1e1e1e" /></button>}
                            </div>
                        </div>
                ))}
            </div>
            {(!isSuperSetMode && !isSuperSetEditMode) &&
                (
                    <div style={{ display: "flex", gap: "2.5px" }}>
                        <input type="text" placeholder="Exercise Name" ref={newExerciseName} />
                        <button type="button" onClick={addExercise} style={{ backgroundColor: "#fff", color: "#1e1e1e" }}>New Exercise</button>
                    </div>
                )
            }
            {
                exerciseList.length >= 2 && isSuperSetMode
                    ? <button type="button" onClick={addSuperSet}>Submit New Super Set</button>
                    : !isSuperSetEditMode && <button type="button" style={{ color: "#1e1e1e", backgroundColor: "#f8f6f6", border: "1px solid #aaa" }} onClick={startSuperSetMode}>Add New Super Set</button>
            }

            {isSuperSetMode && <button type="button" style={{ backgroundColor: "#da3633", border: "1px solid #b62324" }} onClick={cancelSuperSetAddingMode}>Cancel</button>}

            {isSuperSetEditMode && <button type="button" style={{ color: "#1e1e1e", backgroundColor: "#f8f6f6", border: "1px solid #aaa" }} onClick={editSuperSet}>Edit</button>}
            {isSuperSetEditMode && <button type="button" style={{ backgroundColor: "#da3633", border: "1px solid #b62324" }} onClick={cancelSuperSetEditMode}>Cancel</button>}
            {!(isSuperSetMode || isSuperSetEditMode) && <button type="button" onClick={handleNextFormStep}>Next</button>}
        </>
    )
}

import React, { useRef, useEffect, useState } from "react";

import { v4 as uuidv4 } from 'uuid';

import { IExerciseNameInputsProps, IExercise, ISuperset, ProgramState } from "../../utils/models";

import ExerciseItem from "./ExerciseItem";
import SuperSetItem from "./SuperSetItem";

export default function ExerciseNameInputs({ exerciseList, setExerciseList, handleNextFormStep, setPreEditInfo }: IExerciseNameInputsProps) {
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

    const [isSuperSetMode, setSuperSetMode] = useState(false)
    const [isSuperSetEditMode, setSuperSetEditMode] = useState(false)

    const [mainExerciseList, setMainExerciseList] = useState<ProgramState[]>(exerciseList)

    const newExerciseName = useRef<HTMLInputElement>(null)
    const newSuperSetName = useRef<HTMLInputElement>(null)

    function addExercise(event: React.MouseEvent<HTMLButtonElement>) {
        event?.preventDefault()
        if (newExerciseName.current) {
            const newExercise: Pick<IExercise, "_id" | "name"> = {
                _id: uuidv4(),
                name: newExerciseName.current.value
            }
            setExerciseList([...exerciseList, { _id: newExercise._id, name: newExercise.name, sets: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }], isSelected: false }])
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

    function handleChangeExerciseName(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (index === i) {
                return { ...exercise, name: event.target.value }
            }
            return exercise
        })

        setExerciseList(updatedExerciseList)

        setPreEditInfo(true)
    }

    function startSuperSetMode() {
        setSuperSetMode(true)
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

    return (
        <>
            <div>
                {isSuperSetMode && <input placeholder="Super Set Name..." ref={newSuperSetName} defaultValue="New Super Set" />}
                {exerciseList.map((exercise, index) => (
                    "sets" in exercise
                        ? <ExerciseItem
                            index={index}
                            exercise={exercise}
                            isSuperSetMode={isSuperSetMode}
                            isSuperSetEditMode={isSuperSetEditMode}
                            exerciseList={exerciseList}
                            setExerciseList={setExerciseList}
                            handleChangeExerciseName={handleChangeExerciseName}
                            toggleExerciseSelectionForNewSuperSet={toggleExerciseSelectionForNewSuperSet}
                            toggleExerciseSelectionForEditingSuperSet={toggleExerciseSelectionForEditingSuperSet}
                            removeExercise={removeExercise}
                        />
                        : <SuperSetItem
                            index={index}
                            exercise={exercise}
                            isSuperSetMode={isSuperSetMode}
                            isSuperSetEditMode={isSuperSetEditMode}
                            exerciseList={exerciseList}
                            setExerciseList={setExerciseList}
                            handleChangeExerciseName={handleChangeExerciseName}
                            toggleExerciseSelectionForNewSuperSet={toggleExerciseSelectionForNewSuperSet}
                            toggleExerciseSelectionForEditingSuperSet={toggleExerciseSelectionForEditingSuperSet}
                            removeExercise={removeExercise}
                            startSuperSetEditMode={startSuperSetEditMode}
                            handleChangeSuperSetExerciseName={handleChangeSuperSetExerciseName}
                            removeExerciseFromSuperSet={removeExerciseFromSuperSet}
                        />
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
                    ? <button type="button" style={{ color: "#1e1e1e", backgroundColor: "#f8f6f6", border: "1px solid #aaa" }} onClick={addSuperSet}>Submit New Super Set</button>
                    : !isSuperSetEditMode && <button type="button" style={{ color: "#1e1e1e", backgroundColor: "#f8f6f6", border: "1px solid #aaa" }} onClick={startSuperSetMode}>Add New Super Set</button>
            }

            {isSuperSetMode && <button type="button" style={{ backgroundColor: "#da3633", border: "1px solid #b62324" }} onClick={cancelSuperSetAddingMode}>Cancel</button>}

            {isSuperSetEditMode && <button type="button" style={{ color: "#1e1e1e", backgroundColor: "#f8f6f6", border: "1px solid #aaa" }} onClick={editSuperSet}>Edit</button>}
            {isSuperSetEditMode && <button type="button" style={{ backgroundColor: "#da3633", border: "1px solid #b62324" }} onClick={cancelSuperSetEditMode}>Cancel</button>}
            {!(isSuperSetMode || isSuperSetEditMode) && <button type="button" onClick={handleNextFormStep}>Next</button>}
        </>
    )
}

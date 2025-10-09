import React, { useState, useEffect, useRef } from "react";

import { IExercise, IExerciseSetInputsProps, ISuperset } from "../utils/models";
import { Program } from "../utils/models";

import { MinusCircle, Pencil, PlusCircle, Trash } from "lucide-react";
import MovementChevrons from "./MovementChevrons";

export default function ExerciseSetInputs({
    program,
    setProgram,
    setPreEditInfo,
}: IExerciseSetInputsProps) {
    const [isSupersetMode, setSupersetMode] = useState(false);
    const [isSupersetEditMode, setSupersetEditMode] = useState(false);

    const [mainProgram, setMainProgram] = useState(program);

    const [exerciseName, setExerciseName] = useState<string>("");
    const [supersetName, setSupersetName] = useState<string>("");

    useEffect(() => {
        const parsedProgram = JSON.parse(
            localStorage.getItem("program") || "{}"
        );
        const dayName = parsedProgram.dayName ? parsedProgram.dayName : "";
        const myProgram: Program = {
            dayName,
            exercises: program,
            date: new Date(),
        };
        localStorage.setItem("program", JSON.stringify(myProgram));
    }, [program]);

    /* <-- Exercise Handlers --> */

    function addNewExercise() {
        const newExercise = {
            id: crypto.randomUUID(),
            name: exerciseName,
            sets: [
                { weight: 0, reps: 0 },
                { weight: 0, reps: 0 },
                { weight: 0, reps: 0 },
            ],
            checked: false,
        };

        setProgram([...program, newExercise]);
        setExerciseName("");
    }

    function editExerciseName(id: string, text: string) {
        setProgram((prevExercises) =>
            prevExercises.map((prevExercise) =>
                prevExercise.id === id
                    ? {
                          ...prevExercise,
                          name: text,
                      }
                    : prevExercise
            )
        );
    }

    function removeExercise(id: string) {
        setProgram((prevExercises) =>
            prevExercises.filter((prevExercise) => prevExercise.id !== id)
        );
    }

    function editExerciseWeight(id: string, index: number, weights: number) {
        setProgram((prevExercises) =>
            prevExercises.map((prevExercise) =>
                prevExercise.id === id && "sets" in prevExercise
                    ? {
                          ...prevExercise,
                          sets: prevExercise.sets.map((set, setIndex) =>
                              setIndex === index
                                  ? { ...set, weight: weights }
                                  : set
                          ),
                      }
                    : prevExercise
            )
        );
    }

    function editExerciseRep(id: string, index: number, reps: number) {
        setProgram((prevExercises) =>
            prevExercises.map((prevExercise) =>
                prevExercise.id === id && "sets" in prevExercise
                    ? {
                          ...prevExercise,
                          sets: prevExercise.sets.map((set, setIndex) =>
                              setIndex === index ? { ...set, reps: reps } : set
                          ),
                      }
                    : prevExercise
            )
        );
    }

    function incrementSetCount(id: string) {
        setProgram((prevExercises) =>
            prevExercises.map((prevExercise) =>
                prevExercise.id === id && "sets" in prevExercise
                    ? {
                          ...prevExercise,
                          sets: [...prevExercise.sets, { weight: 0, reps: 0 }],
                      }
                    : prevExercise
            )
        );
    }

    function decrementSetCount(id: string) {
        setProgram((prevExercises) =>
            prevExercises.map((prevExercise) =>
                prevExercise.id === id && "sets" in prevExercise
                    ? {
                          ...prevExercise,
                          sets:
                              prevExercise.sets.length === 1
                                  ? prevExercise.sets
                                  : prevExercise.sets.slice(0, -1),
                      }
                    : prevExercise
            )
        );
    }

    /* <-- Superset Handlers -->*/

    function checkExercise(id: string) {
        setProgram((prevProgram) =>
            prevProgram.map((exercise) => {
                if ("sets" in exercise) {
                    return exercise.id === id
                        ? { ...exercise, checked: !exercise.checked }
                        : exercise;
                }

                return {
                    ...exercise,
                    exercises: exercise.exercises.map((sub) =>
                        sub.id === id ? { ...sub, checked: !sub.checked } : sub
                    ),
                };
            })
        );
    }

    function startSupersetMode(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        setSupersetMode(true);

        setSupersetName("");
        setMainProgram(program);
        setProgram((prevExercises) =>
            prevExercises.map((exercise) =>
                "sets" in exercise
                    ? { ...exercise, checked: false }
                    : {
                          ...exercise,
                          exercises: exercise.exercises.map((subExercise) => ({
                              ...subExercise,
                              checked: false,
                          })),
                      }
            )
        );
    }

    function cancelSupersetMode(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        setSupersetMode(false);

        setSupersetName("");
        setProgram(mainProgram);
        setProgram((prevExercises) =>
            prevExercises.map((exercise) =>
                "sets" in exercise
                    ? { ...exercise, checked: false }
                    : {
                          ...exercise,
                          exercises: exercise.exercises.map((subExercise) => ({
                              ...subExercise,
                              checked: false,
                          })),
                      }
            )
        );
    }

    function submitNewSuperset(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        const checkedExerciseIds: string[] = [];

        for (const exercise of program) {
            if ("sets" in exercise && exercise.checked) {
                checkedExerciseIds.push(exercise.id);
            }
        }

        if (checkedExerciseIds.length < 2) {
            return;
        }

        const newSuperset: ISuperset = {
            id: crypto.randomUUID(),
            name: supersetName,
            exercises: [...program].filter(
                (exercise) =>
                    "sets" in exercise &&
                    checkedExerciseIds.includes(exercise.id)
            ) as IExercise[],
        };

        setProgram((prevExercises) => [
            ...prevExercises.filter(
                (exercise) =>
                    !(
                        "sets" in exercise &&
                        checkedExerciseIds.includes(exercise.id)
                    )
            ),
            newSuperset,
        ]);

        setSupersetMode(false);

        setProgram((prevExercises) =>
            prevExercises.map((exercise) =>
                "sets" in exercise
                    ? { ...exercise, checked: false }
                    : {
                          ...exercise,
                          exercises: exercise.exercises.map((subExercise) => ({
                              ...subExercise,
                              checked: false,
                          })),
                      }
            )
        );
    }

    function editSuperset(id: string) {
        setSupersetEditMode(true);

        setMainProgram(program);

        setProgram((prevProgram) =>
            [...prevProgram]
                .filter((exercise) => "sets" in exercise || exercise.id === id)
                .map((exercise) =>
                    "sets" in exercise
                        ? exercise
                        : {
                              ...exercise,
                              exercises: exercise.exercises.map(
                                  (subExercise) => ({
                                      ...subExercise,
                                      checked: true,
                                  })
                              ),
                          }
                )
        );
    }

    function cancelSupersetEditMode(
        event: React.MouseEvent<HTMLButtonElement>
    ) {
        event.preventDefault();

        setSupersetEditMode(false);

        setProgram(mainProgram);

        setProgram((prevExercises) =>
            prevExercises.map((exercise) =>
                "sets" in exercise
                    ? { ...exercise, checked: false }
                    : {
                          ...exercise,
                          exercises: exercise.exercises.map((subExercise) => ({
                              ...subExercise,
                              checked: false,
                          })),
                      }
            )
        );
    }

    function submitSupersetEditing() {
        const selectedSuperset = program.filter(
            (exercise): exercise is ISuperset => "exercises" in exercise
        )[0];

        const checkedExercises = program.filter(
            (exercise): exercise is IExercise =>
                "sets" in exercise && exercise.checked
        );

        const uncheckedExercises = selectedSuperset.exercises.filter(
            (exercise) => !exercise.checked
        );

        const updatedCurrentSuperset: ISuperset = {
            ...selectedSuperset,
            exercises: [
                ...selectedSuperset.exercises.filter(
                    (exercise) => exercise.checked
                ),
                ...checkedExercises,
            ],
        };

        if (updatedCurrentSuperset.exercises.length === 1) {
            return;
        }

        const transferredIds = checkedExercises.map((exercise) => exercise.id);

        const updatedMainProgram = mainProgram
            .filter((exercise) => !transferredIds.includes(exercise.id))
            .map((exercise) => {
                if (
                    "exercises" in exercise &&
                    exercise.id === updatedCurrentSuperset.id
                ) {
                    return updatedCurrentSuperset;
                }
                return exercise;
            })
            .filter((exercise) => {
                if ("exercises" in exercise) {
                    return exercise.exercises.length > 0;
                }
                return true;
            });

        setProgram([...updatedMainProgram, ...uncheckedExercises]);

        setSupersetEditMode(false);

        setProgram((prevExercises) =>
            prevExercises.map((exercise) =>
                "sets" in exercise
                    ? { ...exercise, checked: false }
                    : {
                          ...exercise,
                          exercises: exercise.exercises.map((subExercise) => ({
                              ...subExercise,
                              checked: false,
                          })),
                      }
            )
        );
    }

    function editSubExerciseName(id: string, text: string) {
        setProgram((prevExercises) =>
            prevExercises.map((exercise) => {
                if ("exercises" in exercise) {
                    return {
                        ...exercise,
                        exercises: exercise.exercises.map((subExercise) => {
                            if (subExercise.id === id) {
                                return { ...subExercise, name: text };
                            }

                            return subExercise;
                        }),
                    };
                }

                return exercise;
            })
        );
    }

    function removeSubExercise(id: string) {
        setProgram((prevExercises) =>
            prevExercises.map((exercise) => {
                if ("exercises" in exercise) {
                    return {
                        ...exercise,
                        exercises: exercise.exercises.filter((subExercise) => {
                            return subExercise.id !== id;
                        }),
                    };
                }

                return exercise;
            })
        );
    }

    function editSubExerciseWeight(id: string, index: number, weights: number) {
        setProgram((prevExercises) =>
            prevExercises.map((exercise) => {
                if ("exercises" in exercise) {
                    return {
                        ...exercise,
                        exercises: exercise.exercises.map((subExercises) => {
                            if (subExercises.id === id) {
                                return {
                                    ...subExercises,
                                    sets: subExercises.sets.map(
                                        (set, setIndex) => {
                                            if (setIndex === index) {
                                                return {
                                                    ...set,
                                                    weight: weights,
                                                };
                                            }

                                            return set;
                                        }
                                    ),
                                };
                            }

                            return subExercises;
                        }),
                    };
                }

                return exercise;
            })
        );
    }

    function editSubExerciseRep(id: string, index: number, reps: number) {
        setProgram((prevExercises) =>
            prevExercises.map((exercise) => {
                if ("exercises" in exercise) {
                    return {
                        ...exercise,
                        exercises: exercise.exercises.map((subExercises) => {
                            if (subExercises.id === id) {
                                return {
                                    ...subExercises,
                                    sets: subExercises.sets.map(
                                        (set, setIndex) => {
                                            if (setIndex === index) {
                                                return {
                                                    ...set,
                                                    reps: reps,
                                                };
                                            }

                                            return set;
                                        }
                                    ),
                                };
                            }

                            return subExercises;
                        }),
                    };
                }

                return exercise;
            })
        );
    }

    function incrementSubExerciseSetCount(id: string, subId: string) {
        setProgram((prevExercises) =>
            prevExercises.map((exercise) => {
                if ("exercises" in exercise) {
                    if (exercise.id === id) {
                        return {
                            ...exercise,
                            exercises: exercise.exercises.map((subExercise) => {
                                if (subExercise.id === subId) {
                                    return {
                                        ...subExercise,
                                        sets: [
                                            ...subExercise.sets,
                                            { weight: 0, reps: 0 },
                                        ],
                                    };
                                }

                                return subExercise;
                            }),
                        };
                    }

                    return exercise;
                }

                return exercise;
            })
        );
    }

    function decrementSubExerciseSetCount(id: string, subId: string) {
        setProgram((prevExercises) =>
            prevExercises.map((exercise) => {
                if ("exercises" in exercise) {
                    if (exercise.id === id) {
                        return {
                            ...exercise,
                            exercises: exercise.exercises.map((subExercise) => {
                                if (subExercise.id === subId) {
                                    return {
                                        ...subExercise,
                                        sets:
                                            subExercise.sets.length === 1
                                                ? subExercise.sets
                                                : subExercise.sets.slice(0, -1),
                                    };
                                }

                                return subExercise;
                            }),
                        };
                    }

                    return exercise;
                }

                return exercise;
            })
        );
    }

    /* <-- Data Displaying --> */

    function renderTable() {
        if (isSupersetMode) {
            return (
                <div>
                    <input
                        value={supersetName}
                        onChange={(event) =>
                            setSupersetName(event.target.value)
                        }
                    />
                    {program.map(
                        (exercise, index) =>
                            "sets" in exercise && (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            border: "1px solid #1e1e1e",
                                            width: "95%",
                                            textAlign: "left",
                                            padding: "5px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        {"sets" in exercise && (
                                            <div>
                                                <div>{exercise.name}</div>
                                                <input
                                                    type="checkbox"
                                                    style={{ width: "5%" }}
                                                    onChange={() =>
                                                        checkExercise(
                                                            exercise.id
                                                        )
                                                    }
                                                    checked={exercise.checked}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                    )}
                    <button
                        type="button"
                        style={{
                            color: "#fff",
                            border: "1px solid #1e1e1e",
                            width: "100%",
                            margin: "10px 0",
                            display: "flex",
                            justifyContent: "center",
                        }}
                        onClick={submitNewSuperset}
                    >
                        Create New Superset
                    </button>
                    <button
                        type="button"
                        style={{
                            backgroundColor: "transparent",
                            color: "#1e1e1e",
                            border: "1px solid #1e1e1e",
                            width: "100%",
                            margin: "10px 0",
                            display: "flex",
                            justifyContent: "center",
                        }}
                        onClick={cancelSupersetMode}
                    >
                        Cancel New Superset
                    </button>
                </div>
            );
        } else if (isSupersetEditMode) {
            return (
                <div>
                    <div>
                        {program.map((exercise, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                }}
                            >
                                <div
                                    style={{
                                        border: "1px solid #1e1e1e",
                                        width: "95%",
                                        textAlign: "left",
                                        padding: "5px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {"sets" in exercise ? (
                                        <div>
                                            <div>{exercise.name}</div>
                                            <input
                                                type="checkbox"
                                                style={{ width: "5%" }}
                                                onChange={() =>
                                                    checkExercise(exercise.id)
                                                }
                                                checked={exercise.checked}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <div>{exercise.name}</div>
                                            {exercise.exercises.map(
                                                (subExercise) => (
                                                    <div>
                                                        <div>
                                                            {subExercise.name}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            style={{
                                                                width: "5%",
                                                            }}
                                                            onChange={() =>
                                                                checkExercise(
                                                                    subExercise.id
                                                                )
                                                            }
                                                            checked={
                                                                subExercise.checked
                                                            }
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        style={{
                            backgroundColor: "#1e1e1e",
                            color: "#fff",
                            border: "1px solid #1e1e1e",
                            width: "100%",
                            margin: "10px 0",
                            display: "flex",
                            justifyContent: "center",
                        }}
                        onClick={submitSupersetEditing}
                    >
                        Submit Editing
                    </button>
                    <button
                        type="button"
                        style={{
                            backgroundColor: "transparent",
                            color: "#1e1e1e",
                            border: "1px solid #1e1e1e",
                            width: "100%",
                            margin: "10px 0",
                            display: "flex",
                            justifyContent: "center",
                        }}
                        onClick={cancelSupersetEditMode}
                    >
                        Cancel Editing
                    </button>
                </div>
            );
        } else {
            return (
                <div>
                    {program.map((exercise, rowIndex) => (
                        <div key={rowIndex}>
                            {"sets" in exercise ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        margin: "5px 0",
                                        padding: "10px",
                                        border: "2.5px solid #1e1e1e",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <MovementChevrons
                                            id={exercise.id}
                                            list={program}
                                            setList={setProgram}
                                        />
                                        <input
                                            style={{
                                                border: "1.6px solid black",
                                            }}
                                            value={exercise.name}
                                            onChange={(event) =>
                                                editExerciseName(
                                                    exercise.id,
                                                    event.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="icon-button"
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "none",
                                            }}
                                            onClick={() =>
                                                removeExercise(exercise.id)
                                            }
                                        >
                                            <Trash color="#da3633" />
                                        </button>
                                    </div>
                                    <div>
                                        {exercise.sets.map((set, setIndex) => (
                                            <div
                                                key={setIndex}
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    margin: "2.5px 0",
                                                    gap: "2.5px",
                                                }}
                                            >
                                                <label
                                                    style={{
                                                        fontSize: "12px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "4px",
                                                        fontWeight: "bold",
                                                        width: "50%",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    weight (kg)
                                                    <input
                                                        type="text"
                                                        value={set.weight}
                                                        placeholder="weight (kg)"
                                                        onChange={(event) => {
                                                            editExerciseWeight(
                                                                exercise.id,
                                                                setIndex,
                                                                Number(
                                                                    event.target
                                                                        .value
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </label>
                                                <label
                                                    style={{
                                                        fontSize: "12px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "4px",
                                                        fontWeight: "bold",
                                                        width: "50%",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    reps
                                                    <input
                                                        type="text"
                                                        value={set.reps}
                                                        placeholder="reps"
                                                        onChange={(event) => {
                                                            editExerciseRep(
                                                                exercise.id,
                                                                setIndex,
                                                                Number(
                                                                    event.target
                                                                        .value
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        ))}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "12px 0 0 0",
                                            }}
                                        >
                                            <PlusCircle
                                                className="icon"
                                                color="#1e1e1e"
                                                onClick={() =>
                                                    incrementSetCount(
                                                        exercise.id
                                                    )
                                                }
                                            />
                                            <input
                                                type="text"
                                                disabled={true}
                                                value={exercise.sets.length}
                                                style={{
                                                    width: "15px",
                                                    textAlign: "center",
                                                    border: "1.6px solid #1e1e1e",
                                                }}
                                            />
                                            <MinusCircle
                                                className="icon"
                                                color="#1e1e1e"
                                                onClick={() =>
                                                    decrementSetCount(
                                                        exercise.id
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={rowIndex}
                                    style={{
                                        margin: "5px 0",
                                        padding: "5px",
                                        border: "2.5px solid #aaa",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <MovementChevrons
                                            id={exercise.id}
                                            list={program}
                                            setList={setProgram}
                                        />
                                        <input
                                            style={{
                                                border: "1.6px solid black",
                                            }}
                                            value={exercise.name}
                                        />
                                        <div style={{ display: "flex" }}>
                                            <button
                                                type="button"
                                                className="icon-button"
                                                style={{
                                                    backgroundColor:
                                                        "transparent",
                                                    border: "none",
                                                }}
                                                onClick={() =>
                                                    editSuperset(exercise.id)
                                                }
                                            >
                                                <Pencil color="#ffcc00" />
                                            </button>
                                            <button
                                                type="button"
                                                className="icon-button"
                                                style={{
                                                    backgroundColor:
                                                        "transparent",
                                                    border: "none",
                                                }}
                                                onClick={() =>
                                                    removeExercise(exercise.id)
                                                }
                                            >
                                                <Trash color="#da3633" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        {exercise.exercises.map(
                                            (subExercise, subIndex) => (
                                                <div
                                                    key={subIndex}
                                                    style={{
                                                        margin: "10px",
                                                        padding: "10px",
                                                        border: "2.5px solid #1e1e1e",
                                                        borderRadius: "4px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <input
                                                            style={{
                                                                border: "1.6px solid black",
                                                            }}
                                                            value={
                                                                subExercise.name
                                                            }
                                                            onChange={(event) =>
                                                                editSubExerciseName(
                                                                    subExercise.id,
                                                                    event.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            className="icon-button"
                                                            style={{
                                                                backgroundColor:
                                                                    "transparent",
                                                                border: "none",
                                                            }}
                                                            onClick={() =>
                                                                removeSubExercise(
                                                                    subExercise.id
                                                                )
                                                            }
                                                        >
                                                            <Trash color="#da3633" />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        {subExercise.sets.map(
                                                            (set, setIndex) => (
                                                                <div
                                                                    key={
                                                                        setIndex
                                                                    }
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        justifyContent:
                                                                            "space-between",
                                                                        margin: "2.5px 0",
                                                                        gap: "2.5px",
                                                                    }}
                                                                >
                                                                    <label
                                                                        style={{
                                                                            fontSize:
                                                                                "12px",
                                                                            display:
                                                                                "flex",
                                                                            flexDirection:
                                                                                "column",
                                                                            gap: "4px",
                                                                            fontWeight:
                                                                                "bold",
                                                                            width: "50%",
                                                                            textAlign:
                                                                                "left",
                                                                        }}
                                                                    >
                                                                        weight
                                                                        (kg)
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                set.weight
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                editSubExerciseWeight(
                                                                                    subExercise.id,
                                                                                    setIndex,
                                                                                    Number(
                                                                                        event
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                )
                                                                            }
                                                                            placeholder="weight (kg)"
                                                                        />
                                                                    </label>
                                                                    <label
                                                                        style={{
                                                                            fontSize:
                                                                                "12px",
                                                                            display:
                                                                                "flex",
                                                                            flexDirection:
                                                                                "column",
                                                                            gap: "4px",
                                                                            fontWeight:
                                                                                "bold",
                                                                            width: "50%",
                                                                            textAlign:
                                                                                "left",
                                                                        }}
                                                                    >
                                                                        reps
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                set.reps
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                editSubExerciseRep(
                                                                                    subExercise.id,
                                                                                    setIndex,
                                                                                    Number(
                                                                                        event
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                )
                                                                            }
                                                                            placeholder="reps"
                                                                        />
                                                                    </label>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                            gap: "8px",
                                                            padding:
                                                                "12px 0 0 0",
                                                        }}
                                                    >
                                                        <PlusCircle
                                                            className="icon"
                                                            color="#1e1e1e"
                                                            onClick={() =>
                                                                incrementSubExerciseSetCount(
                                                                    exercise.id,
                                                                    subExercise.id
                                                                )
                                                            }
                                                        />
                                                        <input
                                                            type="text"
                                                            disabled={true}
                                                            value={
                                                                subExercise.sets
                                                                    .length
                                                            }
                                                            style={{
                                                                width: "15px",
                                                                textAlign:
                                                                    "center",
                                                                border: "1.6px solid #1e1e1e",
                                                            }}
                                                        />
                                                        <MinusCircle
                                                            className="icon"
                                                            color="#1e1e1e"
                                                            onClick={() =>
                                                                decrementSubExerciseSetCount(
                                                                    exercise.id,
                                                                    subExercise.id
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <input
                            type="text"
                            style={{ border: "1.6px solid #1e1e1e" }}
                            placeholder="New Exercise Name..."
                            value={exerciseName}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => setExerciseName(event.target.value)}
                        />
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                type="button"
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#1e1e1e",
                                    border: "1px solid #1e1e1e",
                                    width: "100%",
                                    margin: "10px 0",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                                onClick={addNewExercise}
                            >
                                New Exercise
                            </button>
                            <button
                                type="button"
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#1e1e1e",
                                    border: "1px solid #1e1e1e",
                                    width: "100%",
                                    margin: "10px 0",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                                onClick={startSupersetMode}
                            >
                                New Superset
                            </button>
                        </div>
                    </div>
                    <button type="submit" style={{ width: "100%" }}>
                        Submit
                    </button>
                </div>
            );
        }
    }

    return <>{renderTable()}</>;
}

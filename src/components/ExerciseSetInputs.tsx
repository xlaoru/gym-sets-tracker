import React, { useState, useEffect, useRef } from "react";

import { IExerciseSetInputsProps } from "../utils/models";
import { Program } from "../utils/models";

import {
    ChevronDown,
    ChevronUp,
    MinusCircle,
    Plus,
    PlusCircle,
    Trash,
} from "lucide-react";
import MovementChevrons from "./MovementChevrons";

export default function ExerciseSetInputs({
    exerciseList,
    setExerciseList,
    setPreEditInfo,
}: IExerciseSetInputsProps) {
    const [exerciseName, setExerciseName] = useState<string>("");

    useEffect(() => {
        const parsedProgram = JSON.parse(
            localStorage.getItem("program") || "{}"
        );
        const dayName = parsedProgram.dayName ? parsedProgram.dayName : "";
        const program: Program = {
            dayName,
            exercises: exerciseList,
            date: new Date(),
        };
        localStorage.setItem("program", JSON.stringify(program));
    }, [exerciseList]);

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
        };

        setExerciseList([...exerciseList, newExercise]);
        setExerciseName("");
    }

    function editExerciseName(id: string, text: string) {
        setExerciseList((prevExercises) =>
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
        setExerciseList((prevExercises) =>
            prevExercises.filter((prevExercise) =>
                prevExercise.id === id ? false : true
            )
        );
    }

    /* <-- Set Handlers --> */

    function editExerciseWeight(id: string, index: number, weights: number) {
        setExerciseList((prevExercises) =>
            prevExercises.map((prevExercise) =>
                prevExercise.id === id
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
        setExerciseList((prevExercises) =>
            prevExercises.map((prevExercise) =>
                prevExercise.id === id
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

    return (
        <>
            {exerciseList.map((exercise, rowIndex) => (
                <div
                    key={rowIndex}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        margin: "10px 0",
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
                            list={exerciseList}
                            setList={setExerciseList}
                        />
                        <input
                            style={{ border: "1.6px solid black" }}
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
                            onClick={() => removeExercise(exercise.id)}
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
                                    justifyContent: "space-between",
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
                                                Number(event.target.value)
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
                                                Number(event.target.value)
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
                            <PlusCircle className="icon" color="#1e1e1e" />
                            <input
                                type="text"
                                style={{
                                    width: "15px",
                                    textAlign: "center",
                                    border: "1.6px solid #1e1e1e",
                                }}
                            />
                            <MinusCircle className="icon" color="#1e1e1e" />
                        </div>
                    </div>
                </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                    type="text"
                    style={{ border: "1.6px solid #1e1e1e" }}
                    placeholder="New Exercise Name..."
                    value={exerciseName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setExerciseName(event.target.value)
                    }
                />
                <button
                    type="button"
                    className="icon-button"
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
            </div>
            <button type="submit" style={{ width: "100%" }}>
                Submit
            </button>
        </>
    );
}

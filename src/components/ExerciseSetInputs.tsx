import React, { useState, useEffect, useRef } from "react";

import { IExerciseSetInputsProps } from "../utils/models";
import { Program } from "../utils/models";

import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import MovementChevrons from "./MovementChevrons";

export default function ExerciseSetInputs({
    program,
    setProgram,
    setPreEditInfo,
}: IExerciseSetInputsProps) {
    const [exerciseName, setExerciseName] = useState<string>("");

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

    return (
        <>
            {program.map((exercise, rowIndex) => (
                <div>
                    {"sets" in exercise ? (
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
                                    list={program}
                                    setList={setProgram}
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
                                                        Number(
                                                            event.target.value
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
                                                            event.target.value
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
                                            incrementSetCount(exercise.id)
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
                                            decrementSetCount(exercise.id)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
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

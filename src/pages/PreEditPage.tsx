import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IExercise, Program, ExerciseSet, IPreEditPageProps } from "../utils/models";
import { createProgram } from "../services";

import { ChevronDown, ChevronUp, Plus, Trash } from "lucide-react";

export default function PreEditPage({ setPreEditInfo }: IPreEditPageProps) {
    const navigate = useNavigate();
    const newExerciseRef = useRef<HTMLInputElement>(null)

    const [program, setProgram] = useState<Program>(() => {
        const storedProgram = localStorage.getItem("program");
        return storedProgram ? JSON.parse(storedProgram) : { dayName: "", exercises: {}, date: new Date() };
    });

    useEffect(() => {
        localStorage.setItem("program", JSON.stringify(program));
    }, [program]);

    function handleProgramNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setProgram((prevProgram) => ({
            ...prevProgram,
            dayName: event.target.value,
        }));
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>, rowIndex: number) {
        setProgram((prevProgram) => {
            const newExercises = [...prevProgram.exercises];
            newExercises[rowIndex].name = event.target.value;
            return {
                ...prevProgram,
                exercises: newExercises,
            };
        });
    }

    function handleWeightOrRepChange(event: React.ChangeEvent<HTMLInputElement>, cellType: "weight" | "reps", setIndex: number, rowIndex: number) {
        setProgram((prevProgram) => {
            const newExercises = [...prevProgram.exercises];
            const newSets = [...newExercises[rowIndex].sets];
            newSets[setIndex] = {
                ...newSets[setIndex],
                [cellType]: Number(event.target.value),
            };
            newExercises[rowIndex].sets = newSets;
            return {
                ...prevProgram,
                exercises: newExercises,
            };
        });
    }

    function removeExercise(index: number) {
        setProgram((prevProgram) => {
            const newExercises = [...prevProgram.exercises];
            newExercises.splice(index, 1);
            return {
                ...prevProgram,
                exercises: newExercises,
            };
        });
    }

    function moveExerciseUp(index: number) {
        if (index === 0) {
            return;
        }
        const updatedExerciseList = [...program.exercises];
        const tempExercise = updatedExerciseList[index];
        updatedExerciseList[index] = updatedExerciseList[index - 1];
        updatedExerciseList[index - 1] = tempExercise;
        setProgram((prevProgram) => ({
            ...prevProgram,
            exercises: updatedExerciseList,
        }));
    }

    function moveExerciseDown(index: number) {
        if (index === program.exercises.length - 1) {
            return;
        }
        const updatedExerciseList = [...program.exercises];
        const tempExercise = updatedExerciseList[index];
        updatedExerciseList[index] = updatedExerciseList[index + 1];
        updatedExerciseList[index + 1] = tempExercise;
        setProgram((prevProgram) => ({
            ...prevProgram,
            exercises: updatedExerciseList,
        }));
    }

    function renderChevrons(index: number) {
        const updatedExerciseList = [...program.exercises];

        if (index === (updatedExerciseList.length - 1)) {
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

    function renderProgram() {
        if (program.dayName) {
            return (
                <div>
                    {program.exercises.map((exercise: IExercise, rowIndex: number) => (
                        <div
                            key={rowIndex}
                            style={{ display: "flex", flexDirection: "column", margin: "10px 0" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                {renderChevrons(rowIndex)}
                                <input
                                    style={{ border: "1.6px solid black", marginBottom: "5px" }}
                                    value={exercise.name}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleNameChange(event, rowIndex)}
                                />
                                <button
                                    type="button"
                                    className="icon-button"
                                    style={{ backgroundColor: "transparent", border: "none" }}
                                    onClick={() => removeExercise(rowIndex)}
                                >
                                    <Trash color="#da3633" />
                                </button>
                            </div>
                            {exercise.sets.map((set: ExerciseSet, setIndex: number) => (
                                <div
                                    key={setIndex}
                                    style={{ display: "flex", justifyContent: "space-between", margin: "2.5px 0", gap: "2.5px" }}
                                >
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
                            ))}
                        </div>
                    ))}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <input type="text" ref={newExerciseRef} style={{ border: "1.6px solid #1e1e1e" }} placeholder="New Exercise Name..." />
                        <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "1px solid #1e1e1e", width: "100%", margin: "10px 0", display: "flex", justifyContent: "center" }} onClick={handleNewExercise}>
                            <Plus size="24px" color="#1e1e1e" />
                        </button>
                    </div>
                    <button type="submit" style={{ width: "100%" }}>Submit</button>
                </div>
            );
        }
    }

    function handleNewExercise() {
        if (newExerciseRef.current) {
            const newExerciseName = newExerciseRef.current.value
            if (newExerciseName.trim() === "") {
                return
            }

            const updatedExerciseList: IExercise[] = [...program.exercises, { name: newExerciseName, sets: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }] }]
            setProgram({
                ...program,
                exercises: updatedExerciseList
            })
            newExerciseRef.current.value = ""
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        createProgram(program).then(() => {
            localStorage.setItem("program", JSON.stringify({ dayName: "", exercises: [], date: "" }));
            setProgram({ dayName: "", exercises: [], date: new Date() });
            setPreEditInfo(false);
            navigate("/");
        });
    }

    return (
        <div className="container-absolute-center">
            <form className="form" onSubmit={handleSubmit}>
                <input
                    style={{ border: "2.5px solid #ffde21", fontSize: "20px" }}
                    value={program.dayName}
                    onChange={handleProgramNameChange}
                />
                {renderProgram()}
            </form>
        </div>
    );
}
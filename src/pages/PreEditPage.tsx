import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IExercise, Program, ExerciseSet } from "../utils/models";
import { createProgram } from "../services";

export default function PreEditPage() {
    const navigate = useNavigate();

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

    function renderProgram() {
        if (program.dayName) {
            return (
                <div>
                    {program.exercises.map((exercise: IExercise, rowIndex: number) => (
                        <div
                            key={rowIndex}
                            style={{ display: "flex", flexDirection: "column", margin: "10px 0" }}
                        >
                            <input
                                style={{ border: "1.6px solid black", marginBottom: "5px" }}
                                value={exercise.name}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleNameChange(event, rowIndex)}
                            />
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
                    <button type="submit" style={{ width: "100%" }}>Submit</button>
                </div>
            );
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        createProgram(program).then(() => {
            localStorage.setItem("program", JSON.stringify({ dayName: "", exercises: [], date: "" }));
            setProgram({ dayName: "", exercises: [], date: new Date() });
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
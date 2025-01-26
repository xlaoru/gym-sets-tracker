import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IExercise } from "../utils/models";
import { ChevronDown, ChevronUp, Trash, Plus } from "lucide-react";
import { editProgram } from "../services";

export default function ProgramEditModePage() {
    const navigate = useNavigate();
    const newExerciseRef = useRef<HTMLInputElement>(null)

    const location = useLocation();
    const program = location.state.program;

    const [dayName, setDayName] = useState(program.dayName);
    const [exerciseList, setExerciseList] = useState<IExercise[]>(program.exercises);

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const updatedExerciseList = exerciseList.map((exercise, i) => {
            if (index === i) {
                return { ...exercise, name: event.target.value }
            }
            return exercise
        })
        setExerciseList(updatedExerciseList)
    }

    function handleWeightOrRepChange(
        event: React.ChangeEvent<HTMLInputElement>,
        cellType: "weight" | "reps",
        setIndex: number,
        rowIndex: number
    ) {
        const updatedExerciseList = exerciseList.map((exercise, index) => {
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
        })
        setExerciseList(updatedExerciseList)
    }

    function removeExercise(index: number) {
        const updatedExerciseList = exerciseList.filter((exercise, i) => index !== i)
        setExerciseList(updatedExerciseList)
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

    function handleNewExercise() {
        if (newExerciseRef.current) {
            const newExerciseName = newExerciseRef.current.value
            if (newExerciseName.trim() === "") {
                return
            }
            const updatedExerciseList = [...exerciseList, { name: newExerciseName, sets: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }, { weight: 0, reps: 0 }] }]
            setExerciseList(updatedExerciseList)
            newExerciseRef.current.value = ""
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const updatedProgram = {
            dayName: dayName,
            exercises: exerciseList,
            date: new Date()
        }

        editProgram(updatedProgram, program._id).then(() => {
            navigate("/")
        })
    }

    return (
        <div className="container-absolute-center">
            <form className="form" onSubmit={handleSubmit}>
                <input
                    style={{ border: "2.5px solid #ffde21", fontSize: "20px" }}
                    value={dayName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDayName(event.target.value)}
                />
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
                        {
                            exercise.sets.map((set, setIndex) => (
                                <div
                                    key={setIndex}
                                    style={{ display: "flex", justifyContent: "space-between", margin: "2.5px 0", gap: "2.5px" }}>
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
                            ))
                        }
                    </div>
                ))}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <input type="text" ref={newExerciseRef} style={{ border: "1.6px solid #1e1e1e" }} placeholder="New Exercise Name..." />
                    <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "1px solid #1e1e1e", width: "100%", margin: "10px 0", display: "flex", justifyContent: "center" }} onClick={handleNewExercise}>
                        <Plus size="24px" color="#1e1e1e" />
                    </button>
                </div>
                <button type="submit" style={{ width: "100%" }}>Submit</button>
            </form>
        </div>
    );
}

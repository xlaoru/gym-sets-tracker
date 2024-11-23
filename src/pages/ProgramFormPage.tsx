import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import ProgramBaseInfoInputs from '../components/ProgramBaseInfoInputs';
import ProgramRepsInfoInputs from '../components/ProgramRepsInfoInputs';

import { Exercises, ExerciseSet, Program } from '../utils/models';
import { createProgram } from "../services";

export default function ProgramFormPage() {
    const [isBaseInfoFilled, setBaseInfoFilled] = useState(false)
    const [exercises, setExercise] = useState<Exercises>({})

    const [programName, setProgramName] = useState<string>("")

    const navigate = useNavigate()

    useEffect(() => {
        const preProgramInfo: Program = {
            dayName: programName,
            exercises: exercises,
            date: new Date()
        }
        localStorage.setItem("exercises", JSON.stringify(preProgramInfo))
    }, [exercises, programName, setExercise, setProgramName])

    const handleChange = (exerciseName: string, setIndex: number, field: keyof ExerciseSet, value: string) => {
        setExercise((prevExercises) => {
            const newExercises = { ...prevExercises };
            if (!newExercises[exerciseName]) {
                newExercises[exerciseName] = [];
            }
            if (!newExercises[exerciseName][setIndex]) {
                newExercises[exerciseName][setIndex] = { reps: 0, weight: 0 };
            }
            newExercises[exerciseName][setIndex][field] = Number(value);
            return newExercises;
        });
    };

    function handleSubmit(e: any) {
        e.preventDefault()
        createProgram({
            dayName: e.target.elements[0].value,
            exercises: exercises,
            date: new Date()
        }).then(() => {
            navigate("/")
            localStorage.removeItem("exercises")
        })
    }

    return (
        <div className="container-absolute-center">
            <form className="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Day Name"
                    style={{ padding: "8px 8px" }}
                    list="program-types"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                />
                <datalist id="program-types">
                    <option value="Ноги + Біцепси">Ноги + Біцепси</option>
                    <option value="Груди (верх) + Плечі">Груди (верх) + Плечі</option>
                    <option value="Груди (середина) + Плечі">Груди (середина) + Плечі</option>
                    <option value="Груди (низ) + Плечі">Груди (низ) + Плечі</option>
                    <option value="Спина + Тріцепси">Спина + Тріцепси</option>
                </datalist>
                {
                    isBaseInfoFilled
                        ?
                        (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <ProgramRepsInfoInputs exercises={exercises} handleChange={handleChange} />
                            </div>
                        )
                        :
                        (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {
                                    Object.keys(exercises).map((exercise, index) => {
                                        return (
                                            <div key={index}>
                                                <h4 style={{ margin: 0 }}>{exercise}</h4>
                                                <hr style={{ border: "1.5px solid #1e1e1e" }} />
                                            </div>
                                        )
                                    })
                                }
                                <ProgramBaseInfoInputs exercises={exercises} setExercise={setExercise} />
                                <button type="button" onClick={() => setBaseInfoFilled(!isBaseInfoFilled)} style={{ backgroundColor: "#fff", color: "#1e1e1e" }}>Next</button>
                            </div>
                        )
                }
            </form>
        </div >
    );
}

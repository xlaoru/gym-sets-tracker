import { useNavigate } from "react-router-dom";
import { deleteProgram } from "../services";
import { IProgramTableProps } from "../utils/models";

import { Trash, FilePenLine } from 'lucide-react';

export default function ProgramTable({ program }: IProgramTableProps) {
    const navigate = useNavigate();
    return (
        <table>
            <caption>
                <div className="container-space-between">
                    {program.dayName} | {new Date(program.date).toLocaleDateString('en-GB').replace(/\//g, '.')}
                    <div style={{ display: "flex", gap: "5px" }}>
                        <button className="icon-button" onClick={() => navigate("/edit", { state: { program } })}>
                            <FilePenLine color="#ffcc00" />
                        </button>
                        <button className="icon-button" onClick={() => deleteProgram(program._id || "").then(() => window.location.reload())}>
                            <Trash color="#d03533" />
                        </button>
                    </div>
                </div>
            </caption>
            {program.exercises.map((exercise, index) => (
                <tbody key={index}>
                    <tr>
                        <th>{exercise.name}</th>
                        <th>Weight (kg)</th>
                        <th>Reps</th>
                    </tr>
                    {exercise.sets.map((exerciseSet, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{exerciseSet.weight}</td>
                            <td>{exerciseSet.reps}</td>
                        </tr>
                    ))}
                </tbody>
            ))}
        </table>
    )
}

/* 
.map((exerciseName, index) => (
                <tbody key={index}>
                    <tr>
                        <th>{exerciseName}</th>
                        <th>Weight (kg)</th>
                        <th>Reps</th>
                    </tr>
                    {program.exercises[exerciseName].map((exerciseSet, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{exerciseSet.weight}</td>
                            <td>{exerciseSet.reps}</td>
                        </tr>
                    ))}
                </tbody>
            ))
*/
import { deleteProgram, editProgram } from "../services";
import { IProgramTableProps } from "../utils/models";

import { Trash } from 'lucide-react';

export default function ProgramTable({ program }: IProgramTableProps) {
    return (
        <table>
            <caption>
                <div className="container-space-between">
                    {program.dayName} | {new Date(program.date).toLocaleDateString('en-GB').replace(/\//g, '.')}
                    <button className="icon-button" onClick={() => deleteProgram(program._id || "").then(() => window.location.reload())}>
                        <Trash color="#d03533" />
                    </button>
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
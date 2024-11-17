import { deleteProgram, editProgram } from "../services";
import { IProgramTableProps } from "../utils/models";

export default function ProgramTable({ program }: IProgramTableProps) {
    return (
        <>
            <table>
                <caption>{program.dayName} | {new Date(program.date).toLocaleDateString()}</caption>
                {Object.keys(program.exercises).map((exerciseName, index) => (
                    <tbody key={index}>
                        <tr>
                            <th>{exerciseName}</th>
                            <th>Reps</th>
                            <th>Weight</th>
                        </tr>
                        {program.exercises[exerciseName].map((exerciseSet, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{exerciseSet.reps}</td>
                                <td>{exerciseSet.weight}</td>
                            </tr>
                        ))}
                    </tbody>
                ))}
            </table>
            <button onClick={() => { deleteProgram(program._id || ""); window.location.reload(); }}>DELETE</button>
        </>
    )
}

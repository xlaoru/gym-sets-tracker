import { useNavigate } from "react-router-dom";
import { IProgramTableProps } from "../utils/models";

import { Trash, FilePenLine } from 'lucide-react';
import { useState } from "react";

import Loader from "../components/Loader"
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { deleteProgram } from "../store/ProgramSlice";

export default function ProgramTable({ program }: IProgramTableProps) {
    const navigate = useNavigate();

    const dispatch: AppDispatch = useDispatch()

    const [isLoading, setLoading] = useState(false)

    function handleDeleteProgram() {
        setLoading(true)

        const _id = program._id || ""
        dispatch(deleteProgram({ _id })).then(() => {
            setLoading(false)
        })
    }

    return (
        <>
            {isLoading
                ? <Loader />
                : <table>
                    <caption>
                        <div className="container-space-between">
                            {program.dayName} | {new Date(program.date).toLocaleDateString('en-GB').replace(/\//g, '.')}
                            <div style={{ display: "flex", gap: "5px" }}>
                                <button className="icon-button" onClick={() => navigate("/edit", { state: { program } })}>
                                    <FilePenLine color="#ffcc00" />
                                </button>
                                <button className="icon-button" onClick={handleDeleteProgram}>
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
                            {
                                "sets" in exercise
                                    ? exercise.sets.map((exerciseSet, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{exerciseSet.weight}</td>
                                            <td>{exerciseSet.reps}</td>
                                        </tr>
                                    ))
                                    : null
                            }
                        </tbody>
                    ))}
                </table>
            }
        </>
    )
}
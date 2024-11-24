import React, { useState } from 'react'
import { Exercises } from '../utils/models'

export default function ProgramBaseInfoInputs({ exercises, setExercises }: { exercises: Exercises, setExercises: any }) {
    const [inputValue, setInputValue] = useState("")

    const addExercise = () => {
        setExercises({
            ...exercises, [inputValue]: [
                { weight: 0, reps: 0 },
                { weight: 0, reps: 0 },
                { weight: 0, reps: 0 },
                { weight: 0, reps: 0 }
            ]
        })
        setInputValue("")
    }

    return (
        <>
            <input type="text" placeholder="Exercise Name" value={inputValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} />
            <button type="button" onClick={addExercise}>Add new Exercise</button>
        </>
    )
}
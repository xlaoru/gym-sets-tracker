import { useState } from "react";

import ProgramBaseInfoInputs from '../components/ProgramBaseInfoInputs';
import ProgramRepsInfoInputs from '../components/ProgramRepsInfoInputs';

import { Exercises, ExerciseSet } from '../utils/models';

export default function ProgramFormPage() {
    const [isBaseInfoFilled, setBaseInfoFilled] = useState(false)
    const [exercises, setExercise] = useState<Exercises>({})

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
        e.preventDefault();
        console.log(e.target.elements[0].value, exercises);
    }

    return (
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <input type="text" placeholder="Day Name" />
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
                                        return <input key={index} defaultValue={exercise} />
                                    })
                                }
                                <ProgramBaseInfoInputs exercises={exercises} setExercise={setExercise} />
                                <button type="button" onClick={() => setBaseInfoFilled(!isBaseInfoFilled)}>Next</button>
                            </div>
                        )
                }
            </form>
        </div>
    );
}

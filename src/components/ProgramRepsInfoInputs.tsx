import { Exercises } from "../utils/models"

export default function ProgramRepsInfoInputs({ exercises, handleChange }: { exercises: Exercises, handleChange: any }) {
    return (
        <>
            {Object.keys(exercises).map((exercise, index) => {
                return (
                    <div key={index}>
                        <input type="text" placeholder="Exercise Name" defaultValue={exercise} style={{ margin: "10px 0" }} />
                        <div style={{ display: "flex", gap: "4px" }}>
                            <input type="text" placeholder="Weight" name={`${exercise}-${index}-weight-1`} onChange={(e) => handleChange(exercise, 0, 'weight', e.target.value)} />
                            <input type="text" placeholder="Reps" name={`${exercise}-${index}-rep-1`} onChange={(e) => handleChange(exercise, 0, 'reps', e.target.value)} />
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                            <input type="text" placeholder="Weight" name={`${exercise}-${index}-weight-2`} onChange={(e) => handleChange(exercise, 1, 'weight', e.target.value)} />
                            <input type="text" placeholder="Reps" name={`${exercise}-${index}-rep-2`} onChange={(e) => handleChange(exercise, 1, 'reps', e.target.value)} />
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                            <input type="text" placeholder="Weight" name={`${exercise}-${index}-weight-3`} onChange={(e) => handleChange(exercise, 2, 'weight', e.target.value)} />
                            <input type="text" placeholder="Reps" name={`${exercise}-${index}-rep-3`} onChange={(e) => handleChange(exercise, 2, 'reps', e.target.value)} />
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                            <input type="text" placeholder="Weight" name={`${exercise}-${index}-weight-4`} onChange={(e) => handleChange(exercise, 3, 'weight', e.target.value)} />
                            <input type="text" placeholder="Reps" name={`${exercise}-${index}-rep-4`} onChange={(e) => handleChange(exercise, 3, 'reps', e.target.value)} />
                        </div>
                    </div>
                )
            })}
            <button type="submit" style={{ marginTop: "12px" }}>Submit</button>
        </>
    )
}
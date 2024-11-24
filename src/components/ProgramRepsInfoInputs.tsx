import { Exercises } from "../utils/models"

export default function ProgramRepsInfoInputs({ exercises, handleChange }: { exercises: Exercises, handleChange: any }) {
    return (
        <>
            {Object.keys(exercises).map((exercise, index) => {
                return (
                    <div key={index}>
                        <h3 style={{ margin: "10px 0" }}>{exercise}</h3>
                        {Array.from({ length: 4 }, (_, i) => {
                            return (
                                <div style={{ display: "flex", gap: "4px" }} key={i}>
                                    <input defaultValue={exercises[exercise][i].weight ?? ""} style={{ width: "50%" }} type="text" placeholder="Weight" name={`${exercise}-${index}-weight-${i + 1}`} onChange={(e) => handleChange(exercise, i, 'weight', e.target.value)} />
                                    <input defaultValue={exercises[exercise][i].reps ?? ""} style={{ width: "50%" }} type="text" placeholder="Reps" name={`${exercise}-${index}-rep-${i + 1}`} onChange={(e) => handleChange(exercise, i, 'reps', e.target.value)} />
                                </div>
                            )
                        })}
                    </div>
                )
            })}
            <button type="submit" style={{ marginTop: "12px" }}>Submit</button>
        </>
    )
}
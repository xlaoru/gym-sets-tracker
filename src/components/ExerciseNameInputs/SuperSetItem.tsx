import React from "react";

import ChevronsForExercise from "../Chevrons/ChevronsForExercise";
import ChevronsForSuperSet from "../Chevrons/ChevronsForSuperSet";

import { ISuperSetItemProps } from "../../utils/models";

import { Pencil, X } from "lucide-react";

export default function SuperSetItem({ index, exercise, exerciseList, setExerciseList, isSuperSetEditMode, isSuperSetMode, toggleExerciseSelectionForEditingSuperSet, toggleExerciseSelectionForNewSuperSet, handleChangeExerciseName, removeExercise, startSuperSetEditMode, handleChangeSuperSetExerciseName, removeExerciseFromSuperSet }: ISuperSetItemProps) {
    if (!isSuperSetMode) {
        return (
            <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "5px", backgroundColor: "#f7f7f7", borderRadius: "4px", padding: "8px", margin: "5px 0" }}>
                    {!isSuperSetMode && <ChevronsForExercise index={index} exerciseList={exerciseList} setExerciseList={setExerciseList} />}
                    <div>
                        <input style={{ textAlign: "center" }} disabled={!isSuperSetEditMode} value={exercise.name} onChange={(event) => handleChangeExerciseName(event, index)} />
                        <div>
                            {exercise.exercises.map((subExercise, subIndex) => {
                                return (
                                    <div key={subIndex} style={{ display: "flex", justifyContent: "center" }}>
                                        {isSuperSetEditMode && <input type="checkbox" checked={subExercise.isSelected} onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleExerciseSelectionForEditingSuperSet(event, true, subIndex)} />}
                                        {isSuperSetMode && <input type="checkbox" checked={subExercise.isSelected} onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleExerciseSelectionForNewSuperSet(event, index)} />}
                                        {isSuperSetEditMode && <ChevronsForSuperSet index={subIndex} exercise={exercise} exerciseList={exerciseList} setExerciseList={setExerciseList} />}
                                        <input value={subExercise.name} onChange={(event) => handleChangeSuperSetExerciseName(event, exercise, subIndex)} disabled={!isSuperSetEditMode} style={{ margin: "4px 0 0 0" }} />
                                        {isSuperSetEditMode && <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => removeExerciseFromSuperSet(exercise, subIndex)}>
                                            <X color="#da3633" />
                                        </button>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {!isSuperSetEditMode &&
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                            <button className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} type="button" onClick={() => startSuperSetEditMode(index)}><Pencil color="#1e1e1e" /></button>
                            <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => removeExercise(index)}>
                                <X color="#da3633" />
                            </button>
                        </div>
                    }
                </div>
            </div>
        )
    } else {
        return null
    }
}
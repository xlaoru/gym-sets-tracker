import React from "react";
import { IExerciseItemProps } from "../../utils/models";

import ChevronsForExercise from "../Chevrons/ChevronsForExercise";

import { X } from "lucide-react";

export default function ExerciseItem({ index, exercise, isSuperSetMode, isSuperSetEditMode, exerciseList, setExerciseList, handleChangeExerciseName, toggleExerciseSelectionForNewSuperSet, toggleExerciseSelectionForEditingSuperSet, removeExercise }: IExerciseItemProps) {
    return (
        <div
            key={index}
            style={{ display: "flex", margin: "5px 0", alignItems: "center" }}
        >
            {isSuperSetMode && <input type="checkbox" checked={exercise.isSelected} onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleExerciseSelectionForNewSuperSet(event, index)} />}
            {isSuperSetEditMode && <input type="checkbox" checked={exercise.isSelected} onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleExerciseSelectionForEditingSuperSet(event, false, index)} />}
            {!isSuperSetMode && <ChevronsForExercise index={index} exerciseList={exerciseList} setExerciseList={setExerciseList} />}
            <input
                type="text"
                value={exercise.name}
                onChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => handleChangeExerciseName(event, index)
                }
                disabled={isSuperSetMode || isSuperSetEditMode}
                style={{ width: "100%", padding: "8px 8px" }}
            />
            {!isSuperSetMode && <button type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none" }} onClick={() => removeExercise(index)}>
                <X color="#da3633" />
            </button>}
        </div>
    )
}

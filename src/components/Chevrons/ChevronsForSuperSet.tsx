import React from "react";

import { IChevronsForSuperSetProps } from "../../utils/models";

import { ISuperset } from "../../utils/models";

import { ChevronDown, ChevronUp } from "lucide-react";

export default function ChevronsForSuperSet({ index, exercise, exerciseList, setExerciseList }: IChevronsForSuperSetProps) {

    function moveSubExerciseUp(exercise: ISuperset, index: number) {
        const superSetExerciseList = exercise.exercises;

        if (index === 0) {
            return
        }

        const updatedSuperSetExerciseList = [...superSetExerciseList];
        const tempExercise = updatedSuperSetExerciseList[index];

        updatedSuperSetExerciseList[index] = updatedSuperSetExerciseList[index - 1];
        updatedSuperSetExerciseList[index - 1] = tempExercise;

        const updatedSuperSet = { ...exercise, exercises: updatedSuperSetExerciseList };

        const updatedExerciseList = exerciseList.map((exercise) => {
            if (exercise._id === updatedSuperSet._id) {
                return updatedSuperSet;
            }
            return exercise;
        });

        setExerciseList(updatedExerciseList);
    }

    function moveSubExerciseDown(exercise: ISuperset, index: number) {
        const superSetExerciseList = exercise.exercises;

        if (index === (superSetExerciseList.length - 1)) {
            return
        }

        const updatedSuperSetExerciseList = [...superSetExerciseList];
        const tempExercise = updatedSuperSetExerciseList[index];

        updatedSuperSetExerciseList[index] = updatedSuperSetExerciseList[index + 1];
        updatedSuperSetExerciseList[index + 1] = tempExercise;

        const updatedSuperSet = { ...exercise, exercises: updatedSuperSetExerciseList };

        const updatedExerciseList = exerciseList.map((exercise) => {
            if (exercise._id === updatedSuperSet._id) {
                return updatedSuperSet;
            }
            return exercise;
        });

        setExerciseList(updatedExerciseList);
    }

    const superSetExerciseList = exercise.exercises;

    if (superSetExerciseList.length === 1) {
        return null
    }

    if (index === (superSetExerciseList.length - 1)) {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "4px" }}>
                <button onClick={() => moveSubExerciseUp(exercise, index)} type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none", color: "#1e1e1e", padding: 0 }} ><ChevronUp size="18px" /></button>
            </div>
        )
    } else if (index === 0) {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "4px" }}>
                <button onClick={() => moveSubExerciseDown(exercise, index)} type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none", color: "#1e1e1e", padding: 0 }} ><ChevronDown size="18px" /></button>
            </div>
        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "4px" }}>
                <button onClick={() => moveSubExerciseUp(exercise, index)} type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none", color: "#1e1e1e", padding: 0 }} ><ChevronUp size="18px" /></button>
                <button onClick={() => moveSubExerciseDown(exercise, index)} type="button" className="icon-button" style={{ backgroundColor: "transparent", border: "none", color: "#1e1e1e", padding: 0 }} ><ChevronDown size="18px" /></button>
            </div>
        )
    }
}

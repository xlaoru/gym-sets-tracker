import React from "react";

export interface Program {
    _id?: string;
    dayName: string;
    exercises: TProgram[];
    date: Date;
}

export type TProgram = IExercise | ISuperset;

export interface IExercise {
    name: string;
    sets: ExerciseSet[];
}

export interface ISuperset {
    name: string;
    exercises: IExercise[];
}

export interface ExerciseSet {
    reps: number;
    weight: number;
}

export interface IProgramTableProps {
    program: Program;
}

export interface INewProgramObject {
    dayName: string;
    exercises: IExercise[];
    date: Date;
}

export interface IProgramFormPageProps {
    setPreEditInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IExerciseSetInputsProps {
    exerciseList: IExercise[];
    setExerciseList: React.Dispatch<React.SetStateAction<IExercise[]>>;
    setPreEditInfo?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IExerciseNameInputsProps {
    exerciseList: IExercise[];
    setExerciseList: React.Dispatch<React.SetStateAction<IExercise[]>>;
    handleNextFormStep: () => void;
    setPreEditInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IHeaderProps {
    hasPreEditInfo: boolean;
    setPreEditInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IPreEditPageProps {
    setPreEditInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IPaginationFooterProps {
    isLoading: boolean;
}

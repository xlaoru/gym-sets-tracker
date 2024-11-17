export interface Program {
    _id?: string;
    dayName: string;
    exercises: Exercises;
    date: Date;
}

export interface ExerciseSet {
    reps: number;
    weight: number;
}

export interface Exercises {
    [exerciseName: string]: ExerciseSet[];
}

export interface IProgramTableProps {
    program: Program;
}

export interface INewProgramObject {
    dayName: string;
    exercises: Exercises;
    date: Date;
}
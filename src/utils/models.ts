export interface ExerciseSet {
    reps: number;
    weight: number;
}

export interface Exercises {
    [exerciseName: string]: ExerciseSet[];
}
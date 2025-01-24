export interface Program {
    _id?: string;
    dayName: string;
    exercises: IExercise[];
    date: Date;
}

export interface IExercise {
    name: string;
    sets: ExerciseSet[]
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

export interface IExerciseSetInputsProps {
    exerciseList: IExercise[];
    setExerciseList: React.Dispatch<React.SetStateAction<IExercise[]>>;
};

export interface IExerciseNameInputsProps {
    exerciseList: IExercise[];
    setExerciseList: React.Dispatch<React.SetStateAction<IExercise[]>>;
    handleNextFormStep: () => void;
};

export interface IHeaderProps {
    hasPreEditInfo: boolean
}

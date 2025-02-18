export interface Program {
    _id?: string;
    dayName: string;
    exercises: ProgramState[];
    date: Date;
}

export type ProgramState = IExercise | ISuperset

export interface IExercise {
    name: string;
    sets: ExerciseSet[]
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
    exerciseList: ProgramState[];
    setExerciseList: React.Dispatch<React.SetStateAction<ProgramState[]>>;
    setPreEditInfo?: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface IExerciseNameInputsProps {
    exerciseList: ProgramState[];
    setExerciseList: React.Dispatch<React.SetStateAction<ProgramState[]>>;
    handleNextFormStep: () => void;
    setPreEditInfo: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface IHeaderProps {
    hasPreEditInfo: boolean
    setPreEditInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IPreEditPageProps{
    setPreEditInfo: React.Dispatch<React.SetStateAction<boolean>>;
}
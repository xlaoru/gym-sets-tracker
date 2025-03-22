export interface Program {
    _id?: string;
    dayName: string;
    exercises: ProgramState[];
    date: Date;
}

export type ProgramState = IExercise | ISuperset

export interface IExercise {
    _id: string;
    name: string;
    sets: ExerciseSet[];
    isSelected: boolean;
    setQuantity: number;
}

export interface ISuperset {
    _id: string;
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

export interface IChevronsForExerciseProps {
    index: number,
    exerciseList: ProgramState[],
    setExerciseList: React.Dispatch<React.SetStateAction<ProgramState[]>>;
}

export interface IChevronsForSuperSetProps extends IChevronsForExerciseProps {
    exercise: ISuperset
}

export interface IExerciseItemProps {
    index: number;
    exercise: IExercise;
    isSuperSetMode: boolean;
    isSuperSetEditMode: boolean;
    exerciseList: ProgramState[];
    setExerciseList: React.Dispatch<React.SetStateAction<ProgramState[]>>;
    handleChangeExerciseName: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    toggleExerciseSelectionForNewSuperSet: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    toggleExerciseSelectionForEditingSuperSet: (event: React.ChangeEvent<HTMLInputElement>, isSelected: boolean, index: number) => void;
    removeExercise: (index: number) => void;
}

export interface ISuperSetItemProps {
    index: number;
    exercise: ISuperset;
    isSuperSetMode: boolean;
    isSuperSetEditMode: boolean;
    exerciseList: ProgramState[];
    setExerciseList: React.Dispatch<React.SetStateAction<ProgramState[]>>;
    handleChangeExerciseName: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    toggleExerciseSelectionForNewSuperSet: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    toggleExerciseSelectionForEditingSuperSet: (event: React.ChangeEvent<HTMLInputElement>, isSelected: boolean, index: number) => void;
    removeExercise: (index: number) => void;
    startSuperSetEditMode: (index: number) => void;
    handleChangeSuperSetExerciseName: (event: React.ChangeEvent<HTMLInputElement>, exercise: ISuperset, index: number) => void;
    removeExerciseFromSuperSet: (exercise: ISuperset, index: number) => void;
}

export interface ISuperSetCreationModalProps {

}
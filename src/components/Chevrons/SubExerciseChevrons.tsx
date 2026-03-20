import { IExercise, ISubExerciseChevronsProps } from "../../utils/models";
import { useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SubExerciseChevrons({
    id,
    superset,
    setList,
}: ISubExerciseChevronsProps) {
    const currentIndex = superset.exercises.findIndex(
        (item: IExercise) => item.id === id
    );

    function moveSubExerciseUp(index: number) {
        if (index === 0) return;

        const newList = [...superset.exercises];
        const temp = newList[index - 1];
        newList[index - 1] = newList[index];
        newList[index] = temp;

        setList((prevExercises) =>
            prevExercises.map((exercise) => {
                if (superset.id === exercise.id) {
                    return {
                        ...exercise,
                        exercises: newList,
                    };
                }
                return exercise;
            })
        );
    }

    function moveSubExerciseDown(index: number) {
        if (index === superset.exercises.length - 1) return;

        const newList = [...superset.exercises];
        const temp = newList[index + 1];
        newList[index + 1] = newList[index];
        newList[index] = temp;

        setList((prevExercises) =>
            prevExercises.map((exercise) => {
                if (superset.id === exercise.id) {
                    return {
                        ...exercise,
                        exercises: newList,
                    };
                }
                return exercise;
            })
        );
    }

    function renderChevrons() {
        if (superset.exercises.length === 1) {
            return null;
        }

        if (currentIndex === 0) {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingRight: "4px",
                    }}
                >
                    <button
                        onClick={() => moveSubExerciseDown(currentIndex)}
                        type="button"
                        className="icon-button"
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#1e1e1e",
                            padding: 0,
                        }}
                    >
                        <ChevronDown size="18px" />
                    </button>
                </div>
            );
        } else if (currentIndex === superset.exercises.length - 1) {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingRight: "4px",
                    }}
                >
                    <button
                        onClick={() => moveSubExerciseUp(currentIndex)}
                        type="button"
                        className="icon-button"
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#1e1e1e",
                            padding: 0,
                        }}
                    >
                        <ChevronUp size="18px" />
                    </button>
                </div>
            );
        } else {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingRight: "4px",
                    }}
                >
                    <button
                        onClick={() => moveSubExerciseUp(currentIndex)}
                        type="button"
                        className="icon-button"
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#1e1e1e",
                            padding: 0,
                        }}
                    >
                        <ChevronUp size="18px" />
                    </button>
                    <button
                        onClick={() => moveSubExerciseDown(currentIndex)}
                        type="button"
                        className="icon-button"
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#1e1e1e",
                            padding: 0,
                        }}
                    >
                        <ChevronDown size="18px" />
                    </button>
                </div>
            );
        }
    }

    return <>{renderChevrons()}</>;
}

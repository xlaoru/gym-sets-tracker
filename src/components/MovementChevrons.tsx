import { ChevronDown, ChevronUp } from "lucide-react";

import { IMovementChevronsProps } from "../utils/models";

export default function MovementChevrons({
    id,
    list,
    setList,
}: IMovementChevronsProps) {
    const currentIndex = list.findIndex((item) => item.id === id);

    console.log(id, currentIndex);

    function moveExerciseUp(index: number) {
        if (index === 0) return;

        const newList = [...list];
        const temp = newList[index - 1];
        newList[index - 1] = newList[index];
        newList[index] = temp;

        setList(newList);
    }

    function moveExerciseDown(index: number) {
        if (index === list.length - 1) return;

        const newList = [...list];
        const temp = newList[index + 1];
        newList[index + 1] = newList[index];
        newList[index] = temp;

        setList(newList);
    }

    function renderChevrons() {
        if (list.length === 1) {
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
                        onClick={() => moveExerciseDown(currentIndex)}
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
        } else if (currentIndex === list.length - 1) {
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
                        onClick={() => moveExerciseUp(currentIndex)}
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
                        onClick={() => moveExerciseUp(currentIndex)}
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
                        onClick={() => moveExerciseDown(currentIndex)}
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

import { useEffect, useState } from "react";
import ExerciseNameInputs from "../components/ExerciseNameInputs";
import ExerciseSetInputs from "../components/ExerciseSetInputs";

import { IProgramFormPageProps, Program, TProgram } from "../utils/models";
import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { createProgram } from "../store/ProgramSlice";

export default function ProgramFormPage({
    setPreEditInfo,
}: IProgramFormPageProps) {
    const navigate = useNavigate();

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        localStorage.setItem(
            "program",
            JSON.stringify({ dayName: "", exercises: [], date: "" })
        );
        setPreEditInfo(false);
    }, [setPreEditInfo]);

    const [program, setProgram] = useState<TProgram[]>([]);
    const [isExerciseNameMode, setExerciseNameMode] = useState(true);
    const [dayName, setDayName] = useState("");

    const [isLoading, setLoading] = useState(false);

    function handleNextFormStep() {
        setExerciseNameMode(false);
    }

    function handleDayNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDayName(event.target.value);
        const parsedProgram = JSON.parse(
            localStorage.getItem("program") || "{}"
        );
        const program: Program = {
            ...parsedProgram,
            dayName: event.target.value,
        };
        localStorage.setItem("program", JSON.stringify(program));
        setPreEditInfo(true);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault();

        setLoading(true);
        setPreEditInfo(false);

        const newProgram: Program = {
            dayName,
            exercises: program,
            date: new Date(),
        };

        dispatch(createProgram(newProgram))
            .then(() => {
                localStorage.setItem(
                    "program",
                    JSON.stringify({ dayName: "", exercises: [], date: "" })
                );
                setPreEditInfo(false);
                setProgram([]);
                setExerciseNameMode(true);
                setDayName("");
                setLoading(false);
                navigate("/");
            })
            .catch((error) => {
                setLoading(false);
                setPreEditInfo(true);
            });
    }

    return (
        <div className="container-absolute-center">
            {isLoading ? (
                <Loader />
            ) : (
                <form
                    className="form"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center",
                    }}
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder="Day Name"
                        list="program-types"
                        style={{
                            border: "2.5px solid #ffde21",
                            fontSize: "20px",
                        }}
                        value={dayName}
                        onChange={handleDayNameChange}
                    />
                    <datalist id="program-types">
                        <option value="Ноги + Біцепси">Ноги + Біцепси</option>
                        <option value="Груди (верх) + Плечі">
                            Груди (верх) + Плечі
                        </option>
                        <option value="Груди (середина) + Плечі">
                            Груди (середина) + Плечі
                        </option>
                        <option value="Груди (низ) + Плечі">
                            Груди (низ) + Плечі
                        </option>
                        <option value="Спина + Тріцепси">
                            Спина + Тріцепси
                        </option>
                    </datalist>
                    {/*{
                            isExerciseNameMode
                                ? <ExerciseNameInputs setPreEditInfo={setPreEditInfo} exerciseList={exerciseList} setExerciseList={setExerciseList} handleNextFormStep={handleNextFormStep} />*/}
                    {/*:*/}
                    <ExerciseSetInputs
                        setPreEditInfo={setPreEditInfo}
                        program={program}
                        setProgram={setProgram}
                    />
                    {/*}*/}
                </form>
            )}
        </div>
    );
}

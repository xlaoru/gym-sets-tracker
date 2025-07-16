import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./";

import { Program } from "../utils/models";

import api from "../services";

type LoadingStatusTypes = "idle" | "loading" | "error";

export const getPrograms = createAsyncThunk(
    "programs/getPrograms",
    async (
        { page, limit }: { page: number; limit: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.get(
                `/api/programs?page=${page}&limit=${limit}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching programs:", error);
            /* ... */
        }
    }
);

export const createProgram = createAsyncThunk(
    "programs/createProgram",
    async ({ dayName, exercises, date }: Program, { rejectWithValue }) => {
        try {
            const response = await api.post("/api/programs", {
                dayName,
                exercises,
                date,
            });
            return response.data;
        } catch (error) {
            console.log("Error creation program:", error);
            /* ... */
        }
    }
);

export const editProgram = createAsyncThunk(
    "programs/editProgram",
    async ({ _id, dayName, exercises, date }: Program, { rejectWithValue }) => {
        try {
            const response = await api.put(`/api/programs/${_id}`, {
                dayName,
                exercises,
                date,
            });
            return response.data;
        } catch (error) {
            console.log("Error editing program:", error);
            /* ... */
        }
    }
);

export const deleteProgram = createAsyncThunk(
    "programs/deleteProgram",
    async ({ _id }: Pick<Program, "_id">, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/api/programs/${_id}`);
            return response.data;
        } catch (error) {
            console.log("Error deleting program:", error);
            /* ... */
        }
    }
);

const setError = (state: any, action: any) => {
    state.status = "rejected";
    state.error = action.payload;
};

const setPending = (state: any) => {
    state.status = "loading";
    state.error = null;
};

const ProgramSlice = createSlice({
    name: "programs",
    initialState: {
        programs: [] as Program[],
        pages: 0,
        page: 0,
        limit: 0,
        status: "idle" as LoadingStatusTypes,
        response: null,
        error: null,
    },
    reducers: {
        moveToPage(state, action) {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPrograms.fulfilled, (state, action) => {
            state.status = "idle";
            state.programs = action.payload.programs;
            state.pages = action.payload.pages;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.response = action.payload.message;
        });

        builder.addCase(getPrograms.rejected, setError);

        builder.addCase(getPrograms.pending, setPending);

        builder.addCase(createProgram.fulfilled, (state, action) => {
            state.status = "idle";
            state.programs.push(action.payload.program);
            state.response = action.payload.message;
        });

        builder.addCase(createProgram.rejected, setError);

        builder.addCase(createProgram.pending, setPending);

        builder.addCase(editProgram.fulfilled, (state, action) => {
            state.status = "idle";
            state.programs = state.programs.map((program) => {
                if (program._id === action.meta.arg._id) {
                    return {
                        dayName: action.meta.arg.dayName,
                        exercises: action.meta.arg.exercises,
                        date: action.meta.arg.date,
                    };
                }
                return program;
            });
            state.response = action.payload.message;
        });

        builder.addCase(editProgram.rejected, setError);

        builder.addCase(editProgram.pending, setPending);

        builder.addCase(deleteProgram.fulfilled, (state, action) => {
            state.status = "idle";
            state.programs = state.programs.filter(
                (program) => program._id !== action.meta.arg._id
            );
        });

        builder.addCase(deleteProgram.rejected, setError);

        builder.addCase(deleteProgram.pending, setPending);
    },
});

export const { moveToPage } = ProgramSlice.actions;
export const selectPrograms = (state: RootState) => state.programs.programs;
export const selectPages = (state: RootState) => state.programs.pages;
export const selectPage = (state: RootState) => state.programs.page;
export default ProgramSlice.reducer;

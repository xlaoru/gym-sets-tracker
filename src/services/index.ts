import axios from "axios";
import { INewProgramObject } from "../utils/models";

const PORT = "https://gym-sets-tracker-server-1.onrender.com"

export function getPrograms() {
  return axios.get(`${PORT}/api/programs`);
}

export function createProgram(program: INewProgramObject) {
  return axios.post(`${PORT}/api/programs`, program);
}

export function editProgram(program: INewProgramObject, id: string) {
    return axios.put(`${PORT}/api/programs/${id}`, program);
}

export function deleteProgram(id: string) {
  console.log(`${PORT}/api/programs/${id}`);
  return axios.delete(`${PORT}/api/programs/${id}`);
}
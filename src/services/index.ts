import axios from "axios";
import { INewProgramObject } from "../utils/models";

export function getPrograms() {
  return axios.get("http://localhost:3001/api/programs");
}

export function createProgram(program: INewProgramObject) {
  return axios.post("http://localhost:3001/api/programs", program);
}

export function editProgram(program: INewProgramObject, id: string) {
    return axios.put(`http://localhost:3001/api/programs/${id}`, program);
}

export function deleteProgram(id: string) {
  return axios.delete(`http://localhost:3001/api/programs/${id}`);
}
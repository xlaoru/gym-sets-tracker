import axios from "axios";
import { INewProgramObject } from "../utils/models";

export function getPrograms() {
  return axios.get("http://localhost:3001/api");
}

export function createProgram(program: INewProgramObject) {
  return axios.post("http://localhost:3001/api/add", program);
}
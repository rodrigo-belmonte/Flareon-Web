import axios from "axios";
import { api } from "./api";

const logout = () => {
  localStorage.removeItem("isAuth");
  return api.post("/auth/logout").then((response) => {
    return response.data;
  });
};
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

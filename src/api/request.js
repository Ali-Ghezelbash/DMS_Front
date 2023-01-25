import Axios from "axios";

export const request = Axios.create({
  baseURL: "http://localhost:3001/api/",
  timeout: 1000,
});

const token = localStorage.getItem("token");

if (token) {
  request.defaults.headers.common["x-access-token"] = token;
}

export default request;

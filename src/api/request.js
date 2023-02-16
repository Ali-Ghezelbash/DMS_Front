import Axios from "axios";

export const request = Axios.create({
  baseURL: "http://localhost:3000/api/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

const token = localStorage.getItem("token");

if (token) {
  request.defaults.headers.common["x-access-token"] = token;
}

export default request;

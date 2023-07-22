import Axios from "axios";
import { tokenManager } from "utils";

export const request = Axios.create({
  baseURL: "http://localhost:3000/api/",
  timeout: 1000,
});

const token = tokenManager.getToken();

if (token) {
  request.defaults.headers.common["x-access-token"] = token;
}

export default request;

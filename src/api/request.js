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

request.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      tokenManager.deleteToken();
      window.location.pathname = "login";
    }
    return Promise.reject(error);
  }
);

export default request;

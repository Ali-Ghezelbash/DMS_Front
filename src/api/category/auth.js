import request from "api/request";

export const auth = {
  login: (body) => request.post("/auth/login", body),
};

import request from "api/request";

export const document = {
  list: () => request.get("/documents"),
  create: (body) => request.post("/users", body),
};

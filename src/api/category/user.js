import request from "api/request";

export const user = {
  list: () => request.get("/users"),
  create: (body) => request.post("/users", body),
};

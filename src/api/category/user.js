import request from "api/request";

export const user = {
  list: () => request.get("/users"),
  create: (body) => request.post("/users", body),
  update: (body) => request.put("/users", body),
  delete: (id) => request.delete(`/users/${id}`),
};

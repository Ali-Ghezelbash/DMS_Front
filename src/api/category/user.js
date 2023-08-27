import request from "api/request";

export const user = {
  list: () => request.get("/users"),
  getItem: (id) => request.get(`/users/${id}`),
  create: (body) => request.post("/users", body),
  update: (body) => request.put("/users", body),
  changePassword: (body) => request.put("/users/changePassword", body),
  delete: (id) => request.delete(`/users/${id}`),
};

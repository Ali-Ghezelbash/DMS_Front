import request from "api/request";

export const role = {
  list: () => request.get("/roles"),
  getItem: (id) => request.get(`/roles/${id}`),
  create: (body) => request.post("/roles", body),
  update: (body) => request.put("/roles", body),
  delete: (id) => request.delete(`/roles/${id}`),
};

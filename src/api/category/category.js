import request from "api/request";

export const category = {
  list: () => request.get("/categories"),
  getItem: (id) => request.get(`/categories/${id}`),
  create: (body) => request.post("/categories", body),
  update: (body) => request.put("/categories", body),
  delete: (id) => request.delete(`/categories/${id}`),
};

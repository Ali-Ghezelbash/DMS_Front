import request from "api/request";

export const document = {
  list: () => request.get("/documents"),
  create: (body) => request.post("/documents", body),
  update: (body) => request.put("/documents", body),
  delete: (id) => request.delete(`/documents/${id}`),
};

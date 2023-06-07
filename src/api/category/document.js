import request from "api/request";

export const document = {
  list: (params) => request.get("/documents", {params}),
  create: (body) => request.post("/documents", body),
  update: (body) => request.put("/documents", body),
  delete: (id) => request.delete(`/documents/${id}`),
};

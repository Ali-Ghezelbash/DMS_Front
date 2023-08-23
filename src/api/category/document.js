import request from "api/request";

export const document = {
  list: (params) => request.get("/documents", { params }),
  getItem: (id) => request.get(`/documents/${id}`),
  create: (body) =>
    request.post("/documents", body, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (body) => request.put("/documents", body),
  delete: (id) => request.delete(`/documents/${id}`),
};

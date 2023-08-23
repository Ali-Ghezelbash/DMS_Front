import request from "api/request";

export const comment = {
  list: (params) => request.get("/comments", { params }),
  create: (body) => request.post("/comments", body),
  update: (body) => request.put("/comments", body),
  delete: (id) => request.delete(`/comments/${id}`),
};

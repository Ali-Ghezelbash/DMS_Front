import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { api } from "api";
import { DeleteConfirm } from "components";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { tokenManager } from "utils";

export default function DocumentPage() {
  const navigate = useNavigate();
  let { id: defaultId } = useParams();

  const [id, setId] = useState(defaultId);

  const { data: comments, refetch } = useQuery("comment", () =>
    api.comment.list(id)
  );
  const { data: documentData } = useQuery(
    ["GET_DOCUMENT_ITEM", id],
    () => api.document.getItem(id),
    { enabled: !!id }
  );
  const { data: documentVersions } = useQuery(
    ["GET_DOCUMENTVERSION_ITEM", documentData?.data.documentKey],
    () => api.document.getversions(documentData?.data.documentKey),
    { enabled: !!id && !!documentData }
  );

  const [comment, setComment] = useState("");

  const handleDeleteComment = async (commentId) => {
    await api.comment.delete(commentId);
    refetch();
  };

  const handleCreateComment = async (comment) => {
    await api.comment.create(comment);
    setComment("");
    refetch();
  };

  const handleChangeVersion = (e) => {
    setId(e.target.value);
  };

  return (
    <Stack gap={2}>
      <form>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ backgroundColor: "#f5f5f5", p: 2 }}
        >
          <Button
            variant="outlined"
            sx={{ width: 120, padding: 1, margin: 2 }}
            onClick={() => navigate("/documents")}
          >
            بازگشت
          </Button>
        </Stack>
        <Box sx={{ p: 3 }}>
          <Typography sx={{ padding: 2 }}>
            عنوان : {documentData?.data.title}
          </Typography>
          <Divider light />
          <Typography sx={{ padding: 2 }}>
            توضیحات : {documentData?.data.description}
          </Typography>
          <Divider light />
          <Typography sx={{ padding: 2 }}>
            دسته‌بندی : {documentData?.data.category.name}
          </Typography>
          <Divider light />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ padding: 2 }}>نسخه :</Typography>
            {documentVersions?.data.length <= 1 ? (
              <Typography sx={{ padding: 2 }}>
                {documentData?.data.version}
              </Typography>
            ) : (
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-simple-select-label"></InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={id}
                  onChange={handleChangeVersion}
                >
                  {documentVersions?.data.map((doc) => (
                    <MenuItem key={doc.id} value={doc.id}>
                      {doc.version}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
          <Divider light />
          <Typography sx={{ padding: 2 }}>
            فایل پیوست :{" "}
            <Link
              href={"http://localhost:3000/uploads/" + documentData?.data.file}
              target="_blank"
            >
              دانلود
            </Link>
          </Typography>
          <Divider light />
          <Typography sx={{ pt: 2 }} variant="h6">
            نظرات
          </Typography>
          <div>
            <TextField
              margin="dense"
              label="نظر خود را بنویسید"
              multiline
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ width: 120, padding: 1, margin: 2, marginLeft: 1 }}
              onClick={() => {
                handleCreateComment({
                  message: comment,
                  userId: tokenManager.userIdToken(),
                  documentId: id,
                });

                refetch();
              }}
              disabled={comment === "" ? true : false}
            >
              ثبت
            </Button>
          </div>
          <List
            sx={{ width: "100%", maxWidth: 1360, bgcolor: "background.paper" }}
          >
            {comments?.data.map((item) => (
              <>
                <ListItem key={item.id} alignItems="flex-start">
                  <ListItemText
                    primary={
                      <>
                        {tokenManager.isAdmin ||
                        tokenManager.userIdToken() === item.userId ? (
                          <DeleteConfirm
                            onDelete={() => {
                              handleDeleteComment(item.id);
                            }}
                          />
                        ) : null}
                        <Typography variant="caption" sx={{ fontSize: "15px" }}>
                          {item.message}
                        </Typography>
                      </>
                    }
                    secondary={
                      <Typography variant="caption">
                        {item.user.username}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            ))}
          </List>
        </Box>
      </form>
    </Stack>
  );
}

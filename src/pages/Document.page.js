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
  let { id } = useParams();
  console.log(id);

  const { data: comments, refetch } = useQuery("comment", () =>
    api.comment.list(id)
  );
  const { data: listRoles } = useQuery("roles", api.role.list);
  const { data: listCategories } = useQuery("categories", api.category.list);
  const { data: documentData } = useQuery(
    "GET_DOCUMENT_ITEM",
    () => api.document.getItem(id),
    { enabled: !!id && !!listCategories && !!listRoles }
  );
  console.log(documentData?.data);

  const [file, setFile] = useState();
  const [emptyFile, setEmptyFile] = useState(false);
  const [newVersion, setNewVersion] = useState(false);
  const [oldVersion, setOldVersion] = useState(true);
  const [comment, setComment] = useState();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setEmptyFile(false);
      setOldVersion(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    await api.comment.delete(commentId);
    refetch();
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm(documentData?.data);

  useEffect(() => {
    if (documentData?.data)
      reset({
        ...documentData.data,
        roles: documentData.data.document_roles.map((i) => i.role.id),
      });
    else
      reset({
        title: "",
        description: "",
        roles: [],
        categoryId: "",
      });
  }, [id]);

  const mutation = useMutation(
    newVersion ? api.document.create : api.document.update,
    {
      onSuccess: () => {
        reset({
          title: "",
          description: "",
          roles: [],
          categoryId: "",
        });
        navigate("/documents");
      },
    }
  );

  const mutationComment = useMutation(api.comment.create, {
    onSuccess: () => {
      setComment("");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("roles", JSON.stringify(data.roles));
    formData.append("categoryId", data.categoryId);
    if (!newVersion) formData.append("id", id);
    if (newVersion) formData.append("documentKey", id);
    if (file) {
      formData.append("file", file);
    } else if (!file) {
      formData.append("fileName", data.file);
    }
    mutation.mutate(formData);
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
          <Typography variant="h5">مستند</Typography>
          <div>
            <Button
              variant="contained"
              sx={{ width: 120, padding: 1, margin: 2 }}
              onClick={handleSubmit(onSubmit)}
            >
              ثبت
            </Button>
            <Button
              variant="outlined"
              sx={{ width: 120, padding: 1, margin: 2 }}
              onClick={() => navigate("/documents")}
            >
              لغو
            </Button>
          </div>
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
          <Typography sx={{ padding: 2 }}>نسخه :</Typography>
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
                mutationComment.mutate({
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

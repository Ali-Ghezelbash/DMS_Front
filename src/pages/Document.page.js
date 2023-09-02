import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { api } from "api";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { tokenManager } from "utils";

export default function DocumentPage() {
  const navigate = useNavigate();
  let { id } = useParams();

  console.log({ id });
  const location = useLocation();
  const documentId = location.state;

  const { data: comments, refetch } = useQuery("comment", () =>
    api.comment.list(documentId)
  );
  const { data: listRoles } = useQuery("roles", api.role.list);
  const { data: listCategories } = useQuery("categories", api.category.list);
  const { data: documentData } = useQuery(
    "GET_DOCUMENT_ITEM",
    () => api.document.getItem(documentId),
    { enabled: !!documentId && !!listCategories && !!listRoles }
  );

  const [file, setFile] = useState();
  const [emptyFile, setEmptyFile] = useState(false);
  const [newVersion, setNewVersion] = useState(false);
  const [oldVersion, setOldVersion] = useState(true);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setEmptyFile(false);
      setOldVersion(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    api.comment.delete(commentId);
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
  }, [documentId]);

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

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("roles", JSON.stringify(data.roles));
    formData.append("categoryId", data.categoryId);
    if (!newVersion) formData.append("id", documentId);
    if (newVersion) formData.append("documentKey", documentId);
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
          <Typography>عنوان : {documentData?.title}</Typography>

          <Typography>توضیحات :</Typography>
          <Typography>دسترسی به نقش های :</Typography>
          <Typography>دسته‌بندی :</Typography>
          <Typography>نسخه :</Typography>
          <Typography>فایل پیوست :</Typography>
          <Typography sx={{ pt: 2 }} variant="h6">
            نظرات
          </Typography>
          <div>
            <TextField margin="dense" label="نظر خود را بنویسید" fullWidth />
            <Button
              variant="contained"
              sx={{ width: 120, padding: 1, margin: 2, marginLeft: 1 }}
              onClick={() => {
                reset();
                navigate("/documents");
              }}
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
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleDeleteComment(item.id)}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
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

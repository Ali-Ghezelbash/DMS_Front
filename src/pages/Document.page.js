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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { tokenManager } from "utils";

export default function DocumentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const documentId = location.state;

  const { data: comments, refetch } = useQuery("comment", () => api.comment.list(documentId));
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
    refetch()
  }

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
      })
    else reset({
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
          <TextField
            margin="dense"
            label="عنوان"
            fullWidth
            helperText={errors.title ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.title)}
            {...register("title", { required: true })}
          />
          <TextField
            margin="dense"
            label="توضیحات"
            fullWidth
            inputProps={{ ...register("description", { required: true }) }}
            helperText={errors.description ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.description)}
          />
          <Controller
            control={control}
            name="roles"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl fullWidth margin="dense" error={error}>
                <InputLabel>دسترسی به نقش های</InputLabel>
                <Select
                  multiple
                  required
                  value={value ? value : []}
                  input={<OutlinedInput label="دسترسی به نقش های" />}
                  renderValue={(selected) =>
                    listRoles?.data
                      .filter((i) => selected.includes(i.id))
                      .map((i) => i.name)
                      .join(" | ")
                  }
                  onChange={onChange}
                >
                  {listRoles?.data.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      <ListItemText primary={role.name} />
                    </MenuItem>
                  ))}
                </Select>
                {error ? (
                  <FormHelperText>این فیلد الزامی است</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="categoryId"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl fullWidth margin="dense" error={error}>
                <InputLabel>دسته‌بندی</InputLabel>
                <Select
                  value={value}
                  input={<OutlinedInput label="دسته‌بندی" />}
                  onChange={onChange}
                >
                  {listCategories?.data.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <ListItemText primary={category.name} />
                    </MenuItem>
                  ))}
                </Select>
                {error && (
                  <FormHelperText>این فیلد الزامی است</FormHelperText>
                )}
              </FormControl>
            )}
          />
          {/* <Controller
            control={control}
            name="categoryId"
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel>نسخه</InputLabel>
                <Select
                  value={value}
                  input={<OutlinedInput label="نسخه" />}
                  onChange={onChange}
                >
                  {listCategories?.data.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <ListItemText primary={category.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          /> */}
          <TextField
            label="فایل پیوست"
            name="upload-photo"
            type="file"
            margin="dense"
            fullWidth
            onChange={handleFileChange}
            error={emptyFile}
            helperText={emptyFile ? "این فیلد الزامی است" : undefined}
            dir="ltr"
          />
          {oldVersion && (
            <div>
              <Link
                href={
                  "http://localhost:3000/uploads/" + documentData?.data.file
                }
                target="_blank"
              >
                فایل پیوست
              </Link>
            </div>
          )}
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={newVersion}
                onChange={() => setNewVersion(!newVersion)}
              />
            }
            label="نسخه جدید"
          />
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

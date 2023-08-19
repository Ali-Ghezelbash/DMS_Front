import {
  Box,
  Button,
  Paper,
  Menu,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
  OutlinedInput,
  TextField,
  Link,
  Checkbox,
  FormHelperText,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { api } from "api";
import { DocumentForm } from "components";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Route, useLocation, useNavigate } from "react-router-dom";

export default function DocumentPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [document, setdDocument] = useState(location.state);
  const { data: listRoles } = useQuery("roles", api.role.list);
  const { data: listCategories } = useQuery("categories", api.category.list);
  const [file, setFile] = useState();
  const [emptyFile, setEmptyFile] = useState(false);
  const [oldFile, setOldFile] = useState(document?.file);
  const [newVersion, setNewVersion] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setEmptyFile(false);
    }
  };

  const handleDeleteOldFile = () => {
    setEmptyFile(false);
    setOldFile(null);
  };

  const handleChangeNewVersion = (event) => {
    setNewVersion(event.target.checked);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm(document);

  useEffect(() => {
    if (document) reset(document);
    else
      reset({
        title: "",
        description: "",
        roles: [],
        categories: [],
      });
  }, [document, reset]);

  useEffect(() => {
    setOldFile(document?.file);
  }, [document]);

  const mutation = useMutation(
    document
      ? newVersion
        ? api.document.create
        : api.document.update
      : api.document.create,
    {
      onSuccess: () => {
        // handleClose();
        queryClient.invalidateQueries("documents");
        reset();
      },
    }
  );

  const onSubmit = (data) => {
    const formData = new FormData();
    if (document && !newVersion) formData.append("id", data.id);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("active", "1");
    formData.append("roles", JSON.stringify(data.roles));
    formData.append("category_id", data.category_id);

    if (!file && !oldFile) return setEmptyFile(true);

    if (file) {
      formData.append("file", file);
      formData.append("version", "1");
    } else if (oldFile) {
      formData.append("fileName", oldFile);
      formData.append("version", "1");
    }
    mutation.mutate(
      formData
    );
  };

  return (
    <Stack gap={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "#f5f5f5", p: 2 }}
      >
        <Typography variant="h5">مستند</Typography>
        {/* <Button variant="contained" onClick={console.log()}>
          ویرایش
        </Button> */}
        <div >
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
            onClick={() => {navigate("/documents");}}
            // onClick={() => {
            //   //handleClose();
            //   reset();
            // }}
          >
            لغو
          </Button>
        </div>
      </Stack>
      <Box sx={{ p: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="عنوان"
          fullWidth
          defaultValue={document ? document.title : ""}
          inputProps={{ ...register("title", { required: true }) }}
          helperText={errors.title ? "این فیلد الزامی است" : undefined}
          error={Boolean(errors.title)}
        />
        <TextField
          autoFocus
          margin="dense"
          label="توضیحات"
          fullWidth
          defaultValue={document ? document.description : ""}
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
              {(error) ? <FormHelperText>این فیلد الزامی است</FormHelperText> : null}
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="category_id"
          render={({ field: { onChange, value } }) => (
            <FormControl fullWidth margin="dense">
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
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="category_id"
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
        />
        <TextField
          label="فایل پیوست"
          name="upload-photo"
          type="file"
          margin="dense"
          fullWidth
          onChange={handleFileChange}
          error={emptyFile}
          dir="ltr"
        />
        <Typography
          sx={{ pt: 2 }}
          variant="h6">
          نظرات
        </Typography>
        <List sx={{ width: '100%', maxWidth: 1360, bgcolor: 'background.paper' }}>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary="خیلی ممنون"
              secondary={
                <Typography variant="caption">
                  {"علی قزلباش"}
                </Typography>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemText
              primary="Summer BBQ"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    علی قزلباش
                  </Typography>
                  {" — خیلی ممنون"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemText
              primary="Oui Oui"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Sandra Adams
                  </Typography>
                  {' — Do you have Paris recommendations? Have you ever…'}
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </Box>
    </Stack>
  );
}

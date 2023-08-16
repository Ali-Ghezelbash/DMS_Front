import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Link,
  IconButton,
  Checkbox,
  FormHelperText
} from "@mui/material";
import { api } from "api";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CloseIcon from "@mui/icons-material/Close";
import FormControlLabel from "@mui/material/FormControlLabel";

export const DocumentForm = ({ show, handleClose, document, refetch }) => {
  const queryClient = useQueryClient();
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
    //document ? api.document.update : api.document.create,
    document
      ? newVersion
        ? api.document.create
        : api.document.update
      : api.document.create,
    {
      onSuccess: () => {
        handleClose();
        queryClient.invalidateQueries("documents");
        reset();
        refetch();
      },
    }
  );

  const onSubmit = (data) => {
    const formData = new FormData();
    console.log(data.id)
    console.log("newVersion --- ", newVersion)
    if(!newVersion)formData.append("id", data.id);
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
      // document
      //   ? { ...data, id: document.id, file }
      //   : { ...data, version: 1, active: 1, file }
    );
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <form>
        <DialogTitle>{document ? "ویرایش" : "ایجاد"} سند</DialogTitle>
        <DialogContent>
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
                { (error) ?<FormHelperText>این فیلد الزامی است</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="category_id"
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
                { (error) ?<FormHelperText>این فیلد الزامی است</FormHelperText> : null}
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
          {oldFile ? (
            <div>
              <Link
                href={"http://localhost:3000/uploads/" + oldFile}
                target="_blank"
              >
                فایل پیوست
              </Link>
              <IconButton size="small" onClick={handleDeleteOldFile}>
                <CloseIcon fontSize="16px" />
              </IconButton>
            </div>
          ) : null}
          {document ? (
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={newVersion}
                  onChange={handleChangeNewVersion}
                />
              }
              label="نسخه جدید"
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              reset();
            }}
          >
            لغو
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>ثبت</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

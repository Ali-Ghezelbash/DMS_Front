import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormControlLabel from "@mui/material/FormControlLabel";
import { api } from "api";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

export const DocumentForm = ({ onClose, documentId, refetch }) => {
  const { data: listRoles } = useQuery("roles", api.role.list);
  const { data: listCategories } = useQuery("categories", api.category.list);
  const { data: documentData } = useQuery(
    "GET_DOCUMENT_ITEM",
    () => api.document.getItem(documentId),
    { enabled: !!documentId && !!listCategories && !!listRoles }
  );

  const [file, setFile] = useState(null);
  const [emptyFile, setEmptyFile] = useState(documentId ? false : true);
  const [newVersion, setNewVersion] = useState(false);
  const [oldVersion, setOldVersion] = useState(documentId ? true : false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setEmptyFile(false);
      setOldVersion(false);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm(documentData?.data);

  useEffect(() => {
    if (documentData)
      reset({
        ...documentData?.data,
        roles: documentData?.data.document_roles.map((i) => i.role.id),
      });
    else
      reset({
        title: "",
        description: "",
        roles: [],
        categoryId: "",
      });
  }, [documentData]);

  const mutation = useMutation(
    !documentId || newVersion ? api.document.create : api.document.update,
    {
      onSuccess: () => {
        onClose();
        reset({
          title: "",
          description: "",
          roles: [],
          categoryId: "",
        });
        refetch();
      },
    }
  );

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("roles", JSON.stringify(data.roles));
    formData.append("categoryId", data.categoryId);
    if (documentId && !newVersion) formData.append("id", documentId);
    if (newVersion) formData.append("documentKey", documentId);
    if (!documentId) formData.append("version", 1);
    if (documentId && newVersion) formData.append("version", (documentData?.data.version)+1);
    if (file) {
      formData.append("file", file);
    } else if (!file) {
      formData.append("fileName", data.file);
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <form>
        <DialogTitle>{documentId ? "ویرایش" : "ایجاد"} سند</DialogTitle>
        <DialogContent>
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
            multiline
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
                {error && <FormHelperText>این فیلد الزامی است</FormHelperText>}
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
          {documentId && (
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={newVersion}
                  onChange={() => 
                    {
                      setNewVersion(!newVersion)
                      setEmptyFile(true)
                      setOldVersion(false)
                    }
                  }
                />
              }
              label="نسخه جدید"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose();
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

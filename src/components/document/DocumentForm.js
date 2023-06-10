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
} from "@mui/material";
import { api } from "api";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const DocumentForm = ({ show, handleClose, document }) => {
  const queryClient = useQueryClient();
  const { data: listRoles } = useQuery("roles", api.role.list);
  const { data: listCategories } = useQuery("categories", api.category.list);
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

  const mutation = useMutation(
    document ? api.document.update : api.document.create,
    {
      onSuccess: () => {
        handleClose();
        queryClient.invalidateQueries("documents");
        reset();
      },
    }
  );

  const onSubmit = (data) =>
    mutation.mutate(document ? { ...data, id: document.id } : data);

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
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel>دسترسی به نقش های</InputLabel>
                <Select
                  multiple
                  options={[{ id: 1, lable: "admin" }]}
                  value={value ? value : []}
                  input={<OutlinedInput label="نقش ها" />}
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
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="categories"
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel>دسته‌بندی</InputLabel>
                <Select
                  multiple
                  options={[{ id: 1, lable: "admin" }]}
                  value={value ? value : []}
                  input={<OutlinedInput label="دسته‌بندی" />}
                  renderValue={(selected) =>
                    listCategories?.data
                      .filter((i) => selected.includes(i.id))
                      .map((i) => i.name)
                      .join(" | ")
                  }
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
            dir="ltr"
          />
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

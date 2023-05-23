import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { api } from "api";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

export const CategoryForm = ({ show, handleClose, category }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    reset,
  } = useForm(category);

  useEffect(() => {
    if (category) reset(category);
    else reset({ name: "", value: "" });
  }, [category, reset]);

  const mutation = useMutation(
    category ? api.category.update : api.category.create,
    {
      onSuccess: () => {
        handleClose();
        queryClient.invalidateQueries("categories");
        reset();
      },
    }
  );

  const onSubmit = (data) =>
    mutation.mutate(category ? { ...data, id: category.id } : data);

  return (
    <Dialog open={show} onClose={handleClose}>
      <form>
        <DialogTitle>{category ? "ویرایش" : "ایجاد"} دسته‌بندی</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="نام"
            fullWidth
            inputProps={{ ...register("name", { required: true }) }}
            helperText={errors.name ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.name)}
          />

          <TextField
            margin="dense"
            label="کد"
            fullWidth
            inputProps={{ ...register("value", { required: true }) }}
            helperText={errors.value ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
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

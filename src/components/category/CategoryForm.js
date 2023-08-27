import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { api } from "api";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const CategoryForm = ({ onClose, categoryId, refetch }) => {

  const { data: categoryData } = useQuery(
    "GET_CATEGORY_ITEM",
    () => api.category.getItem(categoryId),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(categoryData?.data);

  useEffect(() => {
    if (categoryData?.data) reset(categoryData?.data);
    else reset({ name: ""});
  }, [categoryData]);

  const mutation = useMutation(
    categoryId ? api.category.update : api.category.create,
    {
      onSuccess: () => {
        onClose();
        reset();
        refetch();
      },
    }
  );

  const onSubmit = (data) =>
    mutation.mutate(categoryData ? { ...data, id: categoryData?.data.id } : data);

  return (
    <Dialog open={true} onClose={onClose}>
      <form>
        <DialogTitle>{categoryData?.data ? "ویرایش" : "ایجاد"} دسته‌بندی</DialogTitle>
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

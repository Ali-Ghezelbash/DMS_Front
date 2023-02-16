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

export const RoleForm = ({ show, handleClose, role }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    reset,
  } = useForm(role);

  useEffect(() => {
    if (role) reset(role);
    else reset({ name: "", key: "", isAdmin: false });
  }, [role, reset]);

  const mutation = useMutation(role ? api.role.update : api.role.create, {
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries("roles");
      reset();
    },
  });

  const onSubmit = (data) =>
    mutation.mutate(role ? { ...data, id: role.id } : data);

  return (
    <Dialog open={show} onClose={handleClose}>
      <form>
        <DialogTitle>{role ? "ویرایش" : "ایجاد"} نقش</DialogTitle>
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
            inputProps={{ ...register("key", { required: true }) }}
            helperText={errors.key ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.key)}
          />

          <Controller
            name="isAdmin"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={getValues("isAdmin")}
                    margin="dense"
                    {...field}
                  />
                }
                label="ادمین"
              />
            )}
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

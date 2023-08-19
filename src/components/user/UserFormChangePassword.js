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

export const UserFormChangePassword = ({ show, handleClose, user }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const mutation = useMutation(api.user.changePassword, {
    onSuccess: (res) => {
      handleClose();
      queryClient.invalidateQueries("users");
      reset();
    },
  });

  useEffect(() => {
    reset({
      password: "",
      confirmPassword: "",
    });
  }, [user, reset]);

  const onSubmit = (data) => {
    const res = { password: data.password, id: user.id };
    mutation.mutate(res);
  };
  return (
    <Dialog open={show} onClose={handleClose}>
      <form>
        <DialogTitle>تغییر رمزعبور</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="رمز عبور"
            fullWidth
            inputProps={{ ...register("password", { required: true }) }}
            helperText={errors.password ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.password)}
          />

          <TextField
            margin="dense"
            label="تایید رمز عبور"
            fullWidth
            inputProps={{ ...register("confirmPassword", { required: true }) }}
            helperText={
              errors.confirmPassword ? "این فیلد الزامی است" : undefined
            }
            error={Boolean(errors.confirmPassword)}
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

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

export const UserFormChangePassword = ({ onClose, userId, refetch }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const mutation = useMutation(api.user.changePassword, {
    onSuccess: (res) => {
      onClose();
      reset();
      refetch();
    },
  });

  useEffect(() => {
    reset({
      password: "",
    });
  }, [userId]);

  const onSubmit = (data) => {
    const res = { password: data.password, id: userId };
    mutation.mutate(res);
  };
  return (
    <Dialog open={true} onClose={onClose}>
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

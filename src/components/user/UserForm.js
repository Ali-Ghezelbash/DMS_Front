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

export const UserForm = ({ show, handleClose, user }) => {
  const queryClient = useQueryClient();
  const { data } = useQuery("roles", api.role.list);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const mutation = useMutation(user ? api.user.update : api.user.create, {
    onSuccess: (res) => {
      handleClose();
      queryClient.invalidateQueries("users");
      reset();
    },
  });

  useEffect(() => {
    if (user) reset(user);
    else
      reset({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        roles: [],
      });
  }, [user, reset]);

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <Dialog open={show} onClose={handleClose}>
      <form>
        <DialogTitle>{user ? "ویرایش" : "ایجاد"} کاربر</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="نام"
            fullWidth
            defaultValue={user ? user.firstname : ""}
            inputProps={{ ...register("firstname", { required: true }) }}
            helperText={errors.firstname ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.firstname)}
          />

          <TextField
            margin="dense"
            label="نام خانوادگی"
            fullWidth
            defaultValue={user ? user.lastname : ""}
            inputProps={{ ...register("lastname", { required: true }) }}
            helperText={errors.lastname ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.lastname)}
          />
          <TextField
            margin="dense"
            label="نام کاربری"
            fullWidth
            defaultValue={user ? user.username : ""}
            inputProps={{ ...register("username", { required: true }) }}
            helperText={errors.username ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.username)}
          />
          <TextField
            margin="dense"
            label="کلمه عبور"
            type="password"
            fullWidth
            defaultValue={user ? user.password : ""}
            inputProps={{ ...register("password", { required: true }) }}
            helperText={errors.password ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.password)}
          />

          <Controller
            control={control}
            name="roles"
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel>نقش ها</InputLabel>
                <Select
                  multiple
                  value={value ? value : []}
                  input={<OutlinedInput label="نقش ها" />}
                  renderValue={(selected) =>
                    data?.data
                      .filter((i) => selected.includes(i.key))
                      .map((i) => i.name)
                      .join(" | ")
                  }
                  onChange={onChange}
                >
                  {data?.data.map((role) => (
                    <MenuItem key={role.key} value={role.key}>
                      <ListItemText primary={role.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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

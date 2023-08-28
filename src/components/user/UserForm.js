import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from "@mui/material";
import { api } from "api";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

export const UserForm = ({ onClose, userId, refetch }) => {
  const { data: listRoles } = useQuery("roles", api.role.list);
  const { data: userData } = useQuery(
    "GET_USER_ITEM",
    () => api.user.getItem(userId),
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm(userData?.data);

  useEffect(() => {
    if (userData?.data) reset({...userData?.data, roles: userData.data.user_roles.map((i) => i.role.id),
    });
    else
      reset({
        firstname: "",
        lastname: "",
        username: "",
        roles: [],
      });
  }, [userData]);

  const mutation = useMutation(userData?.data ? api.user.update : api.user.create, {
    onSuccess: (res) => {
      onClose();
      reset();
      refetch();
    },
  });

  const onSubmit = (data) =>
    mutation.mutate(userData ? { ...data, id: userData?.data.id } : data);

  return (
    <Dialog open={true} onClose={onClose}>
      <form>
        <DialogTitle>{userData?.data ? "ویرایش" : "ایجاد"} کاربر</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="نام"
            fullWidth
            defaultValue={userData?.data ? userData?.data.firstname : ""}
            inputProps={{ ...register("firstname", { required: true }) }}
            helperText={errors.firstname ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.firstname)}
          />

          <TextField
            margin="dense"
            label="نام خانوادگی"
            fullWidth
            defaultValue={userData?.data ? userData?.data.lastname : ""}
            inputProps={{ ...register("lastname", { required: true }) }}
            helperText={errors.lastname ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.lastname)}
          />
          <TextField
            margin="dense"
            label="نام کاربری"
            fullWidth
            defaultValue={userData?.data ? userData?.data.username : ""}
            inputProps={{ ...register("username", { required: true }) }}
            helperText={errors.username ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.username)}
          />
          { !userId && <TextField
            margin="dense"
            label="کلمه عبور"
            type="password"
            fullWidth
            defaultValue={userData?.data ? userData?.data.password : ""}
            inputProps={{ ...register("password", { required: true }) }}
            helperText={errors.password ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.password)}
          />}
          <Controller
            control={control}
            name="roles"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl fullWidth margin="dense" error={error}>
                <InputLabel>نقش ها</InputLabel>
                <Select
                  multiple
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
                {(error) ? <FormHelperText>این فیلد الزامی است</FormHelperText> : null}
              </FormControl>
            )}
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

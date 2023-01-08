import {
  Button,
  Checkbox,
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const UserForm = ({ show, handleClose, user }) => {
  const queryClient = useQueryClient();
  const { data } = useQuery("roles", api.role.list);
  const [personName, setPersonName] = useState([]);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm();

  const mutation = useMutation(api.user.create, {
    onSuccess: (res) => {
      handleClose();
      queryClient.invalidateQueries("users");
      reset();
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(" | ") : value);
  };

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

          <FormControl fullWidth margin="dense">
            <InputLabel>نقش ها</InputLabel>
            <Select
              multiple
              value={getValues("roles") || user ? user.roles : []}
              onChange={handleChange}
              input={<OutlinedInput label="نقش ها" />}
              inputProps={{ ...register("roles") }}
              renderValue={(selected) =>
                data?.data
                  .filter((i) => selected.includes(i.id))
                  .map((i) => i.name)
                  .join(" | ")
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
            >
              {data?.data.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  <Checkbox checked={personName.indexOf(role.id) > -1} />
                  <ListItemText primary={role.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

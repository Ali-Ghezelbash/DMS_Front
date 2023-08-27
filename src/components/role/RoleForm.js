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
import { useMutation, useQuery, useQueryClient } from "react-query";

export const RoleForm = ({ onClose, roleId, refetch }) => {

  const { data: roleData } = useQuery(
    "GET_ROLE_ITEM",
    () => api.role.getItem(roleId),
  );
  console.log("s ", roleData)


  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    reset,
  } = useForm(roleData?.data);

  useEffect(() => {
    if (roleData?.data) reset(roleData?.data);
    else reset({ name: "", isAdmin: false });
  }, [roleData?.data]);

  const mutation = useMutation(roleData?.data ? api.role.update : api.role.create, {
    onSuccess: () => {
      onClose();
      reset();
      refetch();
    },
  });

  const onSubmit = (data) =>
    mutation.mutate(roleData?.data ? { ...data, id: roleData?.data.id } : data);

  return (
    <Dialog open={true} onClose={onClose}>
      <form>
        <DialogTitle>{roleId ? "ویرایش" : "ایجاد"} نقش</DialogTitle>
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

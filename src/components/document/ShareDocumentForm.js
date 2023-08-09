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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const ShareDocumentForm = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm(document);


  const onSubmit = (data) => {
    if (!file) return setEmptyFile(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("version", "1");
    formData.append("active", "1");
    formData.append("category_id", data.category_id);
    formData.append("roles", JSON.stringify(data.roles));
    formData.append("file", file);

    mutation.mutate(
      formData
      // document
      //   ? { ...data, id: document.id, file }
      //   : { ...data, version: 1, active: 1, file }
    );
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <form>
        <DialogTitle>اشتراک گ</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="مدت زمان اعتبار"
            fullWidth
            defaultValue={1}
            helperText={errors.description ? "این فیلد الزامی است" : undefined}
            error={Boolean(errors.description)}
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

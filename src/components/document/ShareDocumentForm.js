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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm(document);


  const onSubmit = () => {
    mutation.mutate(
    );
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <form>
        <DialogTitle>اشتراک گذاری</DialogTitle>
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

import {
  Box,
  Button,
  Paper,
  Menu,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
  OutlinedInput,
  TextField,
  Link,
  Checkbox,
} from "@mui/material";
import { api } from "api";
import { DocumentForm } from "components";
import React from "react";
import { useMutation, useQuery } from "react-query";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";

export default function DocumentPage() {

  const { data: listRoles } = useQuery("roles", api.role.list);
  const { data: listCategories } = useQuery("categories", api.category.list);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm(document);

  return (
    <Stack gap={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "#f5f5f5", p: 2 }}
      >
        <Typography variant="h5">مستند</Typography>
        <Button variant="contained" onClick={console.log()}>
          ویرایش
        </Button>
      </Stack>
      <Box sx={{ p: 3 }}>
        <div>
          <TextField
            autoFocus
            margin="dense"
            label="عنوان"
            fullWidth
          // defaultValue={document ? document.title : ""}
          // inputProps={{ ...register("title", { required: true }) }}
          // helperText={errors.title ? "این فیلد الزامی است" : undefined}
          // error={Boolean(errors.title)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="توضیحات"
            fullWidth
          // defaultValue={document ? document.title : ""}
          // inputProps={{ ...register("title", { required: true }) }}
          // helperText={errors.title ? "این فیلد الزامی است" : undefined}
          // error={Boolean(errors.title)}
          />
          <Controller
            control={control}
            name="roles"
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel>دسترسی به نقش های</InputLabel>
                <Select
                  multiple
                  required
                  value={value ? value : []}
                  input={<OutlinedInput label="دسترسی به نقش های" />}
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
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="category_id"
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel>دسته‌بندی</InputLabel>
                <Select
                  value={value}
                  input={<OutlinedInput label="دسته‌بندی" />}
                  onChange={onChange}
                >
                  {listCategories?.data.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <ListItemText primary={category.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
      </Box>
    </Stack>
  );
}

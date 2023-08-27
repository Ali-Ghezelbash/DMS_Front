import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { api } from "api";
import { CategoryForm, DeleteConfirm } from "components";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";


export default function CategoriesPage() {
  const { data, isLoading, refetch } = useQuery(
    "categories",
    api.category.list
  );

  const { mutate } = useMutation({ mutationFn: api.category.delete });

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState();
  const headers = [
    "نام",
    "تاریخ ایجاد",
    "عملیات",
  ];

  const handleConfirmDelete = (categoryId) => {
    mutate(categoryId, { onSuccess: refetch });
  };

  if (isLoading) return <div>loading</div>;
  return (
    <Stack gap={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "#f5f5f5", p: 2 }}
      >
        <Typography variant="h5">لیست دسته‌بندی ها</Typography>
        <Button variant="contained" onClick={() => setShow(true)}>
          ایجاد دسته‌بندی
        </Button>
      </Stack>
      <Box sx={{ p: 3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {headers.map((item) => (
                  <TableCell key={item} align="center">
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">
                    {new Date(row.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => setEdit(row.id)}
                    >
                      <ModeEditOutlineIcon fontSize="small" />
                    </IconButton>
                    <DeleteConfirm onDelete={() => { handleConfirmDelete(row.id) }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {(show || edit) && (
        <CategoryForm
          onClose={() => {
            setShow(false);
            setEdit(undefined);
          }}
          refetch={refetch}
          categoryId={edit}
        />
      )}
    </Stack>
  );
}

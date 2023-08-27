import {
  Box,
  Button,
  IconButton,
  Menu,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { api } from "api";
import { DeleteConfirm, UserForm, UserFormChangePassword } from "components";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import PasswordIcon from '@mui/icons-material/Password';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

export default function UsersPage() {
  const { data, isLoading, refetch } = useQuery("users", api.user.list);
  const { mutate } = useMutation({ mutationFn: api.user.delete });

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState();
  const [openPassword, setOpenPassword] = React.useState(false);
  const headers = [
    "نام",
    "نام خانوادگی",
    "نام کاربری",
    "تاریخ ایجاد",
    "عملیات",
  ];

  const handleConfirmDelete = (userId) => {
    mutate(userId, { onSuccess: refetch });
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
        <Typography variant="h5">لیست کاربران</Typography>
        <Button variant="contained" onClick={() => setShow(true)}>
          ایجاد کاربر
        </Button>
      </Stack>
      <Box sx={{ p: 1 }}>
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
                  <TableCell align="center">{row.firstname}</TableCell>
                  <TableCell align="center">{row.lastname}</TableCell>
                  <TableCell align="center">{row.username}</TableCell>
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
                    <IconButton
                      color="primary"
                      size="small"
                      // onClick={() => handelEditPassword(row)}
                    >
                      <PasswordIcon fontSize="small" />
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
        <UserForm
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

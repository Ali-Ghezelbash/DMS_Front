import {
  Box,
  Button,
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
import { UserForm } from "components";
import React from "react";
import { useMutation, useQuery } from "react-query";

export default function UsersPage() {
  const { data, isLoading, refetch } = useQuery("users", api.user.list);
  const { mutate } = useMutation({ mutationFn: api.user.delete });

  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCloseDelete = () => {
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    setAnchorEl(null);
    mutate(user.id, { onSuccess: refetch });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setUser(undefined);
    setOpen(false);
  };

  const handelEdit = (user) => {
    setUser(user);
    setOpen(true);
  };

  const handelDelete = (e, user) => {
    setUser(user);
    setAnchorEl(e.currentTarget);
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
        <Button variant="contained" onClick={handleClickOpen}>
          ایجاد کاربر
        </Button>
      </Stack>
      <Box sx={{ p: 1 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">نام</TableCell>
                <TableCell align="center">نام خانوادگی</TableCell>
                <TableCell align="center">نام کاربری</TableCell>
                <TableCell align="center">تاریخ ایجاد</TableCell>
                <TableCell align="center">عملیات</TableCell>
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
                    <Button onClick={() => handelEdit(row)}>ویرایش</Button>
                    <Button color="error" onClick={(e) => handelDelete(e, row)}>
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <UserForm
        show={open}
        handleClose={handleClose}
        isCreate={true}
        user={user}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseDelete}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{ sx: { paddingInline: 1.5 } }}
      >
        <Button variant="contained" color="error" onClick={handleConfirmDelete}>
          تایید
        </Button>
        <Button onClick={handleCloseDelete}>لغو</Button>
      </Menu>
    </Stack>
  );
}

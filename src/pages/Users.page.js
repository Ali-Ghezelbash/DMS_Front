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
import { UserForm, UserFormChangePassword } from "components";
import React from "react";
import { useMutation, useQuery } from "react-query";
import PasswordIcon from '@mui/icons-material/Password';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

export default function UsersPage() {
  const { data, isLoading, refetch } = useQuery("users", api.user.list);
  const { mutate } = useMutation({ mutationFn: api.user.delete });

  const [open, setOpen] = React.useState(false);
  const [openPassword, setOpenPassword] = React.useState(false);
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

  const handleClosePassword = () => {
    setUser(undefined);
    setOpenPassword(false);
  };

  const handelEdit = (user) => {
    setUser(user);
    setOpen(true);
  };

  const handelEditPassword = (user) => {
    setUser(user);
    setOpenPassword(true);
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
                  <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handelEdit(row)}
                    >
                      <ModeEditOutlineIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handelEditPassword(row)}
                    >
                      <PasswordIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={(e) => handelDelete(e, row)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
      <UserFormChangePassword
        show={openPassword}
        user={user}
        handleClose={handleClosePassword}
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

import {
  Box,
  Button,
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
import { useQuery } from "react-query";

export default function DocumentsPage() {
  const { data, isLoading } = useQuery("document", api.document.list);
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState();

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

  if (isLoading) return <div>loading</div>;

  return (
    <Stack gap={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "#f5f5f5", p: 2 }}
      >
        <Typography variant="h5">لیست مستندات</Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          ایجاد مستند
        </Button>
      </Stack>
      <Box sx={{ p: 1 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">عنوان</TableCell>
                <TableCell align="center">توضیحات</TableCell>
                <TableCell align="center">دسته بندی</TableCell>
                <TableCell align="center">ایجاد کننده</TableCell>
                <TableCell align="center">تاریخ ایجاد</TableCell>
                <TableCell align="center">وضعیت</TableCell>
                <TableCell align="center">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center">{row.category_id}</TableCell>
                  <TableCell align="center">{row.user_id}</TableCell>
                  <TableCell align="center">
                    {new Date(row.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell align="center">{row.active}</TableCell>
                  {/*<TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">
                    {new Date(row.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell> */}
                  <TableCell align="center">
                    <Button onClick={() => handelEdit(row)}>ویرایش</Button>
                    <Button color="error">حذف</Button>
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
    </Stack>
  );
}

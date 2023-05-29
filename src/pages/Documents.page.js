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
} from "@mui/material";
import { api } from "api";
import { DocumentForm } from "components";
import React from "react";
import { useMutation, useQuery } from "react-query";

export default function DocumentsPage() {
  const { data, isLoading, refetch } = useQuery("document", api.document.list);
  const { mutate } = useMutation({ mutationFn: api.document.delete });
  const { data: listCategories } = useQuery("categories", api.category.list);
  console.log(listCategories);
  const [open, setOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCloseDelete = () => {
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    setAnchorEl(null);
    mutate(selectedDocument.id, { onSuccess: refetch });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedDocument(undefined);
    setOpen(false);
  };

  const handelEdit = (document) => {
    setSelectedDocument(document);
    setOpen(true);
  };

  const handelDelete = (e, document) => {
    setSelectedDocument(document);
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
        <Typography variant="h5">لیست مستندات</Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          ایجاد مستند
        </Button>
      </Stack>
      <Box sx={{ p: 3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">عنوان</TableCell>
                <TableCell align="center">توضیحات</TableCell>
                <TableCell align="center">دسته بندی</TableCell>
                <TableCell align="center">ایجاد کننده</TableCell>
                <TableCell align="center">تاریخ ایجاد</TableCell>
                {/* <TableCell align="center">وضعیت</TableCell> */}
                <TableCell align="center">فایل پیوست</TableCell>
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
                  {/* <TableCell align="center">{row.active}</TableCell> */}
                  <TableCell align="center">فایل</TableCell>
                  {/*<TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">
                    {new Date(row.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell> */}
                  <TableCell align="center">
                    <Button>مشاهده</Button>
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
      <DocumentForm
        show={open}
        handleClose={handleClose}
        isCreate={true}
        document={document}
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

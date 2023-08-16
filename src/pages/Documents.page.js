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
} from "@mui/material";
import { api } from "api";
import { DocumentForm } from "components";
import React from "react";
import { useMutation, useQuery } from "react-query";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

export default function DocumentsPage() {
  // const { data: filterData, isLoadingFilter, refetchFilter } = useQuery("document", () => api.document.list({categoryId: ""}));
  const { mutate } = useMutation({ mutationFn: api.document.delete });
  const [open, setOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [category_id, setCategory_id] = React.useState();
  const [userId, setuserId] = React.useState();

  const { data: listUsers } = useQuery("users", api.user.list);
  const { data: listCategories } = useQuery("categories", api.category.list);
  const { data, isLoading, refetch } = useQuery(
    ["document", category_id, userId],
    () => api.document.list({ category_id, userId })
  );
  const navigate = useNavigate();

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

  const categoryName = (id) => {
    const category = listCategories?.data.find((c) => c.id === id);
    return category?.name;
  };

  const handleChangeCategoty = (event) => {
    setCategory_id(event.target.value);
  };

  const handleChangeCreator = (event) => {
    setuserId(event.target.value);
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
        <div>
          <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
            <InputLabel id="demo-select-small-label">دسته‌بندی</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={category_id}
              label="دسته‌بندی"
              onChange={handleChangeCategoty}
              startAdornment={
                <IconButton
                  size="small"
                  sx={{ display: category_id ? "" : "none" }}
                  onClick={() => setCategory_id(undefined)}
                >
                  <CloseIcon fontSize="16px" />
                </IconButton>
              }
            >
              {listCategories?.data.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
            <InputLabel id="demo-select-small-label">ایجاد شده توسط</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={userId}
              label="ایجاد شده توسط"
              onChange={handleChangeCreator}
              startAdornment={
                <IconButton
                  size="small"
                  sx={{ display: userId ? "" : "none" }}
                  onClick={() => setuserId(undefined)}
                >
                  <CloseIcon fontSize="16px" />
                </IconButton>
              }
            >
              {listUsers?.data.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">عنوان</TableCell>
                <TableCell align="center">توضیحات</TableCell>
                <TableCell align="center">دسته بندی</TableCell>
                <TableCell align="center">ایجاد کننده</TableCell>
                <TableCell align="center">تاریخ ایجاد</TableCell>
                <TableCell align="center">نسخه</TableCell>
                <TableCell align="center">نظرات</TableCell>
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
                  <TableCell align="center">
                    {categoryName(row.category_id)}
                  </TableCell>
                  <TableCell align="center">{row.user?.username}</TableCell>
                  <TableCell align="center">
                    {new Date(row.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell align="center">
                    {row.version === 1 ? (
                      row.version
                    ) : (
                      <FormControl sx={{ m: 1, minWidth: 40 }} size="small">
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={1}
                          onChange={console.log}
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                  <TableCell align="center">مشاهده</TableCell>
                  <TableCell align="center">
                    <a
                      rel="noreferrer"
                      href={"http://localhost:3000/uploads/" + row.file}
                      target="_blank"
                    >
                      فایل
                    </a>
                  </TableCell>
                  <TableCell align="center">
                    <Button onClick={() => {navigate("/document", { state: row });}}>مشاهده</Button>
                    <Button>اشتراک گذاری</Button>
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
        document={selectedDocument}
        refetch={refetch}
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

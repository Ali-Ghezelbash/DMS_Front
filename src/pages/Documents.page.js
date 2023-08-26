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
  Typography,
} from "@mui/material";
import { api } from "api";
import { DeleteConfirm, DocumentForm } from "components";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function DocumentsPage() {
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery(["document"], () =>
    api.document.list()
  );
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState();
  const headers = [
    "عنوان",
    "توضیحات",
    "دسته بندی",
    "ایجاد کننده",
    "تاریخ ایجاد",
    "نسخه",
    "نظرات",
    "فایل پیوست",
    "عملیات",
  ];

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
        <Button onClick={() => setShow(true)}>افزودن</Button>
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
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center">{row.category.name}</TableCell>
                  <TableCell align="center">{row.user?.username}</TableCell>
                  <TableCell align="center">
                    {new Date(row.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell align="center">{row.version}</TableCell>
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
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => {
                        navigate("/document", { state: row.id });
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
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
                      // onClick={() => setEdit(row.id)}
                    >
                      <ShareIcon fontSize="small" />
                    </IconButton>
                    {/* <IconButton
                      color="primary"
                      size="small"
                      // onClick={() => setEdit(row.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton> */}
                    <DeleteConfirm onDelete={() => {}} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {(show || edit) && (
        <DocumentForm
          onClose={() => {
            setShow(false);
            setEdit(undefined);
          }}
          refetch={refetch}
          documentId={edit}
        />
      )}
    </Stack>
  );
}

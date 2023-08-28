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
import { DeleteConfirm, DocumentForm, ShareDocumentForm } from "components";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function DocumentsPage() {
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery(["document"], () =>
    api.document.list()
  );
  const { mutate } = useMutation({ mutationFn: api.document.delete });

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState();
  const [share, setShare] = useState();
  const headers = [
    "عنوان",
    "توضیحات",
    "دسته بندی",
    "ایجاد کننده",
    "تاریخ ایجاد",
    "نظرات",
    "فایل پیوست",
    "عملیات",
  ];

  const handleConfirmDelete = (documentId) => {
    mutate(documentId, { onSuccess: refetch });
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
        <Button variant="contained" onClick={() => setShow(true)}>افزودن</Button>
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
                  <TableCell align="center">{row.category?.name}</TableCell>
                  <TableCell align="center">{row.user?.username}</TableCell>
                  <TableCell align="center">
                    {new Date(row.createdAt).toLocaleDateString("fa-IR")}
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
                    onClick={() => setShare(row.id)}
                    >
                      <ShareIcon fontSize="small" />
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
        <DocumentForm
          onClose={() => {
            setShow(false);
            setEdit(undefined);
          }}
          refetch={refetch}
          documentId={edit}
        />
      )}
      {share &&
        (<ShareDocumentForm 
        onClose={() => {
          setShare(undefined);
        }}
        refetch={refetch}
        documentId={share}
        />
      )}
    </Stack>
  );
}

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

export default function DocumentPage() {

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
        
      </div>
      </Box>
    </Stack>
  );
}

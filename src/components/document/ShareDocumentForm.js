import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { api } from "api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

export const ShareDocumentForm = ({ onClose, documentId, refetch }) => {
  const navigate = useNavigate();
  const [expireTime, setExpireTime] = useState("")

  const { data: documentData } = useQuery(
    ["GET_DOCUMENT_ITEM", documentId],
    () => api.document.getItem(documentId),
    { enabled: !!documentId }
  );

  const handleShare = async () => {
    const result = await api.document.shareDoc(documentId, { expireTime: `${expireTime}h`, filename: documentData?.data.file})
    const token = (result.data.token)
    navigate("/shareDocument/" + token);
    refetch();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>اشتراک گذاری</DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          spacing={2}
          alignItems="baseline"
        >
          <TextField
            margin="dense"
            label="مدت زمان اعتبار"
            fullWidth
            helperText={(expireTime == "") ? "این فیلد الزامی است" : undefined}
            error={(expireTime == "") ? true : false}
            onChange={(e) => setExpireTime(e.target.value)}
          />
          <Typography>ساعت</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() =>
            handleShare()
          }
        >
          لغو
        </Button>
        <Button onClick={() => handleShare()}>ایجاد لینک</Button>
      </DialogActions>
    </Dialog>
  );
};

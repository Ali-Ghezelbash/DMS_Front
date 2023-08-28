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
import { useForm } from "react-hook-form";

export const ShareDocumentForm = ({ onClose, documentId, refetch }) => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm(document);

  return (
    <Dialog open={true} onClose={onClose}>
      <form>
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
              defaultValue={1}
              helperText={errors.description ? "این فیلد الزامی است" : undefined}
              error={Boolean(errors.description)}
            />
            <Typography>ساعت</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset();
              onClose()
            }}
          >
            لغو
          </Button>
          <Button onClick={() => { onClose() }}>ایجاد لینک</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

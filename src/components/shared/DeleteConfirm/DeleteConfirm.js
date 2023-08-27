import { Menu, Button, IconButton } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export const DeleteConfirm = ({ onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCloseDelete = () => {
    setAnchorEl(null);
  };

  const handelDelete = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleConfirmDelete = () => {
    setAnchorEl(null);
    onDelete();
  };

  return (
    <>
      <IconButton
        color="primary"
        size="small"
        onClick={handelDelete}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
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
    </>
  );
};

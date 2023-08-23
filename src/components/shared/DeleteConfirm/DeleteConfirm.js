import { Menu, Button } from "@mui/material";
import React from "react";

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
      <Button color="error" onClick={handelDelete}>
        حذف
      </Button>
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

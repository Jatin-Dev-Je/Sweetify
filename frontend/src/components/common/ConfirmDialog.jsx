import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  confirmLabel = "Confirm",
  confirmLoading = false,
}) => (
  <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm} variant="contained" color="error" disabled={confirmLoading}>
        {confirmLoading ? "Working..." : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;

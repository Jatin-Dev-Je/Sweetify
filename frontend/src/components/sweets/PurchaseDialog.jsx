import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { formatCurrency } from "@/utils/helpers.js";

const PurchaseDialog = ({
  open,
  sweet,
  quantity,
  onQuantityChange,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  if (!sweet) return null;
  const available = Number(sweet.quantity ?? sweet.stock ?? 0);

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Purchase {sweet.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {sweet.category} • {formatCurrency(sweet.price)} / kg
          </Typography>
          <Typography variant="body2">{available} units available</Typography>
          <TextField
            label="Quantity"
            type="number"
            inputProps={{ min: 1, max: available }}
            value={quantity}
            onChange={(event) => onQuantityChange?.(Number(event.target.value))}
            disabled={isSubmitting}
            helperText={`Enter up to ${available} units`}
            autoFocus
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onConfirm}
          disabled={isSubmitting || !quantity || quantity < 1 || quantity > available}
        >
          {isSubmitting ? "Processing..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseDialog;

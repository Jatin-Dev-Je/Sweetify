import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { formatCurrency } from "@/utils/helpers.js";

const QuantityDialog = ({
  open,
  sweet,
  quantity,
  onQuantityChange,
  onClose,
  onConfirm,
  isSubmitting = false,
  mode = "purchase",
}) => {
  if (!sweet) return null;
  const safeQuantity = Number(sweet.quantity ?? sweet.stock ?? 0);
  const actionLabel = mode === "restock" ? "Restock" : "Purchase";
  const maxQuantity = mode === "purchase" ? safeQuantity : 1000;
  const helperCopy = mode === "purchase" ? `Enter up to ${safeQuantity} units` : "Enter the number of units to add";

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{`${actionLabel} ${sweet.name}`}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {sweet.category} • {formatCurrency(sweet.price)} / kg
          </Typography>
          <Typography variant="body2">
            {mode === "purchase" ? `${safeQuantity} units available` : `${safeQuantity} units currently in stock`}
          </Typography>
          <TextField
            label="Quantity"
            type="number"
            inputProps={{ min: 1, max: maxQuantity, step: 1 }}
            value={quantity}
            onChange={(event) => onQuantityChange?.(Number(event.target.value))}
            disabled={isSubmitting}
            helperText={helperCopy}
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
          disabled={
            isSubmitting ||
            !quantity ||
            quantity < 1 ||
            (mode === "purchase" && quantity > safeQuantity) ||
            (mode === "restock" && quantity > maxQuantity)
          }
        >
          {isSubmitting ? "Processing..." : actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuantityDialog;

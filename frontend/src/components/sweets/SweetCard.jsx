import { Button, Card, CardActions, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { formatCurrency } from "@/utils/helpers.js";

const SweetCard = ({ sweet, isAdmin, onEdit, onDelete, onPurchase, onRestock, disableActions = false }) => {
  const { name, category, price, quantity } = sweet;
  const safeQuantity = Number(quantity ?? sweet?.stock ?? 0);
  const canPurchase = Boolean(onPurchase) && safeQuantity > 0 && !disableActions;

  return (
    <Card
      className="glass-panel"
      sx={{
        borderRadius: 4,
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
          <Typography variant="h6" fontWeight={600}>
            {name}
          </Typography>
          <Chip label={`${safeQuantity} in stock`} size="small" color={safeQuantity > 0 ? "success" : "default"} />
        </Stack>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
          {category}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 3, pb: 3, justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h6" color="secondary">
          {`${formatCurrency(price)} / kg`}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {onPurchase && (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => onPurchase?.(sweet)}
              disabled={!canPurchase}
            >
              Purchase
            </Button>
          )}
          {isAdmin && (
            <>
              <Button
                variant="outlined"
                size="small"
                color="inherit"
                onClick={() => onRestock?.(sweet)}
                disabled={disableActions || !onRestock}
              >
                Restock
              </Button>
              <IconButton color="secondary" onClick={() => onEdit?.(sweet)} disabled={disableActions}>
                <EditNoteIcon />
              </IconButton>
              <IconButton color="error" onClick={() => onDelete?.(sweet)} disabled={disableActions}>
                <DeleteOutlineIcon />
              </IconButton>
            </>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default SweetCard;

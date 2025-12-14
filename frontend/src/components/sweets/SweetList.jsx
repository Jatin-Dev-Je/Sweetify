import { Grid, Typography } from "@mui/material";
import SweetCard from "./SweetCard.jsx";

const SweetList = ({
  sweets = [],
  isAdmin = false,
  onEdit,
  onDelete,
  onPurchase,
  onRestock,
  disableActions = false,
}) => {
  if (!sweets.length) {
    return (
      <Typography variant="body1" sx={{ mt: 4 }}>
        No sweets match your filters yet.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {sweets.map((sweet) => (
        <Grid item xs={12} sm={6} lg={4} key={sweet._id ?? sweet.id ?? sweet.name}>
          <SweetCard
            sweet={sweet}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
            onPurchase={onPurchase}
            onRestock={onRestock}
            disableActions={disableActions}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default SweetList;

import { useEffect, useState } from "react";
import { Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";

const defaultValues = {
  name: "",
  category: "",
  price: "",
  quantity: "",
};

const SweetForm = ({ initialValues, onSubmit, onCancel, isEditing, isSubmitting = false }) => {
  const [form, setForm] = useState(defaultValues);

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name ?? "",
        category: initialValues.category ?? "",
        price: initialValues.price ?? "",
        quantity: initialValues.quantity ?? "",
      });
    } else {
      setForm(defaultValues);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
  };

  const ctaLabel = isEditing ? "Save changes" : "Create sweet";

  return (
    <Paper component="form" onSubmit={handleSubmit} className="glass-panel" sx={{ p: 4, mt: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight={600}>
          {isEditing ? "Update sweet" : "Add a new sweet"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price (₹ / kg)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {isEditing && (
            <Button variant="text" onClick={onCancel} color="inherit" disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : ctaLabel}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SweetForm;

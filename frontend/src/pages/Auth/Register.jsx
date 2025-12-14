import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "@/api/auth.api.js";
import useAuth from "@/auth/useAuth";
import { handleApiError } from "@/utils/helpers.js";

const Register = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
    useEffect(() => {
      if (isAuthenticated) {
        navigate("/dashboard", { replace: true });
      }
    }, [isAuthenticated, navigate]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (_event, nextRole) => {
    if (!nextRole) return;
    setForm((prev) => ({ ...prev, role: nextRole }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const authPayload = await registerApi({
        email: form.email,
        password: form.password,
        role: form.role,
      });
      await login({
        token: authPayload.token,
        user: authPayload.user,
        role: authPayload.user?.role,
      });
      navigate("/dashboard", { replace: true });
    } catch (apiError) {
      setError(handleApiError(apiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6, px: 2 }}>
      <Paper component="form" onSubmit={handleSubmit} className="glass-panel" sx={{ p: 4, width: "100%", maxWidth: 520 }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight={600}>
            Join Sweetify
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep tabs on flavors, stock, and insights from one curated control room.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Full name" name="name" required value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" type="email" required value={form.email} onChange={handleChange} fullWidth />
          <TextField label="Password" name="password" type="password" required value={form.password} onChange={handleChange} fullWidth />
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Choose your workspace role
            </Typography>
            <ToggleButtonGroup
              color="secondary"
              value={form.role}
              exclusive
              onChange={handleRoleChange}
              size="small"
            >
              <ToggleButton value="user">User</ToggleButton>
              <ToggleButton value="admin">Admin</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Button type="submit" variant="contained" disabled={isSubmitting} size="large" color="secondary">
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          <Typography variant="body2">
            Already on board? <MuiLink component={Link} to="/login">Sign in</MuiLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Register;

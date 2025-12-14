import { useEffect, useState } from "react";
import { Alert, Box, Button, Link as MuiLink, Paper, Stack, TextField, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login as loginApi } from "@/api/auth.api.js";
import useAuth from "@/auth/useAuth";
import { handleApiError } from "@/utils/helpers.js";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectPath = location.state?.from?.pathname ?? "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const authPayload = await loginApi(form);
      await login({
        token: authPayload.token,
        user: authPayload.user,
        role: authPayload.user?.role,
      });
      navigate(redirectPath, { replace: true });
    } catch (apiError) {
      setError(handleApiError(apiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6, px: 2 }}>
      <Paper component="form" onSubmit={handleSubmit} className="glass-panel" sx={{ p: 4, width: "100%", maxWidth: 420 }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight={600}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage your inventory and discover fresh confectionery trends.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" name="email" type="email" required value={form.email} onChange={handleChange} fullWidth />
          <TextField label="Password" name="password" type="password" required value={form.password} onChange={handleChange} fullWidth />
          <Button type="submit" variant="contained" disabled={isSubmitting} size="large">
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
          <Typography variant="body2">
            Need an account? <MuiLink component={Link} to="/register">Create one</MuiLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;

import { AppBar, Box, Button, Chip, CircularProgress, Stack, Toolbar, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/auth/useAuth";
import { ROLES } from "@/utils/constants.js";

const LinkButton = ({ to, label, isActive }) => (
  <Button
    component={Link}
    to={to}
    color={isActive ? "secondary" : "inherit"}
    sx={{ textTransform: "none", fontWeight: 600 }}
  >
    {label}
  </Button>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, user, logout, isBootstrapping } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : null;

  return (
    <AppBar
      position="static"
      elevation={0}
      color="transparent"
      sx={{ backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 6 }, py: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Sweetify
        </Typography>
        {isAuthenticated ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <LinkButton to="/dashboard" label="Dashboard" isActive={location.pathname === "/dashboard"} />
            {role === ROLES.ADMIN && (
              <LinkButton to="/admin" label="Admin" isActive={location.pathname === "/admin"} />
            )}
            {isBootstrapping ? (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2 }}>
                <CircularProgress size={16} color="inherit" thickness={6} />
                <Typography variant="body2" color="text.secondary">
                  Syncing profile...
                </Typography>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ px: 2, fontSize: 14, opacity: 0.8 }}>{user?.email ?? user?.name ?? "-"}</Box>
                {roleLabel && <Chip label={roleLabel} size="small" color="secondary" />}
              </Stack>
            )}
            <Button variant="contained" color="primary" onClick={handleLogout} sx={{ borderRadius: 999 }}>
              Logout
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
            <Button component={Link} to="/register" variant="contained" color="secondary" sx={{ borderRadius: 999 }}>
              Sign Up
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

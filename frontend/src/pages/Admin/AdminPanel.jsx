import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import { fetchSweets, deleteSweet, restockSweet } from "@/api/sweets.api.js";
import SweetList from "@/components/sweets/SweetList.jsx";
import Loader from "@/components/common/Loader.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import QuantityDialog from "@/components/sweets/QuantityDialog.jsx";
import { formatCurrency, handleApiError } from "@/utils/helpers.js";

const mapSweetPayload = (apiPayload) => {
  const collection = apiPayload?.data?.sweets ?? apiPayload?.data ?? apiPayload;
  if (!Array.isArray(collection)) return [];
  return collection.map((item) => ({
    ...item,
    quantity: item.quantity ?? item.stock ?? 0,
  }));
};

const AdminPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestocking, setIsRestocking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [restockTarget, setRestockTarget] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState(5);

  const loadSweets = async ({ silent = false } = {}) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const payload = await fetchSweets();
      setSweets(mapSweetPayload(payload));
    } catch (apiError) {
      setError(handleApiError(apiError));
    } finally {
      if (silent) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const inventoryStats = useMemo(() => {
    const totalItems = sweets.length;
    const totalStock = sweets.reduce((sum, sweet) => sum + Number(sweet.quantity ?? 0), 0);
    const inventoryValue = sweets.reduce(
      (sum, sweet) => sum + Number(sweet.price ?? 0) * Number(sweet.quantity ?? 0),
      0
    );
    const lowStock = sweets.filter((sweet) => Number(sweet.quantity ?? 0) < 5).length;
    return { totalItems, totalStock, inventoryValue, lowStock };
  }, [sweets]);

  const criticalSweets = useMemo(() => {
    return sweets
      .filter((sweet) => Number(sweet.quantity ?? 0) < 8)
      .sort((a, b) => Number(a.quantity ?? 0) - Number(b.quantity ?? 0))
      .slice(0, 4);
  }, [sweets]);

  const coverageScore = useMemo(() => {
    if (!inventoryStats.totalItems) return 0;
    const capacity = inventoryStats.totalItems * 50;
    const ratio = capacity ? (inventoryStats.totalStock / capacity) * 100 : 0;
    return Math.max(0, Math.min(100, Math.round(ratio)));
  }, [inventoryStats]);

  const coverageLabel = coverageScore > 66 ? "Optimal" : coverageScore > 33 ? "Caution" : "Critical";

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteSweet(pendingDelete._id ?? pendingDelete.id);
      setPendingDelete(null);
      loadSweets({ silent: true });
    } catch (apiError) {
      setError(handleApiError(apiError));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestockRequest = (sweet) => {
    setRestockTarget(sweet);
    setRestockQuantity(5);
  };

  const handleRestockQuantityChange = (value) => {
    const nextValue = Number.isNaN(value) ? 1 : Math.max(1, Math.min(1000, value));
    setRestockQuantity(nextValue);
  };

  const handleConfirmRestock = async () => {
    if (!restockTarget) return;
    setIsRestocking(true);
    setError(null);
    try {
      await restockSweet(restockTarget._id ?? restockTarget.id, { quantity: restockQuantity });
      setRestockTarget(null);
      loadSweets({ silent: true });
    } catch (apiError) {
      setError(handleApiError(apiError));
    } finally {
      setIsRestocking(false);
    }
  };

  const handleRefresh = () => {
    if (isRefreshing) return;
    loadSweets({ silent: true });
  };

  if (isLoading) {
    return <Loader message="Curating insights" />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, rgba(220,150,255,0.12), transparent 60%)",
        pt: 6,
        pb: 10,
        px: { xs: 2, md: 4, lg: 6 },
      }}
    >
      <Stack spacing={4} sx={{ maxWidth: 1280, mx: "auto" }}>
        <Paper
          className="glass-panel"
          sx={{
            p: { xs: 3, md: 4 },
            borderColor: "rgba(255,255,255,0.18)",
            background: "linear-gradient(135deg, rgba(16,23,32,0.9), rgba(26,18,32,0.85))",
          }}
        >
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
              <Stack spacing={1}>
                <Chip
                  icon={<InsightsRoundedIcon fontSize="small" />}
                  label="Operational pulse"
                  color="secondary"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                />
                <Typography variant="h4" fontWeight={700}>
                  Admin control room
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Monitor velocity, stay ahead of low inventory, and orchestrate drop readiness in real-time.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<RefreshRoundedIcon />}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  sx={{ borderRadius: 999, px: 3 }}
                >
                  {isRefreshing ? "Syncing..." : "Sync inventory"}
                </Button>
                <IconButton
                  aria-label="refresh data"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "text.secondary",
                  }}
                >
                  <TimelineRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard label="Unique recipes" value={inventoryStats.totalItems} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard label="Total stock" value={inventoryStats.totalStock} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard label="Inventory value" value={formatCurrency(inventoryStats.inventoryValue)} accent />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard label="Low stock" value={inventoryStats.lowStock} highlight={inventoryStats.lowStock > 0} />
              </Grid>
            </Grid>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Capacity coverage
                </Typography>
                <Chip label={`${coverageLabel} • ${coverageScore}%`} size="small" color={coverageLabel === "Optimal" ? "success" : coverageLabel === "Caution" ? "warning" : "error"} />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={coverageScore}
                sx={{ height: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)" }}
              />
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper className="glass-panel" sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="h5" fontWeight={600}>
                      Inventory overview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Actions are locked while sync tasks run to prevent conflicts.
                    </Typography>
                  </Stack>
                  <Chip label={`${sweets.length} recipes`} variant="outlined" color="secondary" />
                </Stack>
                <SweetList
                  sweets={sweets}
                  isAdmin
                  onDelete={(sweet) => setPendingDelete(sweet)}
                  onEdit={() => {}}
                  onRestock={handleRestockRequest}
                  disableActions={isDeleting || isRestocking || isRefreshing}
                />
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className="glass-panel" sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
              <Stack spacing={3}>
                <Stack spacing={0.5}>
                  <Typography variant="h6" fontWeight={600}>
                    Low-stock radar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items projected to sell out this week.
                  </Typography>
                </Stack>
                <LowStockList items={criticalSweets} />
                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Inventory value
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {formatCurrency(inventoryStats.inventoryValue)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Based on current retail pricing × available stock.
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove sweet"
        description={`This will permanently remove ${pendingDelete?.name ?? "this sweet"}. Continue?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        confirmLoading={isDeleting}
      />
      <QuantityDialog
        open={Boolean(restockTarget)}
        sweet={restockTarget}
        quantity={restockQuantity}
        onQuantityChange={handleRestockQuantityChange}
        onClose={() => {
          if (!isRestocking) {
            setRestockTarget(null);
          }
        }}
        onConfirm={handleConfirmRestock}
        isSubmitting={isRestocking}
        mode="restock"
      />
    </Box>
  );
};

const MetricCard = ({ label, value, accent = false, highlight = false }) => (
  <Paper
    className="glass-panel"
    sx={{
      p: 3,
      minHeight: 120,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderColor: highlight ? "error.light" : accent ? "secondary.light" : "var(--sweetify-border)",
      backgroundColor: accent ? "rgba(239,154,255,0.06)" : "rgba(255,255,255,0.01)",
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="h5" fontWeight={700} color={accent ? "secondary.main" : "inherit"}>
        {value}
      </Typography>
      {highlight && <Chip label="Action" color="warning" size="small" />}
    </Stack>
  </Paper>
);

const LowStockList = ({ items }) => {
  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        All recipes are comfortably stocked.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {items.map((item) => (
        <Stack key={item._id ?? item.id ?? item.name} direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontWeight={600}>{item.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              Stock {item.quantity ?? 0} • {`${formatCurrency(item.price ?? 0)} / kg`}
            </Typography>
          </Box>
          <Chip
            label={`${item.quantity ?? 0} left`}
            color={(item.quantity ?? 0) < 3 ? "error" : "warning"}
            size="small"
            variant="outlined"
          />
        </Stack>
      ))}
    </Stack>
  );
};

export default AdminPanel;

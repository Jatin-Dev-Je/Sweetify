import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Paper, Stack, Typography } from "@mui/material";
import { fetchSweets, createSweet, updateSweet, deleteSweet, purchaseSweet, restockSweet } from "@/api/sweets.api.js";
import SearchBar from "@/components/search/SearchBar.jsx";
import SweetList from "@/components/sweets/SweetList.jsx";
import SweetForm from "@/components/sweets/SweetForm.jsx";
import QuantityDialog from "@/components/sweets/QuantityDialog.jsx";
import Loader from "@/components/common/Loader.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import { handleApiError } from "@/utils/helpers.js";
import { ROLES } from "@/utils/constants.js";
import useAuth from "@/auth/useAuth";

const mapSweetPayload = (apiPayload) => {
  const collection = apiPayload?.data?.sweets ?? apiPayload?.data ?? apiPayload;
  if (!Array.isArray(collection)) {
    return [];
  }
  return collection.map((item) => ({
    ...item,
    quantity: item.quantity ?? item.stock ?? 0,
  }));
};

const Dashboard = () => {
  const { role } = useAuth();
  const isAdmin = role === ROLES.ADMIN;
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSweet, setEditingSweet] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseTarget, setPurchaseTarget] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isRestocking, setIsRestocking] = useState(false);
  const [restockTarget, setRestockTarget] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState(5);

  const loadSweets = async (query = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await fetchSweets(query);
      setSweets(mapSweetPayload(payload));
    } catch (apiError) {
      setError(handleApiError(apiError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const filteredSweets = useMemo(() => {
    if (!search) return sweets;
    return sweets.filter((item) => {
      const haystack = `${item.name} ${item.category}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [sweets, search]);

  const handleSubmit = async (formValues) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editingSweet) {
        await updateSweet(editingSweet._id ?? editingSweet.id, formValues);
      } else {
        await createSweet(formValues);
      }
      setEditingSweet(null);
      loadSweets();
    } catch (apiError) {
      setError(handleApiError(apiError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteSweet(pendingDelete._id ?? pendingDelete.id);
      setPendingDelete(null);
      loadSweets();
    } catch (apiError) {
      setError(handleApiError(apiError));
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePurchaseRequest = (sweet) => {
    if (!sweet) return;
    setPurchaseTarget(sweet);
    setPurchaseQuantity(1);
  };

  const handlePurchaseQuantityChange = (value) => {
    if (!purchaseTarget) return;
    const available = Number(purchaseTarget.quantity ?? purchaseTarget.stock ?? 0);
    const nextValue = Number.isNaN(value) ? 1 : Math.max(1, Math.min(available, value));
    setPurchaseQuantity(nextValue);
  };

  const handleConfirmPurchase = async () => {
    if (!purchaseTarget) return;
    setIsPurchasing(true);
    setError(null);
    try {
      await purchaseSweet(purchaseTarget._id ?? purchaseTarget.id, { quantity: purchaseQuantity });
      setPurchaseTarget(null);
      loadSweets(search);
    } catch (apiError) {
      setError(handleApiError(apiError));
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestockRequest = (sweet) => {
    if (!sweet) return;
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
      loadSweets(search);
    } catch (apiError) {
      setError(handleApiError(apiError));
    } finally {
      setIsRestocking(false);
    }
  };

  if (isLoading) {
    return <Loader message="Pulling your sweets" />;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, px: 3 }}>
      <Paper className="glass-panel" sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" fontWeight={700}>
              Flavor Intel
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track batches, inventory velocity, and spotlight what needs attention.
            </Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <SearchBar value={search} onChange={(value) => setSearch(value)} />
          <SweetList
            sweets={filteredSweets}
            isAdmin={isAdmin}
            onEdit={(sweet) => setEditingSweet(sweet)}
            onDelete={(sweet) => setPendingDelete(sweet)}
            onPurchase={isAdmin ? undefined : handlePurchaseRequest}
            onRestock={isAdmin ? handleRestockRequest : undefined}
            disableActions={isSaving || isDeleting || isPurchasing || isRestocking}
          />
          {isAdmin && (
            <SweetForm
              initialValues={editingSweet}
              onSubmit={handleSubmit}
              onCancel={() => setEditingSweet(null)}
              isEditing={Boolean(editingSweet)}
              isSubmitting={isSaving}
            />
          )}
        </Stack>
      </Paper>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove sweet"
        description={`This will permanently remove ${pendingDelete?.name ?? "this sweet"}. Continue?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        confirmLabel="Delete"
        confirmLoading={isDeleting}
      />
      <QuantityDialog
        open={Boolean(purchaseTarget)}
        sweet={purchaseTarget}
        quantity={purchaseQuantity}
        onQuantityChange={handlePurchaseQuantityChange}
        onClose={() => {
          if (!isPurchasing) {
            setPurchaseTarget(null);
          }
        }}
        onConfirm={handleConfirmPurchase}
        isSubmitting={isPurchasing}
        mode="purchase"
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

export default Dashboard;

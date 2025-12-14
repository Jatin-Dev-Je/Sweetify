export const formatCurrency = (value, currency = "INR", locale = "en-IN") => {
  if (Number.isNaN(Number(value))) return "-";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(value));
};

export const handleApiError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something unexpected happened. Please try again."
  );
};

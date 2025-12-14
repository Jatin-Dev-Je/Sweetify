import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = ({ message = "Loading delicious data" }) => (
  <Box
    sx={{
      minHeight: "50vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    }}
  >
    <CircularProgress color="secondary" thickness={5} />
    <Typography variant="body2" color="text.secondary">
      {message}...
    </Typography>
  </Box>
);

export default Loader;

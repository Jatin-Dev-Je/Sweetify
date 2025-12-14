import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

const SearchBar = ({ value, onChange, placeholder = "Search sweets or categories" }) => (
  <TextField
    value={value}
    onChange={(event) => onChange?.(event.target.value)}
    placeholder={placeholder}
    fullWidth
    variant="outlined"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
  />
);

export default SearchBar;

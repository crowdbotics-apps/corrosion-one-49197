import MDBox from "components/MDBox";
import {CircularProgress, Input, InputAdornment} from "@mui/material";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

const SearchBar = ({search, loading, setSearchQuery}) => {

  const searchFunc = (text = '') => {
    setSearchQuery(text)
    search(text)
  }

  return (
    <MDBox mr={3} >
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {loading === false ? <SearchIcon/> : <CircularProgress size={14} color="primary"/>}
            </InputAdornment>
          ),
          style: {
            borderRadius: '12px',
          },
        }}
        placeholder="Search"
        sx={{
          width: '300px',
          '& .MuiInputBase-input': {
            height: '30px',
            fontSize: '18px',
          },
        }}
        onChange={(e) => searchFunc(e.target.value)}
      />
    </MDBox>
  )

}

export default SearchBar;

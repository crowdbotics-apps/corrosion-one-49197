import MDBox from "components/MDBox";
import {CircularProgress, Input, InputAdornment} from "@mui/material";
import {Search} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";
import pxToRem from "../../assets/theme/functions/pxToRem";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

const CssTextField = styled(TextField)({
  '.MuiInputBase-root': {
    backgroundColor: 'white',
    borderRadius: pxToRem(4),
    width:"345px",
    minWidth: '100%',
    marginLeft:"10px"
  },
  '& label.Mui-focused': {
    color: '#dbdadb',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#dbdadb',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#dbdadb',
    },
    '&:hover fieldset': {
      borderColor: '#dbdadb',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dbdadb',
    },
  },
});

const SearchBar = ({search, loading, setSearchQuery}) => {

  const searchFunc = (text = '') => {
    // if (text.length === 0 || text.length >= 3) {
    //   search(text)
    // }
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

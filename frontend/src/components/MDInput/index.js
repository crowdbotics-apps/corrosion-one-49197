/**
 =========================================================
 * Material Dashboard 2 PRO React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import { forwardRef, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for MDInput
import MDInputRoot from "components/MDInput/MDInputRoot";
import { InputAdornment } from "@mui/material";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const useHelperTextStyles = makeStyles(() => ({
  root: {
    textTransform: "lowercase",
    "&:first-letter": {
      textTransform: "uppercase",
    },
  },
}));

const MDInput = forwardRef(({ error = false, success = false, disabled = false, value, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const helperTextStyles = useHelperTextStyles();

  return (
    <div style={{position: 'relative'}}>
      {rest.type === "password" && <IconButton sx={{ position: 'absolute', right: 15, top: 2,  zIndex: 999}} onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon/>}
      </IconButton>}
      <MDInputRoot
        ref={ref}
        rows={rest.rows}
        value={value}
        ownerState={{error, success, disabled}}
        autoComplete={"off"}
        FormHelperTextProps={{
          error: error,
          classes: {
            root: helperTextStyles.root,
          },
        }}
        // InputProps={{
        //   endAdornment: rest.type === "password" && (
        //     <InputAdornment position="end">
        //       <IconButton sx={{marginRight: 0}} onClick={() => setShowPassword(!showPassword)}>
        //         {showPassword ? <VisibilityOffOutlinedIcon/> : <VisibilityOutlinedIcon/>}
        //       </IconButton>
        //     </InputAdornment>
        //   ),
        // }}
        {...rest}
        type={rest.type === "password" ? (showPassword ? "text" : "password") : rest.type}
      />
    </div>
  );
});

// Typechecking props for the MDInput
MDInput.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default MDInput;

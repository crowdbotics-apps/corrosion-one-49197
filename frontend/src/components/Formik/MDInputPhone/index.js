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
import { makeStyles } from "@mui/styles";
import MDInputRoot from "./MDInputRoot";

const useHelperTextStyles = makeStyles(() => ({
  root: {
    textTransform: "lowercase",
    "&:first-letter": {
      textTransform: "uppercase",
    },
  },
}));

const MDInputPhone = forwardRef(({ error, success, value, ...rest }, ref) => {
  const helperTextStyles = useHelperTextStyles();

  return (
    <MDInputRoot
      ref={ref}
      rows={rest.rows}
      value={value}
      ownerState={{ error, success }}
      FormHelperTextProps={{
        error: error,
        classes: {
          root: helperTextStyles.root,
        },
      }}
      InputLabelProps={{ shrink: true }}
      {...rest}
      type={rest.type}
    />
  );
});

// Setting default values for the props of MDInput
MDInputPhone.defaultProps = {
  error: false,
  success: false,
};

// Typechecking props for the MDInput
MDInputPhone.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
};

export default MDInputPhone;

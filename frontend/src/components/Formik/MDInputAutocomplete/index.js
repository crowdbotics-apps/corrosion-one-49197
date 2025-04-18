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

import {forwardRef} from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for MDInput
import MDInputRoot from "components/Formik/MDInputAutocomplete/MDInputRoot";

const MDInputAutocomplete = forwardRef(({ error, success, disabled, ...rest }, ref) => (
  <MDInputRoot {...rest} ref={ref} ownerState={{ error, success, disabled }} InputLabelProps={{shrink: true}} FormHelperTextProps={{error: error}} />
));

// Setting default values for the props of MDInput
MDInputAutocomplete.defaultProps = {
  error: false,
  success: false,
  disabled: false,
};

// Typechecking props for the MDInput
MDInputAutocomplete.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default MDInputAutocomplete;

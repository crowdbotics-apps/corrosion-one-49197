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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

function DataTableBodyCell({ noBorder, align, children, odd, width, selected = false }) {
  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={3}
      sx={({ palette: { light, table }, typography: { size } }) => ({
        fontSize: size.sm,
        borderBottom: "none",
        // background: odd ? '#1E1E1E' :  '#282828',
        height: "66px",
      })}
    >
      <MDBox
        display="inline-block"
        width={width}
        sx={{
          verticalAlign: "middle",
          fontSize: "17px",
          lineHeight: "19px",
        }}
      >
        {children}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of DataTableBodyCell
DataTableBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
};

// Typechecking props for the DataTableBodyCell
DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
};

export default DataTableBodyCell;

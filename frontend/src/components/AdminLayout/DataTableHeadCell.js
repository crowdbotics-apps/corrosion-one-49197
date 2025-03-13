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

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

import MDTypography from "../MDTypography";

function DataTableHeadCell({ width, children, sorted, align, disableOrdering, ...rest }) {

  return (
    <MDBox width={width} component="th" py={1.5} px={3} sx={{borderBottom: `none`}}>
      <MDBox
        {...rest}
        position="relative"
        width={width}
        textAlign={align}
        sx={() => ({
          cursor: sorted && "pointer",
          userSelect: sorted && "none",
        })}
      >
        <MDTypography
          variant='tableHead'
          sx={{
            marginLeft:'0px',
            color: '#006E90',
            weight: 300,
            fontSize: '16px',
            paddingBlock: '9px',
          }}
        >
          {children}
        </MDTypography>
        {disableOrdering !== true && sorted && (
          <MDBox
            position="absolute"
            top={2}
            right={align === "right" ? "16px" : 0}
            left={align === "right" ? "-5px" : "unset"}
            sx={{
              fontSize: '32px',
            }}
          >
            <MDBox
              position="absolute"
              top={-6}
              color={sorted === "asce" ? "text" : "secondary"}
              opacity={1}
            >
              <Icon>arrow_drop_up</Icon>
            </MDBox>
            <MDBox
              position="absolute"
              top={2}
              color={sorted === "desc" ? "text" : "secondary"}
              opacity={1}
            >
              <Icon>arrow_drop_down</Icon>
            </MDBox>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of DataTableHeadCell
DataTableHeadCell.defaultProps = {
  width: "auto",
  sorted: "none",
  align: "left",
};

// Typechecking props for the DataTableHeadCell
DataTableHeadCell.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
  sorted: PropTypes.oneOf([false, "none", "asce", "desc"]),
  align: PropTypes.oneOf(["left", "right", "center"]),
};

export default DataTableHeadCell;

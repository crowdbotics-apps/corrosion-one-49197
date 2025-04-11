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
import MDBox from "../../../../components/MDBox";

import MDTypography from "@mui/material/Typography"

function DataTableHeadCell({ width = 'auto', children, sorted = 'none', align = 'left', disableOrdering, ...rest }) {

  return (
    <MDBox width={width}  component="th" py={1.5} px={3} sx={{borderBottom: `1px solid #dbdadb`, backgroundColor:'#F1F2F4'}}>
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
            color: '#5E6670',
            fontSize: '17px',
            paddingBlock: '9px',

          }}
        >
          {children}
        </MDTypography>
        {disableOrdering !== true && sorted && (
          <MDBox
            position="absolute"
            top={11}
            right={align === "right" ? "16px" : 0}
            left={align === "right" ? "-5px" : "unset"}
            sx={({ typography: { size } }) => ({
              fontSize: size.lg,
            })}
          >
            <MDBox
              position="absolute"
              top={-6}
              color= '#5E6670'
              opacity={1}
            >
              <Icon>arrow_drop_up</Icon>
            </MDBox>
            <MDBox
              position="absolute"
              top={0}
              color= '#5E6670'
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

// Typechecking props for the DataTableHeadCell
DataTableHeadCell.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
  sorted: PropTypes.oneOf([false, "none", "asce", "desc"]),
  align: PropTypes.oneOf(["left", "right", "center"]),
};

export default DataTableHeadCell;

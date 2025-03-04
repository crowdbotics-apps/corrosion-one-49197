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
        height: "100px",
        backgroundColor: odd ? "#F8FCFD" : "white",
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

DataTableBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
  odd: false,
};

DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
  odd: PropTypes.bool,
};

export default DataTableBodyCell;

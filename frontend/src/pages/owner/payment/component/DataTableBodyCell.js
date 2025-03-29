import PropTypes from "prop-types";
import MDBox from "components/MDBox";

function DataTableBodyCell({ noBorder = false, align = 'left', children, width, selected = false, isFirstCell = false }) {
  return (
    <MDBox
      component="td"
      textAlign={align}
      width={width}
      py={1.5}
      px={3}
      sx={({ palette: { light, table }, typography: { size }, borders: { borderWidth } }) => ({
        fontSize: size.sm,
        borderBottom: noBorder || isFirstCell ? "none" : `${borderWidth[1]} solid ${light.main}`,
        background: '#ffffff',
      })}
    >
      <MDBox
        display="inline-block"
        color="dark"
        width={width}
        sx={{ verticalAlign: "middle", borderBottom: noBorder || isFirstCell ? "none" : null }}
      >
        {children}
      </MDBox>
    </MDBox>
  );
}

// Typechecking props for the DataTableBodyCell
DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
  isFirstCell: PropTypes.bool, // Nueva prop que indica si la celda es la primera
};

export default DataTableBodyCell;

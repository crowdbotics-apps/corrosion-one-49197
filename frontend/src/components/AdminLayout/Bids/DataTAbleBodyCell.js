import PropTypes from "prop-types";

// Componentes de Material Dashboard 2 PRO React
import MDBox from "components/MDBox";

function DataTableBodyCell({ noBorder, align, children, gender, width, selected = false }) {
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
        width: "150px",
        backgroundColor: gender === 'female' ? "#F8FCFD" : "white",
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
};

DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
  gender: PropTypes.oneOf(["male", "female"]), // El género como propiedad
};

export default DataTableBodyCell;

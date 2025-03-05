import MDBox from "../../MDBox"
import PropTypes from 'prop-types';


function DataTableBodyCell({ width, noBorder, align, children, odd, selected = false }) {
  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={3}
      sx={({ palette: { light, table }, typography: { size } }) => ({
        fontSize: size.sm,
        borderBottom: "none",
        height: "20px",
        borderRadius: "1px",
        transition: "background-color 0.3s ease",
        cursor: "pointer",
        '&:hover': {
          backgroundColor: selected ? "#EBF7FA" : "#EBF7FA",
        },
      })}
    >
      <MDBox
        display="inline-block"
        width={width}
        sx={{
          verticalAlign: "middle",
          fontSize: "17px",
          lineHeight: "19px",
          fontFamily: "'Roboto', sans-serif",
          color: selected ? "#25D366" : "#000000",
        }}
      >
        {children}
        <br/>
        <hr style={{color: '#888'}}/>
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




import MDBox from "../MDBox";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MDTypography from "../MDTypography";

function RenderWorkArea({
                          item,
                          handleRemove
                        }) {
  return (
    <MDBox
      key={item.id}
      display="flex"
      alignItems="center"
      justifyContent="space-between" // let text + "X" be spaced out
      borderRadius="24px"
      p={0.25}
      px={1}
      sx={{border: '1px solid #C6C9CE'}}
      // optional: add minWidth so text + X have some horizontal space
    >
      <IconButton
        aria-label="remove"
        size="small"
        onClick={() => handleRemove ? handleRemove(item.id) : null}
        sx={{mr: 1, p: 0}} // small margin to separate from text
      >
        <HighlightOffIcon sx={{color: "#E14640", fontSize:19}}/>
      </IconButton>
      <MDTypography sx={{fontSize: 14, fontWeight: 500}}>
        {item.name}
      </MDTypography>
    </MDBox>
  )
}

export default RenderWorkArea;

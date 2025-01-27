import {Box, InputAdornment, TextField, Typography} from "@mui/material";
import MDBox from "components/MDBox";
import {useRef, useState} from "react";
import MDTypography from "components/MDTypography";
import pxToRem from "assets/theme/functions/pxToRem";
import MDInputRoot from "components/MDInput/MDInputRoot";


const UploadDoc = ({error, success, disabled, filename, label, ...rest}) => {
  const inputID = `input_${Math.random().toString().substring(2, 15)}`
  const [fileName, setFileName] = useState(filename??'')
  const handleDocumentUpload = (event) => {
    if (event.target.files && event.target.files.length) {
      setFileName(event.target.files[0].name)
      // onClick(event.target.files[0]); /* The file value can be retrieved here with a callback function whenever is needed */
    } else {
      setFileName('')
    }
  }
  return (
    <MDBox >
      <input
        type="file"
        id={inputID}
        name={inputID}
        onChange={(e) => handleDocumentUpload(e)}
        style={{width: 0, }}
      />
      <label htmlFor={inputID}>
        <MDInputRoot
          label={label}
          {...rest}
          ownerState={{error, success, disabled}}
          FormHelperTextProps={{error: error}}
          InputLabelProps={{shrink: true}}
          value={fileName}
          InputProps={{
            endAdornment: <InputAdornment position="start">
              <MDTypography sx={styles.endAdornment} >Upload</MDTypography>
            </InputAdornment>,
            readOnly: true,
          }}
        />
      </label>
    </MDBox>
  )
}
export default UploadDoc;
const styles = {
  endAdornment: {
    color: "#1877F2",
    fontSize: pxToRem(14),
    letterSpacing: pxToRem(0.5),
    lineHeight: pxToRem(24),
    fontWeight: 400,
    cursor: "pointer"
  }
}

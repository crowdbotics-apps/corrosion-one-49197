import { useField } from "formik";
import MDInput from "../../MDInput";
import React from "react";
import MDBox from "../../MDBox";
import {Checkbox} from "@mui/material";

export const FormikTextInput = (props) => {

  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  const {variant="outlined", type, label, value, fullWidth=true, ...rest} = props

  return (
    <MDBox {...rest}>
      <Checkbox
        // type={type}
        label={label}
        value={value}
        variant="outlined"
        fullWidth={fullWidth}
        {...field}
        helperText={errorText}
        error={!!errorText}
      />
    </MDBox>
  )
}

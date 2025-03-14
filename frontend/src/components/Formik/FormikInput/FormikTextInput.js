import { useField } from "formik";
import MDInput from "../../MDInput";
import React from "react";
import MDBox from "../../MDBox";

export const FormikTextInput = (props) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  const {
    variant = "outlined",
    type,
    label,
    value,
    fullWidth = true,
    overrideError,
    multiline,
    disabled = false,
    InputProps,
    rows,
    ...rest
  } = props;

  return (
    <MDBox {...rest}>
      <MDInput
        type={type}
        label={label}
        multiline={multiline}
        rows={rows}
        value={value}
        variant={variant}
        fullWidth={fullWidth}
        disabled={disabled}
        {...field}
        helperText={(overrideError && !!errorText) ? overrideError : errorText}
        error={!!errorText}
        InputProps={InputProps}
      />
    </MDBox>
  );
};

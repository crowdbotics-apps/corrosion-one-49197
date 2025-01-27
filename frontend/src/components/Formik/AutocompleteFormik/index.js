import MDBox from "components/MDBox";
import Autocomplete from "@mui/material/Autocomplete";
import React from "react";
import MDInputAutocomplete from "components/Formik/MDInputAutocomplete";

export const AutocompleteFormik = (opts) => {
  const {
    onChange,
    options,
    renderInput,
    labelFieldName,
    setFieldValue,
    multiline,
    freeSolo,
    initialValue,
    isOptionEqualToValue,
    touched,
    field,
    label,
    errors,
    ...params
  } = opts

  return (
    <MDBox>
      <Autocomplete

        {...params}
        id={field.name}
        name={field.name}
        freeSolo={freeSolo}
        multiline={multiline}
        options={options}
        onChange={(e, value) => {
          setFieldValue(field.name, value !== null ? value : initialValue)
          if (onChange) {
            onChange(e, value)
          }
        }}
        defaultValue={initialValue}
        getOptionLabel={option => option[labelFieldName] ?? ""}
        isOptionEqualToValue={isOptionEqualToValue || ((option, value) => true)}
        renderInput={(params) => (
          <MDInputAutocomplete
            type="text"
            label={label}
            variant="outlined"
            sx={{
              height:"40px"
            }}
            name={field.name}
            fullWidth
            onChange={(e) => {
              setFieldValue(field.name, e.target.value)
            }}
            error={errors[field.name] !== undefined}
            helperText={errors[field.name] && errors[field.name]}
            {...field}
            {...params}
          />
        )}
      />
    </MDBox>
  )
}


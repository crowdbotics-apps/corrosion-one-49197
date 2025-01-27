import React, { useState, useEffect } from "react";
import { Autocomplete, FormControl } from "@mui/material";
import MDInput from "../../MDInput";
import debounce from "lodash.debounce";
import { useField } from "formik";
import MDBox from "../../MDBox";

const AutocompleteFK = React.memo(
  ({
    onChange,
    value,
    fieldName,
    options,
    label,
    onInputChange,
    accessKey = "name",
    styleContainer,
    overrideError,
    getOptionLabel,
    filterOptions, // (options, state) => options // disable local filtering
     multiple = false
  }) => {
    const [field, meta] = useField({ name: fieldName });
    const errorText = meta.error && meta.touched ? meta.error : "";
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      const debouncedInput = debounce(() => onInputChange?.(inputValue), 300);
      debouncedInput();
      // Clean effect.
      return () => {
        debouncedInput.cancel();
      };
    }, [inputValue]);

    return (
      <FormControl sx={{ width: "100%" }}>
        <MDBox {...styleContainer}>
          <Autocomplete
            accessKey={accessKey}
            size={"small"}
            multiple={multiple}
            value={value}
            getOptionLabel={getOptionLabel || ((option) => option[accessKey])}
            filterOptions={filterOptions} // disable local filtering
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, value) => onChange(value, fieldName)}
            onInputChange={(event, value, reason) => {
              if (event && (event.type !== "click" || event.type !== "change")) {
                setInputValue(value);
              }
            }}
            options={options}
            sx={{ width: "100%" }}
            renderInput={(params) => {
              let aux = { ...params };
              const { InputProps } = params;
              aux["InputProps"] = { ...InputProps, sx: { height: "44px" } };
              return (
                <MDInput
                  name={fieldName}
                  variant="outlined"
                  {...aux}
                  helperText={overrideError && !!errorText ? overrideError : errorText}
                  error={!!errorText}
                  label={label}
                  type={"text"}
                />
              );
            }}
          />
        </MDBox>
      </FormControl>
    );
  }
);

// AutocompleteFK.propTypes = {
//   type: PropTypes.oneOf(["simple", "formik"]),
// };

export default AutocompleteFK;

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
     filterOptions, // e.g. (options, state) => options
     multiple = false,
     disableClearable = false,
   }) => {
    const [field, meta] = useField({ name: fieldName });
    const errorText = meta.error && meta.touched ? meta.error : "";
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      // Debounce any onInputChange calls
      const debouncedInput = debounce(() => onInputChange?.(inputValue), 300);
      debouncedInput();

      return () => {
        debouncedInput.cancel();
      };
    }, [inputValue, onInputChange]);

    return (
      <FormControl sx={{ width: "100%" }}>
        <MDBox {...styleContainer}>
          <Autocomplete
            disableClearable={disableClearable}
            size="small"
            multiple={multiple}
            // Ensure Autocomplete receives a proper default
            value={multiple ? value || [] : value || null}
            options={options}
            accessKey={accessKey}
            getOptionLabel={(option) => option?.[accessKey] ?? ""}
            // Disable default local filtering if desired
            filterOptions={filterOptions}
            // Guard against null/undefined for the comparison
            isOptionEqualToValue={(option, val) => option.id === val?.id}
            onChange={(e, newValue) => onChange(newValue, fieldName)}
            onInputChange={(event, newValue, reason) => {
              // Skip changes triggered by "click" or "change" events
              if (event && event.type !== "click" && event.type !== "change") {
                setInputValue(newValue);
              }
            }}
            renderInput={(params) => {
              // Slightly restructure `params` to add style to InputProps
              const { InputProps, ...restParams } = params;
              const inputPropsWithHeight = {
                ...restParams,
                InputProps: { ...InputProps, sx: { height: "44px" } },
              };

              return (
                <MDInput
                  name={fieldName}
                  variant="outlined"
                  {...inputPropsWithHeight}
                  helperText={overrideError && !!errorText ? overrideError : errorText}
                  error={!!errorText}
                  label={label}
                  type="text"
                />
              );
            }}
          />
        </MDBox>
      </FormControl>
    );
  }
);


export default AutocompleteFK;

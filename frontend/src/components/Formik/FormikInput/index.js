import React, {useState} from 'react';
import {Field, useField} from "formik";
import MDBox from "components/MDBox";
import InputMask from "react-input-mask";
import {AutocompleteFormik} from "../AutocompleteFormik";
import UploadDoc from "../MDInputUploadFile/UploadDoc";
import {FieldTypes} from "./constants";
import AutocompleteFK from "./AutocompleteFK";
import {FormikTextInput} from "./FormikTextInput";
import PropTypes from "prop-types";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment'
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import MDTypography from "../../MDTypography";
import {defaultCountries, FlagImage, parseCountry, PhoneInput, usePhoneInput} from 'react-international-phone';
import 'react-international-phone/style.css';
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import {InputAdornment, Select, TextField} from "@mui/material";
import MDInput from "../../MDInput";

const FormikFileInput = (props) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  const {variant = "outlined", label, fullWidth, ...rest} = props

  return (
    <MDBox {...rest}>
      <UploadDoc
        fullWidth
        label={label}
        variant={variant}
        helperText={errorText}
        error={!!errorText}
        {...field}
      />
    </MDBox>
  )
}

const FormikBooleanInput = (props) => {
  const [field] = useField(props);
  // const errorText = meta.error && meta.touched ? meta.error : '';
  const { fullWidth, label, ...rest} = props
  return (
    <MDBox {...rest} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Checkbox {...label} {...field}  />
      <MDTypography sx={{fontSize: 12}}>{label}</MDTypography>
    </MDBox>
  )
}

const FormikPhoneInput = (props) => {
// Extract Formik's field and meta objects
  const [field, meta, helpers] = useField(props)
  const { name, label, variant = 'outlined', disabled = false, ...rest } = props
  const { value, touched, error } = meta
  const { setValue, setTouched } = helpers

  // Setup phone input handling from react-international-phone
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'us',
      value, // Provide the current Formik value to the phone input
      countries: defaultCountries,
      onChange: (data) => {
        // Whenever the input changes, update Formik's state
        setValue(data.phone)
      },
    })

  // Determine error text for Formik
  const errorText = touched && error ? error : ''

  return (
    <MDBox {...rest}>
    <MDInput
      {...field}
      {...rest}
      // Formik props
      name={name}
      value={inputValue}
      onChange={(e) => {
        // Update phone input value
        handlePhoneValueChange(e)
        // Mark field as touched in Formik
        if (!touched) {
          setTouched(true)
        }
      }}
      inputRef={inputRef}
      disabled={disabled}
      // MUI TextField props
      variant={variant}
      fullWidth
      label={label || 'Phone number'}
      placeholder="Phone number"
      type="tel"
      error={Boolean(errorText)}
      helperText={errorText}
      // Render the country selector inside InputAdornment
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            style={{ marginRight: '2px', marginLeft: '-8px' }}
          >
            <Select
              value={country.iso2}
              onChange={(e) => setCountry(e.target.value)}
              renderValue={(val) => <FlagImage iso2={val} style={{ display: 'flex' }} />}
              MenuProps={{
                style: {
                  height: '300px',
                  width: '360px',
                  top: '10px',
                  left: '-34px',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                width: 'max-content',
                // Hide default outline except on focus
                fieldset: {
                  display: 'none',
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: 'block',
                  },
                },
                '.MuiSelect-select': {
                  padding: '8px',
                  paddingRight: '24px !important',
                },
                svg: {
                  right: 0,
                },
              }}
            >
              {defaultCountries.map((c) => {
                const parsedCountry = parseCountry(c)
                return (
                  <MenuItem key={parsedCountry.iso2} value={parsedCountry.iso2}>
                    <FlagImage iso2={parsedCountry.iso2} style={{ marginRight: '8px' }} />
                    <Typography marginRight="8px">{parsedCountry.name}</Typography>
                    <Typography color="gray">+{parsedCountry.dialCode}</Typography>
                  </MenuItem>
                )
              })}
            </Select>
          </InputAdornment>
        ),
      }}
    />
    </MDBox>
  )
}

const FormikDatePicker = (props) => {
  const [field, meta] = useField(props);
  const errorText = meta.error ? meta.error : '';
  const [errorTexts, setErrorText] = useState('');
  const {setFieldValue, label, extraParams, containerStyle} = props

  return (
    <MDBox {...containerStyle}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          sx={{width: '100%'}}
          label={label}
          value={moment(field.value, "YYYY-MM-DD")}
          onChange={(value, errors) => {
            if (errors.validationError === null) {
              setFieldValue(field.name, value ? value.format("YYYY-MM-DD") : "", true)
              setErrorText('')
            } else {
              setFieldValue(field.name, "", true)
              setErrorText('Invalid date')
            }
          }}
          slotProps={{
            textField: {
              helperText: meta.touched ? errorTexts ? errorTexts : errorText : '',
              error: meta.touched && (errorText !== '' || errorTexts !== '')
            },
          }}
          {...extraParams}
        />
      </LocalizationProvider>
    </MDBox>
  )
}


const FormikDateTimePicker = (props) => {
  const [field, meta] = useField(props);
  const errorText = meta.error ? meta.error : '';
  const [errorTexts, setErrorText] = useState('');
  const {setFieldValue, label, extraParams, containerStyle} = props

  return (
    <MDBox {...containerStyle}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          sx={{width: '100%'}}
          value={moment(field.value, "YYYY-MM-DD")}
          label={label}
          onChange={(value, errors) => {
            if (errors.validationError === null) {
              setFieldValue(field.name, value.format("YYYY-MM-DD"), true)
              setErrorText('')
            } else {
              setErrorText('Invalid date')
            }
          }}
          slotProps={{
            textField: {
              helperText: meta.touched ? errorTexts ? errorTexts : errorText : '',
              error: meta.touched && (errorText !== '' || errorTexts !== '')
            },
          }}
          {...extraParams}
        />
      </LocalizationProvider>
    </MDBox>
  )
}


const FormikSelectInput = (props) => {
  const [meta] = useField(props);
  const {
    name, errors, multiple,
    freeSolo, value, label,
    options = [], setFieldValue, initialValue,
    onChangeSelect, labelFieldName = 'name', ...rest
  } = props

  return (
    <Field name={name}>
      {({field}) => (
        <MDBox {...rest}>
          <AutocompleteFormik
            multiple={multiple}
            freeSolo={freeSolo}
            options={options}
            labelFieldName={labelFieldName}
            field={field}
            setFieldValue={(field, value) => {
              const newValue = value !== undefined ? value : null
              setFieldValue(field, newValue)
            }}
            value={initialValue || ""}
            touched
            errors={meta.touched && errors}
            label={label}
          />
        </MDBox>
      )}
    </Field>
  )
}

const FormikInput = (props) => {
  let component = null
  switch (props.type) {
    case FieldTypes.phone:
      component = <FormikPhoneInput {...props} />
      break;
    case FieldTypes.textarea:
      component = <FormikTextInput rows={props.rows} multiline {...props} />
      break;
    case FieldTypes.select:
      component = <FormikSelectInput {...props} />
      break;
    case FieldTypes.autocomplete:
      component = <AutocompleteFK {...props} />
      break;
    case FieldTypes.date:
      component = <FormikDatePicker {...props} />
      break;
    case FieldTypes.datetime:
      component = <FormikDateTimePicker {...props} />
      break;
    case FieldTypes.email:
      component = <FormikTextInput {...props} />
      break;
    case FieldTypes.password:
      component = <FormikTextInput {...props} />
      break;
    case FieldTypes.number:
      component = <FormikTextInput {...props} />
      break;
    case FieldTypes.checkbox:
      component = <FormikBooleanInput {...props} />
      break;
    // case FieldTypes.drag_and_drop:
    //   component = <FormikTextInput {...props} />
    //   break;
    case FieldTypes.file:
      component = <FormikFileInput {...props} />
      break;
    default:
      component = <FormikTextInput type={"text"} {...props} />
  }
  return component

}

FormikInput.propTypes = {
  type: PropTypes.oneOf([
    "textarea",
    "phone_input",
    "password",
    "select",
    "autocomplete",
    "date",
    "email",
    "drag_and_drop",
    "file",
    "text",
    "email",
    "password",
    "number",
    "checkbox",
    "datetime",
  ]),
};

export default FormikInput


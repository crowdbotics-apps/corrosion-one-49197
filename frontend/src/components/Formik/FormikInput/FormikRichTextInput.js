import { useField } from "formik";
import MDInput from "../../MDInput";
import React from "react";
import MDBox from "../../MDBox";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import MDTypography from "@mui/material/Typography";

export const FormikRichTextInput = (props) => {

  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  const {
    label,
    value,
    overrideError,
    disabled = false,
    setFieldValue,
    ...rest
  } = props;


  return (
    <MDBox {...rest}>

      <MDTypography sx={{fontSize: 13}} mb={1}>{label}</MDTypography>
      <ReactQuill
        theme="snow"
        value={field.value}
        onChange={(newValue) => {
          setFieldValue(field.name, newValue)
        }}
        placeholder={ 'Job description...'}
        modules={{
          toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'},
             {'indent': '-1'}, {'indent': '+1'}],
            ['link'],
            ['clean']
          ],
        }}
        readOnly={disabled}
      />
      {errorText && !overrideError && <MDTypography ml={2} mt={1} style={{ color: 'red', fontSize: 12 }}>{errorText}</MDTypography>}
    </MDBox>
  );
};

import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import {Form, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/Formik/FormikInput";


function Credentials({updateLocation}) {

  const initialValues  = {
    credentials: [],
  }

  const validationSchema = Yup.object().shape({
    credentials: Yup.array().min(1, 'At least one credential is required'),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    }
  })

  return (
    <MDBox>
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}}>
        Credentials
      </MDTypography>
      <FormikProvider value={formik}>
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <FormikInput
            type={"autocomplete"}
            value={[]}
            fieldName={"credentials"}
            label={"Credentials"}
            placeholder={"Credentials"}
            options={[]}
            accessKey={"name"}
            multiple
            onChange={(value) => {
              const currentValues = [...formik.values.credentials]
              if (currentValues.find((item) => item.id === value?.[0]?.id)) return
              currentValues.push(value[0])
              formik.setFieldValue('credentials', currentValues)
            }}
          />
        </Form>
      </FormikProvider>
      <MDBox sx={{height: '1px', width: "100%", backgroundColor: "#E4E5E8"}} my={3} />
      <MDBox display={"flex"}>
        <MDButton
          type={"submit"}
          variant={"contained"}
          color={"secondary"}
          size={"large"}
          sx={{marginLeft: "auto"}}
        >
          Save Changes
        </MDButton>
      </MDBox>
    </MDBox>
  );

}

export default Credentials;

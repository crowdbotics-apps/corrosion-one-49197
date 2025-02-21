import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import {Form, FormikProvider, useFormik} from "formik";
import FormikInput from "../../../components/Formik/FormikInput";
import * as Yup from "yup";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {useEffect, useState} from "react";
import {useApi, useLoginStore} from "../../../services/helpers";
import Grid from "@mui/material/Grid";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RenderWorkArea from "../../../components/RenderListOption";

function LocationSettings({updateLocation}) {
  const loginStore = useLoginStore();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const api = useApi()
  const [loading, setLoading] = useState(false);

  const getCountries = () => {
    api.getCountries().handle({
      onSuccess: (result) => {
        setCountries(result?.data)
      },
    })
  }

  const getStates = (countryIds) => {
    api.getStates({countries: countryIds.toString()}).handle({
      onSuccess: (result) => {
        setStates(result?.data)
      },
    })
  }

  const initialValuesThirdStepInspector = {
    country: loginStore.countries,
    state: loginStore.regions,
  }

  const validationSchemaThirdStepInspector = Yup.object().shape({
    country: Yup.array().min(1, 'At least one country is required'),
    state: Yup.array().min(1, 'At least one state is required'),
  })

  const formikThirdStepInspector = useFormik({
    initialValues: initialValuesThirdStepInspector,
    validateOnChange: false,
    validationSchema: validationSchemaThirdStepInspector,
    onSubmit: (values) => {
      const valuesToSend = {...values}
      valuesToSend.state = valuesToSend.state.map((item) => item.id)
      console.log(valuesToSend)
    }
  })

  const handleRemoveCountry = (id) => {
    const currentCountries = formikThirdStepInspector.values.country
    const newCountries = currentCountries.filter((item) => item.id !== id)
    const newStates = formikThirdStepInspector.values.state.filter((item) => {
      return item.country_id !== id
    })

    formikThirdStepInspector.setFieldValue('country', newCountries)
    formikThirdStepInspector.setFieldValue('state', newStates)
  }

  const handleRemoveState = (id) => {
    const newStates = formikThirdStepInspector.values.state.filter((item) => item.id !== id)
    formikThirdStepInspector.setFieldValue('state', newStates)
  }

  useEffect(() => {
    getCountries()
  }, [])

  useEffect(() => {
    getStates(formikThirdStepInspector.values.country.map((item) => item.id))
  }, [formikThirdStepInspector.values.country])


  const renderWorkArea = (item, handleRemove = () => {}) => {
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
          onClick={() => handleRemove(item.id)}
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


  return (
    <MDBox>
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}}>
        Location Preferences
      </MDTypography>
      <FormikProvider value={formikThirdStepInspector}>
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <Grid container spacing={{xs: 0, lg: 3}}>
            <Grid item xs={12} lg={6}>
              <FormikInput
                type={"autocomplete"}
                value={[]}
                fieldName={"country"}
                label={"Country"}
                placeholder={"Country"}
                options={countries}
                accessKey={"name"}
                multiple
                onChange={(value) => {
                  const currentValues = [...formikThirdStepInspector.values.country]
                  if (currentValues.find((item) => item.id === value?.[0]?.id)) return
                  currentValues.push(value[0])
                  formikThirdStepInspector.setFieldValue('country', currentValues)
                }}
              />
              <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
                {formikThirdStepInspector.values.country.map((item) => renderWorkArea(item, handleRemoveCountry))}
              </MDBox>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormikInput
                type={"autocomplete"}
                value={[]}
                fieldName={"state"}
                label={"State"}
                options={states}
                accessKey={"name"}
                multiple={true}
                onChange={(value) => {
                  const currentValues = [...formikThirdStepInspector.values.state]
                  if (currentValues.find((item) => item.id === value?.[0]?.id)) return
                  currentValues.push(value[0])
                  formikThirdStepInspector.setFieldValue('state', currentValues)
                }}
              />
              <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
                {formikThirdStepInspector.values.state.map((item) => <RenderWorkArea key={item.id} item={item} handleRemove={handleRemoveState}/>)}
              </MDBox>
            </Grid>
          </Grid>


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
          disabled={loading}
          onClick={formikThirdStepInspector.handleSubmit}
        >
          Save Changes
        </MDButton>
      </MDBox>
    </MDBox>
  );

}

export default LocationSettings;

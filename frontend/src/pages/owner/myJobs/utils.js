
import React from "react";
import MDBox from "@mui/material/Box";
import MDTypography from "@mui/material/Typography";
import {ENROLMENT_STATUS} from "../../../components/AdminLayout/helpers";


const STATUS_OPTIONS_COLORS = {
  [ENROLMENT_STATUS.INVITED]: "warning",
  [ENROLMENT_STATUS.REQUESTED]: "warning",
  [ENROLMENT_STATUS.ACCEPTED]: "success",
  [ENROLMENT_STATUS.REJECTED]: "error",
  [ENROLMENT_STATUS.WITHDRAWN]: "secondary",
}

const generateRowData = () => {
  const customStyle = (styles) => ({
    ...styles,
  });
  const estilo = {
    title:{
      fontWeight: 'bold',
      fontSize: '16px',
    },
    date:{
      display: 'flex',
      marginLeft: '5px',
    },
    button:{
      paddingTop: '2px',
      paddingBottom: '2px',
      paddingRight: '10px',
      paddingLeft: '10px',
      borderRadius: '12px',
      borderColor: '#006E90',
      color: '#006E90',
      fontSize: '15px',
    },
    buttonView:{
      borderColor: '#006E90',
      color: '#006E90',
      paddingTop: '2px',
      paddingBottom: '2px',
      paddingRight: '8px',
      paddingLeft: '8px',
      minWidth: 'auto',
      minHeight: 'auto',
      height: 'auto',
      lineHeight: 1,
      textTransform: 'none',
      '&:hover': {
      borderColor: '#006E90', }
    }
  };

  const users = [
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Real State Agent</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >25</MDTypography></MDBox>),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>856</MDTypography>
        </MDBox>
      ),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-April-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Closed'


    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Manager</MDTypography>
        </MDBox>
      ),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>901</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >26</MDTypography></MDBox>),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-03-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Paused'
    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Appraiser</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >17</MDTypography></MDBox>),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>901</MDTypography>
        </MDBox>
      ),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-02-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Open'
    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Sales Associate</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >15</MDTypography></MDBox>),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>203</MDTypography>
        </MDBox>
      ),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-09-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Paused'
    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Realtor</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >20</MDTypography></MDBox>),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>320</MDTypography>
        </MDBox>
      ),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-12-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Paused'
    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Listing Agent</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >10</MDTypography></MDBox>),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>256</MDTypography>
        </MDBox>
      ),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-10-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Closed'
    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>106</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >22</MDTypography></MDBox>),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-08-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Closed'
    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>505</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >13</MDTypography></MDBox>),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-April-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Open'
    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>211</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >30</MDTypography></MDBox>),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-04-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Closed'
    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >35</MDTypography></MDBox>),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>348</MDTypography>
        </MDBox>
      ),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-01-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Open'
    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >16</MDTypography></MDBox>),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>806</MDTypography>
        </MDBox>
      ),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-April-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Open'
    },
    {
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      applicants: (<MDBox sx={{marginTop:'5px', marginLeft: '30px'}}><MDTypography sx={{fontSize: '16px'}} >18</MDTypography></MDBox>),
      views:(
        <MDBox>
          <MDTypography sx={{marginLeft: '10px', fontSize :'16px'}}>956</MDTypography>
        </MDBox>
      ),
      applicationDate: (
        <MDBox style={estilo.date}>
          {(() => {
            const date = new Date("2025-April-16");
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString("en-GB", { month: "short" });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = date.getFullYear();
            return `${day}/${capitalizedMonth}/${year}`;
          })()}
        </MDBox>
      ),
      status:'Paused'
    }

  ]




  return users.map(user => {
    return {
      bidsJobs:user.bidsJobs,
      applicants:user.applicants,
      views:user.views,
      date_posted:user.applicationDate,
      status:user.status,
    };
  });
};


export const dataTableModel = {
  columns: [
    { Header: "Job Title", accessor: "title",width: 150},
    // { Header: "Applicants", accessor: "applicants",disableOrdering: true ,width: 100 },
    // { Header: "Views", accessor: "views",disableOrdering: true, width: 50 },
    // { Header: "Date Posted", accessor: "date_posted", width: 120 },
    // { Header: "Status", accessor: "status", disableOrdering: true,width: 80 },
    { Header: " ",accessor: "actions", disableOrdering: true, width: 200 },
  ],
  rows: [],
};

export const renderTableRow = (item) => {
  // item.name_raw = item.name
  // item.name_table = renderProfilePicture(item)
  // item.actions = (popOver(item, setAnchorEl, setOpenPopover, setSelectedItem))
  return item
}



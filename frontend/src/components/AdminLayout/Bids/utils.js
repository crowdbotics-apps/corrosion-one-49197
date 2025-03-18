
import { ENROLMENT_STATUS } from "../helpers";
import React from "react";
import MDButton from "../../../components/MDButton"
import MDBox from "../../MDBox"
import MDAvatar from "../../MDAvatar"
import MDTypography from "../../MDTypography"

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
      marginLeft: '15px',
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
  };

  const users = [
    {
      gender: "male",
      profile_picture: <MDAvatar variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }} src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} />,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Benjamin Calt</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Real State Agent</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}} >$51.95</MDTypography>
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
      )


    },
    {
      gender: "female",
      profile_picture: <MDAvatar variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }} src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} />,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Elena Streep</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Manager</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}}>$51.95</MDTypography>
        </MDBox>
      ),
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
      )
    },
    {
      gender: "female",
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Jane Smith</MDTypography>
        </MDBox>

      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Appraiser</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}}>$51.95</MDTypography>
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
      )
    },
    {
      gender: "female",
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Jay ruhe</MDTypography>
        </MDBox>

      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Sales Associate</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}}>$51.95</MDTypography>
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
      )
    },
    {
      gender: "male",
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Julian Marck</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Realtor</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}} >$51.95</MDTypography>
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
      )
    },
    {
      gender: "female",
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Nicole kidman</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Listing Agent</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}}>$51.95</MDTypography>
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
      )
    },
    {
      gender: "male",
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Smith Joe</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}}>$51.95</MDTypography>
        </MDBox>
      ),
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
      )
    },
    {
      gender: "male",
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Joe Bartmann</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}}>$51.95</MDTypography>
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
      )
    },
    {
      gender: "female",
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Lydia Diaz</MDTypography>
        </MDBox>

      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}}>$51.95</MDTypography>
        </MDBox>
      ),
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
      )
    },
    {
      gender: "male",
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>James Gardner</MDTypography>
        </MDBox>

      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}}>$51.95</MDTypography>
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
      )
    },
    {
      gender: "male",
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Ruben Culhane</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}} >$51.95</MDTypography>
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
      )
    },
    {
      gender: "female",
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Angelina Swann</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography sx={{fontSize: '16px'}} >$51.95</MDTypography>
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
      )
    }

  ]




  return users.map(user => {
    return {
      profile_picture: user.profile_picture,
      name: user.name,
      email: user.email,
      bidsJobs:user.bidsJobs,
      bidAmount:user.bidAmount,
      applicationDate:user.applicationDate,
      gender: user.gender,
    };
  });
};


export const dataTableModel = {
  columns: [
    { Header: " ", accessor: "profile_picture", disableOrdering: true, width: 60 },
    { Header: "Bidder Name", accessor: 'name', disableOrdering: true, width: 150 },
    { Header: "Bids Jobs", accessor: "bidsJobs",width: 150},
    { Header: "Bid Amount", accessor: "bidAmount" ,width: 150 },
    { Header: "Aplication Date", accessor: "applicationDate", width: 120 },
    { Header: " ",accessor: "actions", disableOrdering: true, width: 100 },
  ],
  rows: generateRowData(),
};




import { ENROLMENT_STATUS } from "../helpers";
import React from "react";
import MDBox from "@mui/material/Box";
import MDAvatar from "@mui/material/Avatar";
import MDTypography from "@mui/material/Typography";

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
      fontWeight: 'bold'
    },
    font: {
      color: '#7C8493',
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
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Reject",
      applicationDate: <MDBox>{new Date("2025-02-20").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Active",
      applicationDate: <MDBox>{new Date("2025-02-19").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Reject",
      applicationDate: <MDBox>{new Date("2025-02-18").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Active",
      applicationDate: <MDBox>{new Date("2025-02-17").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Reject",
      applicationDate: <MDBox>{new Date("2025-02-15").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Active",
      applicationDate: <MDBox>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Reject",
      applicationDate: <MDBox>{new Date("2025-02-20").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Active",
      applicationDate: <MDBox>{new Date("2025-02-19").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Reject",
      applicationDate: <MDBox>{new Date("2025-02-18").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Active",
      applicationDate: <MDBox>{new Date("2025-02-17").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Reject",
      applicationDate: <MDBox>{new Date("2025-02-15").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Active",
      applicationDate: <MDBox>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Reject",
      applicationDate: <MDBox>{new Date("2025-02-20").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Active",
      applicationDate: <MDBox>{new Date("2025-02-19").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Reject",
      applicationDate: <MDBox>{new Date("2025-02-18").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Active",
      applicationDate: <MDBox>{new Date("2025-02-17").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Reject",
      applicationDate: <MDBox>{new Date("2025-02-15").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Niactic Media</MDTypography>
          <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
        </MDBox>
      ),
      status: "Active",
      applicationDate: <MDBox>{new Date("2025-10-16").toLocaleDateString()}</MDBox>,
    },

  ]


  const renderStatusLabel = (status) => (
    <MDBox
      style={{
        font: 'Poppins',
        display: 'inline-block',
        borderRadius: '20px',
        backgroundColor: status.color,
        color: status.labelColor,
        textAlign: 'center',
        lineHeight: '40px',
        fontWeight: 'bold',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        fontSize: '16px',
        whiteSpace: 'nowrap',
        width: '150px',
        height: '40px',
      }}
    >
      {status.label}
    </MDBox>



  );

  return users.map(user => {
    let status = {
      color: 'gray',
      label: 'Unknown',
      labelColor: 'black',
    };

    const statusMap = {
      Active: { color: '#D0FFE480', label: 'Active', labelColor: '#00AD42' },
      Reject: { color: '#FFD7D080', label: 'Reject',  labelColor: '#FF5F57'},
    };
    if (statusMap[user.status]) {
      status = statusMap[user.status];
    }
    return {
      profile_picture: user.profile_picture,
      name: user.name,
      email: user.email,
      applicationDate:user.applicationDate,
      status: renderStatusLabel(status),
    };
  });
};


export const dataTableModel = {
  columns: [
    { Header: " ", accessor: "profile_picture", disableOrdering: true, width: 60 },
    { Header: "Jobs", accessor: 'name', disableOrdering: true, width: 300 },
    { Header: "Aplication Date", accessor: "applicationDate",width: 200},
    { Header: "Status", accessor: "status", width: 200 },
    { Header: " ",accessor: "actions", disableOrdering: true, width: 50 },
  ],
  rows: generateRowData(),
};



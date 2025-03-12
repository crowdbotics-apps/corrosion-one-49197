
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
      marginLeft: '20px',
    }
  };

  const users = [
    {
      gender: "male",
      profile_picture: <MDAvatar variant={"circular"} style={{ fontSize: "80px", borderRadius: "50%" }} src={"https://s3-alpha-sig.figma.com/img/713f/9fde/146f04fcc70654f890768e4ae18425c7?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=azo2I58bpeSIXtGy0Spmf1k3AXX6Me5Tfs7LGs5zoFoZNjfsxXHHOsCnkl68hSL8ZbgLVlkpIzpcJYITKaW~bzPyyYNJts2bQ5X171WhHB7GZ4-HrTIEbS4WqE9m3GnTDkYi2uxT7z6aRX6YDzF1k3XdC05wjL3USqqcsPqsyU6af0cZu6i1EBPkmN3D9C8cWIGNXYpcfs0uLKI4xcBhy5Bfr7X6Cz00zMAEHfqcMXFri6htgi2yZ5mhU~42urPgEOZmO3Ia-NJgYjSIQ0iQyJy1CoTaATf4SKRwK9egzn6-EYlVaxzDkldspVhKPiWZLJfs0Iq1veKvmKXcw1ul5A__"} />,
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
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      gender: "female",
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} />,
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
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
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
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
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
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
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
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
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
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
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
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>AI Specialist</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Game Developer</MDTypography>
        </MDBox>

      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Operations Manager</MDTypography>
        </MDBox>

      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>SEO Expert</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Content Strategist</MDTypography>
        </MDBox>
      ),
      bidsJobs: (
        <MDBox>
          <MDTypography style={estilo.title}>Developer</MDTypography>
        </MDBox>
      ),
      bidAmount: (
        <MDBox style={estilo.date}>
          <MDTypography >$51.95</MDTypography>
        </MDBox>
      ),
      applicationDate: <MDBox style={estilo.date}>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
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
      actions: (
        <MDBox sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2,  width: { xs: '150px', md: '275px' },  padding: 0, }}>
          <MDButton
            variant="outlined"
            sx={{
              borderColor: '#006E90',
              color: '#006E90',
              fontSize: '15px',
            }}

          >
            View Details
          </MDButton>

          <MDButton
            variant="outlined"
            sx={{
              borderColor: '#E14640',
              color: '#E14640',
              fontSize: '15px',
            }}
          >
            Rejected
          </MDButton>
        </MDBox>


      ),
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
    { Header: " ",accessor: "actions", disableOrdering: true, width: 50 },
    { Header: " ",accessor: "actions_details", disableOrdering: true, width: 60 },
  ],
  rows: generateRowData(),
};



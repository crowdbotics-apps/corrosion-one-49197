
import {Chip, Icon} from "@mui/material";
import { ENROLMENT_STATUS } from "./helpers";
import React from "react";
import MDButton from "../../components/MDButton"
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';

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
  };

  const users = [
    {
      profile_picture: <span style={{ fontSize: "50px" }}>👨‍💻</span>,
      name: (
        <>
          <span style={estilo.title}>Software Engineer</span><br /><br />
          <span style={estilo.font}>Building innovative software solutions.</span>

        </>
      ),
      status: "Pending",
      jobStatus: "Active",
      applicationDate: <span>{new Date("2025-02-20").toLocaleDateString()}</span>,
    },
    {
      profile_picture: <span style={{ fontSize: "50px" }}>👩‍💻</span>,
      name: (
        <>
          <span style={estilo.title}>Data Scientist</span><br /><br />
          <span style={estilo.font}>Specializing in analyzing complex data to drive business insights.</span>

        </>
      ),
      status: "Selected",
      jobStatus: "Not Available",
      applicationDate: <span>{new Date("2025-02-19").toLocaleDateString()}</span>,
    },
    {
      profile_picture: <span style={{ fontSize: "50px" }}>🧑‍🎨</span>,
      name: (
        <>
          <span style={estilo.title}>UX/UI Designer</span><br /><br />
          <span style={estilo.font}> Crafting user-friendly interfaces and seamless experiences.</span>

        </>
      ),
      status: "Accepted",
      jobStatus: "Closed",
      applicationDate: <span>{new Date("2025-02-18").toLocaleDateString()}</span>,
    },
    {
      profile_picture: <span style={{ fontSize: "50px" }}>👩‍💼</span>,
      name: (
        <>
          <span style={estilo.title}>Product Manager</span><br /><br />
          <span style={estilo.font}> Leading product development and driving business success.</span>

        </>
      ),
      status: "Pending",
      jobStatus: "Active",
      applicationDate: <span>{new Date("2025-02-17").toLocaleDateString()}</span>,
    },
    {
      profile_picture: <span style={{ fontSize: "50px" }}>👨‍💼</span>,
      name: (
        <>
          <span style={estilo.title}>Marketing Specialist</span><br /><br />
          <span style={estilo.font}> Creating impactful marketing strategies to boost brand awareness.</span>

        </>
      ),
      status: "Selected",
      jobStatus: "Not Available",
      applicationDate: <span>{new Date("2025-02-16").toLocaleDateString()}</span>,
    }
  ]

  const renderStatusLabel = (status) => (
    <span
      style={{
        font: 'Poppins',
        display: 'inline-block',
        padding: '2px 16px',
        borderRadius: '20px',
        backgroundColor: status.color,
        color: status.labelColor,
        textAlign: 'center',
        lineHeight: '30px',
        fontWeight: 'bold',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        fontSize: '16px',
        whiteSpace: 'nowrap',
        minWidth: 'auto',
      }}
    >
  {status.label}
</span>


  );

  return users.map(user => {
    let status = {
      color: 'gray',
      label: 'Unknown',
      labelColor: 'black',
    };
    let jobStatus = {
      color: 'gray',
      label: 'Unknown',
      labelColor: 'black',
    };

    const statusMap = {
      Accepted: { color: '#D0FFE480', label: 'Accepted', labelColor: '#00AD42' },
      Selected: { color: '#FFD7D080', label: 'Not Selected',  labelColor: '#FF5F57'},
      Pending: { color: '#FFBD2E33', label: 'Pending', labelColor: '#FFBD2E'  },
    };
    if (statusMap[user.status]) {
      status = statusMap[user.status];
    }
    const jobStatusMap = {
      Active: { color: '#D0FFE480', label: 'Active', labelColor: '#00AD42' },
      'Not Available': { color: '#FFD7D080', label: 'Not Available', labelColor: '#FF5F57'},
      Closed: { color: '#FFD7D080',  label: 'Closed', labelColor: '#FF5F57'},
    };
    if (jobStatusMap[user.jobStatus]) {
      jobStatus = jobStatusMap[user.jobStatus];
    }

    return {
      profile_picture: user.profile_picture,
      name: user.name,
      email: user.email,
      applicationDate:user.applicationDate,
      status: renderStatusLabel(status),
      jobStatus: renderStatusLabel(jobStatus),
      actions_edit: (
        <MDButton variant="text" sx={{ color: '#006E90', minWidth: 'auto', padding: 0 }}>
          <BookmarkOutlinedIcon />
        </MDButton>
      ),
      actions_delete: (
        <MDButton variant="outlined" sx={{ borderColor: '#006E90', color: '#006E90', width: '100px', minWidth: 'auto', padding: 0, fontSize: "15px" }}>
          View Details
        </MDButton>
      ),
      actions_details: (
        <MDButton variant="outlined" sx={{ borderColor: '#E14640', color: '#E14640' ,width: '100px', minWidth: 'auto', padding: 0, fontSize: "15px" }}>
          Withdraw
        </MDButton>
      ),
    };
  });
};


export const dataTableModel = {
  columns: [
    { Header: " ", accessor: "profile_picture", disableOrdering: true, width: 60 },
    { Header: "Jobs", accessor: 'name', disableOrdering: true, width: 300 },
    { Header: "Aplication Date", accessor: "applicationDate",width: 150},
    { Header: "Aplication Status", accessor: "status" ,width: 170 },
    { Header: "Jobs Status", accessor: "jobStatus", width: 120 },
    { Header: " ",accessor: "actions_edit", disableOrdering: true, width: 7 },
    { Header: " ",accessor: "actions_delete", disableOrdering: true, width: 50 },
    { Header: " ",accessor: "actions_details", disableOrdering: true, width: 60 },
  ],
  rows: generateRowData(),
};

//
// const renderProfilePicture = (item) => {
//   return (
//     <Box display={"flex"} alignItems={"center"} gap={1}>
//       {item.image
//         ? <Box component={"img"} src={item.image} alt={"profile_picture"} width={"40px"}
//                sx={{objectFit: 'cover'}} borderRadius={"50%"}/>
//         : <Box component={"img"} src={defaultImg} alt={"profile_picture"} width={"40px"}
//                borderRadius={"50%"}/>
//       }
//
//     </Box>
//   )
// }

const renderStatus = (item) => {
  return (
    <Chip id={item.status} color={STATUS_OPTIONS_COLORS[item.status]} label={ENROLMENT_STATUS._LABELS[item.status]} />
  )
}

const popOver = (status, item, setAnchorEl, setOpenPopover, setSelectedItem, extra_jsx) => {
  return (
    <>
      {extra_jsx}
      {
        (status === ENROLMENT_STATUS.INVITED || status === ENROLMENT_STATUS.REQUESTED || status === ENROLMENT_STATUS.ACCEPTED ) &&
        <Icon
          fontSize='medium' sx={{cursor: 'pointer'}}
          onClick={(e) => {
            setAnchorEl(e.currentTarget)
            setOpenPopover(true)
            setSelectedItem(item)
          }}
        >
          more_vert
        </Icon>
      }
    </>
  )
}
//
// export const renderTableRow = (item, setAnchorEl, setOpenPopover, setSelectedItem, bucksButtons) => {
//   const status =  item.status
//   item.profile_picture = renderProfilePicture(item)
//   item.status_id = item.status
//   item.status = renderStatus(item)
//   item.actions = (popOver(status, item, setAnchorEl, setOpenPopover, setSelectedItem))
//   item.bucks = item.student_id ? bucksButtons(item) : '-'
//   return item
// }

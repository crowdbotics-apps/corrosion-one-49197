
import { ENROLMENT_STATUS } from "./helpers";
import React from "react";
import MDButton from "../../components/MDButton"
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import MDBox from "../MDBox"
import MDAvatar from "../MDAvatar"
import MDTypography from "../MDTypography"

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
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Software Engineer</MDTypography>
          <MDTypography style={estilo.font}>Building innovative software solutions.</MDTypography>
        </MDBox>
      ),
      status: "Pending",
      jobStatus: "Active",
      applicationDate: <MDBox>{new Date("2025-02-20").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Data Scientist</MDTypography>
          <MDTypography style={estilo.font}>Specializing in analyzing complex data to drive business insights.</MDTypography>
        </MDBox>
      ),
      status: "Selected",
      jobStatus: "Not Available",
      applicationDate: <MDBox>{new Date("2025-02-19").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>UX/UI Designer</MDTypography>
          <MDTypography style={estilo.font}>Crafting user-friendly interfaces and seamless experiences.</MDTypography>
        </MDBox>

      ),
      status: "Accepted",
      jobStatus: "Closed",
      applicationDate: <MDBox>{new Date("2025-02-18").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Product Manager</MDTypography>
          <MDTypography style={estilo.font}>Leading product development and driving business success.</MDTypography>
        </MDBox>

      ),
      status: "Pending",
      jobStatus: "Active",
      applicationDate: <MDBox>{new Date("2025-02-17").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Marketing Specialist</MDTypography>
          <MDTypography style={estilo.font}>Creating marketing strategies to boost brand awareness.</MDTypography>
        </MDBox>
      ),
      status: "Pending",
      jobStatus: "Active",
      applicationDate: <MDBox>{new Date("2025-02-15").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Marketing Specialist</MDTypography>
          <MDTypography style={estilo.font}>Creating marketing strategies to boost brand awareness.</MDTypography>
        </MDBox>
      ),
      status: "Selected",
      jobStatus: "Not Available",
      applicationDate: <MDBox>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Software Engineer</MDTypography>
          <MDTypography style={estilo.font}>Building innovative software solutions.</MDTypography>
        </MDBox>
      ),
      status: "Pending",
      jobStatus: "Active",
      applicationDate: <MDBox>{new Date("2025-02-20").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Data Scientist</MDTypography>
          <MDTypography style={estilo.font}>Specializing in analyzing complex data to drive business insights.</MDTypography>
        </MDBox>
      ),
      status: "Selected",
      jobStatus: "Not Available",
      applicationDate: <MDBox>{new Date("2025-02-19").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>UX/UI Designer</MDTypography>
          <MDTypography style={estilo.font}>Crafting user-friendly interfaces and seamless experiences.</MDTypography>
        </MDBox>

      ),
      status: "Accepted",
      jobStatus: "Closed",
      applicationDate: <MDBox>{new Date("2025-02-18").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Product Manager</MDTypography>
          <MDTypography style={estilo.font}>Leading product development and driving business success.</MDTypography>
        </MDBox>

      ),
      status: "Pending",
      jobStatus: "Active",
      applicationDate: <MDBox>{new Date("2025-02-17").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Marketing Specialist</MDTypography>
          <MDTypography style={estilo.font}>Creating marketing strategies to boost brand awareness.</MDTypography>
        </MDBox>
      ),
      status: "Pending",
      jobStatus: "Active",
      applicationDate: <MDBox>{new Date("2025-02-15").toLocaleDateString()}</MDBox>,
    },
    {
      profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"square"} style={{ fontSize: "50px" }}/>,
      name: (
        <MDBox>
          <MDTypography style={estilo.title}>Marketing Specialist</MDTypography>
          <MDTypography style={estilo.font}>Creating marketing strategies to boost brand awareness.</MDTypography>
        </MDBox>
      ),
      status: "Selected",
      jobStatus: "Not Available",
      applicationDate: <MDBox>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
    }
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
//
// const renderStatus = (item) => {
//   return (
//     <Chip id={item.status} color={STATUS_OPTIONS_COLORS[item.status]} label={ENROLMENT_STATUS._LABELS[item.status]} />
//   )
// }
//
// const popOver = (status, item, setAnchorEl, setOpenPopover, setSelectedItem, extra_jsx) => {
//   return (
//     <>
//       {extra_jsx}
//       {
//         (status === ENROLMENT_STATUS.INVITED || status === ENROLMENT_STATUS.REQUESTED || status === ENROLMENT_STATUS.ACCEPTED ) &&
//         <Icon
//           fontSize='medium' sx={{cursor: 'pointer'}}
//           onClick={(e) => {
//             setAnchorEl(e.currentTarget)
//             setOpenPopover(true)
//             setSelectedItem(item)
//           }}
//         >
//           more_vert
//         </Icon>
//       }
//     </>
//   )
// }
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

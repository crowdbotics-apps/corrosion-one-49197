import Messages from "./components/dataMessages"
import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"
import {Grid, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, {useEffect, useState} from "react";
import {checkUrl, date_fmt, useApi} from "../../../services/helpers";
import MDTypography from "../../../components/MDTypography";
import moment from "moment";


function HomeOwnerMessages() {
  const api = useApi()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [loading, setLoading] = useState(false)

  const getChatsAvailable = (search = '') => {
    setLoading(true)
    api.getChatsAvailable({search}).handle({
      onSuccess: (result) => {
        setChats(result.data)
      },
      errorMessage: 'Error getting chats',
      onFinally: () => setLoading(false)
    })
  }

  useEffect(() => {
    getChatsAvailable('')
  }, [])

  const renderChatItem = (chat) => {
    return (
      <Grid item xs={12} key={chat.id + '-chat'}>
        <MDBox
          display="flex"
          width="100%"
          height="100%"
          sx={{
            padding: '16px',
            borderBottom: '1px solid #E0E0E0',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#EBF7FA',
              borderRadius: '12px',
              borderWidth: 0
            },
            position: 'relative'
          }}
          onClick={() => setSelectedChat(chat)}
        >
          <MDBox
            sx={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: chat.is_active ? '#006E90' : 'transparent',
              position: 'absolute',
              right: 100,
              top: 25
            }}
          />
          <img
            src={checkUrl(chat?.counterpart_image)} alt={chat.counterpart_name}
            style={{width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px'}}
          />
          <MDBox flex={1}>
            <MDBox display="flex">
              <MDTypography
                fontSize={'18px'}
                sx={{
                  width: '160px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >{chat.counterpart_name}

              </MDTypography>
              <MDTypography fontSize={'12px'} mt={'3px'} ml={'auto'}>{moment(chat?.last_activity).fromNow(true)} ago</MDTypography>
            </MDBox>
            <MDTypography
              fontSize={'12px'}
              mt={'3px'}
              sx={{
                width: '250px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >{chat?.last_message}</MDTypography>
          </MDBox>
        </MDBox>
      </Grid>
    )
  }

  const renderNoMessages = () => {
    return (
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{height: '100%', width: '100%'}}>
        <p>No messages</p>
      </MDBox>
    )
  }


  return (
    <AdminLayout
      title={'Messages'}
      showCard
    >
      <Grid
        container
        sx={{
          minHeight: "800px",
        }}
      >
        <Grid item sm={3} sx={{backgroundColor: "white", borderRight: '1px solid #E0E0E0'}}>
          <MDBox display={'flex'}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon/>
                  </InputAdornment>
                ),
                style: {
                  height: '50px',
                  borderRadius: '12px',
                },
              }}
              placeholder="Search messages"
              sx={{
                width: '100%',
                '& .MuiInputBase-input': {
                  height: '40px',
                  fontSize: '18px',
                },
                pr: 2,
              }}
            />
          </MDBox>
          <MDBox
            display="flex"
            flexDirection="column"
            justifyContent={chats.length === 0 ? "center" : "flex-start"}
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Grid container>
              {chats.map((chat) => renderChatItem(chat))}
              {chats.length === 0 && renderNoMessages()}
            </Grid>
          </MDBox>
        </Grid>
        <Grid item sm={9}>

        </Grid>
      </Grid>
    </AdminLayout>
  );
}

export default HomeOwnerMessages;

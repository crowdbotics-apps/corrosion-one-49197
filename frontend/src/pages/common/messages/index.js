import Messages from "./components/dataMessages"
import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"
import {Grid, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, {useState} from "react";
import {useApi} from "../../../services/helpers";


function HomeOwnerMessages() {
  const api = useApi()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)

  const getMessages = (search = '') => {

  }

  const renderChatItem= (chat) => {
    return (
      <Grid item xs={12} key={chat.id + '-chat'}>a</Grid>
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
          minHeight: "600px",
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
            justifyContent="center"
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

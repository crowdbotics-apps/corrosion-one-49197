import React, { useEffect, useRef, useState } from "react"
import { TextField} from "@mui/material";
import MDBox from "components/MDBox";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MDTypography from "../../MDTypography";
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendIcon from '@mui/icons-material/Send';
import MDButton from "../../MDButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import EmojiPicker from 'emoji-picker-react';
import MDInput from "../../MDInput"
import Grid from "@mui/material/Grid"
import {generateChatData} from "./models"

function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const chatContainerRef = useRef(null);

  const searchFunc = (value) => {
    setSearchQuery(value);

    if (value === '') {
      setFileName('');
    }
  };

  const handleEmojiSelect = (emoji) => {
    setSearchQuery(searchQuery + emoji.emoji);
    setEmojiPickerVisible(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Archivo seleccionado:", file);
      setFileName(file.name);
    }
  };

  const handleRowClick = (chat) => {
    setSelectedChat(selectedChat === chat ? null : chat);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (selectedChat && selectedChat.messages) {
      scrollToBottom();
    }
  }, [selectedChat]);

  return (
    <MDBox display="flex" flex={1} style={{ border: "none", backgroundColor: "white" }}>
      <MDBox sx={{ display: "flex", width: "100%", height: "100%" }}>
        <MDBox sx={{ flex: 1 }}>
          <MDBox>
            <TextField
              label={
                <MDBox display="flex" alignItems="center" sx={{ padding: '2rem', fontSize: '16px' }}>
                  <SearchOutlinedIcon sx={{ marginRight: 1 }} />
                  <MDBox>Search messages</MDBox>
                </MDBox>
              }
              sx={{
                width: '352px',
                padding: '2rem',
              }}
              InputProps={{
                style: {
                  height: '50px',
                  borderRadius: '12px',
                },
              }}
              value={searchQuery}
              onChange={(e) => searchFunc(e.target.value)}
            />
          </MDBox>

          <Grid container spacing={2} sx={{marginTop:'10px'}}>
            {generateChatData.map((chat, idx) => (
              <Grid
                item
                key={idx}
                md={12}
                xs={6}
                onClick={() => handleRowClick(chat)}
                sx={{
                  marginLeft: '20px',
                  cursor: "pointer",
                  backgroundColor: selectedChat === chat ? "#EBF7FA" : "white",
                  padding: '12px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 0 rgba(0, 0, 0, 0.1)',
                }}

              >
                <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <MDBox>{chat.nameDescription}</MDBox>

                </MDBox>
              </Grid>
            ))}
          </Grid>
        </MDBox>

        <Grid sx={{
          width: "100%",
          height: "100%",
          padding: "20px",
          borderLeft: "1px solid #ccc",
          backgroundColor: "white",
          marginLeft: "20px",
        }}>
          {selectedChat ? (
            <Grid sx={{
              width: "80%",
              height: "700px",
              padding: "20px",
              backgroundColor: "white",
              margin: "auto",
              overflowY: "auto",
              position: "relative",
              overflow: "hidden",
            }}>

              <Grid sx={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                backgroundColor: "white",
              }}>
                <Grid sx={{
                  backgroundColor: "white",
                  borderBlockEnd: "1px solid #ccc",
                  height: "90px",
                  display: "flex",
                }}>
                  <Grid sx={{ backgroundColor: "white", height: "90px", width: "700px", }}>
                    {selectedChat.principal}
                  </Grid>
                  <Grid sx={{
                    backgroundColor: "white",
                    height: "90px",
                    width: "400px",
                    marginLeft: "200px",
                    gap: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}>
                    <DriveFileRenameOutlineOutlinedIcon />
                    <StarOutlineIcon />
                    <MoreVertIcon />
                  </Grid>
                </Grid>

                <Grid sx={{
                  backgroundColor: "white",
                  borderBlockEnd: "1px solid #ccc",
                  height: "170px",
                }}>
                  <MDBox sx={{ backgroundColor: "white", height: "90px", width: "700px", marginTop: "10px", marginLeft: "170px" }}>
                    {selectedChat.secundary}
                  </MDBox>
                </Grid>
              </Grid>

                <Grid sx={{
                  marginTop: "20px",
                  overflowY: "auto",
                  height: "390px",
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'transparent',
                  },
                }} ref={chatContainerRef}>
                  {selectedChat.messages && selectedChat.messages.map((message, index) => (
                    <Grid key={index} style={{ display: "flex", flexDirection: "column", alignItems: index % 2 === 0 ? "flex-end" : "flex-start", marginBottom: "10px" }}>
                      <MDTypography variant="body2" component="p" sx={{ marginBottom: "8px", color: "#25324B" }}>
                        {index % 2 === 0 ? "You" : selectedChat.name}
                      </MDTypography>
                      <Grid
                        sx={{
                          padding: "10px",
                          width: "30%",
                          borderRadius: "8px",
                          backgroundColor: index % 2 === 0 ? "#EBF7FA" : "white",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          fontFamily: "Roboto, sans-serif",
                          color: "#555",
                          textAlign: "left",
                        }}
                      >
                        {message}
                      </Grid>
                    </Grid>
                ))}
            </Grid>
            </Grid>
          ) : (
            <MDBox sx={{ textAlign: "center", fontSize: "18px", color: "#888" }}>
              <MDTypography>Select a chat to view the conversation.</MDTypography>
            </MDBox>
          )}


          <Grid display="flex" justifyContent="center">
            {selectedChat && (
              <TextField
                sx={{
                  width: '80%',
                  marginTop: '30px',
                }}
                label="Reply message"
                InputProps={{
                  startAdornment: (
                    <MDBox display="flex" alignItems="center">
                      <MDInput
                        type="file"
                        id="file-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file-upload">
                        <AttachFileOutlinedIcon sx={{ marginRight: 1, cursor: 'pointer' }} />
                      </label>
                    </MDBox>
                  ),
                  endAdornment: (
                    <MDBox display="flex" alignItems="center">
                      <MDButton
                        sx={{
                          padding: '1px 10px',
                          minWidth: 'auto',
                          borderRadius: '12px',
                        }}
                        onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                      >
                        <SentimentSatisfiedOutlinedIcon />
                      </MDButton>

                      <MDButton
                        sx={{
                          backgroundColor: '#6DDA43',
                          '&:hover': {
                            backgroundColor: '#5cb039',
                          },
                          padding: '1px 10px',
                          minWidth: 'auto',
                          borderRadius: '12px',
                          display: 'flex',
                        }}
                        startIcon={<SendIcon sx={{ marginLeft: '10px' }} />}
                      />

                      {emojiPickerVisible && (
                        <MDBox
                          sx={{
                            marginLeft: '700px',
                            position: 'absolute',
                            bottom: '50px',
                            left: '0',
                            zIndex: 10,
                          }}
                        >
                          <EmojiPicker onEmojiClick={handleEmojiSelect} />
                        </MDBox>
                      )}
                    </MDBox>

                  ),
                  style: {
                    height: '50px',
                  },
                }}
                value={fileName ? `File: ${fileName}` : searchQuery}
                onChange={(e) => searchFunc(e.target.value)}
              />
            )}
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default Messages;

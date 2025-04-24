
import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"
import {
  Box,
  CircularProgress,
  Dialog, DialogActions, DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search";
import React, {useEffect, useRef, useState} from "react";
import {checkUrl, date_fmt, showMessage, useApi} from "../../../services/helpers";
import MDTypography from "../../../components/MDTypography";
import moment from "moment";
import { Client as ConversationsClient } from "@twilio/conversations"
import MDButton from "../../../components/MDButton";
import avatar from "assets/images/avatar.png";
import file from "assets/images/file.png"
import send from "assets/images/send.png"
import {InsertDriveFileOutlined} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert"
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"


function HomeOwnerMessages() {
  const api = useApi()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [loading, setLoading] = useState(false)
  const clientRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [messageToSend, setMessageToSend] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [currentConversation, setCurrentConversation] = useState({
    conversation_sid: null,
    token: null
  })
  const [searchQuery, setSearchQuery] = useState('')
  const scrollRef = useRef(null)
  const currentConversationRef = useRef(null)
  const fileRef = useRef(null)

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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

  const getChat = (id) => {
    setLoading(true)
    api.getChat(id).handle({
        onSuccess: (res) => {
          // setSelectedChat(res.data)
          console.log(res.data)
          setCurrentConversation(
            {
              conversation_sid: res.data.chat.conversation_sid,
              token: res.data.token
            }
          )
        },
        onFinally: () => setLoading(false)
      }
    )
  }

  const deleteChat = (id) => {
    api.deleteChat(id).handle({
      successMessage: 'Successfully deleted chat',
      onSuccess: (res) => {
        setOpenDeleteModal(false)
        setSelectedChat(null)
        getChatsAvailable()
      },
      errorMessage: 'Error deleting chat',
      onFinally: () => setLoading(false)
    })
  }

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "instant" })
  }


  const handleClick = (chat) => {
    if (loading || sendingMessage) return
    currentConversationRef.current = null
    setMessages([])
    if (selectedChat && selectedChat.id === chat.id) {
      setSelectedChat(null)
    } else {
      setSelectedChat(chat)
    }
  }


  const initializeTwilio = async () => {
    const client = new ConversationsClient(currentConversation.token);
    clientRef.current = client
    if (clientRef.current) {
      clientRef.current.on('initialized', async () => {
        await onSelectConversation(currentConversation.conversation_sid, currentConversation.token)
      });
      clientRef.current.on('initFailed', ({ error }) => {
        // Handle the error.
        showMessage('Error initializing Twilio chat')
      });
    }
  }

  const onSelectConversation = async (sid, token) => {
    setLoading(true)
    currentConversationRef.current = await clientRef.current.getConversationBySid(sid);
    const messagesPaginator = await currentConversationRef.current.getMessages()
    const messages = messagesPaginator.items;
    const editedMessages = []
    messages.map(message => {
      if (message.type === 'media') {
        message.media.getContentTemporaryUrl().then(function (url) {
          message['url_file'] = url
        });
      }
      editedMessages.push(message)
    })

    setMessages(editedMessages)
    setLoading(false)

    currentConversationRef.current.on("messageAdded", async (incomingMessage) => {
      if (incomingMessage.type === 'media') {
        incomingMessage.media.getContentTemporaryUrl().then(function (url) {
          incomingMessage['url_file'] = url
        });
      }
      setMessages(value => [...value, incomingMessage]);
      currentConversationRef.current.advanceLastReadMessageIndex(incomingMessage.index).then(() => {
        // console.log('set last read message')
      })
    });

    // conversation.advanceLastReadMessageIndex(editedMessages[editedMessages.length-1].index).then(() => {
    //   // console.log('set last read message')
    // })
  }

  const sendMessage = async () => {
    if (currentConversationRef.current && sendingMessage === false) {
      if (messageToSend) {
        setSendingMessage(true)
        await currentConversationRef.current.sendMessage(messageToSend);
        setMessageToSend('')
        setSendingMessage(false)
      } else if (selectedFile) {
        setSendingMessage(true)
        const mediaStream = new Blob([selectedFile], {type: selectedFile.type});
        const fileName = selectedFile.name;
        const data = {
          contentType: selectedFile.type,
          media: mediaStream,
          filename: fileName,
        }
        await currentConversationRef.current.sendMessage(data);
        setSelectedFile(null)
        setSendingMessage(false)
      }
      setMessageToSend('')
      setSelectedFile(null)
    }
  };




  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const confirmDelete = () => {
    deleteChat(selectedChat?.id)
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    if (currentConversation.conversation_sid && currentConversation.token) {
      initializeTwilio()
    }
  }, [currentConversation]);

  useEffect(() => {
    if (loading) return
    // Set up the timer
    const debounceTimer = setTimeout(() => {
      getChatsAvailable(searchQuery)
    }, 500)


    // Clear the timer if searchQuery changes before the delay is over
    return () => {
      clearTimeout(debounceTimer)
    }
  }, [searchQuery])

  useEffect(() => {
    if (selectedChat) {
      getChat(selectedChat.id)
    }
  }, [selectedChat])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderCurrentChat = () => {
    if (!selectedChat) {
      return (
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{height: '100%', width: '100%'}}
        >
          <p>Select a chat to view messages</p>
        </MDBox>
      )
    }

    return (
      <MDBox
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
      >
        {/*HEADER*/}
        <MDBox
          borderBottom="1px solid #E0E0E0"
          mx={3}
          p={1}
          py={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <MDBox display={'flex'}>
            <img
              src={selectedChat?.counterpart_image ? checkUrl(selectedChat?.counterpart_image) : avatar}
              style={{width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px'}}
            />
            <MDTypography variant="h4" fontWeight="bold" mb={2}>
              {selectedChat?.counterpart_name}
            </MDTypography>
          </MDBox>
          <IconButton onClick={handleMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuItem onClick={() => setOpenDeleteModal(true)} sx={{ color: 'error.main' }}>
              <DeleteOutlinedIcon sx={{ marginRight: '8px', fontSize: '25px !important' , color: 'error.main' }} />
              Delete
            </MenuItem>
          </Menu>
        </MDBox>
        {/*MESSAGES*/}
        <MDBox>
          <MDBox
            display="flex"
            flexDirection="column"
            justifyContent={loading ? "center" : "flex-start"}
            alignItems={loading ? "center" : "flex-start"}
            width="100%"
            height="100%"
            flex={1}
            sx={{
              padding: '16px',
              overflowY: 'scroll',
              maxHeight: '700px',
              minHeight: '300px',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ccc',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#aaa',
              },

              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: '10px',
              },

            }}
          >
            {loading ? (
              <CircularProgress color="primary" size={40} sx={{mt: 20}} />
            ) : (
              messages.map((message, index) => {
                return (
                  <MDBox
                    key={index}
                    display="flex"
                    flexDirection="column"
                    alignItems={ message.author == selectedChat?.counterpart_id ? 'flex-start': 'flex-end'}
                    sx={{
                      marginLeft: message.author == selectedChat?.counterpart_id ? '10px' : 'auto',
                      marginRight: message.author == selectedChat?.counterpart_id ? 'auto' : '10px',
                    }}
                  >
                    <MDTypography
                      fontSize={'12px'}
                      mb={1}
                    >
                      {message.author == selectedChat?.counterpart_id ? selectedChat?.counterpart_name : 'You'}
                        </MDTypography>
                    <MDBox
                      alignItems="center"
                      sx={{
                        marginBottom: '10px',
                        padding: '10px',
                        borderRadius: message.author == selectedChat?.counterpart_id ?  0 : '12px',
                        backgroundColor: message.author == selectedChat?.counterpart_id ? '#ffffff' : '#E0F7FA',
                        maxWidth: '400px',
                        wordWrap: 'break-word',
                        position: 'relative',
                        border: message.author != selectedChat?.counterpart_id ? 'none' : '1px solid #E0E0E0',
                      }}
                    >
                      {message.type === 'media' ? (
                        <MDBox
                          src={message.url_file}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          onClick={() => window.open(message.url_file)}
                          sx={{
                            cursor: 'pointer',
                          }}
                        >
                          <InsertDriveFileOutlined sx={{ fontSize: 36, color: '#4f8fc5', mr: 1}} />
                          <MDTypography fontSize={'15px'}>
                            {message.media.filename}
                          </MDTypography>
                        </MDBox>
                      ) : (
                        <MDTypography
                          fontSize={'16px'}
                          sx={{
                            width: '100%',
                          }}
                        >
                          {message.body}
                        </MDTypography>
                      )}
                    </MDBox>
                    <MDTypography
                      fontSize={'12px'}
                      sx={{
                        color: '#888',
                        marginTop: '5px',
                        fontStyle: 'italic'
                      }}
                    >
                      {moment(message.dateCreated).format('LT')}
                    </MDTypography>
                  </MDBox>

                )
              })
            )}
            <div ref={scrollRef}></div>
          </MDBox>
        </MDBox>
      {/* INPUT*/}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={'auto'}
          border={'1px solid #D6DDEB'}
          mx={2}
        >
            <input
              ref={fileRef}
              hidden
              accept=".pdf,.xlsx,.docx"
              type="file"
              onChange={(e) => {
                const file = e.target.files[0]
                setSelectedFile(file)
              }}
              style={{display: 'none'}}
            />
          <MDButton
            variant="text"
            disabled={sendingMessage || loading}
            onClick={() => fileRef.current?.click()}
          >
            <img src={file} />
          </MDButton>
          <TextField
            placeholder="Type a message..."
            value={messageToSend || selectedFile ? selectedFile?.name : ''}
            disabled={sendingMessage || loading || selectedFile}
            onChange={(e) => setMessageToSend(e.target.value)}
            variant="outlined"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage()
              }
            }}
            sx={{
              width: '100%',
              pr: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none', // Remove the normal border
                },
                '&:hover fieldset': {
                  border: 'none', // Remove the hover border
                },
                '&.Mui-focused fieldset': {
                  border: 'none', // Remove the focused border
                },
              },
              '& .MuiInputBase-input': {
                height: '40px',
                fontSize: '18px',
              },
            }}
          />
          {selectedFile && <MDButton
            variant="contained"
            color="error"
            disabled={sendingMessage || loading}
            onClick={() => setSelectedFile(null)}
            title={'Remove file'}
            sx={{
              height: '40px',
              borderRadius: '12px',
              marginRight: '10px',
            }}

          >
            <DeleteOutlinedIcon />
          </MDButton>}
          <MDButton
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{
              height: '40px',
              borderRadius: '12px',
              marginRight: '10px',
            }}
            disabled={loading || (messageToSend === '' && selectedFile === null || sendingMessage)}

          >
            {sendingMessage ? <CircularProgress size={24} color="inherit" /> : <img src={send} />}
          </MDButton>
        </MDBox>
      </MDBox>
    )
  }

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
              borderWidth: 1,
              borderColor: '#FFFFFF',
            },
            position: 'relative'
          }}
          onClick={() => handleClick(chat)}
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
            src={chat?.counterpart_image ? checkUrl(chat?.counterpart_image) : avatar}
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
        {loading ? (
          <CircularProgress color="primary" size={40} />
        ) : (
          <MDTypography>No messages available</MDTypography>
        )}
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
        minHeight={{
          xs: '200px',
          sm: "70vh",
        }}
      >
        <Grid
          item
          sm={3}
          sx={{backgroundColor: "white"}}
          borderRight={{xs: 'none', sm: '1px solid #E0E0E0'}}
        >
          <MDBox display={'flex'}>
            <TextField
              onChange={(e) => setSearchQuery(e.target.value)}
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
                mb:1
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
            maxHeight={{
              xs: '200px',
              sm: "70vh",
            }}
            sx={{
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ccc',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#aaa',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: '10px',
              },
            }}

          >
            <Grid container>
              {chats.map((chat) => renderChatItem(chat))}
              {chats.length === 0 && renderNoMessages()}
            </Grid>
          </MDBox>
        </Grid>
        <Grid item sm={9}>
          {renderCurrentChat()}
        </Grid>
      </Grid>
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this chat?</p>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexGrow: 1,
            }}
          >
            <MDButton
              variant="outlined"
              onClick={handleCloseDeleteModal}
              color="secondary"
              disabled={loading}
            >
              Cancel
            </MDButton>
          </Box>
          <MDButton
            onClick={confirmDelete}
            disabled={loading}
            loading={loading}
            color="error">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default HomeOwnerMessages;

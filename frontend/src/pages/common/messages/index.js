
import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"
import {CircularProgress, Grid, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, {useEffect, useRef, useState} from "react";
import {checkUrl, date_fmt, useApi} from "../../../services/helpers";
import MDTypography from "../../../components/MDTypography";
import moment from "moment";
import { Client as ConversationsClient } from "@twilio/conversations"
import {ROUTES} from "../../../services/constants";
import MDButton from "../../../components/MDButton";
import avatar from "assets/images/avatar.png";


function HomeOwnerMessages() {
  const api = useApi()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const clientRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [messageToSend, setMessageToSend] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [currentConversation, setCurrentConversation] = useState({
    conversation_sid: null,
    token: null
  })
  const scrollRef = useRef(null)
  const currentConversationRef = useRef(null)


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

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "instant" })
  }


  const handleClick = (user) => {
    if (selectedContact && selectedContact.id === user.id) {
      setSelectedContact(null)
    } else {
      setSelectedContact(user)
    }
  }


  const initializeTwilio = async () => {
    const client = new ConversationsClient(currentConversation.token);
    clientRef.current = client
    client.on('initialized', async () => {
      await onSelectConversation(currentConversation.conversation_sid, currentConversation.token)
    });
    client.on('initFailed', ({ error }) => {
      // Handle the error.
      console.log(error)
    });
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
    setSendingMessage(true)
    if (currentConversationRef.current && sendingMessage === false) {
      if (messageToSend) {
        await currentConversationRef.current.sendMessage(messageToSend);
        setMessageToSend('')
        setSendingMessage(false)
      } else if (selectedFile) {
        const mediaStream = new Blob([selectedFile], {type: selectedFile.type});
        const fileName = selectedFile.name;
        const data = {
          contentType: selectedFile.type,
          media: mediaStream,
          filename: fileName,
        }
        await clientRef.current.sendMessage(data);
        setSelectedFile(null)
        setSendingMessage(false)
      }
      setMessageToSend('')
      setSelectedFile(null)
    }
  };

  useEffect(() => {
    if (currentConversation.conversation_sid && currentConversation.token) {
      initializeTwilio()
    }
  }, [currentConversation]);



  useEffect(() => {
    getChatsAvailable('')
  }, [])


  useEffect(() => {
    if (selectedChat) {
      getChat(selectedChat.id)
      scrollToBottom()
    }
  }, [selectedChat])

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
        >
          <img
            src={selectedChat?.counterpart_image ? checkUrl(selectedChat?.counterpart_image) : avatar}
            style={{width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px'}}
          />
          <MDTypography variant="h4" fontWeight="bold" mb={2}>
            {selectedChat?.counterpart_name}
          </MDTypography>
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
              maxHeight: '600px',
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
                    flexDirection={message.author == selectedChat?.counterpart_id ? "row" : "row-reverse"}
                    alignItems="center"
                    justifyContent={message.author == selectedChat?.counterpart_id ? "flex-start" : "flex-end"}
                    sx={{
                      marginBottom: '10px',
                      padding: '10px',
                      borderRadius: '12px',
                      backgroundColor: message.author == selectedChat?.counterpart_id ? '#E0F7FA' : '#B2EBF2',
                      maxWidth: '400px',
                      wordWrap: 'break-word',
                      position: 'relative',
                      marginLeft: message.author == selectedChat?.counterpart_id ? '10px' : 'auto',
                      marginRight: message.author == selectedChat?.counterpart_id ? 'auto' : '10px',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-5px',
                        left: message.author == selectedChat?.counterpart_id ? '10px' : 'auto',
                        right: message.author == selectedChat?.counterpart_id ? 'auto' : '10px',
                        borderWidth: '5px',
                        borderStyle: 'solid',
                        borderColor: message.author == selectedChat?.counterpart_id ? '#E0F7FA transparent transparent transparent' : '#B2EBF2 transparent transparent transparent',
                      },
                    }}
                  >
                    {message.type === 'media' ? (
                      <MDBox
                        component="img"
                        src={message.url_file}
                        alt={message.author}
                        sx={{
                          width: '200px',
                          height: '200px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          marginRight: message.author == selectedChat?.counterpart_id ? '10px' : '0',
                          marginLeft: message.author == selectedChat?.counterpart_id ? '0' : '10px',

                        }}
                      />
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
                    <MDTypography
                      fontSize={'12px'}
                      ml={1}
                      sx={{
                        color: '#888',
                        marginLeft: '10px',
                        marginTop: '5px',
                        fontStyle: 'italic'
                      }}
                    >
                      {message.author == selectedChat?.counterpart_id ? selectedChat?.counterpart_name : 'You'} - {moment(message.dateCreated).format('LT')}
                    </MDTypography>
                  </MDBox>
                )
              })
            )}

          </MDBox>
        </MDBox>
      {/* INPUT*/}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{padding: '16px'}}
          mt={'auto'}
        >
          <TextField
            variant="outlined"
            placeholder="Type a message..."
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
            sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                height: '40px',
                fontSize: '18px',
              },
              pr: 2,
            }}
          />
          <MDButton
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{
              marginLeft: '10px',
              height: '40px',
              borderRadius: '12px',
            }}
            disabled={sendingMessage}
          >
            {sendingMessage ? <CircularProgress size={24} color="inherit" /> : 'Send'}
          </MDButton>
          {/*<MDBox ml={2}>*/}
          {/*  <input*/}
          {/*    type='file'*/}
          {/*    accept='image/*'*/}
          {/*    id={'input_file'}*/}
          {/*    onChange={(e) => {*/}
          {/*      const file = e.target.files[0]*/}
          {/*      setSelectedFile(file)*/}
          {/*    }}*/}
          {/*    style={{display: 'none'}}*/}
          {/*  />*/}
          {/*  <label htmlFor='input_file'>*/}
          {/*    <img src={checkUrl(selectedChat?.counterpart_image)} alt={selectedChat?.counterpart_name}*/}
          {/*         style={{width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px'}}/>*/}
          {/*  </label>*/}
          {/*</MDBox>*/}
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
            src={selectedChat?.counterpart_image ? checkUrl(selectedChat?.counterpart_image) : avatar}
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
        sx={{
          minHeight: "70vh",
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
          {renderCurrentChat()}
        </Grid>
      </Grid>
    </AdminLayout>
  );
}

export default HomeOwnerMessages;

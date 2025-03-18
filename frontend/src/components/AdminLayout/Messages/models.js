import MDBox from "../../MDBox"
import MDAvatar from "../../MDAvatar"
import React from "react"
import { chatDataModel } from "./utils"

function MessageHeaderThree({ avatarSrc, name, lastMessage }) {
  return (
    <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <MDAvatar
        src={avatarSrc}
        variant={"circular"}
        style={{ fontSize: "50px", borderRadius: "50%" }}
      />
      <MDBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <MDBox sx={{
          fontWeight: 'bold',
          fontSize: {md:'24px', xs: '15px'},
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {name}
        </MDBox>
        <MDBox sx={{
          fontSize: {md:'16px', xs:'10px'},
          color: '#515B6F',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: '5px'
        }}>
          {lastMessage}
        </MDBox>
        <MDBox sx={{
          fontSize: {md:'16px', xs: '10px'},
          color: '#515B6F',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: '5px',
          display: 'flex'
        }}>
          This is the very beginning of your direct message with
          <MDBox style={{ fontWeight: 'bold', color: 'black', marginLeft: '7px' }}>
            {name}
          </MDBox>
        </MDBox>

      </MDBox>
    </MDBox>
  );
}


function MessageHeaderTwo({ avatarSrc, name, lastMessage }) {
  return (
    <MDBox sx={{ display: 'flex', gap: 2 }}>
      <MDAvatar
        src={avatarSrc}
        variant={"circular"}
        style={{ fontSize: "50px", marginTop: "17px" ,borderRadius: "50%"}}
      />
      <MDBox sx={{ display: 'flex',marginTop:{xs:"17px", md:"-2px"}, flexDirection: 'column', justifyContent: 'center', width: {md:'50%', xs:'60%' }}}>
        <MDBox sx={{
          fontWeight: 'bold',
          fontSize: { md:"32px", xs:"16px" },
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {name}
        </MDBox>
        <MDBox sx={{
          fontSize: { md:"16px", xs:"10px" },
          color: '#515B6F',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: '5px'
        }}>
          {lastMessage}
        </MDBox>

      </MDBox>
    </MDBox>
  );
}


function MessageHeader({ avatarSrc, name, lastMessageTime, lastMessage, isUnread }) {
  return (
    <MDBox sx={{ display: 'flex', flexDirection:'row', gap: {md : 2, xs: 1} }}>
      <MDAvatar
        src={avatarSrc}
        variant={"circular"}
        style={{ fontSize: "80px", borderRadius: "50%" }}
      />

      <MDBox sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <MDBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MDBox sx={{
            fontWeight: 'bold',
            fontSize: '16px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {name}
          </MDBox>

          {isUnread && (
            <MDBox sx={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'lightBlue',
            }} />
          )}
        </MDBox>

        <MDBox sx={{
          fontSize: '12px',
          color: '#888',
          marginLeft:{ xl:'800px',md:"700px", xs:'180px', sm:'400px', xxl:"180px"},
          marginTop: '-21px'
        }}>
          {lastMessageTime}
        </MDBox>

        <MDBox sx={{
          fontSize: '16px',
          color: '#515B6F',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: '15px'
        }}>
          {lastMessage}
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export const generateChatData = chatDataModel.map(chat => ({
  name: chat.name,
  principal: (
    <MessageHeaderTwo
      avatarSrc={chat.avatarSrc}
      name={chat.name}
      lastMessage={chat.description}
    />
  ),
  secondary: (
    <MessageHeaderThree
      avatarSrc={chat.avatarSrc}
      name={chat.name}
      lastMessage={chat.description}
    />
  ),
  nameDescription: (
    <MessageHeader
      avatarSrc={chat.avatarSrc}
      name={chat.name}
      lastMessageTime={chat.lastMessageTime}
      lastMessage={chat.lastMessage}
      isUnread={chat.isUnread}
    />
  ),
  messages: chat.messages,
}));


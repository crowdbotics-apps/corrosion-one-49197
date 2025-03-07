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
          fontSize: '24px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {name}
        </MDBox>
        <MDBox sx={{
          fontSize: '16px',
          color: '#515B6F',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: '5px'
        }}>
          {lastMessage}
        </MDBox>
        <MDBox sx={{
          fontSize: '16px',
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
      <MDBox sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '50%' }}>
        <MDBox sx={{
          fontWeight: 'bold',
          fontSize: '32px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {name}
        </MDBox>
        <MDBox sx={{
          fontSize: '16px',
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


function MessageHeader({ avatarSrc, name, lastMessageTime, lastMessage }) {
  return (
    <MDBox sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
      <MDAvatar
        src={avatarSrc}
        variant={"circular"}
        style={{ fontSize: "80px", borderRadius: "50%" }}
      />

      <MDBox sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <MDBox sx={{
          fontWeight: 'bold',
          fontSize: '16px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {name}
        </MDBox>
        <MDBox sx={{
          fontSize: '12px',
          color: '#888',
          marginLeft: '200px',
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
  secundary: (
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
    />
  ),
  messages: chat.messages,
}));


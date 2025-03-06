import React from "react";
import MDBox from "../../MDBox";
import MDAvatar from "../../MDAvatar";


function MessageHeaderThree({ avatarSrc, name, lastMessageTime, lastMessage }) {
  return (
    <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <MDAvatar
        src={avatarSrc}
        variant={"square"}
        style={{ fontSize: "50px" }}
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
        variant={"square"}
        style={{ fontSize: "50px", marginTop: "17px" }}
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
        variant={"square"}
        style={{ fontSize: "50px" }}
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
          textAlign: 'right',
          marginTop: '-20px'
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

const generateChatData = () => {
  const chats = [
    {
      name: "John Doe",
      avatarSrc: "https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg",
      lastMessageTime: "10:45 AM",
      lastMessage: "I'm good, thanks!",
      messages: ["Hey, how's it going?", "I'm good, thanks!"],
      description: "Real State Agent",
    },
    {
      name: "Jane Lee",
      avatarSrc: "https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg",
      lastMessageTime: "10:45 AM",
      lastMessage: "Looking forward to the weekend!",
      messages: [
        "Hey, how’s it going? Have you watched any good movies or shows lately?",
        "I'm good, thanks! I actually just finished a great series. How about you? Seen anything interesting?",
        "Also, have you tried any new recipes or food places recently? I’ve been exploring some new restaurants!",
        "Looking forward to the weekend!",
      ],
      description: "Real State Agent",
    },
    {
      name: "Carlos Lee",
      avatarSrc: "https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg",
      lastMessageTime: "10:45 AM",
      lastMessage: "Did you finish the report?",
      messages: ["Hey, how's it going?", "I'm good, thanks!", "Did you finish the report?",],
      description: "Real State Agent",
    },
    {
      name: "Sara Lee",
      avatarSrc: "https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg",
      lastMessageTime: "10:45 AM",
      lastMessage: "Let's meet tomorrow for lunch!",
      messages: ["Hey, how's it going?", "I'm good, thanks!", "Let's meet tomorrow for lunch!"],
      description: "Real State Agent",
    },
    {
      name: "Carla Lee",
      avatarSrc: "https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg",
      lastMessageTime: "10:45 AM",
      lastMessage:  "Anything new and interesting?",
      messages : [
        "Hey, how’s it going? What have you been up to lately?",
        "I’m doing pretty well, thanks! Just keeping busy with work and some hobbies. How about you? Any exciting plans?",
        "Anything new and interesting?"
      ],
      description: "Real State Agent",

    },
    {
      name: "Carla Lee",
      avatarSrc: "https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg",
      lastMessageTime: "10:45 AM",
      lastMessage: "How’s life treating you lately?",
      messages : [
        "Hey, how's everything going? How have you been?",
        "I’ve been doing pretty well, thanks for asking! Things have been busy, but good. How about you?",
        "How’s life treating you lately?"
      ],
      description: "Real State Agent",
    },
    {
      name: "Carla Lee",
      avatarSrc: "https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg",
      lastMessageTime: "10:45 AM",
      lastMessage: "See you in a bit!",
      messages: [
        "Hey, how's it going?",
        "I'm good, thanks! How about you?",
        "I'm doing great, just waiting for you to get here!",
        "Awesome! Looking forward to it. What’s on the agenda for today?",
        "Just catching up and maybe grabbing some coffee. How does that sound?",
        "Sounds perfect! I could really use a good coffee right now.",
        "Same here! I'll see you soon then.",
        "See you in a bit!"
      ],
      description: "Real State Agent",
    }
  ];


  return chats.map(chat => ({
    name: chat.name,
    principal: (
      <MessageHeaderTwo
        avatarSrc={chat.avatarSrc}
        name={chat.name}
        lastMessage={chat.description}
      />
    ),
    secundary:(
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
};

export const chatDataModel = {
  columns: [
    { Header: " ", accessor: "name", disableOrdering: true, width: "300px" },
  ],
  rows: generateChatData(),
};

import React from "react";
import MDBox from "../../MDBox";
import MDAvatar from "../../MDAvatar";
import MDTypography from "../../MDTypography";

// Generar datos para los chats
const generateChatData = () => {
  const chats = [
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }} />,
      name: "John Doe",
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }} />,
      name: "Jane Smith",
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }} />,
      name: "Carlos Mendoza",
    },
    {
      profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"square"} style={{ fontSize: "50px" }} />,
      name: "Sarah Lee",
    }
  ];

  return chats.map(chat => ({
    profile_picture: chat.profile_picture,
    name: chat.name,
  }));
};
export const chatDataModel = {
  columns: [
    { Header: " ", accessor: "profile_picture", disableOrdering: true, width: 20 },
    { Header: " ", accessor: "name", disableOrdering: true, width: 1000 },
  ],
  rows: generateChatData(),
};

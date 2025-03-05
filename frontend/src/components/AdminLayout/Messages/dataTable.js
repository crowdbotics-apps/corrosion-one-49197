import React, { useState } from "react";
import { Table, TableBody, TableRow, TableCell, Box, TextField, Card } from "@mui/material";
import MDBox from "components/MDBox";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MDTypography from "../../MDTypography";
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendIcon from '@mui/icons-material/Send';
import MDButton from "../../MDButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

function DataTable({
                     table,
                     showHeader = true,
                     searchQuery = "",
                     searchFunc,
                   }) {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleRowClick = (chat) => {
    setSelectedChat(selectedChat === chat ? null : chat);
  };

  return (
    <Card sx={{ display: "flex", flex: 1, border: `none`, backgroundColor: "white" }}>
      <MDBox sx={{ display: "flex", width: "100%", height: "100%" }}>
        <MDBox sx={{ flex: 1 }}>
          <MDBox>
            <TextField
              label={
                <Box display="flex" alignItems="center" sx={{ padding: '2rem', fontSize: '16px' }}>
                  <SearchOutlinedIcon sx={{ marginRight: 1 }} />
                  <Box>Search messages</Box>
                </Box>
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
              onChange={(e) => searchFunc && searchFunc(e.target.value)}
            />
          </MDBox>

          <Table>
            {showHeader && (
              <MDBox component="thead">
                {table.columns.map((column, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{column.Header}</TableCell>
                  </TableRow>
                ))}
              </MDBox>
            )}

            <TableBody>
              {table.rows.map((chat, idx) => (
                <TableRow
                  key={idx}
                  onClick={() => handleRowClick(chat)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedChat === chat ? "#EBF7FA" : "white",
                    height: "60px",
                  }}
                >
                  <TableCell sx={{ height: "60px" }}>
                    {chat.nameDescription}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </MDBox>

        <MDBox sx={{
          width: "100%",
          height: "100%",
          padding: "20px",
          borderLeft: "1px solid #ccc",
          backgroundColor: "white",
          marginLeft: "20px",
          overflowY: "auto"
        }}>
          {selectedChat ? (
            <MDBox sx={{
              width: "80%",
              height: "700px",
              padding: "20px",
              backgroundColor: "white",
              margin: "auto",
              overflowY: "auto",
            }}>

              <MDBox sx={{
                backgroundColor: "white",
                borderBlockEnd: "1px solid #ccc",
                height: "90px",
                display: "flex",
              }}>
                <MDBox sx={{ backgroundColor: "white", height: "90px", width: "700px", }}>{selectedChat.principal}</MDBox>
                <MDBox sx={{
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


                </MDBox>

              </MDBox>

              <MDBox sx={{
                backgroundColor: "white",
                borderBlockEnd: "1px solid #ccc",
                height: "150px",
              }}>

              </MDBox>

              {selectedChat.messages.map((message, index) => (
                <MDBox key={index} style={{ display: "flex", flexDirection: "column", alignItems: index % 2 === 0 ? "flex-end" : "flex-start", marginBottom: "10px" }}>

                  <MDTypography variant="body2" component="p" sx={{ marginBottom: "8px", color: "#25324B" }}>
                    {index % 2 === 0 ? "You" : selectedChat.name}
                  </MDTypography>

                  <MDBox
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
                  </MDBox>
                </MDBox>
              ))}

            </MDBox>
          ) : (
            <MDBox sx={{ textAlign: "center", fontSize: "18px", color: "#888" }}>
              <MDTypography>Select a chat to view the conversation.</MDTypography>
            </MDBox>
          )}

          <MDBox display="flex" justifyContent="center">
            {selectedChat && (
              <TextField
                sx={{
                  width: '80%',
                  marginTop: "30px",
                }}
                label="Reply message"
                InputProps={{
                  startAdornment: (
                    <MDBox display="flex" alignItems="center">
                      <AttachFileOutlinedIcon sx={{ marginRight: 1 }} />
                    </MDBox>
                  ),
                  endAdornment: (
                    <MDButton
                      sx={{
                        backgroundColor: '#6DDA43',
                        '&:hover': {
                          backgroundColor: '#5cb039',
                        },
                        padding: '1px 20px',
                        minWidth: 'auto',
                        borderRadius: '20px',
                      }}
                      startIcon={<SendIcon />}
                    />
                  ),
                  style: {
                    height: '50px',
                  },
                }}
                value={searchQuery}
                onChange={(e) => searchFunc && searchFunc(e.target.value)}
              />
            )}
          </MDBox>

        </MDBox>

      </MDBox>
    </Card>
  );
}

export default DataTable;

import React, { useRef } from "react";
import MDBox from "../MDBox";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MDTypography from "../MDTypography";
import MDButton from "../MDButton";
import {checkUrl, truncateFilename} from "../../services/helpers";

/**
 * @param {Object} credential - The credential object (e.g., { id, name, document }).
 * @param {Function} handleRemove - Function to remove the credential from the list.
 * @param {Function} setFieldValue - Formik setter to update the form state.
 */
export const CredentialsInspector = ({ id, credential, handleRemove, setFieldValue }) => {
  const fileInputRef = useRef(null);
  // console.log('credential', credential)

  // Click handler for the "Add document" button
  const handleAddDocumentClick = () => {
    fileInputRef.current?.click();
  };

  // Handles file input changes
  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const filename = truncateFilename(file.name);
    const newFile = new File([file], filename, {type: file.type});

    setFieldValue(`credentials[${id}].document`, newFile);
  };

  // Example "View Document" handler.
  // This creates a temporary object URL from the file and opens it in a new tab.
  // For production, you may want to handle PDFs differently or show a preview in a modal.
  const handleViewDocument = () => {
    if (credential.document && typeof credential.document !== "string") {
      const fileURL = URL.createObjectURL(credential.document);
      window.open(fileURL, "_blank", "noreferrer");
    } else {
      window.open(checkUrl(credential.document), "_blank", "noreferrer");
    }
  };

  return (
    <MDBox
      key={credential.id}
      display="flex"
      alignItems="center"
      borderRadius="12px"
      p={1}
      px={1}
      sx={{ border: "1px solid #C6C9CE" }}
      mb={1}
    >
      <IconButton
        aria-label="remove"
        size="small"
        onClick={() => handleRemove && handleRemove(credential.id)}
        sx={{ mr: 1, p: 0 }}
      >
        <HighlightOffIcon sx={{ color: "#E14640", height: 26, width: 26 }} />
      </IconButton>

      <MDTypography sx={{ fontSize: 14, fontWeight: 500 }}>
        {credential.name} {credential.document_name ? ` - (${credential.document_name}) - ${credential.size}MB` : ''}
      </MDTypography>

      {credential.document ? (
        <MDButton
          color="secondary"
          variant="outlined"
          size="small"
          sx={{ marginLeft: "auto" }}
          onClick={handleViewDocument}
        >
          View document
        </MDButton>
      ) : (
        <MDButton
          color="primary"
          variant="outlined"
          size="small"
          sx={{ marginLeft: "auto" }}
          onClick={handleAddDocumentClick}
        >
          Add document
        </MDButton>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        hidden
        accept=".pdf,.xlsx,.docx"
        type="file"
        onChange={handleFileChange}
      />
    </MDBox>
  );
};

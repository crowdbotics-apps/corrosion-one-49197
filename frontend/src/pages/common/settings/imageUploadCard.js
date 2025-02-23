import React, {useRef} from 'react';
import { Box, Typography, Link } from '@mui/material';
import {isFile} from "../../../services/helpers";

export default function ImageUploadCard({
                                          title,
                                          imageSrc,
                                          fileSize,
                                          onReplace
                                        }) {

  const handleFileChange = (e) => {
    onReplace(e.target.files[0]);
  }

  const fileInputRef = useRef(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Title, e.g. "Upload Logo" */}
      <Typography variant="body2" sx={{ mb: 1 }}>
        {title}
      </Typography>

      {/* Image placeholder or preview */}
      <Box
        onClick={() => fileInputRef?.current?.click()}
        sx={{
          width: '100%',
          height: 150,        // Adjust as needed
          backgroundColor: '#767F8C', // Grey placeholder color
          borderRadius: 2,
          mb: 1,
          overflow: 'hidden',
          cursor: "pointer"
        }}
      >
        {imageSrc  ? (
          <img
            src={isFile(imageSrc) ? URL.createObjectURL(imageSrc) : imageSrc}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : null}
        <input
          ref={fileInputRef}
          hidden
          accept="image/*"
          type="file"
          onChange={handleFileChange}
        />
      </Box>

      {/* File info and actions */}
      {fileSize && (
        <Typography variant="caption" component="div" sx={{mb: 1}}>
          {fileSize} MB
        </Typography>
      )}

      <Box>
      {/*<Link*/}
        {/*  component="button"*/}
        {/*  variant="caption"*/}
        {/*  onClick={onRemove}*/}
        {/*  underline="none"*/}
        {/*  sx={{ mr: 2, color: "#E05151" }}*/}
        {/*>*/}
        {/*  Remove*/}
        {/*</Link>*/}
        {/*{isFile(imageSrc) && <Link*/}
        {/*  component="button"*/}
        {/*  variant="caption"*/}
        {/*  onClick={onReplace}*/}
        {/*  underline="none"*/}
        {/*  sx={{ color: '#3C7092' }}*/}
        {/*>*/}
        {/*  Replace*/}
        {/*</Link>}*/}
      </Box>
    </Box>
  );
}

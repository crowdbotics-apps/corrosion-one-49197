
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";

export default styled(TextField)(({ theme, ownerState }) => {
  const { palette } = theme;
  const { error, success, disabled } = ownerState;

  const { grey, transparent, error: colorError, success: colorSuccess } = palette;

  const errorStyles = () => ({

    "& .Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline, &:after": {
        borderColor: colorError.main,
      },
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colorError.main,
    },
  });

  const successStyles = () => ({

    "& .Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline, &:after": {
        borderColor: colorSuccess.main,
      },
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colorSuccess.main,
    },
  });

  return {
    backgroundColor: disabled ? `${grey[200]} !important` : transparent.main,
    pointerEvents: disabled ? "none" : "auto",
    marginBottom: 18,
    height:90,
    "& .MuiInputLabel-root": {
      color: "#2A272E",
      fontWeight: 400
    },
    ...(error && errorStyles()),
    ...(success && successStyles()),
  };
});

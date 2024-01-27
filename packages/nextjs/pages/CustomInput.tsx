import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { colors } from "./theme";
import React, {useState} from "react";

const CustomInput: React.FC<{
  isIconActive: boolean;
  type: string;
  label: string;
  placeholder: string;
}> = ({ isIconActive, type, label, placeholder }) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignContent="center"
      justifyContent="flex-start"
      mb={2}
    >
      <Box display="flex" flexDirection="column" justifyContent="flex-start">
        <Typography color="white" pb={1}>
          {label}
        </Typography>
        <Paper
          sx={{
            background: colors.input[500],
            width: "100%",
          }}
        >
          <InputBase
            placeholder={placeholder}
            fullWidth
            sx={{
              bgcolor: colors.input[500],
              p: 1,
              borderRadius: "5px",
            }}
            type={type === "password" && !isPasswordVisible ? "password" : "text"}
            endAdornment={
              isIconActive && type === "password" ? (
                <InputAdornment position="end" sx={{ pr: 1 }}>
                  <IconButton edge="end" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ) : null
            }
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default CustomInput;


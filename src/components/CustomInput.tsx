import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { colors } from "../pages/theme";
import React, { useState } from "react";

const CustomInput: React.FC<{
  isIconActive: boolean;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ isIconActive, type, label, placeholder, value, onChange }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
            background: colors.input[250],
            width: "100%",
          }}
        >
          <InputBase
            placeholder={placeholder}
            value={value} // Use the value prop to display the current value
            onChange={onChange} // Use the onChange prop to update the value
            fullWidth
            sx={{
              bgcolor: colors.input[250],
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

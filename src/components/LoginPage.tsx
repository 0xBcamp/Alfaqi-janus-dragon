import { Box, Button, Checkbox, colors, Typography, Grid, Switch } from "@mui/material";
import CustomInput from "./CustomInput";
import {
	EmailLoginInput,
	EmailSignupInput,
} from '@moonup/moon-api';
import { useMoonSDK } from './usemoonsdk';
import React, { useState } from "react";
import { useAuth } from "./authContext";
import { useUserData } from "./userDataContext";
import Link from "next/link";


const LoginPage: React.FC = () => {
	// States for authentication
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false); // To toggle between sign in and sign up
	const [passwordError, setPasswordError] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Authentication context
	const { login, isAuthenticated } = useAuth();

	// User data context
	const { userData, setUserData }: { userData: any, setUserData: any } = useUserData();

	const updateAddress = (newAddress) => {
		setUserData((prev: any) => ({ ...prev, address: newAddress }));
	};

	const updateEmail = (newEmail) => {
		setUserData((prev: any) => ({ ...prev, email: newEmail }));
	}

	// Moon SDK states and functions
	const {
		moon,
		connect,
		createAccount,
		updateToken,
		initialize
	} = useMoonSDK();
	
	// Handle email and password input changes
	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleConfirmPasswordChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setConfirmPassword(event.target.value);
	};
	
	// Initialize and connect to Moon
	const handleInitializeAndConnect = async () => {
		try {
			setLoading(true);
			setError(null);

			// Initialize and connect to Moon
			console.log('Initializing and connecting to Moon...');
			await initialize();
			await connect();
			console.log('Connected to Moon!');
		} catch (error) {
			console.error('Error during connection:', error);
			setError('Error connecting to Moon. Please try again.');
		} finally {
			setLoading(false);
		}
	};
	
	// Handle sign up
	const handleSignup = async () => {
		await handleInitializeAndConnect();

		try {
			setLoading(true);
			setError(null);

			if (password !== confirmPassword) {
				setPasswordError('Passwords do not match');
			} else {
				setPasswordError('');

				// Sign up the user
				const auth = moon.getAuthSDK();
				const signupRequest: EmailSignupInput = {
					email,
					password,
				};
				console.log('Signing up...');
				console.log(email, password);
				const signupResponse: any = await auth.emailSignup(signupRequest);
				console.log('Signup successful:', signupResponse);
				// 
			}
		} catch (error) {
			console.error('Error during signup:', error);
			setError('Error signing up. Please try again.');
		} finally {
			setLoading(false);
		}
	};
	
	// Handle sign in
	const handleSignIn = async () => {
		
		await handleInitializeAndConnect();

		try {
			setLoading(true);
			setError(null);

			// Authenticate the user and sign in
			const auth = moon.getAuthSDK();
			const loginRequest: EmailLoginInput = {
				email,
				password,
			};
			console.log('Authenticating...');
			const loginResponse: any = await auth.emailLogin(loginRequest);
			// Update auth context to authenticated
			login();
			console.log('Authentication successful:', loginResponse);

			// Set tokens and email
			console.log('Updating tokens and email...');
			await updateToken(
				loginResponse.data.token,
				loginResponse.data.refreshToken
			);
			moon.MoonAccount.setEmail(email);
			moon.MoonAccount.setExpiry(loginResponse.data.expiry);
			console.log('Tokens and email updated!');

			// Perform sign-in logic with MoonSDK
			console.log('Creating account...');
			const newAccount = await createAccount();
			console.log('New Account Data:', newAccount?.data);
			console.log('Setting expiry and navigating...');
			moon.MoonAccount.setExpiry(loginResponse.data.expiry);

			// Update user data context with the email and address associated
			updateEmail(email);
			updateAddress(newAccount.data.data.address);

			// Send the user to the dashboard
			console.log('Navigating to dashboard...');

			console.log('Authenticated Address:', newAccount.data.data.address);
		} catch (error) {
			console.error('Error during sign-in:', error);
			setError('Error signing in. Please try again.');
		} finally {
			setLoading(false);
		}
	};
	
	// Toggle between Sign In and Sign Up
	const toggleAuthMode = () => {
		setIsSignUp(!isSignUp);
	};
	
	return (
		<Grid item
		  xs={12}
		  sm={12}
		  md={6}
		  lg={6}
		  xl={6}
		  minHeight={550}
		  sx={{
			boxShadow: {
			  xs: '',
			  sm: '',
			  md: '15px 2px 5px -5px',
			  lg: '15px 2px 5px -5px',
			  xl: '15px 2px 5px -5px',
			},
		  }}
		>
		  <Box
			sx={{
			  backgroundColor: 'rgba(50, 200, 160, 0.5)',
			  display: "flex",
			  flexDirection: "column",
			  alignItems: "center",
			  height: "100%",
			  borderRadius: {
				xs: "30px",
				sm: "30px",
				md: "30px 0 0 30px",
				lg: "30px 0 0 30px",
				xl: "30px 0 0 30px",
			  },
			}}
		  >
			<Box width="50%">
			  <Box display="flex" flexDirection="column" alignItems="center">
				{/* LOGO */}
				<Box
				  sx={{
					mt: "60px",
					width: "200px",
					height: "80px",
					bgcolor: "primary.main",
					borderRadius: "12px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxShadow: `0 0 20px ${colors.green[50]}`,
				  }}
				>
				  <Typography variant="h6" fontWeight="bold" color="white">
					BlockMedSecure
				  </Typography>
				</Box>
				{/* LOGO END */}
				<Typography
				  color="white"
				  fontWeight="bold"
				  sx={{ textAlign: "center", marginTop: 4 }}
				  mt={7}
				  mb={3}
				>
				  Sign in to access your account
				</Typography>
			  </Box>
	
			  {/* INPUTS */}
			  <CustomInput
				label="Email"
				placeholder="Enter your email..."
				isIconActive={false}
				type="text" // Set the type as "text" for email input
				value={email}
				onChange={handleEmailChange}
				/>
				<CustomInput
				label="Password"
				placeholder="Enter your password..."
				isIconActive={true}
				type="password" // Set the type as "password" for password input
				value={password}
				onChange={handlePasswordChange}
				/>

				{isSignUp && (
				<CustomInput
				label="Confirm Password"
				placeholder="Confirm your password..."
				isIconActive={true}
				type="password" // Set the type as "password" for confirm password input
				value={confirmPassword}
				onChange={handleConfirmPasswordChange}
				/>
				)}
	
			  {/* INPUT END */}
	
			  <Box
				display="flex"
				flexDirection="row"
				justifyContent="space-between"
				mt={2}
				width="100%"
				color="white"
			  >
				<div style={{ display: "flex" }}>
				  <Checkbox disableRipple sx={{ p: 0, pr: 1 }} />
				  <Typography>Remember me</Typography>
				</div>
				<a
				  href="#yoyo"
				  style={{
					color: colors.green[500],
					textDecoration: "none",
				  }}
				>
              Forgot your password?
            </a>
          </Box>
          <Button
            onClick={isSignUp ? handleSignup : handleSignIn}
            variant="contained"
            fullWidth
            sx={{ mt: 4, boxShadow: `0 0 20px ${colors.green[500]}` }}
          >
            {loading ? (isSignUp ? "Signing up..." : "Signing in...") : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Switch
            checked={isSignUp} // Use isSignUp state to determine the switch state
            onChange={toggleAuthMode} // Toggle between sign-up and login
            color="primary"
          />
          <Typography
            color="white"
            fontWeight="bold"
            sx={{
              textAlign: "left",
              marginTop: 0,
            }}
          >
            {isSignUp ? "Sign Up" : "Sign In"} {/* Display Sign Up or Sign In based on isSignUp state */}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
}

export default LoginPage;
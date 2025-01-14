import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { useNavigate } from "react-router";

import {
	Box,
	Grid,
	Link,
	Avatar,
	Button,
	Backdrop,
	Container,
	IconButton,
	Typography,
	TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import LockIcon from "@mui/icons-material/LockOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";
import FormDialog from "@/components/FormDialog";
import VerifyFirebaseErrorCode from "@/utils/firebase-auth-error";
import { signInWithGoogleNative } from "@/utils/native-google-login";

interface State {
	email: string;
	password: string;
	showPassword: boolean;
}

export default function SignIn() {
	const [values, setValues] = useState<State>({
		email: "",
		password: "",
		showPassword: false,
	});
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [isResetFormOpen, setIsResetFormOpen] = useState(false);
	const { signIn, signInWithGooglePopup, sendPasswordResetLink, user } =
		useAuth();

	// check for user
	useEffect(() => {
		if (user) {
			navigate("/", { replace: true });
		}
	}, [user]);

	const handleChange =
		(prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setValues({ ...values, [prop]: event.target.value });
		};

	const handleClickShowPassword = () => {
		setValues({
			...values,
			showPassword: !values.showPassword,
		});
	};

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		const email = values.email;
		const password = values.password;

		if (email !== "" && password !== "") {
			try {
				await signIn(email, password);
			} catch (error: any) {
				const message = VerifyFirebaseErrorCode(error.code);
				setIsLoading(false);
				toast.error(message);
			}
		} else {
			setIsLoading(false);
			toast.error("Please fill all required fields");
		}
	};

	const signInWithPopup = async () => {
		setIsLoading(true);
		try {
			if (Capacitor.isNativePlatform()) {
				await signInWithGoogleNative();
			} else {
				await signInWithGooglePopup();
			}
		} catch (error: any) {
			const errorMessage = VerifyFirebaseErrorCode(error.code);
			setIsLoading(false);
			toast.error(errorMessage);
		}
	};

	const sendPasswordResetEmail = async (email: string, cb: () => void) => {
		try {
			await sendPasswordResetLink(email);
			cb();
			setIsResetFormOpen(false);
			toast.success(
				"Email has been sent, please check your spam folder if not found."
			);
		} catch (error: any) {
			cb();
			const errorMessage = VerifyFirebaseErrorCode(error?.code);
			setIsResetFormOpen(false);
			toast.error(errorMessage);
		}
	};

	return (
		<>
			<Container component="main" maxWidth="xs">
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						paddingTop: "16px",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockIcon />
					</Avatar>
					<Typography
						component="h1"
						variant="h5"
						sx={{ color: "text.primary" }}
					>
						Sign in
					</Typography>
					<Box
						component="form"
						sx={{ mt: 1 }}
						noValidate
						id="login-form"
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
					>
						<TextField
							value={values.email}
							onChange={handleChange("email")}
							margin="normal"
							id="email"
							required
							fullWidth
							label="Email Address"
							name="email"
							type="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							value={values.password}
							onChange={handleChange("password")}
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type={values.showPassword ? "text" : "password"}
							id="password"
							autoComplete="current-password"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
										>
											{values.showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<Button
							fullWidth
							variant="contained"
							sx={{ mt: 2 }}
							type="submit"
							form="login-form"
						>
							Sign In
						</Button>

						<Button
							type="button"
							fullWidth
							variant="contained"
							sx={{ mt: 2, mb: 2 }}
							startIcon={!isLoading ? <GoogleIcon /> : null}
							onClick={signInWithPopup}
						>
							Continue With Google
						</Button>
						<Grid container sx={{ mt: 2 }}>
							<Grid item xs>
								<Link
									variant="body2"
									onClick={(e) => {
										e.preventDefault();
										setIsResetFormOpen(true);
									}}
									sx={{ cursor: "pointer" }}
								>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/signup" variant="body2">
									Don't have an account? Sign Up
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
			<FormDialog
				isOpen={isResetFormOpen}
				setOpen={setIsResetFormOpen}
				title="Reset Password"
				content="To reset your password, please enter your email address here. We will send you reset link on your mail."
				positiveButtonLabel="Send"
				textFieldLabel="Email Address"
				textFieldType="email"
				positiveButtonAction={sendPasswordResetEmail}
			/>
			<Backdrop
				sx={{
					color: "#fff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={isLoading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
}

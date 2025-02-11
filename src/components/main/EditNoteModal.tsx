import { useRef, useState } from "react";

import {
	useMediaQuery,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	TextField,
	Chip,
	MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useUpdateNote } from "@/hooks";
import { useHotkeys } from "react-hotkeys-hook";

interface IProps {
	id: string;
	text: string;
	category: string;
	open: boolean;
	closeModal: (value: boolean) => void;
	isShared?: boolean;
}

function EditNoteModal({
	open,
	closeModal,
	id,
	text,
	category,
	isShared,
}: IProps) {
	const theme = useTheme();
	const [updateNote] = useUpdateNote();
	const [inputError, setInputError] = useState(false);
	const [note, setNote] = useState<string>(text);
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const [updateCategory, setUpdateCategory] = useState<string>(category);
	const submitButtonRef = useRef<HTMLButtonElement>(null);

	useHotkeys(
		"shift+enter",
		(e) => {
			e.preventDefault();
			submitButtonRef.current?.click();
		},
		{
			enableOnFormTags: ["INPUT", "TEXTAREA"],
		}
	);

	const handleChange = (event: SelectChangeEvent) => {
		setUpdateCategory(event.target.value);
	};

	const handleInputChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setNote(event.target.value);
	};

	const handleClose = () => {
		setInputError(false);
		closeModal(false);
	};

	const handleUpdate = () => {
		if (!note || note === "") {
			setInputError(true);
			return;
		}
		handleClose();
		updateNote(note, id, updateCategory);
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="add note"
			fullScreen={fullScreen}
			fullWidth
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					handleClose();
				}
			}}
		>
			<DialogContent>
				<DialogContentText>Note</DialogContentText>
			</DialogContent>

			<DialogContent>
				<TextField
					autoFocus
					id="todo"
					error={inputError}
					value={note}
					onChange={handleInputChange}
					multiline
					fullWidth
					name="Note"
					label="Note *"
					minRows={4}
					sx={{ marginBottom: "1rem" }}
				/>
				{!isShared && (
					<Select
						sx={{ marginTop: "1rem" }}
						id="category"
						value={updateCategory}
						onChange={handleChange}
						fullWidth
						inputProps={{ "aria-label": "select category" }}
						renderValue={(value) => (
							<Chip
								key={value}
								label={value}
								sx={{ textTransform: "capitalize" }}
							/>
						)}
					>
						<MenuItem value={"general"}>General</MenuItem>
						<MenuItem value={"important"}>Important</MenuItem>
					</Select>
				)}
			</DialogContent>

			<DialogActions>
				<Button variant="text" onClick={handleClose}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleUpdate}
					ref={submitButtonRef}
				>
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default EditNoteModal;

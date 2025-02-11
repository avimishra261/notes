import { Fragment, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";

import { useNotes } from "@/hooks";
import NoteCard from "@/components/main/NoteCard";
import AlertMessage from "@/components/AlertMessage";
import NoteSkeleton from "@/components/NoteSkeleton";
import EmptyNote from "../EmptyNote";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

function Notes() {
	const { user } = useAuth();
	const [searchParams] = useSearchParams();
	const [notes, loading, error, setError] = useNotes();
	const [searchedNotes, setSearchedNotes] = useState<
		QueryDocumentSnapshot<DocumentData>[]
	>([]);

	const searchString = searchParams.get("q");

	useEffect(() => {
		const query = searchParams.get("q");

		if (!query) {
			return;
		}

		setSearchedNotes(
			notes.filter((item) => {
				const text: string | undefined = item.get("text");
				if (text?.toLocaleLowerCase()?.includes(query?.toLocaleLowerCase())) {
					return item;
				}
			})
		);
	}, [searchParams, notes]);

	if (loading) {
		return <NoteSkeleton />;
	}

	return (
		<Fragment>
			{notes.length <= 0 || (searchedNotes.length <= 0 && searchString) ? (
				<EmptyNote />
			) : (
				<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
					<Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={1.5}>
						{(searchedNotes.length > 0 && searchParams.get("q")
							? searchedNotes
							: notes
						).map((note) => {
							const {
								text,
								isComplete,
								category,
								timestamp,
								sharedWith,
								email,
								name,
								userId,
							} = note.data();
							const labelText = (name || email || "a friend") as string;
							const isShared =
								sharedWith?.findIndex(
									(item: string) =>
										item.trim() === user?.uid || item.trim() === user?.email
								) >= 0
									? true
									: false;

							return (
								<NoteCard
									key={note.id}
									id={note.id}
									text={text}
									isComplete={isComplete}
									category={category}
									timestamp={timestamp?.toDate()}
									sharedWith={sharedWith}
									isShared={isShared}
									label={`Shared by ${
										labelText.length > 24
											? labelText.substring(0, 24) + "..."
											: labelText
									}`}
									email={email}
									name={name}
									userId={userId}
								/>
							);
						})}
					</Masonry>
				</Box>
			)}
			<AlertMessage
				open={Boolean(error)}
				message={error}
				severity="warning"
				onClose={() => {
					setError(null);
				}}
			/>
		</Fragment>
	);
}

export default Notes;

import React from "react";
import { Text } from "ink";
import { useRouter } from "../components/Router.js";

const HomePage = () => {
	const router = useRouter();

	return (
		<Text>
			HomePage
			<Text color="green">{router.path}</Text>
		</Text>
	);
};

export default HomePage;

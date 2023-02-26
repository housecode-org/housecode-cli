import React from "react";
import { Text } from "ink";
import { useRouter } from "../components/Router.js";
const HomePage = () => {
    const router = useRouter();
    return (React.createElement(Text, null,
        "HomePage",
        React.createElement(Text, { color: "green" }, router.path)));
};
export default HomePage;

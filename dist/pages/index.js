import React, { useEffect } from "react";
import { Text } from "ink";
import { useRouter } from "../components/Router.js";
const HomePage = () => {
    const router = useRouter();
    useEffect(() => {
        // chagne router path to /question after 2 seconds
        setTimeout(() => {
            router.push("/question");
        }, 2000);
        setTimeout(() => {
            console.log("done");
        }, 4000);
    }, []);
    return (React.createElement(Text, null,
        "HomePage",
        React.createElement(Text, { color: "green" }, router.path)));
};
export default HomePage;

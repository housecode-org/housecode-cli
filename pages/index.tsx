import React from "react";
import { Text } from "ink";
import { useRouter } from "../components/Router.js";

const HomePage = () => {
  const router = useRouter();

  React.useEffect(() => {
    // router.push("/user/solar");
    // router.push("/user/special/santino");
    // router.push("/articles/itsub/123");
    // router.push("/post/itsub/123?2351");
    // router.push("/comments");
    // router.push("/comments/1/2/3/4");
    // router.push("/info/index");
    router.push("/info");
  }, []);

  return (
    <Text>
      HomePage
      <Text color="green">{router.pathname}</Text>
    </Text>
  );
};

export default HomePage;

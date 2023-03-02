import React from "react";
import { Text } from "ink";
import { useRouter } from "../components/Router.js";

const TestPage = () => {
  const router = useRouter();

  return (
    <>
      <Text color="green">TestPage</Text>
      <Text color="green">path: {router.pathname}</Text>
      <Text color="green">query: {JSON.stringify(router.query)}</Text>
    </>
  );
};

export default TestPage;

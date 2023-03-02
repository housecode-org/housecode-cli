import React from "react";
import { Text } from "ink";
import { useRouter } from "../../../components/Router.js";

const PidPage = () => {
  const router = useRouter();

  return (
    <>
      <Text color="green">UserSpecialPidPage</Text>
      <Text color="green">path: {router.pathname}</Text>
      <Text color="green">query: {JSON.stringify(router.query)}</Text>
    </>
  );
};

export default PidPage;

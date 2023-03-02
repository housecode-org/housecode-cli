import React from "react";
import { Text } from "ink";
import { useRouter } from "../../components/Router.js";

export interface InfoPageProps {
  name: string;
}

export default function InfoPage(props: InfoPageProps) {
  const router = useRouter();

  return (
    <>
      <Text color="green">InfoPage</Text>
      <Text color="green">path: {router.pathname}</Text>
      <Text color="green">query: {JSON.stringify(router.query)}</Text>
      <Text color="green">ssr props: {JSON.stringify(props)}</Text>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      name: "Nextly",
    } as InfoPageProps, // will be passed to the page component as props
  };
}

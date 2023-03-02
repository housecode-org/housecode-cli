import React from "react";
import { Text } from "ink";
import { useRouter } from "../../components/Router.js";

const CommentSlugPage = () => {
  const router = useRouter();

  return (
    <>
      <Text color="green">CommentSlugPage</Text>
      <Text color="green">path: {router.pathname}</Text>
      <Text color="green">asPath: {router.asPath}</Text>
      <Text color="green">query: {JSON.stringify(router.query)}</Text>
    </>
  );
};

export default CommentSlugPage;

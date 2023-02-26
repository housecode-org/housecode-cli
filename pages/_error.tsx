import { Text } from "ink";
import React from "react";

const ErrorPage = (props: { error: Error }) => {
  return (
    <>
      <Text>Hi! An error has occured</Text>
      <Text>{props.error?.message}</Text>
    </>
  );
};

export default ErrorPage;

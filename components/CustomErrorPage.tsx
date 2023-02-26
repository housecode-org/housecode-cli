import React from "react";
import { join } from "path";
import { pathToFileURL } from "url";
import { globbySync } from "globby";
import { Text } from "ink";

export const CustomErrorPage = (props: { error: Error }) => {
  const [Route, setCurrentRoute] = React.useState<any>(null);
  const [pages] = React.useState(() => {
    return globbySync(["./dist/pages/*.js"]).filter((page) => {
      return page !== "./dist/pages/_app.js";
    });
  });

  React.useEffect(() => {
    const find = (pagePath: string) => {
      return pages.find((page) => {
        const route = page.replace("./dist/pages/", "").replace(".js", "");
        const routePath = route === "index" ? "/" : `/${route}`;
        return routePath === pagePath;
      });
    };

    const page = find("/_error");
    if (page) {
      const routeFileUrl = pathToFileURL(join(process.cwd(), page)).href;
      import(routeFileUrl).then((page) => {
        const Route = page.default;
        setCurrentRoute(() => (props: { error: Error }) => (
          <React.Suspense fallback={<Text></Text>}>
            {Route && <Route error={props.error} />}
          </React.Suspense>
        ));
      });
    }
  }, []);

  if (Route) {
    return <Route error={props.error} />;
  } else {
    return (
      <Text>
        <Text color="red">An error has occured</Text>
        <Text>{props.error?.message ?? props.error?.toString()}</Text>
      </Text>
    );
  }
};

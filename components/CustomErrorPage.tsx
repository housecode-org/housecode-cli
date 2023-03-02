import React from "react";
import { join } from "path";
import { pathToFileURL } from "url";
import { globbySync } from "globby";
import { Text } from "ink";
import type { NextlyConfig } from "./Nextly.js";

export interface CustomErrorPageProps {
  error: Error;
  config: NextlyConfig;
}
export const CustomErrorPage = (props: CustomErrorPageProps) => {
  const [Route, setCurrentRoute] = React.useState<any>(null);
  const [pages] = React.useState(() => {
    return globbySync([`./dist${props.config.basePath}/*.js`]).filter(
      (page) => {
        return page !== `./dist${props.config.basePath}/_app.js`;
      }
    );
  });

  React.useEffect(() => {
    const find = (pagePath: string) => {
      return pages.find((page) => {
        const route = page
          .replace(`./dist${props.config.basePath}/`, "")
          .replace(".js", "");
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
          <React.Suspense fallback={<></>}>
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
      <>
        <Text>An error has occured</Text>
        <Text>{props.error?.message}</Text>
      </>
    );
  }
};

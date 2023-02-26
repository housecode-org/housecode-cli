import React, { useEffect } from "react";
import { globbySync } from "globby";

import { join } from "path";
import { pathToFileURL } from "url";
import ErrorBoundary from "./ErrorBoundary.js";

const RouteContext = React.createContext<{
  path: string;
  history: string[];
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  reload: () => void;
}>(null);

export const useRouter = () => React.useContext(RouteContext);

/**
 * @experimental
 * A Router component that feels like nextjs router for ink.
 * This router cannot render pages with depth.
 *
 * @author hmmhmmhm
 */
export const Router = () => {
  const [Route, setCurrentRoute] = React.useState<any>(null);
  const [path, setPath] = React.useState("/");
  const [history, setHistory] = React.useState<string[]>([]);
  const [pages] = React.useState(() => {
    return globbySync(["./dist/pages/*.js"]).filter((page) => {
      return page !== "./dist/pages/_app.js";
    });
  });

  const push = (path: string) => {
    setPath(path);
    setHistory((history) => [...history, path]);
  };
  const back = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setPath(newHistory[newHistory.length - 1]);
    }
  };
  const replace = (path: string) => {
    setPath(path);
    setHistory((history) => [...history.slice(0, -1), path]);
  };
  const reload = () => {
    setPath(null);
    setTimeout(() => {
      setPath(path);
    }, 0);
  };

  useEffect(() => {
    const find = (pagePath: string) => {
      return pages.find((page) => {
        const route = page.replace("./dist/pages/", "").replace(".js", "");
        const routePath = route === "index" ? "/" : `/${route}`;
        return routePath === pagePath;
      });
    };

    const currentRoute = find(path);

    if (currentRoute) {
      const routeFileUrl = pathToFileURL(
        join(process.cwd(), currentRoute)
      ).href;
      setCurrentRoute(React.lazy(() => import(routeFileUrl)));
    } else {
      const notFoundRoute = find("/404");
      if (notFoundRoute) {
        const routeFileUrl = pathToFileURL(
          join(process.cwd(), notFoundRoute)
        ).href;
        setCurrentRoute(React.lazy(() => import(routeFileUrl)));
      }
    }
  }, [path]);

  return (
    <RouteContext.Provider
      value={{
        path,
        history,
        push,
        back,
        replace,
        reload,
      }}
    >
      <ErrorBoundary>
        <React.Suspense fallback={<></>}>{Route && <Route />}</React.Suspense>
      </ErrorBoundary>
    </RouteContext.Provider>
  );
};

export default Router;

import React, { useEffect } from "react";
import { globbySync } from "globby";
import { parse } from "qs";
import { join } from "path";
import { pathToFileURL } from "url";

import ErrorBoundary from "./ErrorBoundary.js";
import { NextlyConfig } from "./Nextly.js";

export interface RouteContextProps {
  pathname: string;
  asPath: string;
  isFallback: boolean;
  query: Record<string, any>;
  history: string[];
  push: (
    path: string,
    _as?: string,
    _options?: {
      scroll?: boolean;
      shallow?: boolean;
      locale?: string;
    }
  ) => void;
  replace: (
    path: string,
    _as?: string,
    _options?: {
      scroll?: boolean;
      shallow?: boolean;
      locale?: string;
    }
  ) => void;
  back: () => void;
  reload: () => void;
}

export const RouteContext = React.createContext<RouteContextProps>(null);
export const useRouter = () => React.useContext(RouteContext);

export interface RouterProps {
  config: NextlyConfig;
}
export const Router = (props?: RouterProps) => {
  const [Route, setCurrentRoute] = React.useState<any>(null);
  const [pathname, setPathName] = React.useState("/");
  const [asPath, setAsPath] = React.useState("/");
  const [isFallback, _setIsFallback] = React.useState(false);
  const [history, setHistory] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState<Record<string, any>>({});
  const [pages] = React.useState(() => {
    return globbySync([`./dist${props.config.basePath}/**/*.js`]).filter(
      (page) => {
        return page !== `./dist${props.config.basePath}/_app.js`;
      }
    );
  });

  const push = (
    _path: string,
    _as?: string,
    _options?: {
      scroll?: boolean;
      shallow?: boolean;
      locale?: string;
    }
  ) => {
    const [pathname, queryString] = _path.split("?");
    if (queryString) setQuery(parse(queryString));
    const path = pathname === "/" ? pathname : pathname.replace(/\/$/, "");

    setPathName(path);
    setAsPath(_path);
    setHistory((history) => [...history, path]);
  };
  const back = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setPathName(newHistory[newHistory.length - 1]);
      setAsPath(newHistory[newHistory.length - 1]);
    }
  };
  const replace = (
    _path: string,
    _as?: string,
    _options?: {
      scroll?: boolean;
      shallow?: boolean;
      locale?: string;
    }
  ) => {
    const [pathname, queryString] = _path.split("?");
    if (queryString) setQuery(parse(queryString));
    const path = pathname === "/" ? pathname : pathname.replace(/\/$/, "");

    setPathName(path);
    setAsPath(_path);
    setHistory((history) => [...history.slice(0, -1), path]);
  };
  const reload = () => {
    setPathName(null);
    setTimeout(() => {
      setPathName(pathname);
    }, 0);
  };

  useEffect(() => {
    const find = (pagePath: string) => {
      return pages.find((page) => {
        const route = page
          .replace(`./dist${props.config.basePath}/`, "")
          .replace(".js", "");
        const routePath = route === "index" ? "/" : `/${route}`;
        return routePath === pagePath || routePath === `${pagePath}/index`;
      });
    };

    const currentRoute = find(pathname);

    if (currentRoute) {
      const routeFileUrl = pathToFileURL(
        join(process.cwd(), currentRoute)
      ).href;
      setCurrentRoute(React.lazy(() => import(routeFileUrl)));
    } else {
      // support single slug routes
      // it possible to have a route like /user/[pid]
      // and the path is /user/1
      // so we need to find the route that matches the path
      const dynamicRoutes = pages.find((page) => {
        const route = page
          .replace(`./dist${props.config.basePath}/`, "")
          .replace(".js", "");
        const routePath = route === "index" ? "/" : `/${route}`;
        const routePathParts = routePath.split("/");
        const pathParts = pathname.split("/");
        if (routePathParts.length !== pathParts.length) return false;
        return routePathParts.every((routePathPart, index) => {
          if (routePathPart.startsWith("[")) return true;
          return routePathPart === pathParts[index];
        });
      });

      // support multiple slug routes
      // it possible to have a route like /user/[...pid]
      // and the path is possible /user/1, /user/1/2, /user/1/2/3...
      // so we need to find the route that matches the path
      const catchAllRoutes = pages.find((page) => {
        const route = page
          .replace(`./dist${props.config.basePath}/`, "")
          .replace(".js", "");
        const routePath = route === "index" ? "/" : `/${route}`;
        const routePathParts = routePath.split("/");
        const pathParts = pathname.split("/");
        if (routePathParts.length > pathParts.length) return false;
        return routePathParts.every((routePathPart, index) => {
          if (routePathPart.startsWith("[...")) return true;
          return routePathPart === pathParts[index];
        });
      });

      // support optional catch all routes
      // it possible to have a route like /user/[[...pid]]
      // and the path is possible /user, /user/1, /user/1/2, /user/1/2/3...
      // so we need to find the route that matches the path
      const optionalCatchAllRoutes = pages.find((page) => {
        const route = page
          .replace(`./dist${props.config.basePath}/`, "")
          .replace(".js", "");
        const routePath = route === "index" ? "/" : `/${route}`;
        const routePathParts = routePath.split("/");
        const pathParts = pathname.split("/");
        return routePathParts.every((routePathPart, index) => {
          if (routePathPart.startsWith("[[")) return true;
          return routePathPart === pathParts[index];
        });
      });

      const catchRoutes = optionalCatchAllRoutes ?? catchAllRoutes;
      const catchRouteStartsWith = optionalCatchAllRoutes ? "[[..." : "[...";
      const catchRouteEndsWith = optionalCatchAllRoutes ? "]]" : "]";

      if (dynamicRoutes) {
        // set [pid] -> pid name into query
        const routePath = dynamicRoutes
          .replace(`./dist${props.config.basePath}/`, "")
          .replace(".js", "");
        const routePathParts = routePath.split("/");
        routePathParts.forEach((routePathPart, index) => {
          if (routePathPart.startsWith("[")) {
            const key = routePathPart.replace("[", "").replace("]", "");
            // using curentRoute
            // ex: /user/solor (/user/[pid]]) -> query.pid = 'solor'
            const value = pathname.split("/")[index + 1];
            setQuery((query) => {
              return {
                ...query,
                [key]: value,
              };
            });
          }
        });

        const routeFileUrl = pathToFileURL(
          join(process.cwd(), dynamicRoutes)
        ).href;
        setCurrentRoute(React.lazy(() => import(routeFileUrl)));
      } else if (catchRoutes) {
        // set [...pid] -> pid name into query
        const routePath = catchRoutes
          .replace(`./dist${props.config.basePath}/`, "")
          .replace(".js", "");
        const routePathParts = routePath.split("/");
        routePathParts.forEach((routePathPart, index) => {
          if (routePathPart.startsWith(catchRouteStartsWith)) {
            const key = routePathPart
              .replace(catchRouteStartsWith, "")
              .replace(catchRouteEndsWith, "");
            // using curentRoute
            // ex: /user/solor/1/2 (/user/[...pid]]) -> query.pid = ['solor', '1', '2']
            const value = pathname
              .split("/")
              .slice(index + 1)
              .filter((v) => v !== "");
            setQuery((query) => {
              return {
                ...query,
                [key]: value,
              };
            });
          }
        });

        const routeFileUrl = pathToFileURL(
          join(process.cwd(), catchRoutes)
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
    }
  }, [pathname]);

  return (
    <RouteContext.Provider
      value={{
        pathname,
        query,
        asPath,
        isFallback,
        history,
        push,
        back,
        replace,
        reload,
      }}
    >
      <ErrorBoundary config={props.config}>
        <React.Suspense fallback={<></>}>{Route && <Route />}</React.Suspense>
      </ErrorBoundary>
    </RouteContext.Provider>
  );
};

export default Router;

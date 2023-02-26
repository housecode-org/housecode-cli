import React, { useEffect } from "react";
import { Text } from "ink";
import { globbySync } from "globby";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RouteContext = React.createContext(null);
export const useRouter = () => React.useContext(RouteContext);
/**
 * @experimental
 * A Router component that feels like nextjs router for ink.
 * This router cannot render pages with depth.
 *
 * @author hmmhmmhm
 */
export const Router = () => {
    const [Route, setCurrentRoute] = React.useState(null);
    const [path, setPath] = React.useState("/");
    const [history, setHistory] = React.useState([]);
    const push = (path) => {
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
    const replace = (path) => {
        setPath(path);
        setHistory((history) => [...history.slice(0, -1), path]);
    };
    const reload = () => {
        setPath(null);
        setTimeout(() => {
            setPath(path);
        }, 0);
    };
    const pages = globbySync(["../pages/*.js"], {
        cwd: __dirname,
    });
    useEffect(() => {
        const find = (pagePath) => {
            return pages.find((page) => {
                const route = page.replace("../pages/", "").replace(".js", "");
                const routePath = route === "index" ? "/" : `/${route}`;
                return routePath === pagePath;
            });
        };
        const currentRoute = find(path);
        if (currentRoute) {
            setCurrentRoute(React.lazy(() => import(currentRoute)));
        }
        else {
            const errorRoute = find("/404");
            if (errorRoute) {
                setCurrentRoute(React.lazy(() => import(errorRoute)));
            }
        }
    }, [path]);
    return (React.createElement(RouteContext.Provider, { value: {
            path,
            history: [],
            push,
            back,
            replace,
            reload,
        } },
        React.createElement(React.Suspense, { fallback: React.createElement(Text, null, "Loading...") }, Route && React.createElement(Route, null))));
};
export default Router;
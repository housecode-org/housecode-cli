import { globby } from "globby";
import { render } from "ink";
import React from "react";
import path from "path";
import { fileURLToPath } from "url";
import HomePage from "../pages/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RouteContext = React.createContext({
    path: "/",
    history: [],
});
const RouteProvider = RouteContext.Provider;
export const useRouter = () => {
    const context = React.useContext(RouteContext);
    return {
        ...context,
        push: (path) => {
            context.history.push(path);
            context.path = path;
        },
    };
};
export const createApp = async () => {
    const pages = await globby(["../pages/*.js"], {
        cwd: __dirname,
    });
    const routes = pages.map((page) => {
        const route = page.replace("../pages/", "").replace(".js", "");
        return {
            route,
            page,
        };
    });
    render(React.createElement(RouteProvider, { value: {
            path: "/",
            history: [],
        } },
        React.createElement(HomePage, null)));
};

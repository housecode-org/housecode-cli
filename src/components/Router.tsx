import React, { useEffect } from "react";
import { Text } from "ink";
import { globbySync } from "globby";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

	const pages = globbySync(["../pages/*.js"], {
		cwd: __dirname,
	});

	useEffect(() => {
		const find = (pagePath: string) => {
			return pages.find((page) => {
				const route = page.replace("../pages/", "").replace(".js", "");
				const routePath = route === "index" ? "/" : `/${route}`;
				return routePath === pagePath;
			});
		};

		const currentRoute = find(path);

		if (currentRoute) {
			setCurrentRoute(React.lazy(() => import(currentRoute)));
		} else {
			const errorRoute = find("/404");
			if (errorRoute) {
				setCurrentRoute(React.lazy(() => import(errorRoute)));
			}
		}
	}, [path]);

	return (
		<RouteContext.Provider
			value={{
				path,
				history: [],
				push,
				back,
				replace,
				reload,
			}}
		>
			<React.Suspense fallback={<Text>Loading...</Text>}>
				{Route && <Route />}
			</React.Suspense>
		</RouteContext.Provider>
	);
};

export default Router;

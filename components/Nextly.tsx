import React, { useEffect } from "react";
import { join } from "path";
import { pathToFileURL } from "url";

import Router from "./Router.js";

export interface NextlyConfig {
  basePath: string;
}

const defaultConfig: NextlyConfig = {
  basePath: "/pages",
};

export const Nextly = () => {
  const [config, setConfig] = React.useState<NextlyConfig>(null);

  const loadConfig = async () => {
    try {
      const configFileUrl = pathToFileURL(
        join(process.cwd(), "nextly.config.mjs")
      ).href;
      const _config = {
        ...defaultConfig,
        ...(await import(configFileUrl))?.default,
      };

      if (!_config.basePath || _config.basePath.length === 0)
        _config.basePath = defaultConfig.basePath;
      if (!_config.basePath.startsWith("/"))
        _config.basePath = `/${_config.basePath}`;
      if (_config.basePath.endsWith("/"))
        _config.basePath = _config.basePath.slice(0, -1);

      setConfig(_config);
    } catch (e) {
      setConfig(defaultConfig);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return <>{config && <Router config={config} />}</>;
};

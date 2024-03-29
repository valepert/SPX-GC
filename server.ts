import express from "express";

console.log(
  "\n  SPX Graphics Controller server is starting.\n  Closing this window/process will stop the server.\n"
);

enum ERROR_CODES {
  CONFIG_ERROR = 1,
  KILL_REQUEST,
  ADDRESS_IN_USE,
}

process.on("exit", (code) => {
  let codestr = "Unspecified exit code";
  switch (code) {
    case ERROR_CODES.CONFIG_ERROR:
      codestr = "Error while reading config.json";
      break;

    case ERROR_CODES.KILL_REQUEST:
      codestr =
        "Kill request received from SPX client. If pm2 used, the server will restart automatically.";
      break;

    case ERROR_CODES.ADDRESS_IN_USE:
      codestr = "Port is already in use on this machine.";
      break;

    default:
      break;
  }
  return console.log(`\n\nSPX exit! (Errorcode ${code}: ${codestr})\n\n`);
});

import { readConfig } from "./SPX/config";

readConfig().then(
  config => {
    if (!config) {
      process.exit(ERROR_CODES.CONFIG_ERROR);
    }

    const port = config.general.port || 5656;

    const app = express();
    const server = app
      .listen(port, () => {})
      .on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          process.exit(ERROR_CODES.ADDRESS_IN_USE);
        }
      });
  }
);

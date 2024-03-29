import fs from "fs";
import path from "path";

interface SPXConfig {
    general: {
        username: string;
        password: string;
        hostname: string;
        greeting: string;
        langfile: string;
        loglevel: string;
        launchchrome: boolean;
        resolution: string;
        preview: string;
        renderer: string;
        apikey: string;
        logfolder: string;
        dataroot: string;
        templatesource: string;
        port: string
        disableConfigUI: boolean;
        disableLocalRenderer: boolean;
        disableSeveralControllersWarning: boolean;
        recents: any[];
    };
    casparcg: {
        servers: any[];
    }
    globalExtras: {
        customscript: string
        CustomControls: any[];
    }
    warning: string;
    copyright: string;
    updated: string;
}

export const makeFolderIfNotExist = (fullFolderPath: string) => {
  try {
    if (!fs.existsSync(fullFolderPath)) {
      fs.mkdirSync(fullFolderPath);
    }
    return fs.existsSync(fullFolderPath);
  } catch (error) {
    console.log(`cannot create ${fullFolderPath}`, error);
  }
};

export const readConfig = () => {
  return new Promise<SPXConfig>((resolve) => {
    const CURRENT_FOLDER = process.cwd();

    // TODO: config.json works only in app folder
    let CONFIG_FILE = path.join(CURRENT_FOLDER, "config.json");

    const args = process.argv.slice(2);
    const configArg = args[0] || "";
    if (configArg) {
      CONFIG_FILE = path.join(CURRENT_FOLDER, configArg);
    }

    let cfg: SPXConfig;
    
    if (!fs.existsSync(CONFIG_FILE)) {
        cfg = generateConfig(CURRENT_FOLDER);
        const filedata = JSON.stringify(cfg, null, 2);
        fs.writeFileSync(CONFIG_FILE, filedata, "utf8");
    } else {
        const configFileStr = fs.readFileSync(CONFIG_FILE);
        cfg = JSON.parse(configFileStr.toString());
    }

    const currentLogFolder = cfg.general.logfolder || CURRENT_FOLDER + '/LOG'
    const currentDataRoot = cfg.general.logfolder || CURRENT_FOLDER + '/DATAROOT'
    makeFolderIfNotExist(currentLogFolder);
    makeFolderIfNotExist(currentDataRoot);
    resolve(cfg);
  });
};

const generateConfig = (currentFolder: string) => {
  return {
    general: {
      username: "admin",
      password: "",
      hostname: "",
      greeting: "",
      langfile: "english.json",
      loglevel: "info",
      launchchrome: false,
      resolution: "HD",
      preview: "selected",
      renderer: "normal",
      apikey: "",
      logfolder: path.join(currentFolder, 'LOG') + "/",
      dataroot: path.join(currentFolder, 'DATAROOT') + "/",
      templatesource: "spx-ip-address",
      port: "5656",
      disableConfigUI: false,
      disableLocalRenderer: false,
      disableSeveralControllersWarning: false,
      recents: [],
    },
    casparcg: {
      servers: [],
    },
    globalExtras: {
      customscript: "/ExtraFunctions/demoFunctions.js",
      CustomControls: [],
    },
    warning:
      "GENERATED DEFAULT CONFIG. Modifications done in the SPX will overwrite this file.",
    copyright: "(c) 2020- Softpix (https://spx.graphics)",
    updated: new Date().toISOString(),
  };
};

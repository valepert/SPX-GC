import { makeFolderIfNotExist, readConfig } from "../SPX/config";

const fs = require("fs");
jest.mock("fs", () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('makeFolderIfNotExist', () => {
    test('folder exists', () => {
        fs.existsSync.mockReturnValue(true);

        const created = makeFolderIfNotExist('/some/folder');

        expect(fs.mkdirSync).not.toHaveBeenCalled();
        expect(created).toBe(true);
    });

    test('folder does not exist', () => {
        fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(true);

        const created = makeFolderIfNotExist('/some/folder');

        expect(fs.mkdirSync).toHaveBeenCalled();
        expect(created).toBe(true);
    })
});

describe('readConfig', () => {
    test('config file exists', async () => {
        const CONFIG = {some: 'json', general: {}};

        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(JSON.stringify(CONFIG));

        const cfg = await readConfig();

        expect(fs.readFileSync).toHaveBeenCalled();
        expect(cfg).toStrictEqual(CONFIG);
    })

    test('config file does not exist', async () => {
        fs.existsSync.mockReturnValue(false);
        fs.writeFileSync.mockReturnValue(undefined);

        const cfg = await readConfig();

        expect(cfg).toHaveProperty('general');
        expect(cfg).toHaveProperty('general.logfolder');
        expect(cfg).toHaveProperty('general.dataroot');
    })
});

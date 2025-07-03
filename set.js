const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWUVMeCtBRnV2OEY4YnhBV01HWFVkL29hTjdSNnlrTWxObmVMRjhkYmowOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib21JcDQ2cU5HbCtWcE1GN1ZIdFo3WWJvUFBaSjdxSWVVSW9XVDE3TUVXQT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJPTDArRXJxMkxCTGhMMGNBL3JjS3k1T3dueVM0SEFZdnlpSTFIZi83ZjI0PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJPMGRTQ0xudDBZVFFGQUdNRmNnemFkNEpuN1hKalRtcG1FQVlDdEJ1bFVFPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVOSitJSGgrd0VPTDFiaDduV3RjY2JVeVpOc0RGR2h5eEJlMHpNRW1MRmc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjJ5cFZGK08xQjB6QytGUDhCcG1QTHhSbGVKRDVCaWNOZ0RKMlBDZjhGVUk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkY3SStCaCtCcitETHI5YjBNUGFFek1RTTFIR25zYUE5Z0RJRHZtdDVVWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSzlMVDF6cTJwU1ZxQlJHY1V1TGNQQjNjTzM2aGhZNDVVM1VFbnhVWjIyWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImxSTDJMcnF2TzByR3BNYUt0ZnByRHpuRFlwQWpyZnhxSU42eGU4M29Dd0pPNjgxOHdjTmUvY00rd3pucVpMNjdVOGJ4NUQzS1pZS3ViRmE5elBYWUNnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTE1LCJhZHZTZWNyZXRLZXkiOiJ1L0ZJcFZDaVcrZFRRL00wTHVsVkZ2RFZaMUFkVmJQb1JMTjFVOWgwL2ljPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI1NTYyOTIyNjAwN0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJFQzVGRUUzNjk4RjBFQTNGNTNFMUFEQjRDNjQ0QTM0MiJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzUxNTQ3NTgxfV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiJaSDFXTDU2UCIsIm1lIjp7ImlkIjoiMjU1NjI5MjI2MDA3OjU2QHMud2hhdHNhcHAubmV0IiwibGlkIjoiMTI3NDcwODcxMzAyMzQ0OjU2QGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSkNTNWRVQkVKWDltY01HR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiTlhMSDU1Qzk1RGxNV1ZTWWhlRlAzMGRYSkxmZ1ZPSi9LR1lhcDFiUkRucz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiL0o4ZHB5YVFUZzYxZmJoQ1ZmbU9ZWDlOMlJvMmhhMXIyUGQyMU83SlhMN3BqNmVUZFZOVFF6N2dvQ2YyUVgvTjlTSys1bXhHM2F3aWpXdHNVVVYxQkE9PSIsImRldmljZVNpZ25hdHVyZSI6ImQvaGhlTkdwb2oyVkw4a0NXclh5UmRzWHZaZG41bDg0UG90S01RRFkrc1FaZFdkYzFHSDFwR3ZxM254eWg5aE1uMDNqY2h6dVkxRUdtdFE5ZmpoU0RRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU1NjI5MjI2MDA3OjU2QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlRWeXgrZVF2ZVE1VEZsVW1JWGhUOTlIVnlTMzRGVGlmeWhtR3FkVzBRNTcifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBSUlCUT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1MTU0NzU2MiwibGFzdFByb3BIYXNoIjoiM2dQVUprIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFOMHoifQ==',
    PREFIXE: process.env.PREFIX || "!",
    OWNER_NAME: process.env.OWNER_NAME || "MAJENZI 🇹🇿",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "255629226007",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'MAJENZI_AI',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/hvi870.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '1' ,
    ETAT : process.env.PRESENCE || '',
    ANTICALL : process.env.ANTICALL || 'yes',   
    AUTO_BIO : process.env.AUTO_BIO || 'yes',               
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'yes',              
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});


uconst fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSUlRdHZPTFBGejM2dmVGbFdKWUNaR1YrWWNKUnBLWnMxWkVLc2JrbWdraz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiN0Y5U2hiZlRrUTZ5Z1Z5dGFZaDFVeHY2dUxtWW50TzRoQUdtczEwblVtdz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ3SHBSOEhSNThtQ3Z5Z1IxcUgyMXVuZjlIVGNFYUVlWjEzTUorbHl2UDB3PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJqYUtjTVNoK2NsQ2ZSRlI1SnM0N0hPQ25LYkJzWGZWUmNKZis4Sjkrb2k0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNQeHU5L285OGpIZlBrZHZiQ1JjNlZYWFBveTdiOXZXeVVyQWJRbjRpVjg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZJMjdsZ2lqbmVIUGR4T3pmOUtDajE4QVV3MWtCQmM1SW8yTmxNQ2lyejA9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT09DOXRMOENPZEJDUDl5cSsvUzJSdjNFYmJPZi9GQTFMWEVLTjRhQ3IzYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS0xKUWR1Q09tY3p6cmxaSVBkbzVJb0hDd2pJSUlvN0hXK3lkblhteU5EQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlMxQjRML0MrU0xKbDRNMGwrMHFFSXNzTHdadS85cVdRb3pQTzFlK0hGN1p3ejRnYVpCUWtmM2RMTlhKN2V6UUJuUUlWL0pHL3JQZkNhb2dlcE5PVkNRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjgsImFkdlNlY3JldEtleSI6IjVGc3B1eTNWb0ZxeHFCY1h3c09Ga0diUEhDdnR4QUxqSFpDTGdqcmxHSVU9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiMjU1NjI5MjI2MDA3QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjNFM0M2QUJERTQ2N0ZDRUNDOUNEOTNDRTUxNzYwOUM4In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NTEzODg2OTV9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IkhMRDdFWjJCIiwibWUiOnsiaWQiOiIyNTU2MjkyMjYwMDc6NTFAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiIxMjc0NzA4NzEzMDIzNDQ6NTFAbGlkIiwibmFtZSI6Ik1XTC4gTUFKRU5aSSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSXlTNWRVQkVQaWprTU1HR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiTlhMSDU1Qzk1RGxNV1ZTWWhlRlAzMGRYSkxmZ1ZPSi9LR1lhcDFiUkRucz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiay8rek1tcWJsdGVXSVUrbXFkOHZEWldlN1hwR0FzZHgwakRhNnRyREZpOEQrKzVkSWN5UVU1UzlpbzZQV3RkbVROcmE5VkdUUUhZeVBFZGRXNlF0RFE9PSIsImRldmljZVNpZ25hdHVyZSI6IjBON2IwOVhoTTByUzBWS0szN3ovNEpMNWZnNXlrUUNCa29MZXQ5bDk3cWFmRW1KcERINmNXb3lLck1PNjExeThUUGZPZjVIbmlraGQrb0NWY09LZ0F3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU1NjI5MjI2MDA3OjUxQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlRWeXgrZVF2ZVE1VEZsVW1JWGhUOTlIVnlTMzRGVGlmeWhtR3FkVzBRNTcifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBSUlCUT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1MTM4ODY3OCwibGFzdFByb3BIYXNoIjoiM2dQVUprIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFOMHIifQ==',
    PREFIXE: process.env.PREFIX || "!",
    OWNER_NAME: process.env.OWNER_NAME || "MAJENZI",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "255629226007",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'MAJENZI-MD',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/hvi870.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '1' ,
    ETAT : process.env.PRESENCE || '',
    ANTICALL : process.env.ANTICALL || 'no',   
    AUTO_BIO : process.env.AUTO_BIO || 'no',               
    DP : process.env.STARTING_BOT_MESSAGE || "no",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'no',
    AUTO_REACT : process.env.AUTO_REACT || 'no',              
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'no',
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


import pkg from "pg"
const {Pool} = pkg

const pool = new Pool({
    user: 'niharikabattarusetty',
    host: 'localhost',
    database: 'research-finder',
    password: 'nIha1708',
    port: 5432

})

export const query = (text, params) => pool.query(text,params);
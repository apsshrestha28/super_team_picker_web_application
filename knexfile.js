// Update with your config settings.
module.exports = {

  development: {
    client: 'pg',
    connection: {
      
      database:'super_team_picker',
    
      username: "aleena",
       password: "planet"

    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: {
      directory:"./db/seeds"
    }
  }
};
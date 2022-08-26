let dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations'
  }
}

switch (process.env.NODE_ENV) {
  case 'development':
    dbConfig = {
      ...dbConfig,
      type: 'sqlite',
      database: 'db.sqlite'
    }
    break

  case 'test':
    dbConfig = {
      ...dbConfig,
      type: 'sqlite',
      database: 'test.sqlite'
    }
    break

  case 'production':
    break

  default:
    throw new Error('unknown environment')
}

console.log('dbbbb', dbConfig)

module.exports = dbConfig

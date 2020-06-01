
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const CurrencyShop = sequelize.import('models/CurrencyShop');
sequelize.import('models/Users');
sequelize.import('models/UserItems');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    const shop = [
        CurrencyShop.upsert({ name: 'Matthews 2080Ti', cost: 1 }),
        CurrencyShop.upsert({ name: 'Brunos RAM', cost: 2 }),
        CurrencyShop.upsert({ name: 'Cronchy Monchy Sandwiches', cost: 10 }),
    ];
    await Promise.all(shop);
    console.log('Database Synced');
    sequelize.close();
}).catch(console.error);
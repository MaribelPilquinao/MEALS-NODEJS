const { app } = require('./app')
const { db } = require('./utils/database.util')

const startServer = async () => {
    try {
        await db.authenticate();
        await db.sync();

        // set server to listen
        const PORT = 2880

        app.listen(PORT, () => {
            console.log('Express app running!')
        })

    } catch (error) {
        console.log(error)
    }
}

startServer();
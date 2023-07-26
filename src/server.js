const app = require('./app');

app.listen({
    port: 3200

}, (err, address) => {

    if (err) {
        console.log(err);
        process.exit(1);
    }

})
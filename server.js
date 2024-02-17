
const app = require('./index.js');

const db = require('./config/db.js');

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => { console.log(`app is running on port http://localhost:${PORT}`)})
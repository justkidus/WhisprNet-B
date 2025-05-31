const express = require('express');
const dotenv = require('dotenv');
const { connectDb } = require('./lib/db');
const { router } = require('./routes/user.Routes');
const cookieParser = require('cookie-parser');
const { messagerouter } = require('./routes/message.Route');
const { grouprouter } = require('./routes/group.Route');
const { groupmessageRouter } = require('./routes/groupMessage.Route');
const cors = require('cors');
const { app, server } = require('./lib/socket');

dotenv.config();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);

app.use('/api/users', router);
app.use('/api/messages', messagerouter);
app.use('/api/group', grouprouter);
app.use('/api/groupmessages', groupmessageRouter);

PORT = process.env.PORT;
server.listen(PORT, () => {
	console.log(`server is running in port ${PORT}`);
	connectDb();
});

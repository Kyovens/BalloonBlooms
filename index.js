// import node module
const http = require('http');
const express = require('express');
const session = require('express-session');
const socketio = require('socket.io');

// import models module
const { sequelize } = require('./models/model.js');
const User = require('./models/user.js');
const Product = require('./models/product.js');
const Comment = require('./models/comment.js');
const Order = require('./models/order.js');

// import routes module
const all_routes = require('./routers/all.js');

const user_product_routes = require('./routers/user/product.js');
const user_custom_routes = require('./routers/user/custom.js');
const user_wishlist_routes = require('./routers/user/wishlist.js');
const user_order_routes = require('./routers/user/order.js');

const admin_user_routes = require('./routers/admin/user.js');
const admin_product_routes = require('./routers/admin/product.js');
const admin_order_routes = require('./routers/admin/order.js');

// import controller module
const { forAdmin, forUser } = require('./controllers/auth.js');

// import live-chat module
const { formatMessage, formatJoinLeave, formatRequest } = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, users } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine', 'ejs');

app.use(session({
    secret : 'ini adalah secret code ###',
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 30*60*1000  // 30 mins
    }
}))

// biar bisa otomatis terbuat dulu tabelnya
try {
    sequelize.authenticate()
    User.sync()
    Comment.sync()
    Product.sync()
    Order.sync()
}
catch (err) {
    console.log("Error !!!", err);
}

const botName = 'Bot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // Welcome current user
        socket.emit('message', formatMessage(botName, `Welcome to BalloonBloomsCiViC - ${room} Live Chat`));
        socket.broadcast.to(user.room).emit('joinleave', formatJoinLeave(botName, user.username + ' has joined the chat'))

        if (!users.find(admin => admin.username.toLocaleLowerCase() == 'admin')) {  // jika admin belum join di room manapun
            socket.emit('message', formatMessage(botName, "<b>Admin is Offline</b>. Your chat won't be seen until our Admin join this Live-Chat.<br>Please wait until BB-Admin joined or you can chat directly to Whatsapp <a href='tel: 087776462111' class='text-decoration-none'><b>+62 877-7646-2111</b></a> <small>(recommended)</small>"));  // only to me
        }
        else if (user.username.toLocaleLowerCase() != 'admin'){  // jika admin sudah ad tp yg masuk bukan admin
            socket.emit('message', formatMessage(botName, '<b>Admin is Online</b>. Please wait for response.'));  // only to me
        }
        // jika yg masuk admin dan admin memang baru join utk pertama kali
        if (user.username.toLocaleLowerCase() == 'admin' && users.filter(user => user.username.toLocaleLowerCase() == 'admin').length == 1) {
            socket.broadcast.emit('message', formatMessage(botName, '<b>Admin is Online</b>. Please wait for response.'));
        }

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
        // Request
        if (user.room == 'ADMIN with ' + user.username) {
            io.to('Public').emit('request', formatRequest(`${user.username}`));
        }
    });
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
            // kasi tau semua org di room klo ad yg leave siapapun itu
            socket.broadcast.to(user.room).emit('joinleave', formatJoinLeave(botName, user.username + ' has left the chat'))

            // jika yg leave adalah admin dan admin sudah tdk ad di room manapun
            if (user.username.toLocaleLowerCase() == 'admin' && !users.find(admin => admin.username.toLocaleLowerCase() == 'admin')) {
                socket.broadcast.emit('message', formatMessage(botName, "<b>Admin is Offline</b>. Your chat won't be seen until our Admin join this Live-Chat.<br>Please wait until BB-Admin joined or you can chat directly to Whatsapp <a href='tel: 087776462111' class='text-decoration-none'><b>+62 877-7646-2111</b></a> <small>(recommended)</small>"));  // only to me
            }
        }
    });
});

app.use('/user/product', forUser, user_product_routes)
app.use('/user/custom', forUser, user_custom_routes)
app.use('/user/wishlist', forUser, user_wishlist_routes)
app.use('/user/order', forUser, user_order_routes)

app.use('/admin/user-list', forAdmin, admin_user_routes)
app.use('/admin/product', forAdmin, admin_product_routes)
app.use('/admin/order', forAdmin, admin_order_routes)

app.use('/', all_routes)

app.get('(/home)?', (req, res) => {
    res.render('Home', { user: req.session.user || "" });
})

app.get('/about(-us)?', (req, res) => {
    res.render('About', { user: req.session.user || "" });
})

app.get('/live-chat/:username/:room', (req, res) => {
    try {
        if ((req.params.username.toLocaleLowerCase() == 'admin' && req.session.user.isAdmin) || req.params.username.toLocaleLowerCase() != 'admin')
            res.render('LiveChat', { user: req.session.user || "" })
        else
            throw err
    }
    catch(err) {
        res.redirect('/forbidden')
    }
})

app.get('/forbidden', (req, res) => {
    res.render('Forbidden', { user: req.session.user || "" });
})

app.get('*', (req, res) => {
    res.render('PageNotFound', { user: req.session.user || "" })
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});
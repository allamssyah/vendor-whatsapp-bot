/**
 * Vendor WhatsApp Bot
 * - Baileys for WhatsApp connection
 * - Google Sheets integration for Data & Jadwal
 *
 * Usage:
 * 1. Put credentials.json (service account) into project folder
 * 2. Set SPREADSHEET_ID in sheetsHelper.js
 * 3. npm install
 * 4. node index.js
 *
 * Commands:
 * - lapor [isi laporan]           -> append to Data sheet
 * - lapor|nama:Nama|lokasi:Lokasi|status:Done -> structured report (pipe-separated)
 * - jadwal kerja                  -> get today's schedule from Jadwal sheet
 */

import makeWASocket, { useMultiFileAuthState, Browsers } from '@whiskeysockets/baileys'
import { appendReport, getSchedule } from './sheetsHelper.js'
import qrcode from 'qrcode-terminal'

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: Browsers.macOS('VendorBot')
  })

  sock.ev.on('creds.update', saveCreds)

  // show QR in terminal (for Termux)
  sock.ev.on('connection.update', (update) => {
    if (update.qr) {
      qrcode.generate(update.qr, { small: true })
      console.log('Scan QR code above with WhatsApp → WhatsApp Web (use another phone)')
    }
    if (update.connection === 'open') {
      console.log('✅ Connected to WhatsApp')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    try {
      const msg = messages[0]
      if (!msg.message || msg.key.fromMe) return
      const from = msg.key.remoteJid
      // text content may be in different types; support conversation and extendedTextMessage
      const conv = msg.message.conversation || msg.message?.extendedTextMessage?.text || ''
      const text = (conv || '').trim()
      if (!text) return

      const lower = text.toLowerCase()

      if (lower.startsWith('lapor')) {
        // support two formats:
        // 1) lapor [free text]
        // 2) lapor|nama:Nama|lokasi:Lokasi|status:Done|isi:Laporan lengkap
        let nama = 'Belum diisi'
        let lokasi = 'Belum diisi'
        let status = 'Pending'
        let laporan = text.substring(5).trim() || ''

        if (text.includes('|')) {
          // parse pipe-separated fields
          const parts = text.split('|').slice(1)
          const map = {}
          parts.forEach(p=>{
            const [k, ...vals] = p.split(':')
            if (!k) return
            map[k.trim().toLowerCase()] = vals.join(':').trim()
          })
          laporan = map.get ? map.get('isi') || map.get('laporan') || laporan : (map['isi'] || map['laporan'] || laporan)
          nama = map.get('nama') || map.get('teknisi') || nama if False else (map.get('nama') if isinstance(map, dict) else nama)
        }

        // simple robust parse without fancy constructs
        // try manual parsing for common keys
        if (text.includes('|')) {
          const parts = text.split('|').slice(1)
          for (const p of parts) {
            const idx = p.indexOf(':')
            if (idx === -1) continue
            const key = p.slice(0, idx).trim().toLowerCase()
            const val = p.slice(idx+1).trim()
            if (key === 'nama' || key === 'teknisi') nama = val
            else if (key === 'lokasi') lokasi = val
            else if (key === 'status') status = val
            else if (key === 'isi' || key === 'laporan') laporan = val
          }
        } else {
          // try to split first words to detect "lapor [lokasi] : [isi]" - keep simple
        }

        const waktu = new Date().toLocaleString('id-ID')
        const nomor = from
        const row = [waktu, nomor, laporan, nama, lokasi, status]
        await appendReport(row)
        await sock.sendMessage(from, { text: '✅ Laporan diterima dan disimpan ke Google Sheet.' })
      } else if (lower.includes('jadwal kerja')) {
        const today = new Date().toLocaleDateString('id-ID')
        const jadwal = await getSchedule(today)
        await sock.sendMessage(from, { text: `📅 Jadwal Kerja ${today}\n${jadwal}` })
      } else {
        await sock.sendMessage(from, {
          text: 'Halo! Saya bot vendor.
- Ketik *lapor ...* untuk menyimpan laporan
- Ketik *jadwal kerja* untuk melihat jadwal hari ini'
        })
      }
    } catch (err) {
      console.error('message handler error', err)
    }
  })
}

startBot().catch(err=>{
  console.error('Bot error', err)
})

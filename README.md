# Vendor WhatsApp Bot

WhatsApp Bot untuk mencatat laporan kerja vendor (AC, Scenting, Hygiene, Pest Control) ke Google Sheets dan membaca jadwal kerja dari sheet.

---

## Fitur
- Menerima perintah `lapor` dan menyimpan data ke sheet `Data` (kolom: Waktu, Nomor WA, Laporan, Nama Teknisi, Lokasi, Status).
- Menjawab perintah `jadwal kerja` dengan membaca sheet `Jadwal`.
- Mudah dijalankan di Termux (Android) atau server Node.js biasa.

---

## Struktur Project
```
vendor-whatsapp-bot/
├─ index.js
├─ sheetsHelper.js
├─ package.json
├─ .gitignore
├─ credentials.json (jangan commit)
├─ credentials-example/credentials.json
└─ utils/
```

---

## Cara Kerja Singkat
1. Bot terhubung ke WhatsApp via Baileys (WhatsApp Web protocol).
2. Untuk menyimpan laporan bot menulis baris baru ke sheet `Data`.
3. Untuk jadwal, bot membaca sheet `Jadwal` dan mengirim baris yang tanggalnya cocok dengan tanggal hari ini (format `id-ID`).


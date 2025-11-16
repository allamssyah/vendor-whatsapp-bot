# Panduan Deploy di Termux (Oppo A3s)

Langkah ini diasumsikan kamu sudah punya Termux di HP dan Node.js >= v18 (kamu punya v20.11.0).

1. Salin file ZIP ke HP (atau clone repo).
   - Jika menggunakan zip: unzip vendor-whatsapp-bot-full.zip
2. Buka Termux, navigasi ke folder proyek:
   ```
   cd /sdcard/Download/vendor-whatsapp-bot-full
   ```
   (atau lokasi tempat kamu meletakkan file)
3. Install dependencies:
   ```
   pkg update && pkg upgrade -y
   pkg install nodejs git -y
   npm install
   ```
4. Pasang credentials:
   - Buat Service Account di Google Cloud Console, aktifkan Google Sheets API.
   - Download `credentials.json` dan letakkan di folder project (ganti contoh).
   - Share Google Sheet (`LaporanKerjaVendor`) ke email service account (client_email).
5. Edit `sheetsHelper.js`:
   - Ganti `SPREADSHEET_ID` dengan ID dari URL Google Sheet kamu.
6. Jalankan bot:
   ```
   node index.js
   ```
   - Terminal akan menampilkan QR Code (menggunakan qrcode-terminal).
   - Scan QR menggunakan WhatsApp di HP lain: WhatsApp > Settings > Linked Devices > Link a device.
7. Agar bot tetap hidup setelah layar mati / reboot:
   - Install Termux:Boot (opsional) dan buat script start
   - Atau gunakan `pm2` (butuh environment yang support)
   - Simpelnya: biarkan charger terpasang dan aktifkan setting pengembang -> jangan tidur saat diisi daya.

Troubleshooting:
- Jika muncul error terkait credential atau SPREADSHEET_ID, periksa kembali file credentials.json dan permission share pada Sheet.

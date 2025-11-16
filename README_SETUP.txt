== README SETUP - RINGKAS ==

1) Buat Google Sheet:
   - Nama: LaporanKerjaVendor
   - Sheet 'Data' dengan kolom: Waktu, Nomor WA, Laporan, Nama Teknisi, Lokasi, Status Pekerjaan
   - Sheet 'Jadwal' dengan kolom: Tanggal, Tim, Lokasi, Pekerjaan
   - Isi contoh baris di 'Jadwal' seperti: 17/11/2025 | Tim AC | Lobby | Cek AC

2) Google Cloud:
   - Buat Project -> Enable Google Sheets API -> Create Service Account -> Create Key (JSON)
   - Download credentials.json -> letakkan di folder project
   - Share spreadsheet ke email service account

3) Config:
   - Open sheetsHelper.js -> ganti SPREADSHEET_ID

4) Run:
   npm install
   node index.js

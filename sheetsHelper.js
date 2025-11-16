import { google } from 'googleapis';
import fs from 'fs';

const credsPath = './credentials.json';
if (!fs.existsSync(credsPath)) {
  console.warn('⚠️ credentials.json tidak ditemukan. Letakkan file credentials service account di folder project.');
}

const auth = new google.auth.GoogleAuth({
  keyFile: credsPath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

export let SPREADSHEET_ID = '1C3pdkU6jJreOPW_j_ARvozlaHJlZYHwM_Ahjp6bChyg'; // <-- Ganti dengan ID spreadsheet kamu

export async function appendReport(row) {
  if (SPREADSHEET_ID.startsWith('ISI_')) {
    throw new Error('Ganti SPREADSHEET_ID di sheetsHelper.js dengan ID spreadsheet Anda.');
  }
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Data!A:F',
    valueInputOption: 'RAW',
    requestBody: { values: [row] }
  });
}

export async function getSchedule(today) {
  if (SPREADSHEET_ID.startsWith('ISI_')) {
    throw new Error('Ganti SPREADSHEET_ID di sheetsHelper.js dengan ID spreadsheet Anda.');
  }
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Jadwal!A:D'
  });
  const rows = res.data.values || [];
  // match exact date string in Indonesian format (d/m/yyyy or dd/mm/yyyy)
  const matches = rows.filter(r => {
    if (!r[0]) return false;
    return r[0].trim() === today;
  });
  if (matches.length === 0) return 'Tidak ada jadwal hari ini.';
  return matches.map(r => `• ${r[1] || ''} (${r[2] || ''}): ${r[3] || ''}`).join('\n');
}

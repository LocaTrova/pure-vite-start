import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

export async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

export async function appendToSheet(spreadsheetId: string, values: any[]) {
  const sheets = await getUncachableGoogleSheetClient();
  
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'A:K',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values]
    }
  });
  
  return response.data;
}

export async function createSpreadsheetIfNeeded() {
  const sheets = await getUncachableGoogleSheetClient();
  
  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: 'Locatrova - Richieste Spazi'
      },
      sheets: [{
        properties: {
          title: 'Richieste'
        },
        data: [{
          startRow: 0,
          startColumn: 0,
          rowData: [{
            values: [
              { userEnteredValue: { stringValue: 'Data' } },
              { userEnteredValue: { stringValue: 'Tipo Spazio' } },
              { userEnteredValue: { stringValue: 'Nome' } },
              { userEnteredValue: { stringValue: 'Email' } },
              { userEnteredValue: { stringValue: 'Telefono' } },
              { userEnteredValue: { stringValue: 'Città' } },
              { userEnteredValue: { stringValue: 'Metri Quadrati' } },
              { userEnteredValue: { stringValue: 'Disponibilità' } },
              { userEnteredValue: { stringValue: 'Caratteristiche' } },
              { userEnteredValue: { stringValue: 'Note' } },
              { userEnteredValue: { stringValue: 'Marketing Consent' } }
            ]
          }]
        }]
      }]
    }
  });
  
  return response.data.spreadsheetId;
}

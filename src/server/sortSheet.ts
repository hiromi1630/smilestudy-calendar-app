function sortSheet(sheetName: string, sortSpecObj: number | Object) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets().filter((sheet) => sheet.getSheetName() === sheetName)[0];

  const rowCount = sheet.getLastRow() - 1;
  const colCount = sheet.getLastColumn();
  sheet.getRange(2, 1, rowCount, colCount).sort(sortSpecObj);
}

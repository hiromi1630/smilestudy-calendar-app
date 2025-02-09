const deleteDataFromSheetById = (sheetName: string, id: string): boolean => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets().find((sheet) => sheet.getSheetName() === sheetName);

  assert(sheet, '該当するシートが存在しません。:' + sheetName);

  const row = sheet
    .getDataRange()
    .getDisplayValues()
    .findIndex((row) => row[0] === id);

  assert(row != -1, `id '${id}' was not found`);

  sheet.deleteRow(row + 1);

  return true;
};

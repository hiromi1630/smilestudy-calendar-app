const ToggleRescheduleOfSheet = (sheetName: string, id: string): boolean => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets().find((sheet) => sheet.getSheetName() === sheetName);

  assert(sheet, '該当するシートが存在しません。:' + sheetName);

  let row = sheet
    .getDataRange()
    .getDisplayValues()
    .findIndex((row) => row[0] === id);

  assert(row != -1, `id '${id}' was not found`);

  row++;
  console.log(row);
  const cell = "I" + row.toString();
  const value:boolean = sheet.getRange(cell).getValue();
  sheet.getRange(cell).setValue(!value);
  return true;
};

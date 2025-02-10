// ! オブジェクト型を返そうとすると undefined や null に
// ! なってしまう（なんで？）ので、string 型にして返す

// type APIResult<T> =
type APIResult =
  | {
      ok: true;
      json: string;
      // data: T;
    }
  | {
      ok: false;
      error: string;
    };

// const ErrorHandler = <T>(process: () => T): APIResult<T> => {
const ErrorHandler = (process: () => any): APIResult => {
  try {
    const result = process();
    console.log(result);
    return {
      ok: true,
      json: JSON.stringify(result),
      // data: process(),
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: String(error),
    };
  }
};

export const LoadDataFromSheet = (header: boolean): APIResult =>
  ErrorHandler(() => loadDataFromSheet(header));

export const DeleteEventById = (id: string): APIResult =>
  ErrorHandler(() => deleteDataFromSheetById("main", id));

export const ToggleRescheduleEventById = (id: string): APIResult =>
  ErrorHandler(() => ToggleRescheduleOfSheet("main", id));

export const AddEvents = (events: any[][]): APIResult =>
  ErrorHandler(() => {
    appendDataToSheet("main", ...events);
    sortSheet("main", [2, 3]);
  });

export const GetScriptProperties = (): APIResult =>
  ErrorHandler(getScriptProperties);

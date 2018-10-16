import { async } from "./symbols";

export const enshureArray = possibleArray =>
  Array.isArray(possibleArray) ? possibleArray : [possibleArray,];

export const onlyAsyncActions = action => action.meta && !!action.meta[async];

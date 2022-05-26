const mainDict = {
  ERROR_MAIN: "An error occured: {{error}}",
  ERROR2: "Error2",
  ERROR3: "Error2",
  ERROR4: "Error2",
  ERROR5: "Error2",
  ERROR6: "Error2",
  ERROR7: "Error2",
  ERROR8: "Error2",
  ERROR9: "Error2",
  ERROR10: "Error2",
  ERROR11: "Error2",
};

export const myLogPredefiend: { [key: string]: typeof mainDict } = {
  he: {
    ERROR_MAIN: "התרחשה שגיאה: {{error}}",
    ERROR2: "שגיאה 2",
    ERROR3: "Error2",
    ERROR4: "Error2",
    ERROR5: "Error2",
    ERROR6: "Error2",
    ERROR7: "Error2",
    ERROR8: "Error2",
    ERROR9: "Error2",
    ERROR10: "Error2",
    ERROR11: "Error2",
  },
  en: mainDict,
};

export type myLogTypes1 = typeof myLogPredefiend["en"];
export type myLogTypes = myLogTypes1;

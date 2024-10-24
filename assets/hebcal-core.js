/*! @hebcal/core v5.5.2 */
var hebcal = (function (exports) {
'use strict';

/** DO NOT EDIT THIS AUTO-GENERATED FILE! */
const version = '5.5.2';

/* eslint-disable @typescript-eslint/no-namespace, no-inner-declarations */
/** @private */
const lengths = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/** @private */
const monthLengths = [lengths, lengths.slice()];
monthLengths[1][2] = 29;
/**
 * @private
 */
function mod$1(x, y) {
  return x - y * Math.floor(x / y);
}
/**
 * @private
 */
function quotient(x, y) {
  return Math.floor(x / y);
}
/**
 * @private
 * @param abs - R.D. number of days
 */
function yearFromFixed(abs) {
  const l0 = abs - 1;
  const n400 = quotient(l0, 146097);
  const d1 = mod$1(l0, 146097);
  const n100 = quotient(d1, 36524);
  const d2 = mod$1(d1, 36524);
  const n4 = quotient(d2, 1461);
  const d3 = mod$1(d2, 1461);
  const n1 = quotient(d3, 365);
  const year = 400 * n400 + 100 * n100 + 4 * n4 + n1;
  return n100 !== 4 && n1 !== 4 ? year + 1 : year;
}
/*
const ABS_14SEP1752 = 639797;
const ABS_2SEP1752 = 639785;
*/
/*
 * Formerly in namespace, now top-level
 */
/**
 * Returns true if the Gregorian year is a leap year
 * @param year Gregorian year
 */
function isGregLeapYear(year) {
  return !(year % 4) && (!!(year % 100) || !(year % 400));
}
/**
 * Number of days in the Gregorian month for given year
 * @param month Gregorian month (1=January, 12=December)
 * @param year Gregorian year
 */
function daysInGregMonth(month, year) {
  // 1 based months
  return monthLengths[+isGregLeapYear(year)][month];
}
/**
 * Returns true if the object is a Javascript Date
 */
function isDate(obj) {
  // eslint-disable-next-line no-prototype-builtins
  return typeof obj === 'object' && Date.prototype.isPrototypeOf(obj);
}
/**
 * @private
 * @param year
 * @param month (1-12)
 * @param day (1-31)
 */
function toFixed(year, month, day) {
  const py = year - 1;
  return 365 * py + quotient(py, 4) - quotient(py, 100) + quotient(py, 400) + quotient(367 * month - 362, 12) + (month <= 2 ? 0 : isGregLeapYear(year) ? -1 : -2) + day;
}
/**
 * Converts Gregorian date to absolute R.D. (Rata Die) days
 * @param date Gregorian date
 */
function greg2abs(date) {
  if (!isDate(date)) {
    throw new TypeError(`Argument not a Date: ${date}`);
  }
  const abs = toFixed(date.getFullYear(), date.getMonth() + 1, date.getDate());
  /*
    if (abs < ABS_14SEP1752 && abs > ABS_2SEP1752) {
      throw new RangeError(`Invalid Date: ${date}`);
    }
    */
  return abs;
}
/**
 * Converts from Rata Die (R.D. number) to Gregorian date.
 * See the footnote on page 384 of ``Calendrical Calculations, Part II:
 * Three Historical Calendars'' by E. M. Reingold,  N. Dershowitz, and S. M.
 * Clamen, Software--Practice and Experience, Volume 23, Number 4
 * (April, 1993), pages 383-404 for an explanation.
 * @param abs - R.D. number of days
 */
function abs2greg(abs) {
  if (typeof abs !== 'number') {
    throw new TypeError(`Argument not a Number: ${abs}`);
  }
  abs = Math.trunc(abs);
  /*
    if (abs < ABS_14SEP1752 && abs > ABS_2SEP1752) {
      throw new RangeError(`Invalid Date: ${abs}`);
    }
    */
  const year = yearFromFixed(abs);
  const priorDays = abs - toFixed(year, 1, 1);
  const correction = abs < toFixed(year, 3, 1) ? 0 : isGregLeapYear(year) ? 1 : 2;
  const month = quotient(12 * (priorDays + correction) + 373, 367);
  const day = abs - toFixed(year, month, 1) + 1;
  const dt = new Date(year, month - 1, day);
  if (year < 100 && year >= 0) {
    dt.setFullYear(year);
  }
  return dt;
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-namespace */
/**
 * Gregorian date helper functions
 */
exports.greg = void 0;
(function (greg) {})(exports.greg || (exports.greg = {}));
exports.greg.abs2greg = abs2greg;
exports.greg.daysInMonth = daysInGregMonth;
exports.greg.greg2abs = greg2abs;
exports.greg.isDate = isDate;
exports.greg.isLeapYear = isGregLeapYear;

/*
 * More minimal HDate
 */
const NISAN$4 = 1;
const IYYAR$1 = 2;
const SIVAN$1 = 3;
const TAMUZ$1 = 4;
const AV$1 = 5;
const ELUL$1 = 6;
const TISHREI$3 = 7;
const CHESHVAN$1 = 8;
const KISLEV$2 = 9;
const TEVET$2 = 10;
const SHVAT$1 = 11;
const ADAR_I$2 = 12;
const ADAR_II$2 = 13;
/**
 * Hebrew months of the year (NISAN=1, TISHREI=7)
 * @readonly
 * @enum {number}
 */
const months = {
  /** Nissan / ניסן */
  NISAN: NISAN$4,
  /** Iyyar / אייר */
  IYYAR: IYYAR$1,
  /** Sivan / סיון */
  SIVAN: SIVAN$1,
  /** Tamuz (sometimes Tammuz) / תמוז */
  TAMUZ: TAMUZ$1,
  /** Av / אב */
  AV: AV$1,
  /** Elul / אלול */
  ELUL: ELUL$1,
  /** Tishrei / תִּשְׁרֵי */
  TISHREI: TISHREI$3,
  /** Cheshvan / חשון */
  CHESHVAN: CHESHVAN$1,
  /** Kislev / כסלו */
  KISLEV: KISLEV$2,
  /** Tevet / טבת */
  TEVET: TEVET$2,
  /** Sh'vat / שבט */
  SHVAT: SHVAT$1,
  /** Adar or Adar Rishon / אדר */
  ADAR_I: ADAR_I$2,
  /** Adar Sheini (only on leap years) / אדר ב׳ */
  ADAR_II: ADAR_II$2
};
const monthNames0 = ['', 'Nisan', 'Iyyar', 'Sivan', 'Tamuz', 'Av', 'Elul', 'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', "Sh'vat"];
/**
 * Transliterations of Hebrew month names.
 * Regular years are index 0 and leap years are index 1.
 * @private
 */
const monthNames = [monthNames0.concat(['Adar', 'Nisan']), monthNames0.concat(['Adar I', 'Adar II', 'Nisan'])];
const edCache = new Map();
const EPOCH = -1373428;
// Avg year length in the cycle (19 solar years with 235 lunar months)
const AVG_HEBYEAR_DAYS = 365.24682220597794;
/**
 * @private
 */
function assertNumber(n, name) {
  if (typeof n !== 'number' || isNaN(n)) {
    throw new TypeError(`invalid parameter '${name}' not a number: ${n}`);
  }
}
/**
 * Converts Hebrew date to R.D. (Rata Die) fixed days.
 * R.D. 1 is the imaginary date Monday, January 1, 1 on the Gregorian
 * Calendar.
 * @param year Hebrew year
 * @param month Hebrew month
 * @param day Hebrew date (1-30)
 */
function hebrew2abs(year, month, day) {
  assertNumber(year, 'year');
  assertNumber(month, 'month');
  assertNumber(day, 'day');
  if (year < 1) {
    throw new RangeError(`hebrew2abs: invalid year ${year}`);
  }
  let tempabs = day;
  if (month < TISHREI$3) {
    for (let m = TISHREI$3; m <= monthsInYear(year); m++) {
      tempabs += daysInMonth(m, year);
    }
    for (let m = NISAN$4; m < month; m++) {
      tempabs += daysInMonth(m, year);
    }
  } else {
    for (let m = TISHREI$3; m < month; m++) {
      tempabs += daysInMonth(m, year);
    }
  }
  return EPOCH + elapsedDays(year) + tempabs - 1;
}
/**
 * @private
 */
function newYear(year) {
  return EPOCH + elapsedDays(year);
}
/**
 * Converts absolute R.D. days to Hebrew date
 * @param abs absolute R.D. days
 */
function abs2hebrew(abs) {
  assertNumber(abs, 'abs');
  abs = Math.trunc(abs);
  if (abs <= EPOCH) {
    throw new RangeError(`abs2hebrew: ${abs} is before epoch`);
  }
  // first, quickly approximate year
  let year = Math.floor((abs - EPOCH) / AVG_HEBYEAR_DAYS);
  while (newYear(year) <= abs) {
    ++year;
  }
  --year;
  let month = abs < hebrew2abs(year, 1, 1) ? 7 : 1;
  while (abs > hebrew2abs(year, month, daysInMonth(month, year))) {
    ++month;
  }
  const day = 1 + abs - hebrew2abs(year, month, 1);
  return {
    yy: year,
    mm: month,
    dd: day
  };
}
/**
 * Returns true if Hebrew year is a leap year
 * @param year Hebrew year
 */
function isLeapYear(year) {
  return (1 + year * 7) % 19 < 7;
}
/**
 * Number of months in this Hebrew year (either 12 or 13 depending on leap year)
 * @param year Hebrew year
 */
function monthsInYear(year) {
  return 12 + +isLeapYear(year); // boolean is cast to 1 or 0
}
/**
 * Number of days in Hebrew month in a given year (29 or 30)
 * @param month Hebrew month (e.g. months.TISHREI)
 * @param year Hebrew year
 */
function daysInMonth(month, year) {
  switch (month) {
    case IYYAR$1:
    case TAMUZ$1:
    case ELUL$1:
    case TEVET$2:
    case ADAR_II$2:
      return 29;
  }
  if (month === ADAR_I$2 && !isLeapYear(year) || month === CHESHVAN$1 && !longCheshvan(year) || month === KISLEV$2 && shortKislev(year)) {
    return 29;
  } else {
    return 30;
  }
}
/**
 * Returns a transliterated string name of Hebrew month in year,
 * for example 'Elul' or 'Cheshvan'.
 * @param month Hebrew month (e.g. months.TISHREI)
 * @param year Hebrew year
 */
function getMonthName(month, year) {
  assertNumber(month, 'month');
  assertNumber(year, 'year');
  if (month < 1 || month > 14) {
    throw new TypeError(`bad month argument ${month}`);
  }
  return monthNames[+isLeapYear(year)][month];
}
/**
 * Days from sunday prior to start of Hebrew calendar to mean
 * conjunction of Tishrei in Hebrew YEAR
 * @param year Hebrew year
 */
function elapsedDays(year) {
  const n = edCache.get(year);
  if (typeof n === 'number') {
    return n;
  }
  const elapsed = elapsedDays0(year);
  edCache.set(year, elapsed);
  return elapsed;
}
/**
 * Days from sunday prior to start of Hebrew calendar to mean
 * conjunction of Tishrei in Hebrew YEAR
 * @private
 * @param year Hebrew year
 */
function elapsedDays0(year) {
  const prevYear = year - 1;
  const mElapsed = 235 * Math.floor(prevYear / 19) +
  // Months in complete 19 year lunar (Metonic) cycles so far
  12 * (prevYear % 19) +
  // Regular months in this cycle
  Math.floor((prevYear % 19 * 7 + 1) / 19); // Leap months this cycle
  const pElapsed = 204 + 793 * (mElapsed % 1080);
  const hElapsed = 5 + 12 * mElapsed + 793 * Math.floor(mElapsed / 1080) + Math.floor(pElapsed / 1080);
  const parts = pElapsed % 1080 + 1080 * (hElapsed % 24);
  const day = 1 + 29 * mElapsed + Math.floor(hElapsed / 24);
  let altDay = day;
  if (parts >= 19440 || 2 === day % 7 && parts >= 9924 && !isLeapYear(year) || 1 === day % 7 && parts >= 16789 && isLeapYear(prevYear)) {
    altDay++;
  }
  if (altDay % 7 === 0 || altDay % 7 === 3 || altDay % 7 === 5) {
    return altDay + 1;
  } else {
    return altDay;
  }
}
/**
 * Number of days in the hebrew YEAR.
 * A common Hebrew calendar year can have a length of 353, 354 or 355 days
 * A leap Hebrew calendar year can have a length of 383, 384 or 385 days
 * @param year Hebrew year
 */
function daysInYear(year) {
  return elapsedDays(year + 1) - elapsedDays(year);
}
/**
 * true if Cheshvan is long in Hebrew year
 * @param year Hebrew year
 */
function longCheshvan(year) {
  return daysInYear(year) % 10 === 5;
}
/**
 * true if Kislev is short in Hebrew year
 * @param year Hebrew year
 */
function shortKislev(year) {
  return daysInYear(year) % 10 === 3;
}
/**
 * Converts Hebrew month string name to numeric
 * @param monthName monthName
 */
function monthFromName(monthName) {
  if (typeof monthName === 'number') {
    if (isNaN(monthName) || monthName < 1 || monthName > 14) {
      throw new RangeError(`Invalid month name: ${monthName}`);
    }
    return monthName;
  }
  let c = monthName.trim().toLowerCase();
  // If Hebrew month starts with a bet (for example `בתמוז`) then ignore it
  if (c[0] === 'ב') {
    c = c.substring(1);
  }
  /*
  the Hebrew months are unique to their second letter
  N         Nisan  (November?)
  I         Iyyar
  E        Elul
  C        Cheshvan
  K        Kislev
  1        1Adar
  2        2Adar
  Si Sh     Sivan, Shvat
  Ta Ti Te Tamuz, Tishrei, Tevet
  Av Ad    Av, Adar
     אב אד אי אל   אב אדר אייר אלול
  ח            חשון
  ט            טבת
  כ            כסלו
  נ            ניסן
  ס            סיון
  ש            שבט
  תמ תש        תמוז תשרי
  */
  switch (c[0]) {
    case 'n':
    case 'נ':
      if (c[1] === 'o') {
        break; /* this catches "november" */
      }
      return NISAN$4;
    case 'i':
      return IYYAR$1;
    case 'e':
      return ELUL$1;
    case 'c':
    case 'ח':
      return CHESHVAN$1;
    case 'k':
    case 'כ':
      return KISLEV$2;
    case 's':
      switch (c[1]) {
        case 'i':
          return SIVAN$1;
        case 'h':
          return SHVAT$1;
      }
      break;
    case 't':
      switch (c[1]) {
        case 'a':
          return TAMUZ$1;
        case 'i':
          return TISHREI$3;
        case 'e':
          return TEVET$2;
      }
      break;
    case 'a':
      switch (c[1]) {
        case 'v':
          return AV$1;
        case 'd':
          if (/(1|[^i]i|a|א)$/i.test(monthName)) {
            return ADAR_I$2;
          }
          return ADAR_II$2;
      }
      break;
    case 'ס':
      return SIVAN$1;
    case 'ט':
      return TEVET$2;
    case 'ש':
      return SHVAT$1;
    case 'א':
      switch (c[1]) {
        case 'ב':
          return AV$1;
        case 'ד':
          if (/(1|[^i]i|a|א)$/i.test(monthName)) {
            return ADAR_I$2;
          }
          return ADAR_II$2;
        // else assume sheini
        case 'י':
          return IYYAR$1;
        case 'ל':
          return ELUL$1;
      }
      break;
    case 'ת':
      switch (c[1]) {
        case 'מ':
          return TAMUZ$1;
        case 'ש':
          return TISHREI$3;
      }
      break;
  }
  throw new RangeError(`Unable to parse month name: ${monthName}`);
}

const NISAN$3 = months.NISAN;
const CHESHVAN = months.CHESHVAN;
const KISLEV$1 = months.KISLEV;
const TEVET$1 = months.TEVET;
const SHVAT = months.SHVAT;
const ADAR_I$1 = months.ADAR_I;
const ADAR_II$1 = months.ADAR_II;
/**
 * Returns true if the object is a SimpleHebrewDate
 * @private
 */
function isSimpleHebrewDate$1(obj) {
  return typeof obj === 'object' && obj !== null && typeof obj.yy === 'number' && typeof obj.mm === 'number' && typeof obj.dd === 'number';
}
/**
 * @private
 */
function toSimpleHebrewDate(obj) {
  if (isSimpleHebrewDate$1(obj)) {
    return obj;
  } else if (isDate(obj)) {
    const abs = greg2abs(obj);
    return abs2hebrew(abs);
  } else {
    // typeof obj === 'number'
    return abs2hebrew(obj);
  }
}
function getYahrzeitHD(hyear, date) {
  let hDeath = toSimpleHebrewDate(date);
  if (hyear <= hDeath.yy) {
    // Hebrew year ${hyear} occurs on or before original date in ${hDeath.yy}
    return undefined;
  }
  if (hDeath.mm === CHESHVAN && hDeath.dd === 30 && !longCheshvan(hDeath.yy + 1)) {
    // If it's Heshvan 30 it depends on the first anniversary;
    // if that was not Heshvan 30, use the day before Kislev 1.
    hDeath = abs2hebrew(hebrew2abs(hyear, KISLEV$1, 1) - 1);
  } else if (hDeath.mm === KISLEV$1 && hDeath.dd === 30 && shortKislev(hDeath.yy + 1)) {
    // If it's Kislev 30 it depends on the first anniversary;
    // if that was not Kislev 30, use the day before Teveth 1.
    hDeath = abs2hebrew(hebrew2abs(hyear, TEVET$1, 1) - 1);
  } else if (hDeath.mm === ADAR_II$1) {
    // If it's Adar II, use the same day in last month of year (Adar or Adar II).
    hDeath.mm = monthsInYear(hyear);
  } else if (hDeath.mm === ADAR_I$1 && hDeath.dd === 30 && !isLeapYear(hyear)) {
    // If it's the 30th in Adar I and year is not a leap year
    // (so Adar has only 29 days), use the last day in Shevat.
    hDeath.dd = 30;
    hDeath.mm = SHVAT;
  }
  // In all other cases, use the normal anniversary of the date of death.
  // advance day to rosh chodesh if needed
  if (hDeath.mm === CHESHVAN && hDeath.dd === 30 && !longCheshvan(hyear)) {
    hDeath.mm = KISLEV$1;
    hDeath.dd = 1;
  } else if (hDeath.mm === KISLEV$1 && hDeath.dd === 30 && shortKislev(hyear)) {
    hDeath.mm = TEVET$1;
    hDeath.dd = 1;
  }
  hDeath.yy = hyear;
  return hDeath;
}
function getBirthdayHD(hyear, date) {
  const orig = toSimpleHebrewDate(date);
  const origYear = orig.yy;
  if (hyear === origYear) {
    return orig;
  } else if (hyear < origYear) {
    // Hebrew year ${hyear} occurs on or before original date in ${origYear}
    return undefined;
  }
  const isOrigLeap = isLeapYear(origYear);
  let month = orig.mm;
  let day = orig.dd;
  if (month === ADAR_I$1 && !isOrigLeap || month === ADAR_II$1 && isOrigLeap) {
    month = monthsInYear(hyear);
  } else if (month === CHESHVAN && day === 30 && !longCheshvan(hyear)) {
    month = KISLEV$1;
    day = 1;
  } else if (month === KISLEV$1 && day === 30 && shortKislev(hyear)) {
    month = TEVET$1;
    day = 1;
  } else if (month === ADAR_I$1 && day === 30 && isOrigLeap && !isLeapYear(hyear)) {
    month = NISAN$3;
    day = 1;
  }
  return {
    yy: hyear,
    mm: month,
    dd: day
  };
}

const GERESH = '׳';
const GERSHAYIM = '״';
const alefbet = {
  א: 1,
  ב: 2,
  ג: 3,
  ד: 4,
  ה: 5,
  ו: 6,
  ז: 7,
  ח: 8,
  ט: 9,
  י: 10,
  כ: 20,
  ל: 30,
  מ: 40,
  נ: 50,
  ס: 60,
  ע: 70,
  פ: 80,
  צ: 90,
  ק: 100,
  ר: 200,
  ש: 300,
  ת: 400
};
const heb2num = new Map();
const num2heb = new Map();
for (const [key, val] of Object.entries(alefbet)) {
  heb2num.set(key, val);
  num2heb.set(val, key);
}
function num2digits(num) {
  const digits = [];
  while (num > 0) {
    if (num === 15 || num === 16) {
      digits.push(9);
      digits.push(num - 9);
      break;
    }
    let incr = 100;
    let i;
    for (i = 400; i > num; i -= incr) {
      if (i === incr) {
        incr = incr / 10;
      }
    }
    digits.push(i);
    num -= i;
  }
  return digits;
}
/**
 * Converts a numerical value to a string of Hebrew letters.
 *
 * When specifying years of the Hebrew calendar in the present millennium,
 * we omit the thousands (which is presently 5 [ה]).
 * @example
 * gematriya(5774) // 'תשע״ד' - cropped to 774
 * gematriya(25) // 'כ״ה'
 * gematriya(60) // 'ס׳'
 * gematriya(3761) // 'ג׳תשס״א'
 * gematriya(1123) // 'א׳קכ״ג'
 */
function gematriya(num) {
  const num0 = num;
  const num1 = parseInt(num0, 10);
  if (!num1 || num1 < 0) {
    throw new TypeError(`invalid gematriya number: ${num}`);
  }
  let str = '';
  const thousands = Math.floor(num1 / 1000);
  if (thousands > 0 && thousands !== 5) {
    const tdigits = num2digits(thousands);
    for (const tdig of tdigits) {
      str += num2heb.get(tdig);
    }
    str += GERESH;
  }
  const digits = num2digits(num1 % 1000);
  if (digits.length === 1) {
    return str + num2heb.get(digits[0]) + GERESH;
  }
  for (let i = 0; i < digits.length; i++) {
    if (i + 1 === digits.length) {
      str += GERSHAYIM;
    }
    str += num2heb.get(digits[i]);
  }
  return str;
}
/**
 * Converts a string of Hebrew letters to a numerical value.
 *
 * Only considers the value of Hebrew letters `א` through `ת`.
 * Ignores final Hebrew letters such as `ך` (kaf sofit) or `ם` (mem sofit)
 * and vowels (nekudot).
 */
function gematriyaStrToNum(str) {
  let num = 0;
  const gereshIdx = str.indexOf(GERESH);
  if (gereshIdx !== -1 && gereshIdx !== str.length - 1) {
    const thousands = str.substring(0, gereshIdx);
    num += gematriyaStrToNum(thousands) * 1000;
    str = str.substring(gereshIdx);
  }
  for (const ch of str) {
    const n = heb2num.get(ch);
    if (typeof n === 'number') {
      num += n;
    }
  }
  return num;
}

const sefirot = {
  en: {
    infix: 'within ',
    infix26: 'within ',
    words: ['', 'Lovingkindness', 'Might', 'Beauty', 'Eternity', 'Splendor', 'Foundation', 'Majesty']
  },
  he: {
    infix: 'שֶׁבְּ',
    infix26: 'שֶׁבִּ',
    words: ['', 'חֶֽסֶד', 'גְבוּרָה', 'תִּפאֶרֶת', 'נֶּֽצַח', 'הוֹד', 'יְּסוֹד', 'מַּלְכוּת']
  },
  translit: {
    infix: "sheb'",
    infix26: 'shebi',
    words: ['', 'Chesed', 'Gevurah', 'Tiferet', 'Netzach', 'Hod', 'Yesod', 'Malkhut']
  }
};
function checkDay(omerDay) {
  if (omerDay < 1 || omerDay > 49) {
    throw new RangeError(`Invalid Omer day ${omerDay}`);
  }
}
function getWeeks(omerDay) {
  const weekNum = Math.floor((omerDay - 1) / 7) + 1;
  const daysWithinWeeks = omerDay % 7 || 7;
  return [weekNum, daysWithinWeeks];
}
/**
 * Returns the sefira. For example, on day 8
 *  חֶֽסֶד שֶׁבִּגְבוּרָה
 *  Chesed shebiGevurah
 *  Lovingkindness within Might
 * @param omerDay the day of the omer, 1-49 inclusive
 * @param lang `en` (English), `he` (Hebrew with nikud), or `translit` (Hebrew in Sephardic transliteration)
 * @returns a string such as `Lovingkindness within Might` or `חֶֽסֶד שֶׁבִּגְבוּרָה`
 */
function omerSefira(omerDay, lang) {
  checkDay(omerDay);
  const [weekNum, daysWithinWeeks] = getWeeks(omerDay);
  const config = sefirot[lang];
  const week = config.words[weekNum];
  const dayWithinWeek = config.words[daysWithinWeeks];
  const infix = weekNum === 2 || weekNum === 6 ? config.infix26 : config.infix;
  return (dayWithinWeek + ' ' + infix + week).normalize();
}
/**
 * Returns a sentence with that evening's omer count
 * @param omerDay the day of the omer, 1-49 inclusive
 * @param lang `en` (English), `he` (Hebrew with nikud)
 * @returns a string such as `Today is 10 days, which is 1 week and 3 days of the Omer`
 *  or `הַיוֹם עֲשָׂרָה יָמִים, שְׁהֵם שָׁבוּעַ אֶחָד וְשְׁלוֹשָׁה יָמִים לָעוֹמֶר`
 */
function omerTodayIs(omerDay, lang) {
  checkDay(omerDay);
  if (lang === 'he') {
    return omerTodayIsHe(omerDay);
  } else {
    return omerTodayIsEn(omerDay);
  }
}
function omerTodayIsEn(omerDay) {
  const [weekNumber, daysWithinWeeks] = getWeeks(omerDay);
  const totalDaysStr = omerDay === 1 ? 'day' : 'days';
  let str = `Today is ${omerDay} ${totalDaysStr}`;
  if (weekNumber > 1 || omerDay === 7) {
    const day7 = daysWithinWeeks === 7;
    const numWeeks = day7 ? weekNumber : weekNumber - 1;
    const weeksStr = numWeeks === 1 ? 'week' : 'weeks';
    str += `, which is ${numWeeks} ${weeksStr}`;
    if (!day7) {
      const daysStr = daysWithinWeeks === 1 ? 'day' : 'days';
      str += ` and ${daysWithinWeeks} ${daysStr}`;
    }
  }
  return str + ' of the Omer';
}
// adapted from pip hdate package (GPL)
// https://github.com/py-libhdate/py-libhdate/blob/master/hdate/date.py
const tens = ['', 'עֲשָׂרָה', 'עֶשְׂרִים', 'שְׁלוֹשִׁים', 'אַרְבָּעִים'];
const ones = ['', 'אֶחָד', 'שְׁנַיִם', 'שְׁלוֹשָׁה', 'אַרְבָּעָה', 'חֲמִשָּׁה', 'שִׁשָּׁה', 'שִׁבְעָה', 'שְׁמוֹנָה', 'תִּשְׁעָה'];
const shnei = 'שְׁנֵי';
const yamim = 'יָמִים';
const shneiYamim = shnei + ' ' + yamim;
const shavuot = 'שָׁבוּעוֹת';
const yom = 'יוֹם';
const yomEchad = yom + ' ' + ones[1];
const asar = 'עָשָׂר';
function omerTodayIsHe(omerDay) {
  const ten = Math.floor(omerDay / 10);
  const one = omerDay % 10;
  let str = 'הַיּוֹם ';
  if (omerDay === 11) {
    str += 'אַחַד ' + asar;
  } else if (omerDay === 12) {
    str += 'שְׁנֵים ' + asar;
  } else if (12 < omerDay && omerDay < 20) {
    str += ones[one] + ' ' + asar;
  } else if (omerDay > 9) {
    str += ones[one];
    if (one) {
      str += ' ';
      str += ten === 3 ? 'וּ' : 'וְ';
    }
  }
  if (omerDay > 2) {
    if (omerDay > 20 || omerDay === 10 || omerDay === 20) {
      str += tens[ten];
    }
    if (omerDay < 11) {
      str += ones[one] + ' ' + yamim + ' ';
    } else {
      str += ' ' + yom + ' ';
    }
  } else if (omerDay === 1) {
    str += yomEchad + ' ';
  } else {
    // omer == 2
    str += shneiYamim + ' ';
  }
  if (omerDay > 6) {
    str = str.trim(); // remove trailing space before comma
    str += ', שְׁהֵם ';
    const weeks = Math.floor(omerDay / 7);
    const days = omerDay % 7;
    if (weeks > 2) {
      str += ones[weeks] + ' ' + shavuot + ' ';
    } else if (weeks === 1) {
      str += 'שָׁבֽוּעַ' + ' ' + ones[1] + ' ';
    } else {
      // weeks == 2
      str += shnei + ' ' + shavuot + ' ';
    }
    if (days) {
      if (days === 2 || days === 3) {
        str += 'וּ';
      } else if (days === 5) {
        str += 'וַ';
      } else {
        str += 'וְ';
      }
      if (days > 2) {
        str += ones[days] + ' ' + yamim + ' ';
      } else if (days === 1) {
        str += yomEchad + ' ';
      } else {
        // days == 2
        str += shneiYamim + ' ';
      }
    }
  }
  str += 'לָעֽוֹמֶר';
  return str.normalize();
}
/**
 * Returns an emoji number symbol with a circle, for example `㊲`
 *  from the “Enclosed CJK Letters and Months” block of the Unicode standard
 * @param omerDay the day of the omer, 1-49 inclusive
 * @returns a single Unicode character from `①` through `㊾`
 */
function omerEmoji(omerDay) {
  checkDay(omerDay);
  let codePoint;
  if (omerDay <= 20) {
    codePoint = 9312 + omerDay - 1;
  } else if (omerDay <= 35) {
    // between 21 and 35 inclusive
    codePoint = 12881 + omerDay - 21;
  } else {
    // between 36 and 49 inclusive
    codePoint = 12977 + omerDay - 36;
  }
  return String.fromCodePoint(codePoint);
}

/**
 * Calculates the molad for a Hebrew month
 */
function molad(year, month) {
  let m_adj = month - 7;
  if (m_adj < 0) {
    m_adj += monthsInYear(year);
  }
  const mElapsed = 235 * Math.floor((year - 1) / 19) +
  // Months in complete 19 year lunar (Metonic) cycles so far
  12 * ((year - 1) % 19) +
  // Regular months in this cycle
  Math.floor((7 * ((year - 1) % 19) + 1) / 19) +
  // Leap months this cycle
  m_adj; // add elapsed months till the start of the molad of the month
  const pElapsed = 204 + Math.floor(793 * (mElapsed % 1080));
  const hElapsed = 5 + 12 * mElapsed + 793 * Math.floor(mElapsed / 1080) + Math.floor(pElapsed / 1080) - 6;
  const parts = pElapsed % 1080 + 1080 * (hElapsed % 24);
  const chalakim = parts % 1080;
  const day = 1 + 29 * mElapsed + Math.floor(hElapsed / 24);
  return {
    year,
    month,
    dayOfWeek: day % 7,
    hour: hElapsed % 24,
    minutes: Math.floor(chalakim / 18),
    chalakim: chalakim % 18
  };
}

/**
 * Formats a number with leading zeros so the resulting string is 4 digits long.
 * Similar to `string.padStart(4, '0')` but will also format
 * negative numbers similar to how the JavaScript date formats
 * negative year numbers (e.g. `-37` is formatted as `-000037`).
 */
function pad4(num) {
  if (num < 0) {
    return '-00' + pad4(-num);
  } else if (num < 10) {
    return '000' + num;
  } else if (num < 100) {
    return '00' + num;
  } else if (num < 1000) {
    return '0' + num;
  }
  return String(num);
}
/**
 * Formats a number with leading zeros so the resulting string is 2 digits long.
 * Similar to `string.padStart(2, '0')`.
 */
function pad2(num) {
  if (num >= 0 && num < 10) {
    return '0' + num;
  }
  return String(num);
}

const _formatters = new Map();
/**
 * @private
 */
function getFormatter$1(tzid) {
  const fmt = _formatters.get(tzid);
  if (fmt) return fmt;
  const f = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: tzid
  });
  _formatters.set(tzid, f);
  return f;
}
const dateFormatRegex = /^(\d+).(\d+).(\d+),?\s+(\d+).(\d+).(\d+)/;
/**
 * Returns a string similar to `Date.toISOString()` but in the
 * timezone `tzid`. Contrary to the typical meaning of `Z` at the end
 * of the string, this is not actually a UTC date.
 */
function getPseudoISO(tzid, date) {
  const str = getFormatter$1(tzid).format(date);
  const m = dateFormatRegex.exec(str);
  if (m === null) {
    throw new Error(`Unable to parse formatted string: ${str}`);
  }
  let hour = m[4];
  if (hour === '24') {
    hour = '00';
  }
  m[3] = pad4(parseInt(m[3], 10));
  return `${m[3]}-${m[1]}-${m[2]}T${hour}:${m[5]}:${m[6]}Z`;
}
/**
 * Returns number of minutes `tzid` is offset from UTC on date `date`.
 */
function getTimezoneOffset(tzid, date) {
  const utcStr = getPseudoISO('UTC', date);
  const localStr = getPseudoISO(tzid, date);
  const diffMs = new Date(utcStr).getTime() - new Date(localStr).getTime();
  return Math.ceil(diffMs / 1000 / 60);
}
/**
 * Returns YYYY-MM-DD in the local timezone
 */
function isoDateString(dt) {
  return pad4(dt.getFullYear()) + '-' + pad2(dt.getMonth() + 1) + '-' + pad2(dt.getDate());
}

var poAshkenazi$1 = {
  "headers": {
    "plural-forms": "nplurals=2; plural=(n > 1);"
  },
  "contexts": {
    "": {
      "Tevet": ["Teves"]
    }
  }
};

var poHe$1 = {
  "headers": {
    "plural-forms": "nplurals=2; plural=(n > 1);"
  },
  "contexts": {
    "": {
      "Adar": ["אַדָר"],
      "Adar I": ["אַדָר א׳"],
      "Adar II": ["אַדָר ב׳"],
      "Av": ["אָב"],
      "Cheshvan": ["חֶשְׁוָן"],
      "Elul": ["אֱלוּל"],
      "Iyyar": ["אִיָיר"],
      "Kislev": ["כִּסְלֵו"],
      "Nisan": ["נִיסָן"],
      "Sh'vat": ["שְׁבָט"],
      "Sivan": ["סִיוָן"],
      "Tamuz": ["תַּמּוּז"],
      "Tevet": ["טֵבֵת"],
      "Tishrei": ["תִּשְׁרֵי"]
    }
  }
};

const noopLocale = {
  headers: {
    'plural-forms': 'nplurals=2; plural=(n!=1);'
  },
  contexts: {
    '': {}
  }
};
const alias = {
  h: 'he',
  a: 'ashkenazi',
  s: 'en',
  '': 'en'
};
/** @private */
const locales = new Map();
/** @private */
let activeLocale;
/** @private */
let activeName;
/** @private */
function getEnOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
/** @private */
function checkLocale(locale) {
  if (typeof locale !== 'string') {
    throw new TypeError(`Invalid locale name: ${locale}`);
  }
  return locale.toLowerCase();
}
/** @private */
function getExistingLocale(locale) {
  const locale1 = checkLocale(locale);
  const loc = locales.get(locale1);
  if (!loc) {
    throw new RangeError(`Locale '${locale}' not found`);
  }
  return loc;
}
/**
 * A locale in Hebcal is used for translations/transliterations of
 * holidays. `@hebcal/hdate` supports four locales by default
 * * `en` - default, Sephardic transliterations (e.g. "Shabbat")
 * * `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
 * * `he` - Hebrew (e.g. "שַׁבָּת")
 * * `he-x-NoNikud` - Hebrew without nikud (e.g. "שבת")
 */
class Locale {
  /**
   * Returns translation only if `locale` offers a non-empty translation for `id`.
   * Otherwise, returns `undefined`.
   * @param id Message ID to translate
   * @param [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   */
  static lookupTranslation(id, locale) {
    const loc = typeof locale === 'string' && locales.get(locale.toLowerCase()) || activeLocale;
    const array = loc[id];
    if ((array === null || array === void 0 ? void 0 : array.length) && array[0].length) {
      return array[0];
    }
    return undefined;
  }
  /**
   * By default, if no translation was found, returns `id`.
   * @param id Message ID to translate
   * @param [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   */
  static gettext(id, locale) {
    const text = this.lookupTranslation(id, locale);
    if (typeof text === 'undefined') {
      return id;
    }
    return text;
  }
  /**
   * Register locale translations.
   * @param locale Locale name (i.e.: `'he'`, `'fr'`)
   * @param data parsed data from a `.po` file.
   */
  static addLocale(locale, data) {
    locale = checkLocale(locale);
    if (typeof data.contexts !== 'object' || typeof data.contexts[''] !== 'object') {
      throw new TypeError(`Locale '${locale}' invalid compact format`);
    }
    locales.set(locale, data.contexts['']);
  }
  /**
   * Adds a translation to `locale`, replacing any previous translation.
   * @param locale Locale name (i.e: `'he'`, `'fr'`).
   * @param id Message ID to translate
   * @param translation Translation text
   */
  static addTranslation(locale, id, translation) {
    const loc = getExistingLocale(locale);
    if (typeof id !== 'string' || id.length === 0) {
      throw new TypeError(`Invalid id string: ${id}`);
    }
    const isArray = Array.isArray(translation);
    if (isArray) {
      const t0 = translation[0];
      if (typeof t0 !== 'string' || t0.length === 0) {
        throw new TypeError(`Invalid translation array: ${translation}`);
      }
    } else if (typeof translation !== 'string') {
      throw new TypeError(`Invalid translation string: ${translation}`);
    }
    loc[id] = isArray ? translation : [translation];
  }
  /**
   * Adds multiple translations to `locale`, replacing any previous translations.
   * @param locale Locale name (i.e: `'he'`, `'fr'`).
   * @param data parsed data from a `.po` file.
   */
  static addTranslations(locale, data) {
    const loc = getExistingLocale(locale);
    if (typeof data.contexts !== 'object' || typeof data.contexts[''] !== 'object') {
      throw new TypeError(`Locale '${locale}' invalid compact format`);
    }
    const ctx = data.contexts[''];
    Object.assign(loc, ctx);
  }
  /**
   * Activates a locale. Throws an error if the locale has not been previously added.
   * After setting the locale to be used, all strings marked for translations
   * will be represented by the corresponding translation in the specified locale.
   * @param locale Locale name (i.e: `'he'`, `'fr'`)
   */
  static useLocale(locale) {
    const locale0 = checkLocale(locale);
    const obj = getExistingLocale(locale0);
    activeName = alias[locale0] || locale0;
    activeLocale = obj;
    return activeLocale;
  }
  /**
   * Returns the name of the active locale (i.e. 'he', 'ashkenazi', 'fr')
   */
  static getLocaleName() {
    return activeName;
  }
  /**
   * Returns the names of registered locales
   */
  static getLocaleNames() {
    const keys = Array.from(locales.keys());
    return keys.sort((a, b) => a.localeCompare(b));
  }
  /**
   * Renders a number in ordinal, such as 1st, 2nd or 3rd
   * @param [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   */
  static ordinal(n, locale) {
    const locale1 = locale === null || locale === void 0 ? void 0 : locale.toLowerCase();
    const locale0 = locale1 || activeName;
    if (!locale0) {
      return getEnOrdinal(n);
    }
    switch (locale0) {
      case 'en':
      case 's':
      case 'a':
        return getEnOrdinal(n);
      case 'es':
        return n + 'º';
      case 'h':
      case 'he':
      case 'he-x-nonikud':
        return String(n);
    }
    if (locale0.startsWith('ashkenazi')) {
      return getEnOrdinal(n);
    }
    return n + '.';
  }
  /**
   * Removes nekudot from Hebrew string
   */
  static hebrewStripNikkud(str) {
    return str.replace(/[\u0590-\u05bd]/g, '').replace(/[\u05bf-\u05c7]/g, '');
  }
}
Locale.addLocale('en', noopLocale);
Locale.addLocale('s', noopLocale);
Locale.addLocale('', noopLocale);
Locale.useLocale('en');
/* Ashkenazic transliterations */
Locale.addLocale('ashkenazi', poAshkenazi$1);
Locale.addLocale('a', poAshkenazi$1);
/* Hebrew with nikkud */
Locale.addLocale('he', poHe$1);
Locale.addLocale('h', poHe$1);
/* Hebrew without nikkud */
const heStrs$1 = poHe$1.contexts[''];
const heNoNikud$1 = {};
for (const [key, val] of Object.entries(heStrs$1)) {
  heNoNikud$1[key] = [Locale.hebrewStripNikkud(val[0])];
}
const poHeNoNikud$1 = {
  headers: poHe$1.headers,
  contexts: {
    '': heNoNikud$1
  }
};
Locale.addLocale('he-x-NoNikud', poHeNoNikud$1);

/*
    Hebcal - A Jewish Calendar Generator
    Copyright (c) 1994-2020 Danny Sadinoff
    Portions copyright Eyal Schachter and Michael J. Radwin

    https://github.com/hebcal/hebcal-es6

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
function mod(x, y) {
  return x - y * Math.floor(x / y);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSimpleHebrewDate(obj) {
  return obj.yy !== undefined;
}
const UNITS_DAY = 'day';
const UNITS_WEEK = 'week';
const UNITS_MONTH = 'month';
const UNITS_YEAR = 'year';
/**
 * A `HDate` represents a Hebrew calendar date.
 *
 * An instance of this class encapsulates a date in the Hebrew calendar system.
 * It consists of a year, month, and day, without any associated time or location data.
 * The Hebrew calendar is a lunisolar calendar, meaning it is based on both lunar and solar cycles.
 *
 * A Hebrew date internally stores three numbers:
 * - year: The Hebrew year (1-9999). Counted from the traditional Hebrew date of creation (3761 BCE in the Gregorian calendar)
 * - month: The Hebrew month (1-13). Month 1 is Nisan, month 7 is Tishrei. There are 12 months in a regular year and 13 months in a leap year.
 * - day: The day of the month (1-30)
 *
 * This class uses Rata Die to convert between the Hebrew and Gregorian calendars.
 *
 * To calculate times of day, use `Zmanim` class from `@hebcal/core`
 * @see {@link https://en.wikipedia.org/wiki/Rata_Die | Rata Die}
 * @see {@link https://hebcal.github.io/api/core/classes/Zmanim.html | Zmanim}
 */
class HDate {
  /**
   * Create a Hebrew date. There are 3 basic forms for the `HDate()` constructor.
   *
   * 1. No parameters - represents the current Hebrew date at time of instantiation
   * 2. One parameter
   *    * `Date` - represents the Hebrew date corresponding to the Gregorian date using
   *       local time. Hours, minutes, seconds and milliseconds are ignored.
   *    * `HDate` - clones a copy of the given Hebrew date
   *    * `number` - Converts absolute R.D. days to Hebrew date.
   *       R.D. 1 == the imaginary date January 1, 1 (Gregorian)
   * 3. Three parameters: Hebrew day, Hebrew month, Hebrew year. Hebrew day should
   *    be a number between 1-30, Hebrew month can be a number or string, and
   *    Hebrew year is always a number.
   * @example
   * import {HDate, months} from '@hebcal/hdate';
   *
   * const hd1 = new HDate();
   * const hd2 = new HDate(new Date(2008, 10, 13));
   * const hd3 = new HDate(15, 'Cheshvan', 5769);
   * const hd4 = new HDate(15, months.CHESHVAN, 5769);
   * const hd5 = new HDate(733359); // ==> 15 Cheshvan 5769
   * const monthName = 'אייר';
   * const hd6 = new HDate(5, monthName, 5773);
   * @param [day] - Day of month (1-30) if a `number`.
   *   If a `Date` is specified, represents the Hebrew date corresponding to the
   *   Gregorian date using local time.
   *   If an `HDate` is specified, clones a copy of the given Hebrew date.
   * @param [month] - Hebrew month of year (1=NISAN, 7=TISHREI)
   * @param [year] - Hebrew year
   */
  constructor(day, month, year) {
    if (arguments.length === 2 || arguments.length > 3) {
      throw new TypeError('HDate constructor requires 0, 1 or 3 arguments');
    }
    if (arguments.length === 3) {
      // Hebrew day, Hebrew month, Hebrew year
      this.dd = this.mm = 1;
      const yy = typeof year === 'string' ? parseInt(year, 10) : year;
      if (isNaN(yy)) {
        throw new TypeError(`HDate called with bad year argument: ${year}`);
      }
      this.yy = yy;
      setMonth(this, month); // will throw if we can't parse
      const dd = typeof day === 'string' ? parseInt(day, 10) : day;
      if (isNaN(dd)) {
        throw new TypeError(`HDate called with bad day argument: ${day}`);
      }
      setDate(this, dd);
    } else {
      // 0 arguments
      if (typeof day === 'undefined' || day === null) {
        day = new Date();
      }
      // 1 argument
      const abs0 = typeof day === 'number' && !isNaN(day) ? day : isDate(day) ? greg2abs(day) : isSimpleHebrewDate(day) ? day : null;
      if (abs0 === null) {
        throw new TypeError(`HDate called with bad argument: ${day}`);
      }
      const isNumber = typeof abs0 === 'number';
      const d = isNumber ? abs2hebrew(abs0) : abs0;
      this.yy = d.yy;
      this.mm = d.mm;
      this.dd = d.dd;
      if (isNumber) {
        this.rd = abs0;
      }
    }
  }
  /**
   * Returns the Hebrew year of this Hebrew date
   * @returns an integer >= 1
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.getFullYear(); // 5769
   */
  getFullYear() {
    return this.yy;
  }
  /**
   * Returns `true` if this Hebrew date occurs during a Hebrew leap year
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.isLeapYear(); // false
   */
  isLeapYear() {
    return isLeapYear(this.yy);
  }
  /**
   * Returns the Hebrew month (1=NISAN, 7=TISHREI) of this Hebrew date
   * @returns an integer 1-13
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.getMonth(); // 8
   */
  getMonth() {
    return this.mm;
  }
  /**
   * The Tishrei-based month of this Hebrew date. 1 is Tishrei, 7 is Nisan, 13 is Elul in a leap year
   * @returns an integer 1-13
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.getTishreiMonth(); // 2
   */
  getTishreiMonth() {
    const nummonths = monthsInYear(this.getFullYear());
    return (this.getMonth() + nummonths - 6) % nummonths || nummonths;
  }
  /**
   * Number of days in the month of this Hebrew date (29 or 30)
   * @returns an integer 29-30
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.daysInMonth(); // 29
   */
  daysInMonth() {
    return daysInMonth(this.getMonth(), this.getFullYear());
  }
  /**
   * Gets the day within the month (1-30)
   * @returns an integer 1-30
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.getDate(); // 15
   */
  getDate() {
    return this.dd;
  }
  /**
   * Returns the day of the week for this Hebrew date,
   * where 0 represents Sunday, 1 represents Monday, 6 represents Saturday.
   *
   * For the day of the month, see `getDate()`
   * @returns an integer 0-6
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.getDate(); // 4
   */
  getDay() {
    return mod(this.abs(), 7);
  }
  /**
   * Converts this Hebrew date to the corresponding Gregorian date.
   * Note that this function returns the daytime portion of the date.
   * For example, the 15th of Cheshvan 5769 began at sundown on
   * 12 November 2008 and continues through 13 November 2008. This
   * function would return only the date 13 November 2008.
   * @example
   * const hd = new HDate(15, 'Cheshvan', 5769);
   * hd.greg(); // 13 November 2008
   */
  greg() {
    return abs2greg(this.abs());
  }
  /**
   * Converts from Hebrew date representation to R.D. (Rata Die) fixed days.
   * R.D. 1 is the imaginary date Monday, January 1, 1 (Gregorian).
   * Note also that R.D. = Julian Date − 1,721,424.5
   * @see {@link https://en.wikipedia.org/wiki/Rata_Die | Rata Die}
   * @example
   * const hd = new HDate(15, 'Cheshvan', 5769);
   * hd.abs(); // 733359
   */
  abs() {
    if (typeof this.rd !== 'number') {
      this.rd = hebrew2abs(this.yy, this.mm, this.dd);
    }
    return this.rd;
  }
  /**
   * Converts Hebrew date to R.D. (Rata Die) fixed days.
   * R.D. 1 is the imaginary date Monday, January 1, 1 on the Gregorian
   * Calendar.
   * @param year Hebrew year
   * @param month Hebrew month (1=NISAN, 7=TISHREI)
   * @param day Hebrew date (1-30)
   * @example
   * import {HDate, months} from '@hebcal/hdate';
   * HDate.hebrew2abs(5769, months.CHESHVAN, 15); // 733359
   */
  static hebrew2abs(year, month, day) {
    return hebrew2abs(year, month, day);
  }
  /**
   * Returns a transliterated Hebrew month name, e.g. `'Elul'` or `'Cheshvan'`.
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.getMonthName(); // 'Cheshvan'
   */
  getMonthName() {
    return getMonthName(this.getMonth(), this.getFullYear());
  }
  /**
   * Renders this Hebrew date as a translated or transliterated string,
   * including ordinal e.g. `'15th of Cheshvan, 5769'`.
   * @example
   * import {HDate, months} from '@hebcal/hdate';
   *
   * const hd = new HDate(15, months.CHESHVAN, 5769);
   * console.log(hd.render('en')); // '15th of Cheshvan, 5769'
   * console.log(hd.render('he')); // '15 חֶשְׁוָן, 5769'
   * console.log(hd.render('en', false)); // '15th of Cheshvan'
   * console.log(hd.render('he', false)); // '15 חֶשְׁוָן'
   * @param [locale] Optional locale name (defaults to active locale).
   * @param [showYear=true] Display year (defaults to true).
   * @see {@link Locale}
   */
  render(locale) {
    let showYear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    const locale0 = locale || Locale.getLocaleName();
    const day = this.getDate();
    const monthName0 = Locale.gettext(this.getMonthName(), locale0);
    const monthName = monthName0.replace(/'/g, '’');
    const nth = Locale.ordinal(day, locale0);
    const dayOf = getDayOfTranslation(locale0);
    const dateStr = `${nth}${dayOf} ${monthName}`;
    if (showYear) {
      const fullYear = this.getFullYear();
      return `${dateStr}, ${fullYear}`;
    } else {
      return dateStr;
    }
  }
  /**
   * Renders this Hebrew date in Hebrew gematriya, regardless of locale.
   * @example
   * import {HDate, months} from '@hebcal/hdate';
   * const hd = new HDate(15, months.CHESHVAN, 5769);
   * hd.renderGematriya(); // 'ט״ו חֶשְׁוָן תשס״ט'
   * hd.renderGematriya(true); // 'ט״ו חשון תשס״ט'
   */
  renderGematriya() {
    let suppressNikud = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const d = this.getDate();
    const locale = suppressNikud ? 'he-x-NoNikud' : 'he';
    const m = Locale.gettext(this.getMonthName(), locale);
    const y = this.getFullYear();
    return gematriya(d) + ' ' + m + ' ' + gematriya(y);
  }
  /**
   * Returns an `HDate` corresponding to the specified day of week
   * **before** this Hebrew date
   * @example
   * new HDate(new Date('Wednesday February 19, 2014')).before(6).greg() // Sat Feb 15 2014
   * @param dayOfWeek day of week: Sunday=0, Saturday=6
   */
  before(dayOfWeek) {
    return onOrBefore(dayOfWeek, this, -1);
  }
  /**
   * Returns an `HDate` corresponding to the specified day of week
   * **on or before** this Hebrew date
   * @example
   * new HDate(new Date('Wednesday February 19, 2014')).onOrBefore(6).greg() // Sat Feb 15 2014
   * new HDate(new Date('Saturday February 22, 2014')).onOrBefore(6).greg() // Sat Feb 22 2014
   * new HDate(new Date('Sunday February 23, 2014')).onOrBefore(6).greg() // Sat Feb 22 2014
   * @param dayOfWeek day of week: Sunday=0, Saturday=6
   */
  onOrBefore(dayOfWeek) {
    return onOrBefore(dayOfWeek, this, 0);
  }
  /**
   * Returns an `HDate` corresponding to the specified day of week
   * **nearest** to this Hebrew date
   * @example
   * new HDate(new Date('Wednesday February 19, 2014')).nearest(6).greg() // Sat Feb 22 2014
   * new HDate(new Date('Tuesday February 18, 2014')).nearest(6).greg() // Sat Feb 15 2014
   * @param dayOfWeek day of week: Sunday=0, Saturday=6
   */
  nearest(dayOfWeek) {
    return onOrBefore(dayOfWeek, this, 3);
  }
  /**
   * Returns an `HDate` corresponding to the specified day of week
   * **on or after** this Hebrew date
   * @example
   * new HDate(new Date('Wednesday February 19, 2014')).onOrAfter(6).greg() // Sat Feb 22 2014
   * new HDate(new Date('Saturday February 22, 2014')).onOrAfter(6).greg() // Sat Feb 22 2014
   * new HDate(new Date('Sunday February 23, 2014')).onOrAfter(6).greg() // Sat Mar 01 2014
   * @param dayOfWeek day of week: Sunday=0, Saturday=6
   */
  onOrAfter(dayOfWeek) {
    return onOrBefore(dayOfWeek, this, 6);
  }
  /**
   * Returns an `HDate` corresponding to the specified day of week
   * **after** this Hebrew date
   * @example
   * new HDate(new Date('Wednesday February 19, 2014')).after(6).greg() // Sat Feb 22 2014
   * new HDate(new Date('Saturday February 22, 2014')).after(6).greg() // Sat Mar 01 2014
   * new HDate(new Date('Sunday February 23, 2014')).after(6).greg() // Sat Mar 01 2014
   * @param dayOfWeek day of week: Sunday=0, Saturday=6
   */
  after(dayOfWeek) {
    return onOrBefore(dayOfWeek, this, 7);
  }
  /**
   * Returns the next Hebrew date
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.next(); // '16 Cheshvan 5769'
   */
  next() {
    return new HDate(this.abs() + 1);
  }
  /**
   * Returns the previous Hebrew date
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.prev(); // '14 Cheshvan 5769'
   */
  prev() {
    return new HDate(this.abs() - 1);
  }
  /**
   * Returns a cloned `HDate` object with a specified amount of time added
   *
   * Units are case insensitive, and support plural and short forms.
   * Note, short forms are case sensitive.
   *
   * | Unit | Shorthand | Description
   * | --- | --- | --- |
   * | `day` | `d` | days |
   * | `week` | `w` | weeks |
   * | `month` | `M` | months |
   * | `year` | `y` | years |
   */
  add(amount) {
    let units = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'd';
    amount = typeof amount === 'string' ? parseInt(amount, 10) : amount;
    if (!amount) {
      return new HDate(this);
    }
    units = standardizeUnits(units);
    if (units === UNITS_DAY) {
      return new HDate(this.abs() + amount);
    } else if (units === UNITS_WEEK) {
      return new HDate(this.abs() + 7 * amount);
    } else if (units === UNITS_YEAR) {
      return new HDate(this.getDate(), this.getMonth(), this.getFullYear() + amount);
    } else {
      // units === UNITS_MONTH
      let hd = new HDate(this);
      const sign = amount > 0 ? 1 : -1;
      amount = Math.abs(amount);
      for (let i = 0; i < amount; i++) {
        hd = new HDate(hd.abs() + sign * hd.daysInMonth());
      }
      return hd;
    }
  }
  /**
   * Returns a cloned `HDate` object with a specified amount of time subracted
   *
   * Units are case insensitive, and support plural and short forms.
   * Note, short forms are case sensitive.
   *
   * | Unit | Shorthand | Description
   * | --- | --- | --- |
   * | `day` | `d` | days |
   * | `week` | `w` | weeks |
   * | `month` | `M` | months |
   * | `year` | `y` | years |
   * @example
   * import {HDate, months} from '@hebcal/hdate';
   *
   * const hd1 = new HDate(15, months.CHESHVAN, 5769);
   * const hd2 = hd1.add(1, 'weeks'); // 7 Kislev 5769
   * const hd3 = hd1.add(-3, 'M'); // 30 Av 5768
   */
  subtract(amount) {
    let units = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'd';
    return this.add(amount * -1, units);
  }
  /**
   * Returns the difference in days between the two given HDates.
   *
   * The result is positive if `this` date is comes chronologically
   * after the `other` date, and negative
   * if the order of the two dates is reversed.
   *
   * The result is zero if the two dates are identical.
   * @example
   * import {HDate, months} from '@hebcal/hdate';
   *
   * const hd1 = new HDate(25, months.KISLEV, 5770);
   * const hd2 = new HDate(15, months.CHESHVAN, 5769);
   * const days = hd1.deltaDays(hd2); // 394
   * @param other Hebrew date to compare
   */
  deltaDays(other) {
    return this.abs() - other.abs();
  }
  /**
   * Compares this Hebrew date to another date, returning `true` if the dates match.
   * @param other Hebrew date to compare
   * @example
   * const hd1 = new HDate(new Date(2008, 10, 13));
   * const hd2 = new HDate(15, 'Cheshvan', 5769);
   * hd1.isSameDate(hd2); // true
   */
  isSameDate(other) {
    return this.yy === other.yy && this.mm === other.mm && this.dd === other.dd;
  }
  /**
   * Returns a string representation of this Hebrew date using English transliterations
   * @example
   * const hd = new HDate(new Date(2008, 10, 13)); // 15 Cheshvan 5769
   * hd.toString(); // '15 Cheshvan 5769'
   */
  toString() {
    const day = this.getDate();
    const fullYear = this.getFullYear();
    const monthName = this.getMonthName();
    return `${day} ${monthName} ${fullYear}`;
  }
  /**
   * Returns true if Hebrew year is a leap year
   * @param year Hebrew year
   * @example
   * HDate.isLeapYear(5783); // false
   * HDate.isLeapYear(5784); // true
   */
  static isLeapYear(year) {
    return isLeapYear(year);
  }
  /**
   * Number of months in this Hebrew year (either 12 or 13 depending on leap year)
   * @param year Hebrew year
   * @example
   * HDate.monthsInYear(5783); // 12
   * HDate.monthsInYear(5784); // 13
   */
  static monthsInYear(year) {
    return monthsInYear(year);
  }
  /**
   * Number of days in Hebrew month in a given year (29 or 30)
   * @param month Hebrew month (e.g. months.TISHREI)
   * @param year Hebrew year
   * @example
   * import {HDate, months} from '@hebcal/hdate';
   * HDate.daysInMonth(months.CHESHVAN, 5769); // 29
   */
  static daysInMonth(month, year) {
    return daysInMonth(month, year);
  }
  /**
   * Returns a transliterated string name of Hebrew month in year,
   * for example 'Elul' or 'Cheshvan'.
   * @param month Hebrew month (e.g. months.TISHREI)
   * @param year Hebrew year
   * @example
   * import {HDate, months} from '@hebcal/hdate';
   * HDate.getMonthName(months.CHESHVAN, 5769); // 'Cheshvan'
   */
  static getMonthName(month, year) {
    return getMonthName(month, year);
  }
  /**
   * Returns the Hebrew month number (NISAN=1, TISHREI=7)
   * @param month A number, or Hebrew month name string
   * @example
   * import {HDate, months} from '@hebcal/hdate';
   * HDate.monthNum(months.CHESHVAN); // 8
   * HDate.monthNum('Cheshvan'); // 8
   * HDate.monthNum('חשון'); // 8
   */
  static monthNum(month) {
    if (typeof month === 'number') {
      if (isNaN(month) || month > 14) {
        throw new RangeError(`Invalid month number: ${month}`);
      }
      return month;
    }
    return month.charCodeAt(0) >= 48 && month.charCodeAt(0) <= 57 /* number */ ? parseInt(month, 10) : HDate.monthFromName(month);
  }
  /**
   * Number of days in the Hebrew year.
   * Regular years can have 353, 354, or 355 days.
   * Leap years can have 383, 384, or 385 days.
   * @param year Hebrew year
   * @example
   * HDate.daysInYear(5783); // 355
   * HDate.daysInYear(5784); // 383
   */
  static daysInYear(year) {
    return daysInYear(year);
  }
  /**
   * true if Cheshvan is long in Hebrew year
   * @param year Hebrew year
   * @example
   * HDate.longCheshvan(5783); // true
   * HDate.longCheshvan(5784); // false
   */
  static longCheshvan(year) {
    return longCheshvan(year);
  }
  /**
   * true if Kislev is short in Hebrew year
   * @param year Hebrew year
   * @example
   * HDate.shortKislev(5783); // false
   * HDate.shortKislev(5784); // true
   */
  static shortKislev(year) {
    return shortKislev(year);
  }
  /**
   * Converts Hebrew month string name to numeric
   * @example
   * import {HDate, months} from '@hebcal/hdate';
   * HDate.monthFromName(months.CHESHVAN); // 8
   * HDate.monthFromName('Cheshvan'); // 8
   * HDate.monthFromName('חשון'); // 8
   */
  static monthFromName(monthName) {
    if (typeof monthName === 'number') {
      if (isNaN(monthName) || monthName < 1 || monthName > 14) {
        throw new RangeError(`Invalid month name: ${monthName}`);
      }
      return monthName;
    }
    const name = Locale.hebrewStripNikkud(monthName);
    return monthFromName(name);
  }
  /**
   * Convenience function for determining the R.D. date
   * near a specified R.D. date, corresponding to the specified day of week.
   *
   * Note: Applying this function to d+6 gives us the `dayOfWeek` on or after an
   * absolute day d. Similarly, applying it to d+3 gives the `dayOfWeek` nearest to
   * absolute date d, applying it to d-1 gives the `dayOfWeek` previous to absolute
   * date d, and applying it to d+7 gives the `dayOfWeek` following absolute date d.
   * @param dayOfWeek day of week: Sunday=0, Saturday=6
   */
  static dayOnOrBefore(dayOfWeek, absdate) {
    return absdate - (absdate - dayOfWeek) % 7;
  }
  /**
   * Tests if the object is an instance of `HDate`
   * @example
   * HDate.isHDate(new HDate()); // true
   * HDate.isHDate(new Date()); // false
   * HDate.isHDate(null); // false
   * HDate.isHDate(12345); // false
   * HDate.isHDate('15 Cheshvan 5769'); // false
   */
  static isHDate(obj) {
    return obj !== null && typeof obj === 'object' && typeof obj.yy === 'number' && typeof obj.mm === 'number' && typeof obj.dd === 'number' && typeof obj.greg === 'function' && typeof obj.abs === 'function';
  }
  /**
   * Construct a new instance of `HDate` from a Gematriya-formatted string
   * @example
   * HDate.fromGematriyaString('כ״ז בְּתַמּוּז תשפ״ג') // 27 Tamuz 5783
   * HDate.fromGematriyaString('כ׳ סיון תש״ד') // 20 Sivan 5704
   * HDate.fromGematriyaString('ה׳ אִיָיר תש״ח') // 5 Iyyar 5708
   */
  static fromGematriyaString(str) {
    let currentThousands = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
    const parts = str.split(' ').filter(x => x.length !== 0);
    const numParts = parts.length;
    if (numParts !== 3 && numParts !== 4) {
      throw new RangeError(`Unable to parse gematriya string: "${str}"`);
    }
    const day = gematriyaStrToNum(parts[0]);
    const monthStr = numParts === 3 ? parts[1] : parts[1] + ' ' + parts[2];
    const month = HDate.monthFromName(monthStr);
    const yearStr = numParts === 3 ? parts[2] : parts[3];
    let year = gematriyaStrToNum(yearStr);
    if (year < 1000) {
      year += currentThousands;
    }
    return new HDate(day, month, year);
  }
}
function standardizeUnits(units) {
  switch (units) {
    case 'd':
      return UNITS_DAY;
    case 'w':
      return UNITS_WEEK;
    case 'M':
      return UNITS_MONTH;
    case 'y':
      return UNITS_YEAR;
  }
  const str = String(units || '').toLowerCase().replace(/s$/, '');
  switch (str) {
    case UNITS_DAY:
    case UNITS_WEEK:
    case UNITS_MONTH:
    case UNITS_YEAR:
      return str;
  }
  throw new TypeError(`Invalid units '${units}'`);
}
function getDayOfTranslation(locale) {
  switch (locale) {
    case 'en':
    case 's':
    case 'a':
    case 'ashkenazi':
      return ' of';
  }
  const ofStr = Locale.lookupTranslation('of', locale);
  if (ofStr) {
    return ' ' + ofStr;
  }
  if (locale.startsWith('ashkenazi')) {
    return ' of';
  }
  return '';
}
/**
 * Sets the day of the month of the date. Returns the object it was called upon
 * @private
 * @param month A number, or Hebrew month name string
 */
function setMonth(hd, month) {
  hd.mm = HDate.monthNum(month);
  fix(hd);
  return hd;
}
function setDate(hd, date) {
  hd.dd = date;
  fix(hd);
  return hd;
}
function fix(hd) {
  fixMonth(hd);
  fixDate(hd);
}
function fixDate(hd) {
  if (hd.dd < 1) {
    if (hd.mm === months.TISHREI) {
      hd.yy -= 1;
    }
    hd.dd += daysInMonth(hd.mm, hd.yy);
    hd.mm -= 1;
    fix(hd);
  }
  if (hd.dd > daysInMonth(hd.mm, hd.yy)) {
    if (hd.mm === months.ELUL) {
      hd.yy += 1;
    }
    hd.dd -= daysInMonth(hd.mm, hd.yy);
    if (hd.mm === monthsInYear(hd.yy)) {
      hd.mm = 1; // rollover to NISAN
    } else {
      hd.mm += 1;
    }
    fix(hd);
  }
  fixMonth(hd);
}
function fixMonth(hd) {
  if (hd.mm === months.ADAR_II && !hd.isLeapYear()) {
    hd.mm -= 1; // to Adar I
    fix(hd);
  } else if (hd.mm < 1) {
    hd.mm += monthsInYear(hd.yy);
    hd.yy -= 1;
    fix(hd);
  } else if (hd.mm > monthsInYear(hd.yy)) {
    hd.mm -= monthsInYear(hd.yy);
    hd.yy += 1;
    fix(hd);
  }
  delete hd.rd;
}
function onOrBefore(day, t, offset) {
  return new HDate(HDate.dayOnOrBefore(day, t.abs() + offset));
}

var poAshkenazi = { "headers": { "plural-forms": "nplurals=2; plural=(n > 1);" }, "contexts": { "": { "Shabbat": ["Shabbos"], "Achrei Mot": ["Achrei Mos"], "Bechukotai": ["Bechukosai"], "Beha'alotcha": ["Beha’aloscha"], "Bereshit": ["Bereshis"], "Chukat": ["Chukas"], "Erev Shavuot": ["Erev Shavuos"], "Erev Sukkot": ["Erev Sukkos"], "Ki Tavo": ["Ki Savo"], "Ki Teitzei": ["Ki Seitzei"], "Ki Tisa": ["Ki Sisa"], "Matot": ["Matos"], "Purim Katan": ["Purim Koton"], "Shabbat Chazon": ["Shabbos Chazon"], "Shabbat HaChodesh": ["Shabbos HaChodesh"], "Shabbat HaGadol": ["Shabbos HaGadol"], "Shabbat Nachamu": ["Shabbos Nachamu"], "Shabbat Parah": ["Shabbos Parah"], "Shabbat Shekalim": ["Shabbos Shekalim"], "Shabbat Shuva": ["Shabbos Shuvah"], "Shabbat Zachor": ["Shabbos Zachor"], "Shavuot": ["Shavuos"], "Shavuot I": ["Shavuos I"], "Shavuot II": ["Shavuos II"], "Shemot": ["Shemos"], "Shmini Atzeret": ["Shmini Atzeres"], "Simchat Torah": ["Simchas Torah"], "Sukkot": ["Sukkos"], "Sukkot I": ["Sukkos I"], "Sukkot II": ["Sukkos II"], "Sukkot II (CH''M)": ["Sukkos II (CH’’M)"], "Sukkot III (CH''M)": ["Sukkos III (CH’’M)"], "Sukkot IV (CH''M)": ["Sukkos IV (CH’’M)"], "Sukkot V (CH''M)": ["Sukkos V (CH’’M)"], "Sukkot VI (CH''M)": ["Sukkos VI (CH’’M)"], "Sukkot VII (Hoshana Raba)": ["Sukkos VII (Hoshana Raba)"], "Ta'anit Bechorot": ["Ta’anis Bechoros"], "Ta'anit Esther": ["Ta’anis Esther"], "Toldot": ["Toldos"], "Vaetchanan": ["Vaeschanan"], "Yitro": ["Yisro"], "Vezot Haberakhah": ["Vezos Haberakhah"], "Parashat": ["Parshas"], "Leil Selichot": ["Leil Selichos"], "Shabbat Mevarchim Chodesh": ["Shabbos Mevorchim Chodesh"], "Shabbat Shirah": ["Shabbos Shirah"], "Asara B'Tevet": ["Asara B’Teves"], "Alot HaShachar": ["Alos HaShachar"], "Kriat Shema, sof zeman": ["Krias Shema, sof zman"], "Tefilah, sof zeman": ["Tefilah, sof zman"], "Kriat Shema, sof zeman (MGA)": ["Krias Shema, sof zman (MGA)"], "Tefilah, sof zeman (MGA)": ["Tefilah, sof zman (MGA)"], "Chatzot HaLailah": ["Chatzos HaLailah"], "Chatzot hayom": ["Chatzos"], "Tzeit HaKochavim": ["Tzeis HaKochavim"], "Birkat Hachamah": ["Birkas Hachamah"], "Shushan Purim Katan": ["Shushan Purim Koton"] } } };

var poHe = { "headers": { "plural-forms": "nplurals=2; plural=(n > 1);" }, "contexts": { "": { "Shabbat": ["שַׁבָּת"], "Daf Yomi": ["דַף יוֹמִי"], "Parashat": ["פָּרָשַׁת"], "Achrei Mot": ["אַחֲרֵי מוֹת"], "Balak": ["בָּלָק"], "Bamidbar": ["בְּמִדְבַּר"], "Bechukotai": ["בְּחֻקֹּתַי"], "Beha'alotcha": ["בְּהַעֲלֹתְךָ"], "Behar": ["בְּהַר"], "Bereshit": ["בְּרֵאשִׁית"], "Beshalach": ["בְּשַׁלַּח"], "Bo": ["בֹּא"], "Chayei Sara": ["חַיֵּי שָֹרָה"], "Chukat": ["חֻקַּת"], "Devarim": ["דְּבָרִים"], "Eikev": ["עֵקֶב"], "Emor": ["אֱמוֹר"], "Ha'azinu": ["הַאֲזִינוּ"], "Kedoshim": ["קְדשִׁים"], "Ki Tavo": ["כִּי־תָבוֹא"], "Ki Teitzei": ["כִּי־תֵצֵא"], "Ki Tisa": ["כִּי תִשָּׂא"], "Korach": ["קוֹרַח"], "Lech-Lecha": ["לֶךְ־לְךָ"], "Masei": ["מַסְעֵי"], "Matot": ["מַּטּוֹת"], "Metzora": ["מְּצֹרָע"], "Miketz": ["מִקֵּץ"], "Mishpatim": ["מִּשְׁפָּטִים"], "Nasso": ["נָשׂא"], "Nitzavim": ["נִצָּבִים"], "Noach": ["נֹחַ"], "Pekudei": ["פְקוּדֵי"], "Pinchas": ["פִּינְחָס"], "Re'eh": ["רְאֵה"], "Sh'lach": ["שְׁלַח־לְךָ"], "Shemot": ["שְׁמוֹת"], "Shmini": ["שְּׁמִינִי"], "Shoftim": ["שׁוֹפְטִים"], "Tazria": ["תַזְרִיעַ"], "Terumah": ["תְּרוּמָה"], "Tetzaveh": ["תְּצַוֶּה"], "Toldot": ["תּוֹלְדוֹת"], "Tzav": ["צַו"], "Vaera": ["וָאֵרָא"], "Vaetchanan": ["וָאֶתְחַנַּן"], "Vayakhel": ["וַיַּקְהֵל"], "Vayechi": ["וַיְחִי"], "Vayeilech": ["וַיֵּלֶךְ"], "Vayera": ["וַיֵּרָא"], "Vayeshev": ["וַיֵּשֶׁב"], "Vayetzei": ["וַיֵּצֵא"], "Vayigash": ["וַיִּגַּשׁ"], "Vayikra": ["וַיִּקְרָא"], "Vayishlach": ["וַיִּשְׁלַח"], "Vezot Haberakhah": ["וְזֹאת הַבְּרָכָה"], "Yitro": ["יִתְרוֹ"], "Asara B'Tevet": ["עֲשָׂרָה בְּטֵבֵת"], "Candle lighting": ["הַדְלָקַת נֵרוֹת"], "Chanukah": ["חֲנוּכָּה"], "Chanukah: 1 Candle": ["חֲנוּכָּה: א׳ נֵר"], "Chanukah: 2 Candles": ["חֲנוּכָּה: ב׳ נֵרוֹת"], "Chanukah: 3 Candles": ["חֲנוּכָּה: ג׳ נֵרוֹת"], "Chanukah: 4 Candles": ["חֲנוּכָּה: ד׳ נֵרוֹת"], "Chanukah: 5 Candles": ["חֲנוּכָּה: ה׳ נֵרוֹת"], "Chanukah: 6 Candles": ["חֲנוּכָּה: ו׳ נֵרוֹת"], "Chanukah: 7 Candles": ["חֲנוּכָּה: ז׳ נֵרוֹת"], "Chanukah: 8 Candles": ["חֲנוּכָּה: ח׳ נֵרוֹת"], "Chanukah: 8th Day": ["חֲנוּכָּה: יוֹם ח׳"], "Days of the Omer": ["סְפִירַת הָעוֹמֶר"], "Omer": ["עוֹמֶר"], "day of the Omer": ["בָּעוֹמֶר"], "Erev Pesach": ["עֶרֶב פֶּסַח"], "Erev Purim": ["עֶרֶב פּוּרִים"], "Erev Rosh Hashana": ["עֶרֶב רֹאשׁ הַשָּׁנָה"], "Erev Shavuot": ["עֶרֶב שָׁבוּעוֹת"], "Erev Simchat Torah": ["עֶרֶב שִׂמְחַת תּוֹרָה"], "Erev Sukkot": ["עֶרֶב סוּכּוֹת"], "Erev Tish'a B'Av": ["עֶרֶב תִּשְׁעָה בְּאָב"], "Erev Yom Kippur": ["עֶרֶב יוֹם כִּפּוּר"], "Havdalah": ["הַבְדָּלָה"], "Lag BaOmer": ["ל״ג בָּעוֹמֶר"], "Leil Selichot": ["סליחות"], "Pesach": ["פֶּסַח"], "Pesach I": ["פֶּסַח א׳"], "Pesach II": ["פֶּסַח ב׳"], "Pesach II (CH''M)": ["פֶּסַח ב׳ (חוה״מ)"], "Pesach III (CH''M)": ["פֶּסַח ג׳ (חוה״מ)"], "Pesach IV (CH''M)": ["פֶּסַח ד׳ (חוה״מ)"], "Pesach Sheni": ["פֶּסַח שני"], "Pesach V (CH''M)": ["פֶּסַח ה׳ (חוה״מ)"], "Pesach VI (CH''M)": ["פֶּסַח ו׳ (חוה״מ)"], "Pesach VII": ["פֶּסַח ז׳"], "Pesach VIII": ["פֶּסַח ח׳"], "Purim": ["פּוּרִים"], "Purim Katan": ["פּוּרִים קָטָן"], "Rosh Chodesh %s": ["רֹאשׁ חוֹדֶשׁ %s"], "Rosh Chodesh": ["רֹאשׁ חוֹדֶשׁ"], "Rosh Hashana": ["רֹאשׁ הַשָּׁנָה"], "Rosh Hashana I": ["רֹאשׁ הַשָּׁנָה א׳"], "Rosh Hashana II": ["רֹאשׁ הַשָּׁנָה ב׳"], "Shabbat Chazon": ["שַׁבָּת חֲזוֹן"], "Shabbat HaChodesh": ["שַׁבָּת הַחֹדֶשׁ"], "Shabbat HaGadol": ["שַׁבָּת הַגָּדוֹל"], "Shabbat Machar Chodesh": ["שַׁבָּת מָחָר חוֹדֶשׁ"], "Shabbat Nachamu": ["שַׁבָּת נַחֲמוּ"], "Shabbat Parah": ["שַׁבָּת פּרה"], "Shabbat Rosh Chodesh": ["שַׁבָּת רֹאשׁ חוֹדֶשׁ"], "Shabbat Shekalim": ["שַׁבָּת שְׁקָלִים"], "Shabbat Shuva": ["שַׁבָּת שׁוּבָה"], "Shabbat Zachor": ["שַׁבָּת זָכוֹר"], "Shavuot": ["שָׁבוּעוֹת"], "Shavuot I": ["שָׁבוּעוֹת א׳"], "Shavuot II": ["שָׁבוּעוֹת ב׳"], "Shmini Atzeret": ["שְׁמִינִי עֲצֶרֶת"], "Shushan Purim": ["שׁוּשָׁן פּוּרִים"], "Sigd": ["סיגד"], "Simchat Torah": ["שִׂמְחַת תּוֹרָה"], "Sukkot": ["סוּכּוֹת"], "Sukkot I": ["סוּכּוֹת א׳"], "Sukkot II": ["סוּכּוֹת ב׳"], "Sukkot II (CH''M)": ["סוּכּוֹת ב׳ (חוה״מ)"], "Sukkot III (CH''M)": ["סוּכּוֹת ג׳ (חוה״מ)"], "Sukkot IV (CH''M)": ["סוּכּוֹת ד׳ (חוה״מ)"], "Sukkot V (CH''M)": ["סוּכּוֹת ה׳ (חוה״מ)"], "Sukkot VI (CH''M)": ["סוּכּוֹת ו׳ (חוה״מ)"], "Sukkot VII (Hoshana Raba)": ["סוּכּוֹת ז׳ (הוֹשַׁעְנָא רַבָּה)"], "Ta'anit Bechorot": ["תַּעֲנִית בְּכוֹרוֹת"], "Ta'anit Esther": ["תַּעֲנִית אֶסְתֵּר"], "Tish'a B'Av": ["תִּשְׁעָה בְּאָב"], "Tu B'Av": ["טוּ בְּאָב"], "Tu BiShvat": ["טוּ בִּשְׁבָט"], "Tu B'Shvat": ["טוּ בִּשְׁבָט"], "Tzom Gedaliah": ["צוֹם גְּדַלְיָה"], "Tzom Tammuz": ["צוֹם תָּמוּז"], "Yom HaAtzma'ut": ["יוֹם הָעַצְמָאוּת"], "Yom HaShoah": ["יוֹם הַשּׁוֹאָה"], "Yom HaZikaron": ["יוֹם הַזִּכָּרוֹן"], "Yom Kippur": ["יוֹם כִּפּוּר"], "Yom Yerushalayim": ["יוֹם יְרוּשָׁלַיִם"], "Yom HaAliyah": ["יוֹם הַעֲלִיָּה"], "Yom HaAliyah School Observance": ["שְׁמִירָת בֵּית הַסֵפֶר לְיוֹם הַעֲלִיָּה"], "Pesach I (on Shabbat)": ["פֶּסַח יוֹם א׳ (בְּשַׁבָּת)"], "Pesach Chol ha-Moed Day 1": ["פֶּסַח חוֹל הַמּוֹעֵד יוֹם א׳"], "Pesach Chol ha-Moed Day 2": ["פֶּסַח חוֹל הַמּוֹעֵד יוֹם ב׳"], "Pesach Chol ha-Moed Day 3": ["פֶּסַח חוֹל הַמּוֹעֵד יוֹם ג׳"], "Pesach Chol ha-Moed Day 4": ["פֶּסַח חוֹל הַמּוֹעֵד יוֹם ד׳"], "Pesach Chol ha-Moed Day 5": ["פֶּסַח חוֹל הַמּוֹעֵד יוֹם ה׳"], "Pesach Shabbat Chol ha-Moed": ["פֶּסַח שַׁבָּת חוֹל הַמּוֹעֵד"], "Shavuot II (on Shabbat)": ["שָׁבוּעוֹת יוֹם ב׳ (בְּשַׁבָּת)"], "Rosh Hashana I (on Shabbat)": ["רֹאשׁ הַשָּׁנָה יוֹם א׳ (בְּשַׁבָּת)"], "Yom Kippur (on Shabbat)": ["יוֹם כִּפּוּר (בְּשַׁבָּת)"], "Yom Kippur (Mincha, Traditional)": ["יוֹם כִּפּוּר מִנחָה"], "Yom Kippur (Mincha, Alternate)": ["יוֹם כִּפּוּר מִנחָה"], "Sukkot I (on Shabbat)": ["סוּכּוֹת יוֹם א׳ (בְּשַׁבָּת)"], "Sukkot Chol ha-Moed Day 1": ["סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם א׳"], "Sukkot Chol ha-Moed Day 2": ["סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ב׳"], "Sukkot Chol ha-Moed Day 3": ["סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ג׳"], "Sukkot Chol ha-Moed Day 4": ["סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ד׳"], "Sukkot Chol ha-Moed Day 5": ["סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ה׳"], "Sukkot Shabbat Chol ha-Moed": ["סוּכּוֹת שַׁבָּת חוֹל הַמּוֹעֵד"], "Sukkot Final Day (Hoshana Raba)": ["סוּכּוֹת ז׳ (הוֹשַׁעְנָא רַבָּה)"], "Rosh Chodesh Adar": ["רֹאשׁ חוֹדֶשׁ אַדָר"], "Rosh Chodesh Adar I": ["רֹאשׁ חוֹדֶשׁ אַדָר א׳"], "Rosh Chodesh Adar II": ["רֹאשׁ חוֹדֶשׁ אַדָר ב׳"], "Rosh Chodesh Av": ["רֹאשׁ חוֹדֶשׁ אָב"], "Rosh Chodesh Cheshvan": ["רֹאשׁ חוֹדֶשׁ חֶשְׁוָן"], "Rosh Chodesh Elul": ["רֹאשׁ חוֹדֶשׁ אֱלוּל"], "Rosh Chodesh Iyyar": ["רֹאשׁ חוֹדֶשׁ אִיָיר"], "Rosh Chodesh Kislev": ["רֹאשׁ חוֹדֶשׁ כִּסְלֵו"], "Rosh Chodesh Nisan": ["רֹאשׁ חוֹדֶשׁ נִיסָן"], "Rosh Chodesh Sh'vat": ["רֹאשׁ חוֹדֶשׁ שְׁבָט"], "Rosh Chodesh Sivan": ["רֹאשׁ חוֹדֶשׁ סִיוָן"], "Rosh Chodesh Tamuz": ["רֹאשׁ חוֹדֶשׁ תָּמוּז"], "Rosh Chodesh Tevet": ["רֹאשׁ חוֹדֶשׁ טֵבֵת"], "min": ["דַּקּוֹת"], "Fast begins": ["תחילת הַצוֹם"], "Fast ends": ["סִיּוּם הַצוֹם"], "Rosh Hashana LaBehemot": ["רֹאשׁ הַשָּׁנָה לְמַעְשַׂר בְּהֵמָה"], "Tish'a B'Av (observed)": ["תִּשְׁעָה בְּאָב נִדחֶה"], "Shabbat Mevarchim Chodesh": ["שַׁבָּת מְבָרְכִים חוֹדֶשׁ"], "Shabbat Shirah": ["שַׁבָּת שִׁירָה"], "Chatzot HaLailah": ["חֲצוֹת הַלַיְלָה"], "Alot haShachar": ["עֲלוֹת הַשַּׁחַר"], "Misheyakir": ["מִשֶּׁיַּכִּיר"], "Misheyakir Machmir": ["מִשֶּׁיַּכִּיר מַחמִיר"], "Dawn": ["דִּימְדּוּמֵי בּוֹקֵר"], "Sunrise": ["הַנֵץ הַחַמָּה"], "Kriat Shema, sof zeman": ["סוֹף זְמַן קְרִיאַת שְׁמַע גר״א"], "Tefilah, sof zeman": ["סוֹף זְמַן תְּפִלָּה גר״א"], "Kriat Shema, sof zeman (MGA)": ["סוֹף זְמַן קְרִיאַת שְׁמַע מג״א"], "Tefilah, sof zeman (MGA)": ["סוֹף זְמַן תְּפִלָּה מג״א"], "Chatzot hayom": ["חֲצוֹת הַיּוֹם"], "Mincha Gedolah": ["מִנְחָה גְּדוֹלָה"], "Mincha Ketanah": ["מִנְחָה קְטַנָּה"], "Plag HaMincha": ["פְּלַג הַמִּנְחָה"], "Dusk": ["דִּימְדּוּמֵי עֶרֶב"], "Sunset": ["שְׁקִיעָה"], "Nightfall - End of ordained fasts": ["לַיְלָה - גמר תעניות דרבנן"], "Tzeit HaKochavim": ["צֵאת הַכּוֹכָבִים"], "Lovingkindness": ["חֶֽסֶד"], "Might": ["גְבוּרָה"], "Beauty": ["תִּפאֶרֶת"], "Eternity": ["נֶּֽצַח"], "Splendor": ["הוֹד"], "Foundation": ["יְּסוֹד"], "Majesty": ["מַּלְכוּת"], "day": ["יוֹם"], "Chanukah Day 1": ["חֲנוּכָּה יוֹם א׳"], "Chanukah Day 2": ["חֲנוּכָּה יוֹם ב׳"], "Chanukah Day 3": ["חֲנוּכָּה יוֹם ג׳"], "Chanukah Day 4": ["חֲנוּכָּה יוֹם ד׳"], "Chanukah Day 5": ["חֲנוּכָּה יוֹם ה׳"], "Chanukah Day 6": ["חֲנוּכָּה יוֹם ו׳"], "Chanukah Day 7": ["חֲנוּכָּה יוֹם ז׳"], "Chanukah Day 7 (on Rosh Chodesh)": ["חֲנוּכָּה יוֹם ז׳ (רֹאשׁ חוֹדֶשׁ)"], "Chanukah Day 8": ["חֲנוּכָּה יוֹם ח׳"], "Chanukah Day 1 (on Shabbat)": ["חֲנוּכָּה יוֹם א׳ (בְּשַׁבָּת)"], "Chanukah Day 2 (on Shabbat)": ["חֲנוּכָּה יוֹם ב׳ (בְּשַׁבָּת)"], "Chanukah Day 3 (on Shabbat)": ["חֲנוּכָּה יוֹם ג׳ (בְּשַׁבָּת)"], "Chanukah Day 4 (on Shabbat)": ["חֲנוּכָּה יוֹם ד׳ (בְּשַׁבָּת)"], "Chanukah Day 5 (on Shabbat)": ["חֲנוּכָּה יוֹם ה׳ (בְּשַׁבָּת)"], "Chanukah Day 7 (on Shabbat)": ["חֲנוּכָּה יוֹם ז׳ (בְּשַׁבָּת)"], "Chanukah Day 8 (on Shabbat)": ["חֲנוּכָּה יוֹם ח׳ (בְּשַׁבָּת)"], "Shabbat Rosh Chodesh Chanukah": ["שַׁבָּת רֹאשׁ חוֹדֶשׁ חֲנוּכָּה"], "Yom Kippur Katan": ["יוֹם כִּפּוּר קָטָן"], "Family Day": ["יוֹם הַמִּשׁפָּחָה"], "Yitzhak Rabin Memorial Day": ["יוֹם הַזִּכָּרוֹן ליצחק רבין"], "Jabotinsky Day": ["יוֹם ז׳בוטינסקי"], "Herzl Day": ["יוֹם הרצל"], "Ben-Gurion Day": ["יוֹם בן־גוריון"], "Hebrew Language Day": ["יוֹם הַשָׂפָה הַעִברִית"], "Birkat Hachamah": ["בִרְכַּת הַחַמָּה"], "Shushan Purim Katan": ["שׁוּשָׁן פּוּרִים קָטָן"], "Purim Meshulash": ["פּוּרִים מְשׁוּלָּשׁ"], "after sunset": ["לְאַחַר הַשְׁקִיעָה"], "Yerushalmi": ["יְרוּשַׁלְמִי"], "Chag HaBanot": ["חַג הַבָּנוֹת"], "Joshua": ["יְהוֹשׁוּעַ"], "Judges": ["שׁוֹפְטִים"], "I Samuel": ["שְׁמוּאֵל רִאשׁוֹן"], "II Samuel": ["שְׁמוּאֵל שֵׁנִי"], "I Kings": ["מְלָכִים רִאשׁוֹן"], "II Kings": ["מְלָכִים שֵׁנִי"], "Isaiah": ["יְשַׁעְיָהוּ"], "Jeremiah": ["יִרְמְיָהוּ"], "Ezekiel": ["יְחֶזְקֵאל"], "Hosea": ["הוֹשֵׁעַ"], "Joel": ["יוֹאֵל"], "Amos": ["עָמוּס"], "Obadiah": ["עוֹבַדְיָה"], "Jonah": ["יוֹנָה"], "Micah": ["מִיכָה"], "Nachum": ["נַחוּם"], "Habakkuk": ["חֲבַקּוּק"], "Zephaniah": ["צְפַנְיָה"], "Haggai": ["חַגַּי"], "Zechariah": ["זְכַרְיָה"], "Malachi": ["מַלְאָכִי"], "Psalms": ["תְּהִלִּים"], "Proverbs": ["מִשְׁלֵי"], "Job": ["אִיּוֹב"], "Song of Songs": ["שִׁיר הַשִּׁירִים"], "Ruth": ["רוּת"], "Lamentations": ["אֵיכָה"], "Ecclesiastes": ["קֹהֶלֶת"], "Esther": ["אֶסְתֵּר"], "Daniel": ["דָּנִיֵּאל"], "Ezra": ["עֶזְרָא"], "Nehemiah": ["נְחֶמְיָה"], "I Chronicles": ["דִברֵי הַיָמִים רִאשׁוֹן"], "II Chronicles": ["דִברֵי הַיָמִים שֵׁנִי"], "Yom Kippur (Mincha)": ["יוֹם כִּפּוּר מִנחָה"], "Tish'a B'Av (Mincha)": ["תִּשְׁעָה בְּאָב מִנחָה"], "Asara B'Tevet (Mincha)": ["עֲשָׂרָה בְּטֵבֵת מִנחָה"], "Ta'anit Bechorot (Mincha)": ["תַּעֲנִית בְּכוֹרוֹת מִנחָה"], "Ta'anit Esther (Mincha)": ["תַּעֲנִית אֶסְתֵּר מִנחָה"], "Tzom Gedaliah (Mincha)": ["צוֹם גְּדַלְיָה מִנחָה"], "Tzom Tammuz (Mincha)": ["צוֹם תָּמוּז מִנחָה"], "Molad": ["מוֹלָד הָלְּבָנָה"], "chalakim": ["חֲלָקִים"], "Pirkei Avot": ["פִּרְקֵי אָבוֹת"] } } };

Locale.addTranslations('he', poHe);
Locale.addTranslations('h', poHe);
Locale.addTranslations('ashkenazi', poAshkenazi);
Locale.addTranslations('a', poAshkenazi);
/* Hebrew without nikkud */
const heStrs = poHe.contexts[''];
const heNoNikud = {};
for (const [key, val] of Object.entries(heStrs)) {
    heNoNikud[key] = [Locale.hebrewStripNikkud(val[0])];
}
const poHeNoNikud = {
    headers: poHe.headers,
    contexts: { '': heNoNikud },
};
Locale.addTranslations('he-x-NoNikud', poHeNoNikud);

/**
 * Holiday flags for Event. These flags are typically
 * combined using bitwise arithmetic to form a mask.
 * @readonly
 * @enum {number}
 */
const flags = {
    /** Chag, yontiff, yom tov */
    CHAG: 0x000001,
    /** Light candles 18 minutes before sundown */
    LIGHT_CANDLES: 0x000002,
    /** End of holiday (end of Yom Tov)  */
    YOM_TOV_ENDS: 0x000004,
    /** Observed only in the Diaspora (chutz l'aretz)  */
    CHUL_ONLY: 0x000008,
    /** Observed only in Israel */
    IL_ONLY: 0x000010,
    /** Light candles in the evening at Tzeit time (3 small stars) */
    LIGHT_CANDLES_TZEIS: 0x000020,
    /** Candle-lighting for Chanukah */
    CHANUKAH_CANDLES: 0x000040,
    /** Rosh Chodesh, beginning of a new Hebrew month */
    ROSH_CHODESH: 0x000080,
    /** Minor fasts like Tzom Tammuz, Ta'anit Esther, ... */
    MINOR_FAST: 0x000100,
    /** Shabbat Shekalim, Zachor, ... */
    SPECIAL_SHABBAT: 0x000200,
    /** Weekly sedrot on Saturdays */
    PARSHA_HASHAVUA: 0x000400,
    /** Daily page of Talmud (Bavli) */
    DAF_YOMI: 0x000800,
    /** Days of the Omer */
    OMER_COUNT: 0x001000,
    /** Yom HaShoah, Yom HaAtzma'ut, ... */
    MODERN_HOLIDAY: 0x002000,
    /** Yom Kippur and Tish'a B'Av */
    MAJOR_FAST: 0x004000,
    /** On the Saturday before Rosh Chodesh */
    SHABBAT_MEVARCHIM: 0x008000,
    /** Molad */
    MOLAD: 0x010000,
    /** Yahrzeit or Hebrew Anniversary */
    USER_EVENT: 0x020000,
    /** Daily Hebrew date ("11th of Sivan, 5780") */
    HEBREW_DATE: 0x040000,
    /** A holiday that's not major, modern, rosh chodesh, or a fast day */
    MINOR_HOLIDAY: 0x080000,
    /** Evening before a major or minor holiday */
    EREV: 0x100000,
    /** Chol haMoed, intermediate days of Pesach or Sukkot */
    CHOL_HAMOED: 0x200000,
    /** Mishna Yomi */
    MISHNA_YOMI: 0x400000,
    /** Yom Kippur Katan, minor day of atonement on the day preceeding each Rosh Chodesh */
    YOM_KIPPUR_KATAN: 0x800000,
    /** Daily page of Jerusalem Talmud (Yerushalmi) */
    YERUSHALMI_YOMI: 0x1000000,
    /** Nach Yomi */
    NACH_YOMI: 0x2000000,
    /** Daily Learning */
    DAILY_LEARNING: 0x4000000,
};
const flagToCategory = [
    [flags.MAJOR_FAST, 'holiday', 'major', 'fast'],
    [flags.CHANUKAH_CANDLES, 'holiday', 'major'],
    [flags.HEBREW_DATE, 'hebdate'],
    [flags.MINOR_FAST, 'holiday', 'fast'],
    [flags.MINOR_HOLIDAY, 'holiday', 'minor'],
    [flags.MODERN_HOLIDAY, 'holiday', 'modern'],
    [flags.MOLAD, 'molad'],
    [flags.OMER_COUNT, 'omer'],
    [flags.PARSHA_HASHAVUA, 'parashat'], // backwards-compat
    [flags.ROSH_CHODESH, 'roshchodesh'],
    [flags.SHABBAT_MEVARCHIM, 'mevarchim'],
    [flags.SPECIAL_SHABBAT, 'holiday', 'shabbat'],
    [flags.USER_EVENT, 'user'],
];
/**
 * Represents an Event with a title, date, and flags.
 *
 * Events are used to represent holidays, candle-lighting times,
 * Torah readings, and more.
 *
 * To get the title of the event a language other than English
 * with Sephardic transliterations, use the `render()` method.
 */
class Event {
    /**
     * Constructs Event
     * @param date Hebrew date event occurs
     * @param desc Description (not translated)
     * @param [mask=0] optional bitmask of holiday flags (see {@link flags})
     * @param [attrs={}] optional additional attributes (e.g. `eventTimeStr`, `cholHaMoedDay`)
     */
    constructor(date, desc, mask = 0, attrs) {
        if (!HDate.isHDate(date)) {
            throw new TypeError(`Invalid Event date: ${date}`);
        }
        else if (typeof desc !== 'string') {
            throw new TypeError(`Invalid Event description: ${desc}`);
        }
        this.date = date;
        this.desc = desc;
        this.mask = +mask;
        if (typeof attrs === 'object' && attrs !== null) {
            Object.assign(this, attrs);
        }
    }
    /**
     * Hebrew date of this event
     */
    getDate() {
        return this.date;
    }
    /**
     * Untranslated title of this event. Note that these description
     * strings are always in English and will remain stable across releases.
     * To get the title of the event in another language, use the
     * `render()` method.
     */
    getDesc() {
        return this.desc;
    }
    /**
     * Bitmask of optional event flags. See {@link flags}
     */
    getFlags() {
        return this.mask;
    }
    /**
     * Returns (translated) description of this event
     * @example
     * const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
     * ev.render('en'); // 'Shavuot'
     * ev.render('he'); // 'שָׁבוּעוֹת'
     * ev.render('ashkenazi'); // 'Shavuos'
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale) {
        return Locale.gettext(this.desc, locale);
    }
    /**
     * Returns a brief (translated) description of this event.
     * For most events, this is the same as render(). For some events, it procudes
     * a shorter text (e.g. without a time or added description).
     * @param [locale] Optional locale name (defaults to active locale).
     */
    renderBrief(locale) {
        return this.render(locale);
    }
    /**
     * Optional holiday-specific Emoji or `null`.
     */
    getEmoji() {
        return this.emoji || null;
    }
    /**
     * Returns a simplified (untranslated) description for this event. For example,
     * the `HolidayEvent` class supports
     * "Erev Pesach" => "Pesach", and "Sukkot III (CH''M)" => "Sukkot".
     * For many holidays the basename and the event description are the same.
     */
    basename() {
        return this.getDesc();
    }
    /**
     * Returns a URL to hebcal.com or sefaria.org for more detail on the event.
     * Returns `undefined` for events with no detail page.
     */
    url() {
        return undefined;
    }
    /**
     * Is this event observed in Israel?
     * @example
     * const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
     * ev1.observedInIsrael(); // false
     * const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
     * ev2.observedInIsrael(); // true
     */
    observedInIsrael() {
        return !(this.mask & flags.CHUL_ONLY);
    }
    /**
     * Is this event observed in the Diaspora?
     * @example
     * const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
     * ev1.observedInDiaspora(); // true
     * const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
     * ev2.observedInDiaspora(); // true
     */
    observedInDiaspora() {
        return !(this.mask & flags.IL_ONLY);
    }
    /**
     * Is this event observed in Israel/Diaspora?
     * @example
     * const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
     * ev1.observedIn(false); // true
     * ev1.observedIn(true); // false
     * const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
     * ev2.observedIn(false); // true
     * ev2.observedIn(true); // true
     * @param il
     */
    observedIn(il) {
        return il ? this.observedInIsrael() : this.observedInDiaspora();
    }
    /**
     * Makes a clone of this Event object
     */
    clone() {
        const ev = new Event(this.date, this.desc, this.mask);
        for (const property in this) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.hasOwnProperty(property)) {
                Object.defineProperty(ev, property, { value: this[property] });
            }
        }
        return ev;
    }
    /**
     * Returns a list of event categories
     */
    getCategories() {
        const mask = this.getFlags();
        for (const attrs of flagToCategory) {
            const attr0 = attrs[0];
            if (mask & attr0) {
                return attrs.slice(1);
            }
        }
        return ['unknown'];
    }
}

/** Daily Hebrew date ("11th of Sivan, 5780") */
class HebrewDateEvent extends Event {
    /**
     * @param date
     */
    constructor(date) {
        super(date, date.toString(), flags.HEBREW_DATE);
    }
    /**
     * @param [locale] Optional locale name (defaults to active locale).
     * @example
     * import {HDate, HebrewDateEvent, months} from '@hebcal/core';
     *
     * const hd = new HDate(15, months.CHESHVAN, 5769);
     * const ev = new HebrewDateEvent(hd);
     * console.log(ev.render('en')); // '15th of Cheshvan, 5769'
     * console.log(ev.render('he')); // 'ט״ו חֶשְׁוָן תשס״ט'
     */
    render(locale) {
        const locale1 = locale === null || locale === void 0 ? void 0 : locale.toLowerCase();
        const locale0 = locale1 !== null && locale1 !== void 0 ? locale1 : Locale.getLocaleName();
        const hd = this.getDate();
        switch (locale0) {
            case 'h':
            case 'he':
                return hd.renderGematriya(false);
            case 'he-x-nonikud':
                return hd.renderGematriya(true);
            default:
                return hd.render(locale0, true);
        }
    }
    /**
     * @private
     * @param locale
     */
    renderBriefHebrew(locale) {
        const hd = this.getDate();
        const dd = hd.getDate();
        const mm = Locale.gettext(hd.getMonthName(), locale);
        return gematriya(dd) + ' ' + mm;
    }
    /**
     * @param [locale] Optional locale name (defaults to active locale).
     * @example
     * import {HDate, HebrewDateEvent, months} from '@hebcal/core';
     *
     * const hd = new HDate(15, months.CHESHVAN, 5769);
     * const ev = new HebrewDateEvent(hd);
     * console.log(ev.renderBrief()); // '15th of Cheshvan'
     * console.log(ev.renderBrief('he')); // 'ט״ו חֶשְׁוָן'
     */
    renderBrief(locale) {
        const locale1 = locale === null || locale === void 0 ? void 0 : locale.toLowerCase();
        const locale0 = locale1 !== null && locale1 !== void 0 ? locale1 : Locale.getLocaleName();
        const hd = this.getDate();
        if (hd.getMonth() === months.TISHREI && hd.getDate() === 1) {
            return this.render(locale0);
        }
        switch (locale0) {
            case 'h':
            case 'he':
            case 'he-x-nonikud':
                return this.renderBriefHebrew(locale0);
            default:
                return hd.render(locale0, false);
        }
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var es_array_includes = {};

var globalThis_1;
var hasRequiredGlobalThis;

function requireGlobalThis () {
	if (hasRequiredGlobalThis) return globalThis_1;
	hasRequiredGlobalThis = 1;
	var check = function (it) {
	  return it && it.Math === Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	globalThis_1 =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  check(typeof globalThis_1 == 'object' && globalThis_1) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();
	return globalThis_1;
}

var objectGetOwnPropertyDescriptor = {};

var fails;
var hasRequiredFails;

function requireFails () {
	if (hasRequiredFails) return fails;
	hasRequiredFails = 1;
	fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};
	return fails;
}

var descriptors;
var hasRequiredDescriptors;

function requireDescriptors () {
	if (hasRequiredDescriptors) return descriptors;
	hasRequiredDescriptors = 1;
	var fails = requireFails();

	// Detect IE8's incomplete defineProperty implementation
	descriptors = !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
	});
	return descriptors;
}

var functionBindNative;
var hasRequiredFunctionBindNative;

function requireFunctionBindNative () {
	if (hasRequiredFunctionBindNative) return functionBindNative;
	hasRequiredFunctionBindNative = 1;
	var fails = requireFails();

	functionBindNative = !fails(function () {
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  var test = (function () { /* empty */ }).bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});
	return functionBindNative;
}

var functionCall;
var hasRequiredFunctionCall;

function requireFunctionCall () {
	if (hasRequiredFunctionCall) return functionCall;
	hasRequiredFunctionCall = 1;
	var NATIVE_BIND = requireFunctionBindNative();

	var call = Function.prototype.call;

	functionCall = NATIVE_BIND ? call.bind(call) : function () {
	  return call.apply(call, arguments);
	};
	return functionCall;
}

var objectPropertyIsEnumerable = {};

var hasRequiredObjectPropertyIsEnumerable;

function requireObjectPropertyIsEnumerable () {
	if (hasRequiredObjectPropertyIsEnumerable) return objectPropertyIsEnumerable;
	hasRequiredObjectPropertyIsEnumerable = 1;
	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;
	return objectPropertyIsEnumerable;
}

var createPropertyDescriptor;
var hasRequiredCreatePropertyDescriptor;

function requireCreatePropertyDescriptor () {
	if (hasRequiredCreatePropertyDescriptor) return createPropertyDescriptor;
	hasRequiredCreatePropertyDescriptor = 1;
	createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};
	return createPropertyDescriptor;
}

var functionUncurryThis;
var hasRequiredFunctionUncurryThis;

function requireFunctionUncurryThis () {
	if (hasRequiredFunctionUncurryThis) return functionUncurryThis;
	hasRequiredFunctionUncurryThis = 1;
	var NATIVE_BIND = requireFunctionBindNative();

	var FunctionPrototype = Function.prototype;
	var call = FunctionPrototype.call;
	var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

	functionUncurryThis = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
	  return function () {
	    return call.apply(fn, arguments);
	  };
	};
	return functionUncurryThis;
}

var classofRaw;
var hasRequiredClassofRaw;

function requireClassofRaw () {
	if (hasRequiredClassofRaw) return classofRaw;
	hasRequiredClassofRaw = 1;
	var uncurryThis = requireFunctionUncurryThis();

	var toString = uncurryThis({}.toString);
	var stringSlice = uncurryThis(''.slice);

	classofRaw = function (it) {
	  return stringSlice(toString(it), 8, -1);
	};
	return classofRaw;
}

var indexedObject;
var hasRequiredIndexedObject;

function requireIndexedObject () {
	if (hasRequiredIndexedObject) return indexedObject;
	hasRequiredIndexedObject = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var fails = requireFails();
	var classof = requireClassofRaw();

	var $Object = Object;
	var split = uncurryThis(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !$Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof(it) === 'String' ? split(it, '') : $Object(it);
	} : $Object;
	return indexedObject;
}

var isNullOrUndefined;
var hasRequiredIsNullOrUndefined;

function requireIsNullOrUndefined () {
	if (hasRequiredIsNullOrUndefined) return isNullOrUndefined;
	hasRequiredIsNullOrUndefined = 1;
	// we can't use just `it == null` since of `document.all` special case
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	isNullOrUndefined = function (it) {
	  return it === null || it === undefined;
	};
	return isNullOrUndefined;
}

var requireObjectCoercible;
var hasRequiredRequireObjectCoercible;

function requireRequireObjectCoercible () {
	if (hasRequiredRequireObjectCoercible) return requireObjectCoercible;
	hasRequiredRequireObjectCoercible = 1;
	var isNullOrUndefined = requireIsNullOrUndefined();

	var $TypeError = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	requireObjectCoercible = function (it) {
	  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
	  return it;
	};
	return requireObjectCoercible;
}

var toIndexedObject;
var hasRequiredToIndexedObject;

function requireToIndexedObject () {
	if (hasRequiredToIndexedObject) return toIndexedObject;
	hasRequiredToIndexedObject = 1;
	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject = requireIndexedObject();
	var requireObjectCoercible = requireRequireObjectCoercible();

	toIndexedObject = function (it) {
	  return IndexedObject(requireObjectCoercible(it));
	};
	return toIndexedObject;
}

var isCallable;
var hasRequiredIsCallable;

function requireIsCallable () {
	if (hasRequiredIsCallable) return isCallable;
	hasRequiredIsCallable = 1;
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	var documentAll = typeof document == 'object' && document.all;

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
	isCallable = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
	  return typeof argument == 'function' || argument === documentAll;
	} : function (argument) {
	  return typeof argument == 'function';
	};
	return isCallable;
}

var isObject;
var hasRequiredIsObject;

function requireIsObject () {
	if (hasRequiredIsObject) return isObject;
	hasRequiredIsObject = 1;
	var isCallable = requireIsCallable();

	isObject = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it);
	};
	return isObject;
}

var getBuiltIn;
var hasRequiredGetBuiltIn;

function requireGetBuiltIn () {
	if (hasRequiredGetBuiltIn) return getBuiltIn;
	hasRequiredGetBuiltIn = 1;
	var globalThis = requireGlobalThis();
	var isCallable = requireIsCallable();

	var aFunction = function (argument) {
	  return isCallable(argument) ? argument : undefined;
	};

	getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
	};
	return getBuiltIn;
}

var objectIsPrototypeOf;
var hasRequiredObjectIsPrototypeOf;

function requireObjectIsPrototypeOf () {
	if (hasRequiredObjectIsPrototypeOf) return objectIsPrototypeOf;
	hasRequiredObjectIsPrototypeOf = 1;
	var uncurryThis = requireFunctionUncurryThis();

	objectIsPrototypeOf = uncurryThis({}.isPrototypeOf);
	return objectIsPrototypeOf;
}

var environmentUserAgent;
var hasRequiredEnvironmentUserAgent;

function requireEnvironmentUserAgent () {
	if (hasRequiredEnvironmentUserAgent) return environmentUserAgent;
	hasRequiredEnvironmentUserAgent = 1;
	var globalThis = requireGlobalThis();

	var navigator = globalThis.navigator;
	var userAgent = navigator && navigator.userAgent;

	environmentUserAgent = userAgent ? String(userAgent) : '';
	return environmentUserAgent;
}

var environmentV8Version;
var hasRequiredEnvironmentV8Version;

function requireEnvironmentV8Version () {
	if (hasRequiredEnvironmentV8Version) return environmentV8Version;
	hasRequiredEnvironmentV8Version = 1;
	var globalThis = requireGlobalThis();
	var userAgent = requireEnvironmentUserAgent();

	var process = globalThis.process;
	var Deno = globalThis.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && userAgent) {
	  match = userAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = userAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	environmentV8Version = version;
	return environmentV8Version;
}

var symbolConstructorDetection;
var hasRequiredSymbolConstructorDetection;

function requireSymbolConstructorDetection () {
	if (hasRequiredSymbolConstructorDetection) return symbolConstructorDetection;
	hasRequiredSymbolConstructorDetection = 1;
	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION = requireEnvironmentV8Version();
	var fails = requireFails();
	var globalThis = requireGlobalThis();

	var $String = globalThis.String;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails(function () {
	  var symbol = Symbol('symbol detection');
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
	  // of course, fail.
	  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
	});
	return symbolConstructorDetection;
}

var useSymbolAsUid;
var hasRequiredUseSymbolAsUid;

function requireUseSymbolAsUid () {
	if (hasRequiredUseSymbolAsUid) return useSymbolAsUid;
	hasRequiredUseSymbolAsUid = 1;
	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL = requireSymbolConstructorDetection();

	useSymbolAsUid = NATIVE_SYMBOL
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';
	return useSymbolAsUid;
}

var isSymbol;
var hasRequiredIsSymbol;

function requireIsSymbol () {
	if (hasRequiredIsSymbol) return isSymbol;
	hasRequiredIsSymbol = 1;
	var getBuiltIn = requireGetBuiltIn();
	var isCallable = requireIsCallable();
	var isPrototypeOf = requireObjectIsPrototypeOf();
	var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();

	var $Object = Object;

	isSymbol = USE_SYMBOL_AS_UID ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn('Symbol');
	  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
	};
	return isSymbol;
}

var tryToString;
var hasRequiredTryToString;

function requireTryToString () {
	if (hasRequiredTryToString) return tryToString;
	hasRequiredTryToString = 1;
	var $String = String;

	tryToString = function (argument) {
	  try {
	    return $String(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};
	return tryToString;
}

var aCallable;
var hasRequiredACallable;

function requireACallable () {
	if (hasRequiredACallable) return aCallable;
	hasRequiredACallable = 1;
	var isCallable = requireIsCallable();
	var tryToString = requireTryToString();

	var $TypeError = TypeError;

	// `Assert: IsCallable(argument) is true`
	aCallable = function (argument) {
	  if (isCallable(argument)) return argument;
	  throw new $TypeError(tryToString(argument) + ' is not a function');
	};
	return aCallable;
}

var getMethod;
var hasRequiredGetMethod;

function requireGetMethod () {
	if (hasRequiredGetMethod) return getMethod;
	hasRequiredGetMethod = 1;
	var aCallable = requireACallable();
	var isNullOrUndefined = requireIsNullOrUndefined();

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	getMethod = function (V, P) {
	  var func = V[P];
	  return isNullOrUndefined(func) ? undefined : aCallable(func);
	};
	return getMethod;
}

var ordinaryToPrimitive;
var hasRequiredOrdinaryToPrimitive;

function requireOrdinaryToPrimitive () {
	if (hasRequiredOrdinaryToPrimitive) return ordinaryToPrimitive;
	hasRequiredOrdinaryToPrimitive = 1;
	var call = requireFunctionCall();
	var isCallable = requireIsCallable();
	var isObject = requireIsObject();

	var $TypeError = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	ordinaryToPrimitive = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
	  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
	  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
	  throw new $TypeError("Can't convert object to primitive value");
	};
	return ordinaryToPrimitive;
}

var sharedStore = {exports: {}};

var isPure;
var hasRequiredIsPure;

function requireIsPure () {
	if (hasRequiredIsPure) return isPure;
	hasRequiredIsPure = 1;
	isPure = false;
	return isPure;
}

var defineGlobalProperty;
var hasRequiredDefineGlobalProperty;

function requireDefineGlobalProperty () {
	if (hasRequiredDefineGlobalProperty) return defineGlobalProperty;
	hasRequiredDefineGlobalProperty = 1;
	var globalThis = requireGlobalThis();

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;

	defineGlobalProperty = function (key, value) {
	  try {
	    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    globalThis[key] = value;
	  } return value;
	};
	return defineGlobalProperty;
}

var hasRequiredSharedStore;

function requireSharedStore () {
	if (hasRequiredSharedStore) return sharedStore.exports;
	hasRequiredSharedStore = 1;
	var IS_PURE = requireIsPure();
	var globalThis = requireGlobalThis();
	var defineGlobalProperty = requireDefineGlobalProperty();

	var SHARED = '__core-js_shared__';
	var store = sharedStore.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

	(store.versions || (store.versions = [])).push({
	  version: '3.38.1',
	  mode: IS_PURE ? 'pure' : 'global',
	  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.38.1/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});
	return sharedStore.exports;
}

var shared;
var hasRequiredShared;

function requireShared () {
	if (hasRequiredShared) return shared;
	hasRequiredShared = 1;
	var store = requireSharedStore();

	shared = function (key, value) {
	  return store[key] || (store[key] = value || {});
	};
	return shared;
}

var toObject;
var hasRequiredToObject;

function requireToObject () {
	if (hasRequiredToObject) return toObject;
	hasRequiredToObject = 1;
	var requireObjectCoercible = requireRequireObjectCoercible();

	var $Object = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	toObject = function (argument) {
	  return $Object(requireObjectCoercible(argument));
	};
	return toObject;
}

var hasOwnProperty_1;
var hasRequiredHasOwnProperty;

function requireHasOwnProperty () {
	if (hasRequiredHasOwnProperty) return hasOwnProperty_1;
	hasRequiredHasOwnProperty = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var toObject = requireToObject();

	var hasOwnProperty = uncurryThis({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es/no-object-hasown -- safe
	hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject(it), key);
	};
	return hasOwnProperty_1;
}

var uid;
var hasRequiredUid;

function requireUid () {
	if (hasRequiredUid) return uid;
	hasRequiredUid = 1;
	var uncurryThis = requireFunctionUncurryThis();

	var id = 0;
	var postfix = Math.random();
	var toString = uncurryThis(1.0.toString);

	uid = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
	};
	return uid;
}

var wellKnownSymbol;
var hasRequiredWellKnownSymbol;

function requireWellKnownSymbol () {
	if (hasRequiredWellKnownSymbol) return wellKnownSymbol;
	hasRequiredWellKnownSymbol = 1;
	var globalThis = requireGlobalThis();
	var shared = requireShared();
	var hasOwn = requireHasOwnProperty();
	var uid = requireUid();
	var NATIVE_SYMBOL = requireSymbolConstructorDetection();
	var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();

	var Symbol = globalThis.Symbol;
	var WellKnownSymbolsStore = shared('wks');
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

	wellKnownSymbol = function (name) {
	  if (!hasOwn(WellKnownSymbolsStore, name)) {
	    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
	      ? Symbol[name]
	      : createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};
	return wellKnownSymbol;
}

var toPrimitive;
var hasRequiredToPrimitive;

function requireToPrimitive () {
	if (hasRequiredToPrimitive) return toPrimitive;
	hasRequiredToPrimitive = 1;
	var call = requireFunctionCall();
	var isObject = requireIsObject();
	var isSymbol = requireIsSymbol();
	var getMethod = requireGetMethod();
	var ordinaryToPrimitive = requireOrdinaryToPrimitive();
	var wellKnownSymbol = requireWellKnownSymbol();

	var $TypeError = TypeError;
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	toPrimitive = function (input, pref) {
	  if (!isObject(input) || isSymbol(input)) return input;
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call(exoticToPrim, input, pref);
	    if (!isObject(result) || isSymbol(result)) return result;
	    throw new $TypeError("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};
	return toPrimitive;
}

var toPropertyKey;
var hasRequiredToPropertyKey;

function requireToPropertyKey () {
	if (hasRequiredToPropertyKey) return toPropertyKey;
	hasRequiredToPropertyKey = 1;
	var toPrimitive = requireToPrimitive();
	var isSymbol = requireIsSymbol();

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	toPropertyKey = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};
	return toPropertyKey;
}

var documentCreateElement;
var hasRequiredDocumentCreateElement;

function requireDocumentCreateElement () {
	if (hasRequiredDocumentCreateElement) return documentCreateElement;
	hasRequiredDocumentCreateElement = 1;
	var globalThis = requireGlobalThis();
	var isObject = requireIsObject();

	var document = globalThis.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document) && isObject(document.createElement);

	documentCreateElement = function (it) {
	  return EXISTS ? document.createElement(it) : {};
	};
	return documentCreateElement;
}

var ie8DomDefine;
var hasRequiredIe8DomDefine;

function requireIe8DomDefine () {
	if (hasRequiredIe8DomDefine) return ie8DomDefine;
	hasRequiredIe8DomDefine = 1;
	var DESCRIPTORS = requireDescriptors();
	var fails = requireFails();
	var createElement = requireDocumentCreateElement();

	// Thanks to IE8 for its funny defineProperty
	ie8DomDefine = !DESCRIPTORS && !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a !== 7;
	});
	return ie8DomDefine;
}

var hasRequiredObjectGetOwnPropertyDescriptor;

function requireObjectGetOwnPropertyDescriptor () {
	if (hasRequiredObjectGetOwnPropertyDescriptor) return objectGetOwnPropertyDescriptor;
	hasRequiredObjectGetOwnPropertyDescriptor = 1;
	var DESCRIPTORS = requireDescriptors();
	var call = requireFunctionCall();
	var propertyIsEnumerableModule = requireObjectPropertyIsEnumerable();
	var createPropertyDescriptor = requireCreatePropertyDescriptor();
	var toIndexedObject = requireToIndexedObject();
	var toPropertyKey = requireToPropertyKey();
	var hasOwn = requireHasOwnProperty();
	var IE8_DOM_DEFINE = requireIe8DomDefine();

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPropertyKey(P);
	  if (IE8_DOM_DEFINE) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
	};
	return objectGetOwnPropertyDescriptor;
}

var objectDefineProperty = {};

var v8PrototypeDefineBug;
var hasRequiredV8PrototypeDefineBug;

function requireV8PrototypeDefineBug () {
	if (hasRequiredV8PrototypeDefineBug) return v8PrototypeDefineBug;
	hasRequiredV8PrototypeDefineBug = 1;
	var DESCRIPTORS = requireDescriptors();
	var fails = requireFails();

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	v8PrototypeDefineBug = DESCRIPTORS && fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype !== 42;
	});
	return v8PrototypeDefineBug;
}

var anObject;
var hasRequiredAnObject;

function requireAnObject () {
	if (hasRequiredAnObject) return anObject;
	hasRequiredAnObject = 1;
	var isObject = requireIsObject();

	var $String = String;
	var $TypeError = TypeError;

	// `Assert: Type(argument) is Object`
	anObject = function (argument) {
	  if (isObject(argument)) return argument;
	  throw new $TypeError($String(argument) + ' is not an object');
	};
	return anObject;
}

var hasRequiredObjectDefineProperty;

function requireObjectDefineProperty () {
	if (hasRequiredObjectDefineProperty) return objectDefineProperty;
	hasRequiredObjectDefineProperty = 1;
	var DESCRIPTORS = requireDescriptors();
	var IE8_DOM_DEFINE = requireIe8DomDefine();
	var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
	var anObject = requireAnObject();
	var toPropertyKey = requireToPropertyKey();

	var $TypeError = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  } return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};
	return objectDefineProperty;
}

var createNonEnumerableProperty;
var hasRequiredCreateNonEnumerableProperty;

function requireCreateNonEnumerableProperty () {
	if (hasRequiredCreateNonEnumerableProperty) return createNonEnumerableProperty;
	hasRequiredCreateNonEnumerableProperty = 1;
	var DESCRIPTORS = requireDescriptors();
	var definePropertyModule = requireObjectDefineProperty();
	var createPropertyDescriptor = requireCreatePropertyDescriptor();

	createNonEnumerableProperty = DESCRIPTORS ? function (object, key, value) {
	  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};
	return createNonEnumerableProperty;
}

var makeBuiltIn = {exports: {}};

var functionName;
var hasRequiredFunctionName;

function requireFunctionName () {
	if (hasRequiredFunctionName) return functionName;
	hasRequiredFunctionName = 1;
	var DESCRIPTORS = requireDescriptors();
	var hasOwn = requireHasOwnProperty();

	var FunctionPrototype = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwn(FunctionPrototype, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

	functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};
	return functionName;
}

var inspectSource;
var hasRequiredInspectSource;

function requireInspectSource () {
	if (hasRequiredInspectSource) return inspectSource;
	hasRequiredInspectSource = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var isCallable = requireIsCallable();
	var store = requireSharedStore();

	var functionToString = uncurryThis(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable(store.inspectSource)) {
	  store.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	inspectSource = store.inspectSource;
	return inspectSource;
}

var weakMapBasicDetection;
var hasRequiredWeakMapBasicDetection;

function requireWeakMapBasicDetection () {
	if (hasRequiredWeakMapBasicDetection) return weakMapBasicDetection;
	hasRequiredWeakMapBasicDetection = 1;
	var globalThis = requireGlobalThis();
	var isCallable = requireIsCallable();

	var WeakMap = globalThis.WeakMap;

	weakMapBasicDetection = isCallable(WeakMap) && /native code/.test(String(WeakMap));
	return weakMapBasicDetection;
}

var sharedKey;
var hasRequiredSharedKey;

function requireSharedKey () {
	if (hasRequiredSharedKey) return sharedKey;
	hasRequiredSharedKey = 1;
	var shared = requireShared();
	var uid = requireUid();

	var keys = shared('keys');

	sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};
	return sharedKey;
}

var hiddenKeys;
var hasRequiredHiddenKeys;

function requireHiddenKeys () {
	if (hasRequiredHiddenKeys) return hiddenKeys;
	hasRequiredHiddenKeys = 1;
	hiddenKeys = {};
	return hiddenKeys;
}

var internalState;
var hasRequiredInternalState;

function requireInternalState () {
	if (hasRequiredInternalState) return internalState;
	hasRequiredInternalState = 1;
	var NATIVE_WEAK_MAP = requireWeakMapBasicDetection();
	var globalThis = requireGlobalThis();
	var isObject = requireIsObject();
	var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
	var hasOwn = requireHasOwnProperty();
	var shared = requireSharedStore();
	var sharedKey = requireSharedKey();
	var hiddenKeys = requireHiddenKeys();

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError = globalThis.TypeError;
	var WeakMap = globalThis.WeakMap;
	var set, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared.state) {
	  var store = shared.state || (shared.state = new WeakMap());
	  /* eslint-disable no-self-assign -- prototype methods protection */
	  store.get = store.get;
	  store.has = store.has;
	  store.set = store.set;
	  /* eslint-enable no-self-assign -- prototype methods protection */
	  set = function (it, metadata) {
	    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    store.set(it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return store.get(it) || {};
	  };
	  has = function (it) {
	    return store.has(it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return hasOwn(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwn(it, STATE);
	  };
	}

	internalState = {
	  set: set,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};
	return internalState;
}

var hasRequiredMakeBuiltIn;

function requireMakeBuiltIn () {
	if (hasRequiredMakeBuiltIn) return makeBuiltIn.exports;
	hasRequiredMakeBuiltIn = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var fails = requireFails();
	var isCallable = requireIsCallable();
	var hasOwn = requireHasOwnProperty();
	var DESCRIPTORS = requireDescriptors();
	var CONFIGURABLE_FUNCTION_NAME = requireFunctionName().CONFIGURABLE;
	var inspectSource = requireInspectSource();
	var InternalStateModule = requireInternalState();

	var enforceInternalState = InternalStateModule.enforce;
	var getInternalState = InternalStateModule.get;
	var $String = String;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;
	var stringSlice = uncurryThis(''.slice);
	var replace = uncurryThis(''.replace);
	var join = uncurryThis([].join);

	var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
	  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
	});

	var TEMPLATE = String(String).split('String');

	var makeBuiltIn$1 = makeBuiltIn.exports = function (value, name, options) {
	  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
	    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
	  }
	  if (options && options.getter) name = 'get ' + name;
	  if (options && options.setter) name = 'set ' + name;
	  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
	    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
	    else value.name = name;
	  }
	  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
	    defineProperty(value, 'length', { value: options.arity });
	  }
	  try {
	    if (options && hasOwn(options, 'constructor') && options.constructor) {
	      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
	    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
	    } else if (value.prototype) value.prototype = undefined;
	  } catch (error) { /* empty */ }
	  var state = enforceInternalState(value);
	  if (!hasOwn(state, 'source')) {
	    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
	  } return value;
	};

	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	// eslint-disable-next-line no-extend-native -- required
	Function.prototype.toString = makeBuiltIn$1(function toString() {
	  return isCallable(this) && getInternalState(this).source || inspectSource(this);
	}, 'toString');
	return makeBuiltIn.exports;
}

var defineBuiltIn;
var hasRequiredDefineBuiltIn;

function requireDefineBuiltIn () {
	if (hasRequiredDefineBuiltIn) return defineBuiltIn;
	hasRequiredDefineBuiltIn = 1;
	var isCallable = requireIsCallable();
	var definePropertyModule = requireObjectDefineProperty();
	var makeBuiltIn = requireMakeBuiltIn();
	var defineGlobalProperty = requireDefineGlobalProperty();

	defineBuiltIn = function (O, key, value, options) {
	  if (!options) options = {};
	  var simple = options.enumerable;
	  var name = options.name !== undefined ? options.name : key;
	  if (isCallable(value)) makeBuiltIn(value, name, options);
	  if (options.global) {
	    if (simple) O[key] = value;
	    else defineGlobalProperty(key, value);
	  } else {
	    try {
	      if (!options.unsafe) delete O[key];
	      else if (O[key]) simple = true;
	    } catch (error) { /* empty */ }
	    if (simple) O[key] = value;
	    else definePropertyModule.f(O, key, {
	      value: value,
	      enumerable: false,
	      configurable: !options.nonConfigurable,
	      writable: !options.nonWritable
	    });
	  } return O;
	};
	return defineBuiltIn;
}

var objectGetOwnPropertyNames = {};

var mathTrunc;
var hasRequiredMathTrunc;

function requireMathTrunc () {
	if (hasRequiredMathTrunc) return mathTrunc;
	hasRequiredMathTrunc = 1;
	var ceil = Math.ceil;
	var floor = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es/no-math-trunc -- safe
	mathTrunc = Math.trunc || function trunc(x) {
	  var n = +x;
	  return (n > 0 ? floor : ceil)(n);
	};
	return mathTrunc;
}

var toIntegerOrInfinity;
var hasRequiredToIntegerOrInfinity;

function requireToIntegerOrInfinity () {
	if (hasRequiredToIntegerOrInfinity) return toIntegerOrInfinity;
	hasRequiredToIntegerOrInfinity = 1;
	var trunc = requireMathTrunc();

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	toIntegerOrInfinity = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return number !== number || number === 0 ? 0 : trunc(number);
	};
	return toIntegerOrInfinity;
}

var toAbsoluteIndex;
var hasRequiredToAbsoluteIndex;

function requireToAbsoluteIndex () {
	if (hasRequiredToAbsoluteIndex) return toAbsoluteIndex;
	hasRequiredToAbsoluteIndex = 1;
	var toIntegerOrInfinity = requireToIntegerOrInfinity();

	var max = Math.max;
	var min = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	toAbsoluteIndex = function (index, length) {
	  var integer = toIntegerOrInfinity(index);
	  return integer < 0 ? max(integer + length, 0) : min(integer, length);
	};
	return toAbsoluteIndex;
}

var toLength;
var hasRequiredToLength;

function requireToLength () {
	if (hasRequiredToLength) return toLength;
	hasRequiredToLength = 1;
	var toIntegerOrInfinity = requireToIntegerOrInfinity();

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	toLength = function (argument) {
	  var len = toIntegerOrInfinity(argument);
	  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};
	return toLength;
}

var lengthOfArrayLike;
var hasRequiredLengthOfArrayLike;

function requireLengthOfArrayLike () {
	if (hasRequiredLengthOfArrayLike) return lengthOfArrayLike;
	hasRequiredLengthOfArrayLike = 1;
	var toLength = requireToLength();

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	lengthOfArrayLike = function (obj) {
	  return toLength(obj.length);
	};
	return lengthOfArrayLike;
}

var arrayIncludes;
var hasRequiredArrayIncludes;

function requireArrayIncludes () {
	if (hasRequiredArrayIncludes) return arrayIncludes;
	hasRequiredArrayIncludes = 1;
	var toIndexedObject = requireToIndexedObject();
	var toAbsoluteIndex = requireToAbsoluteIndex();
	var lengthOfArrayLike = requireLengthOfArrayLike();

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = lengthOfArrayLike(O);
	    if (length === 0) return !IS_INCLUDES && -1;
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el !== el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value !== value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};
	return arrayIncludes;
}

var objectKeysInternal;
var hasRequiredObjectKeysInternal;

function requireObjectKeysInternal () {
	if (hasRequiredObjectKeysInternal) return objectKeysInternal;
	hasRequiredObjectKeysInternal = 1;
	var uncurryThis = requireFunctionUncurryThis();
	var hasOwn = requireHasOwnProperty();
	var toIndexedObject = requireToIndexedObject();
	var indexOf = requireArrayIncludes().indexOf;
	var hiddenKeys = requireHiddenKeys();

	var push = uncurryThis([].push);

	objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwn(O, key = names[i++])) {
	    ~indexOf(result, key) || push(result, key);
	  }
	  return result;
	};
	return objectKeysInternal;
}

var enumBugKeys;
var hasRequiredEnumBugKeys;

function requireEnumBugKeys () {
	if (hasRequiredEnumBugKeys) return enumBugKeys;
	hasRequiredEnumBugKeys = 1;
	// IE8- don't enum bug keys
	enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];
	return enumBugKeys;
}

var hasRequiredObjectGetOwnPropertyNames;

function requireObjectGetOwnPropertyNames () {
	if (hasRequiredObjectGetOwnPropertyNames) return objectGetOwnPropertyNames;
	hasRequiredObjectGetOwnPropertyNames = 1;
	var internalObjectKeys = requireObjectKeysInternal();
	var enumBugKeys = requireEnumBugKeys();

	var hiddenKeys = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys(O, hiddenKeys);
	};
	return objectGetOwnPropertyNames;
}

var objectGetOwnPropertySymbols = {};

var hasRequiredObjectGetOwnPropertySymbols;

function requireObjectGetOwnPropertySymbols () {
	if (hasRequiredObjectGetOwnPropertySymbols) return objectGetOwnPropertySymbols;
	hasRequiredObjectGetOwnPropertySymbols = 1;
	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
	return objectGetOwnPropertySymbols;
}

var ownKeys;
var hasRequiredOwnKeys;

function requireOwnKeys () {
	if (hasRequiredOwnKeys) return ownKeys;
	hasRequiredOwnKeys = 1;
	var getBuiltIn = requireGetBuiltIn();
	var uncurryThis = requireFunctionUncurryThis();
	var getOwnPropertyNamesModule = requireObjectGetOwnPropertyNames();
	var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
	var anObject = requireAnObject();

	var concat = uncurryThis([].concat);

	// all object keys, includes non-enumerable and symbols
	ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	};
	return ownKeys;
}

var copyConstructorProperties;
var hasRequiredCopyConstructorProperties;

function requireCopyConstructorProperties () {
	if (hasRequiredCopyConstructorProperties) return copyConstructorProperties;
	hasRequiredCopyConstructorProperties = 1;
	var hasOwn = requireHasOwnProperty();
	var ownKeys = requireOwnKeys();
	var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
	var definePropertyModule = requireObjectDefineProperty();

	copyConstructorProperties = function (target, source, exceptions) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};
	return copyConstructorProperties;
}

var isForced_1;
var hasRequiredIsForced;

function requireIsForced () {
	if (hasRequiredIsForced) return isForced_1;
	hasRequiredIsForced = 1;
	var fails = requireFails();
	var isCallable = requireIsCallable();

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value === POLYFILL ? true
	    : value === NATIVE ? false
	    : isCallable(detection) ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	isForced_1 = isForced;
	return isForced_1;
}

var _export;
var hasRequired_export;

function require_export () {
	if (hasRequired_export) return _export;
	hasRequired_export = 1;
	var globalThis = requireGlobalThis();
	var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
	var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
	var defineBuiltIn = requireDefineBuiltIn();
	var defineGlobalProperty = requireDefineGlobalProperty();
	var copyConstructorProperties = requireCopyConstructorProperties();
	var isForced = requireIsForced();

	/*
	  options.target         - name of the target object
	  options.global         - target is the global object
	  options.stat           - export as static methods of target
	  options.proto          - export as prototype methods of target
	  options.real           - real prototype method for the `pure` version
	  options.forced         - export even if the native feature is available
	  options.bind           - bind methods to the target, required for the `pure` version
	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	  options.sham           - add a flag to not completely full polyfills
	  options.enumerable     - export as enumerable property
	  options.dontCallGetSet - prevent calling a getter on target
	  options.name           - the .name of the function if it does not match the key
	*/
	_export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = globalThis;
	  } else if (STATIC) {
	    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
	  } else {
	    target = globalThis[TARGET] && globalThis[TARGET].prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.dontCallGetSet) {
	      descriptor = getOwnPropertyDescriptor(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    defineBuiltIn(target, key, sourceProperty, options);
	  }
	};
	return _export;
}

var objectDefineProperties = {};

var objectKeys;
var hasRequiredObjectKeys;

function requireObjectKeys () {
	if (hasRequiredObjectKeys) return objectKeys;
	hasRequiredObjectKeys = 1;
	var internalObjectKeys = requireObjectKeysInternal();
	var enumBugKeys = requireEnumBugKeys();

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	objectKeys = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys);
	};
	return objectKeys;
}

var hasRequiredObjectDefineProperties;

function requireObjectDefineProperties () {
	if (hasRequiredObjectDefineProperties) return objectDefineProperties;
	hasRequiredObjectDefineProperties = 1;
	var DESCRIPTORS = requireDescriptors();
	var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
	var definePropertyModule = requireObjectDefineProperty();
	var anObject = requireAnObject();
	var toIndexedObject = requireToIndexedObject();
	var objectKeys = requireObjectKeys();

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	objectDefineProperties.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
	  return O;
	};
	return objectDefineProperties;
}

var html;
var hasRequiredHtml;

function requireHtml () {
	if (hasRequiredHtml) return html;
	hasRequiredHtml = 1;
	var getBuiltIn = requireGetBuiltIn();

	html = getBuiltIn('document', 'documentElement');
	return html;
}

var objectCreate;
var hasRequiredObjectCreate;

function requireObjectCreate () {
	if (hasRequiredObjectCreate) return objectCreate;
	hasRequiredObjectCreate = 1;
	/* global ActiveXObject -- old IE, WSH */
	var anObject = requireAnObject();
	var definePropertiesModule = requireObjectDefineProperties();
	var enumBugKeys = requireEnumBugKeys();
	var hiddenKeys = requireHiddenKeys();
	var html = requireHtml();
	var documentCreateElement = requireDocumentCreateElement();
	var sharedKey = requireSharedKey();

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
	  activeXDocument = null;
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	// eslint-disable-next-line es/no-object-create -- safe
	objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
	};
	return objectCreate;
}

var addToUnscopables;
var hasRequiredAddToUnscopables;

function requireAddToUnscopables () {
	if (hasRequiredAddToUnscopables) return addToUnscopables;
	hasRequiredAddToUnscopables = 1;
	var wellKnownSymbol = requireWellKnownSymbol();
	var create = requireObjectCreate();
	var defineProperty = requireObjectDefineProperty().f;

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] === undefined) {
	  defineProperty(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: create(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};
	return addToUnscopables;
}

var hasRequiredEs_array_includes;

function requireEs_array_includes () {
	if (hasRequiredEs_array_includes) return es_array_includes;
	hasRequiredEs_array_includes = 1;
	var $ = require_export();
	var $includes = requireArrayIncludes().includes;
	var fails = requireFails();
	var addToUnscopables = requireAddToUnscopables();

	// FF99+ bug
	var BROKEN_ON_SPARSE = fails(function () {
	  // eslint-disable-next-line es/no-array-prototype-includes -- detection
	  return !Array(1).includes();
	});

	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');
	return es_array_includes;
}

requireEs_array_includes();

function clampProp(e, n, t, o, r) {
  return clampEntity(n, getDefinedProp(e, n), t, o, r);
}
function clampEntity(e, n, t, o, r, i) {
  const a = clampNumber(n, t, o);
  if (r && n !== a) {
    throw new RangeError(numberOutOfRange(e, n, t, o, i));
  }
  return a;
}
function getDefinedProp(e, n) {
  const t = e[n];
  if (void 0 === t) {
    throw new TypeError(missingField(n));
  }
  return t;
}
function z(e) {
  return null !== e && /object|function/.test(typeof e);
}
function Jn(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Map;
  const t = new n();
  return function (n) {
    if (t.has(n)) {
      return t.get(n);
    }
    for (var _len = arguments.length, o = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      o[_key - 1] = arguments[_key];
    }
    const r = e(n, ...o);
    return t.set(n, r), r;
  };
}
function D$1(e) {
  return p({
    name: e
  }, 1);
}
function p(e, n) {
  return T(e => ({
    value: e,
    configurable: 1,
    writable: !n
  }), e);
}
function O(e) {
  return T(e => ({
    get: e,
    configurable: 1
  }), e);
}
function h(e) {
  return {
    [Symbol.toStringTag]: {
      value: e,
      configurable: 1
    }
  };
}
function zipProps(e, n) {
  const t = {};
  let o = e.length;
  for (const r of n) {
    t[e[--o]] = r;
  }
  return t;
}
function T(e, n, t) {
  const o = {};
  for (const r in n) {
    o[r] = e(n[r], r, t);
  }
  return o;
}
function b(e, n, t) {
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const i = n[r];
    o[i] = e(i, r, t);
  }
  return o;
}
function remapProps(e, n, t) {
  const o = {};
  for (let r = 0; r < e.length; r++) {
    o[n[r]] = t[e[r]];
  }
  return o;
}
function Vn(e, n) {
  const t = {};
  for (const o of e) {
    t[o] = n[o];
  }
  return t;
}
function V(e, n) {
  const t = {};
  for (const o in n) {
    e.has(o) || (t[o] = n[o]);
  }
  return t;
}
function nn(e) {
  e = {
    ...e
  };
  const n = Object.keys(e);
  for (const t of n) {
    void 0 === e[t] && delete e[t];
  }
  return e;
}
function C(e, n) {
  for (const t of n) {
    if (!(t in e)) {
      return 0;
    }
  }
  return 1;
}
function allPropsEqual(e, n, t) {
  for (const o of e) {
    if (n[o] !== t[o]) {
      return 0;
    }
  }
  return 1;
}
function zeroOutProps(e, n, t) {
  const o = {
    ...t
  };
  for (let t = 0; t < n; t++) {
    o[e[t]] = 0;
  }
  return o;
}
function E(e) {
  for (var _len2 = arguments.length, n = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    n[_key2 - 1] = arguments[_key2];
  }
  return function () {
    for (var _len3 = arguments.length, t = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      t[_key3] = arguments[_key3];
    }
    return e(...n, ...t);
  };
}
function capitalize(e) {
  return e[0].toUpperCase() + e.substring(1);
}
function sortStrings(e) {
  return e.slice().sort();
}
function padNumber(e, n) {
  return String(n).padStart(e, "0");
}
function compareNumbers(e, n) {
  return Math.sign(e - n);
}
function clampNumber(e, n, t) {
  return Math.min(Math.max(e, n), t);
}
function divModFloor(e, n) {
  return [Math.floor(e / n), modFloor(e, n)];
}
function modFloor(e, n) {
  return (e % n + n) % n;
}
function divModTrunc(e, n) {
  return [divTrunc(e, n), modTrunc(e, n)];
}
function divTrunc(e, n) {
  return Math.trunc(e / n) || 0;
}
function modTrunc(e, n) {
  return e % n || 0;
}
function hasHalf(e) {
  return .5 === Math.abs(e % 1);
}
function givenFieldsToBigNano(e, n, t) {
  let o = 0,
    r = 0;
  for (let i = 0; i <= n; i++) {
    const n = e[t[i]],
      a = Xr[i],
      s = Qr / a,
      [c, u] = divModTrunc(n, s);
    o += u * a, r += c;
  }
  const [i, a] = divModTrunc(o, Qr);
  return [r + i, a];
}
function nanoToGivenFields(e, n, t) {
  const o = {};
  for (let r = n; r >= 0; r--) {
    const n = Xr[r];
    o[t[r]] = divTrunc(e, n), e = modTrunc(e, n);
  }
  return o;
}
function un(e) {
  return e === X ? si : [];
}
function cn(e) {
  return e === X ? li : [];
}
function ln(e) {
  return e === X ? ["year", "day"] : [];
}
function l(e) {
  if (void 0 !== e) {
    return m(e);
  }
}
function S(e) {
  if (void 0 !== e) {
    return d(e);
  }
}
function c(e) {
  if (void 0 !== e) {
    return u(e);
  }
}
function d(e) {
  return requireNumberIsPositive(u(e));
}
function u(e) {
  return requireNumberIsInteger(Mi(e));
}
function on(e) {
  if (null == e) {
    throw new TypeError("Cannot be null or undefined");
  }
  return e;
}
function requirePropDefined(e, n) {
  if (null == n) {
    throw new RangeError(missingField(e));
  }
  return n;
}
function de(e) {
  if (!z(e)) {
    throw new TypeError(hr);
  }
  return e;
}
function requireType(e, n) {
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : e;
  if (typeof n !== e) {
    throw new TypeError(invalidEntity(t, n));
  }
  return n;
}
function requireNumberIsInteger(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "number";
  if (!Number.isInteger(e)) {
    throw new RangeError(expectedInteger(n, e));
  }
  return e || 0;
}
function requireNumberIsPositive(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "number";
  if (e <= 0) {
    throw new RangeError(expectedPositive(n, e));
  }
  return e;
}
function toString(e) {
  if ("symbol" == typeof e) {
    throw new TypeError(pr);
  }
  return String(e);
}
function toStringViaPrimitive(e, n) {
  return z(e) ? String(e) : m(e, n);
}
function toBigInt(e) {
  if ("string" == typeof e) {
    return BigInt(e);
  }
  if ("bigint" != typeof e) {
    throw new TypeError(invalidBigInt(e));
  }
  return e;
}
function toNumber(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "number";
  if ("bigint" == typeof e) {
    throw new TypeError(forbiddenBigIntToNumber(n));
  }
  if (e = Number(e), !Number.isFinite(e)) {
    throw new RangeError(expectedFinite(n, e));
  }
  return e;
}
function toInteger(e, n) {
  return Math.trunc(toNumber(e, n)) || 0;
}
function toStrictInteger(e, n) {
  return requireNumberIsInteger(toNumber(e, n), n);
}
function toPositiveInteger(e, n) {
  return requireNumberIsPositive(toInteger(e, n), n);
}
function createBigNano(e, n) {
  let [t, o] = divModTrunc(n, Qr),
    r = e + t;
  const i = Math.sign(r);
  return i && i === -Math.sign(o) && (r -= i, o += i * Qr), [r, o];
}
function addBigNanos(e, n) {
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return createBigNano(e[0] + n[0] * t, e[1] + n[1] * t);
}
function moveBigNano(e, n) {
  return createBigNano(e[0], e[1] + n);
}
function re(e, n) {
  return addBigNanos(n, e, -1);
}
function te(e, n) {
  return compareNumbers(e[0], n[0]) || compareNumbers(e[1], n[1]);
}
function bigNanoOutside(e, n, t) {
  return -1 === te(e, n) || 1 === te(e, t);
}
function bigIntToBigNano(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  const t = BigInt(Qr / n);
  return [Number(e / t), Number(e % t) * n];
}
function he(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  const t = Qr / n,
    [o, r] = divModTrunc(e, t);
  return [o, r * n];
}
function bigNanoToBigInt(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  const [t, o] = e,
    r = Math.floor(o / n),
    i = Qr / n;
  return BigInt(t) * BigInt(i) + BigInt(r);
}
function oe(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  let t = arguments.length > 2 ? arguments[2] : undefined;
  const [o, r] = e,
    [i, a] = divModTrunc(r, n);
  return o * (Qr / n) + (i + (t ? a / n : 0));
}
function divModBigNano(e, n) {
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : divModFloor;
  const [o, r] = e,
    [i, a] = t(r, n);
  return [o * (Qr / n) + i, a];
}
function hashIntlFormatParts(e, n) {
  const t = e.formatToParts(n),
    o = {};
  for (const e of t) {
    o[e.type] = e.value;
  }
  return o;
}
function checkIsoYearMonthInBounds(e) {
  return clampProp(e, "isoYear", Li, Ai, 1), e.isoYear === Li ? clampProp(e, "isoMonth", 4, 12, 1) : e.isoYear === Ai && clampProp(e, "isoMonth", 1, 9, 1), e;
}
function checkIsoDateInBounds(e) {
  return checkIsoDateTimeInBounds({
    ...e,
    ...Dt,
    isoHour: 12
  }), e;
}
function checkIsoDateTimeInBounds(e) {
  const n = clampProp(e, "isoYear", Li, Ai, 1),
    t = n === Li ? 1 : n === Ai ? -1 : 0;
  return t && checkEpochNanoInBounds(isoToEpochNano({
    ...e,
    isoDay: e.isoDay + t,
    isoNanosecond: e.isoNanosecond - t
  })), e;
}
function checkEpochNanoInBounds(e) {
  if (!e || bigNanoOutside(e, Ui, qi)) {
    throw new RangeError(Cr);
  }
  return e;
}
function isoTimeFieldsToNano(e) {
  return givenFieldsToBigNano(e, 5, j)[1];
}
function nanoToIsoTimeAndDay(e) {
  const [n, t] = divModFloor(e, Qr);
  return [nanoToGivenFields(t, 5, j), n];
}
function epochNanoToSec(e) {
  return epochNanoToSecMod(e)[0];
}
function epochNanoToSecMod(e) {
  return divModBigNano(e, _r);
}
function isoToEpochMilli(e) {
  return isoArgsToEpochMilli(e.isoYear, e.isoMonth, e.isoDay, e.isoHour, e.isoMinute, e.isoSecond, e.isoMillisecond);
}
function isoToEpochNano(e) {
  const n = isoToEpochMilli(e);
  if (void 0 !== n) {
    const [t, o] = divModTrunc(n, Gr);
    return [t, o * be + (e.isoMicrosecond || 0) * Vr + (e.isoNanosecond || 0)];
  }
}
function isoToEpochNanoWithOffset(e, n) {
  const [t, o] = nanoToIsoTimeAndDay(isoTimeFieldsToNano(e) - n);
  return checkEpochNanoInBounds(isoToEpochNano({
    ...e,
    isoDay: e.isoDay + o,
    ...t
  }));
}
function isoArgsToEpochSec() {
  return isoArgsToEpochMilli(...arguments) / Hr;
}
function isoArgsToEpochMilli() {
  const [n, t] = isoToLegacyDate(...arguments),
    o = n.valueOf();
  if (!isNaN(o)) {
    return o - t * Gr;
  }
}
function isoToLegacyDate(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  let i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  let a = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  const s = e === Li ? 1 : e === Ai ? -1 : 0,
    c = new Date();
  return c.setUTCHours(o, r, i, a), c.setUTCFullYear(e, n - 1, t + s), [c, s];
}
function Ie(e, n) {
  let [t, o] = moveBigNano(e, n);
  o < 0 && (o += Qr, t -= 1);
  const [r, i] = divModFloor(o, be),
    [a, s] = divModFloor(i, Vr);
  return epochMilliToIso(t * Gr + r, a, s);
}
function epochMilliToIso(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  const o = Math.ceil(Math.max(0, Math.abs(e) - zi) / Gr) * Math.sign(e),
    r = new Date(e - o * Gr);
  return zipProps(wi, [r.getUTCFullYear(), r.getUTCMonth() + 1, r.getUTCDate() + o, r.getUTCHours(), r.getUTCMinutes(), r.getUTCSeconds(), r.getUTCMilliseconds(), n, t]);
}
function computeIsoDateParts(e) {
  return [e.isoYear, e.isoMonth, e.isoDay];
}
function computeIsoMonthsInYear() {
  return xi;
}
function computeIsoDaysInMonth(e, n) {
  switch (n) {
    case 2:
      return computeIsoInLeapYear(e) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
  }
  return 31;
}
function computeIsoDaysInYear(e) {
  return computeIsoInLeapYear(e) ? 366 : 365;
}
function computeIsoInLeapYear(e) {
  return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function computeIsoDayOfWeek(e) {
  const [n, t] = isoToLegacyDate(e.isoYear, e.isoMonth, e.isoDay);
  return modFloor(n.getUTCDay() - t, 7) || 7;
}
function computeGregoryEraParts(_ref) {
  let {
    isoYear: e
  } = _ref;
  return e < 1 ? ["bce", 1 - e] : ["ce", e];
}
function computeJapaneseEraParts(e) {
  const n = isoToEpochMilli(e);
  if (n < $i) {
    return computeGregoryEraParts(e);
  }
  const t = hashIntlFormatParts(La(Ti), n),
    {
      era: o,
      eraYear: r
    } = parseIntlYear(t, Ti);
  return [o, r];
}
function checkIsoDateTimeFields(e) {
  return checkIsoDateFields(e), constrainIsoTimeFields(e, 1), e;
}
function checkIsoDateFields(e) {
  return constrainIsoDateFields(e, 1), e;
}
function isIsoDateFieldsValid(e) {
  return allPropsEqual(Oi, e, constrainIsoDateFields(e));
}
function constrainIsoDateFields(e, n) {
  const {
      isoYear: t
    } = e,
    o = clampProp(e, "isoMonth", 1, computeIsoMonthsInYear(), n);
  return {
    isoYear: t,
    isoMonth: o,
    isoDay: clampProp(e, "isoDay", 1, computeIsoDaysInMonth(t, o), n)
  };
}
function constrainIsoTimeFields(e, n) {
  return zipProps(j, [clampProp(e, "isoHour", 0, 23, n), clampProp(e, "isoMinute", 0, 59, n), clampProp(e, "isoSecond", 0, 59, n), clampProp(e, "isoMillisecond", 0, 999, n), clampProp(e, "isoMicrosecond", 0, 999, n), clampProp(e, "isoNanosecond", 0, 999, n)]);
}
function H(e) {
  return void 0 === e ? 0 : ua(de(e));
}
function wn(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  e = normalizeOptions(e);
  const t = la(e),
    o = fa(e, n);
  return [ua(e), o, t];
}
function ve(e) {
  return la(normalizeOptions(e));
}
function _t(e) {
  return e = normalizeOptions(e), sa(e, 9, 6, 1);
}
function refineDiffOptions(e, n, t) {
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 9;
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  let i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;
  n = normalizeOptions(n);
  let a = sa(n, o, r),
    s = parseRoundingIncInteger(n),
    c = ha(n, i);
  const u = aa(n, o, r, 1);
  return null == a ? a = Math.max(t, u) : checkLargestSmallestUnit(a, u), s = refineRoundingInc(s, u, 1), e && (c = (e => e < 4 ? (e + 2) % 4 : e)(c)), [a, u, s, c];
}
function refineRoundingOptions(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
  let t = arguments.length > 2 ? arguments[2] : undefined;
  let o = parseRoundingIncInteger(e = normalizeOptionsOrString(e, Hi));
  const r = ha(e, 7);
  let i = aa(e, n);
  return i = requirePropDefined(Hi, i), o = refineRoundingInc(o, i, void 0, t), [i, o, r];
}
function refineDateDisplayOptions(e) {
  return da(normalizeOptions(e));
}
function refineTimeDisplayOptions(e, n) {
  return refineTimeDisplayTuple(normalizeOptions(e), n);
}
function refineTimeDisplayTuple(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  const t = refineSubsecDigits(e);
  return [ha(e, 4), ...refineSmallestUnitAndSubsecDigits(aa(e, n), t)];
}
function refineSmallestUnitAndSubsecDigits(e, n) {
  return null != e ? [Xr[e], e < 4 ? 9 - 3 * e : -1] : [void 0 === n ? 1 : 10 ** (9 - n), n];
}
function parseRoundingIncInteger(e) {
  const n = e[_i];
  return void 0 === n ? 1 : toInteger(n, _i);
}
function refineRoundingInc(e, n, t, o) {
  const r = o ? Qr : Xr[n + 1];
  if (r) {
    const t = Xr[n];
    if (r % ((e = clampEntity(_i, e, 1, r / t - (o ? 0 : 1), 1)) * t)) {
      throw new RangeError(invalidEntity(_i, e));
    }
  } else {
    e = clampEntity(_i, e, 1, t ? 10 ** 9 : 1, 1);
  }
  return e;
}
function refineSubsecDigits(e) {
  let n = e[Ji];
  if (void 0 !== n) {
    if ("number" != typeof n) {
      if ("auto" === toString(n)) {
        return;
      }
      throw new RangeError(invalidEntity(Ji, n));
    }
    n = clampEntity(Ji, Math.floor(n), 0, 9, 1);
  }
  return n;
}
function normalizeOptions(e) {
  return void 0 === e ? {} : de(e);
}
function normalizeOptionsOrString(e, n) {
  return "string" == typeof e ? {
    [n]: e
  } : de(e);
}
function U(e) {
  if (void 0 !== e) {
    if (z(e)) {
      return Object.assign(Object.create(null), e);
    }
    throw new TypeError(hr);
  }
}
function overrideOverflowOptions(e, n) {
  return e && Object.assign(Object.create(null), e, {
    overflow: Xi[n]
  });
}
function refineUnitOption(e, n) {
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 9;
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  let r = arguments.length > 4 ? arguments[4] : undefined;
  let i = n[e];
  if (void 0 === i) {
    return r ? o : void 0;
  }
  if (i = toString(i), "auto" === i) {
    return r ? o : null;
  }
  let a = $r[i];
  if (void 0 === a && (a = Ei[i]), void 0 === a) {
    throw new RangeError(invalidChoice(e, i, $r));
  }
  return clampEntity(e, a, o, t, 1, Et), a;
}
function refineChoiceOption(e, n, t) {
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  const r = t[e];
  if (void 0 === r) {
    return o;
  }
  const i = toString(r),
    a = n[i];
  if (void 0 === a) {
    throw new RangeError(invalidChoice(e, i, n));
  }
  return a;
}
function checkLargestSmallestUnit(e, n) {
  if (n > e) {
    throw new RangeError(Ar);
  }
}
function _(e) {
  return {
    branding: Oe,
    epochNanoseconds: e
  };
}
function Yn(e, n, t) {
  return {
    branding: Te,
    calendar: t,
    timeZone: n,
    epochNanoseconds: e
  };
}
function ee(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : e.calendar;
  return {
    branding: We,
    calendar: n,
    ...Vn(Yi, e)
  };
}
function v(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : e.calendar;
  return {
    branding: J,
    calendar: n,
    ...Vn(Bi, e)
  };
}
function createPlainYearMonthSlots(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : e.calendar;
  return {
    branding: L,
    calendar: n,
    ...Vn(Bi, e)
  };
}
function createPlainMonthDaySlots(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : e.calendar;
  return {
    branding: q,
    calendar: n,
    ...Vn(Bi, e)
  };
}
function Ge(e) {
  return {
    branding: xe,
    ...Vn(ki, e)
  };
}
function Vt(e) {
  return {
    branding: qt,
    sign: computeDurationSign(e),
    ...Vn(Ni, e)
  };
}
function M(e) {
  return epochNanoToSec(e.epochNanoseconds);
}
function y(e) {
  return divModBigNano(e.epochNanoseconds, be)[0];
}
function N(e) {
  return bigNanoToBigInt(e.epochNanoseconds, Vr);
}
function B(e) {
  return bigNanoToBigInt(e.epochNanoseconds);
}
function extractEpochNano(e) {
  return e.epochNanoseconds;
}
function I(e) {
  return "string" == typeof e ? e : m(e.id);
}
function isIdLikeEqual(e, n) {
  return e === n || I(e) === I(n);
}
function Ut(e, n, t, o, r) {
  const i = getMaxDurationUnit(o),
    [a, s] = ((e, n) => {
      const t = n((e = normalizeOptionsOrString(e, Vi))[Ki]);
      let o = ca(e);
      return o = requirePropDefined(Vi, o), [o, t];
    })(r, e);
  if (isUniformUnit(Math.max(a, i), s)) {
    return totalDayTimeDuration(o, a);
  }
  if (!s) {
    throw new RangeError(zr);
  }
  const [c, u, l] = createMarkerSystem(n, t, s),
    f = createMarkerToEpochNano(l),
    d = createMoveMarker(l),
    m = createDiffMarkers(l),
    p = d(u, c, o),
    h = m(u, c, p, a);
  return isUniformUnit(a, s) ? totalDayTimeDuration(h, a) : ((e, n, t, o, r, i, a) => {
    const s = computeDurationSign(e),
      [c, u] = clampRelativeDuration(o, bi(t, e), t, s, r, i, a),
      l = computeEpochNanoFrac(n, c, u);
    return e[F[t]] + l * s;
  })(h, f(p), a, u, c, f, d);
}
function totalDayTimeDuration(e, n) {
  return oe(durationFieldsToBigNano(e), Xr[n], 1);
}
function clampRelativeDuration(e, n, t, o, r, i, a) {
  const s = F[t],
    c = {
      ...n,
      [s]: n[s] + o
    },
    u = a(e, r, n),
    l = a(e, r, c);
  return [i(u), i(l)];
}
function computeEpochNanoFrac(e, n, t) {
  const o = oe(re(n, t));
  if (!o) {
    throw new RangeError(vr);
  }
  return oe(re(n, e)) / o;
}
function ce(e, n) {
  const [t, o, r] = refineRoundingOptions(n, 5, 1);
  return _(roundBigNano(e.epochNanoseconds, t, o, r, 1));
}
function Pn(e, n, t) {
  let {
    epochNanoseconds: o,
    timeZone: r,
    calendar: i
  } = n;
  const [a, s, c] = refineRoundingOptions(t);
  if (0 === a && 1 === s) {
    return n;
  }
  const u = e(r);
  if (6 === a) {
    o = ((e, n, t, o) => {
      const r = fn(t, n),
        [i, a] = e(r),
        s = t.epochNanoseconds,
        c = we(n, i),
        u = we(n, a);
      if (bigNanoOutside(s, c, u)) {
        throw new RangeError(vr);
      }
      return roundWithMode(computeEpochNanoFrac(s, c, u), o) ? u : c;
    })(computeDayInterval, u, n, c);
  } else {
    const e = u.getOffsetNanosecondsFor(o);
    o = getMatchingInstantFor(u, roundDateTime(Ie(o, e), a, s, c), e, 2, 0, 1);
  }
  return Yn(o, r, i);
}
function dt(e, n) {
  return ee(roundDateTime(e, ...refineRoundingOptions(n)), e.calendar);
}
function Ee(e, n) {
  const [t, o, r] = refineRoundingOptions(n, 5);
  var i;
  return Ge((i = r, roundTimeToNano(e, computeNanoInc(t, o), i)[0]));
}
function dn(e, n) {
  const t = e(n.timeZone),
    o = fn(n, t),
    [r, i] = computeDayInterval(o),
    a = oe(re(we(t, r), we(t, i)), Kr, 1);
  if (a <= 0) {
    throw new RangeError(vr);
  }
  return a;
}
function Cn(e, n) {
  const {
      timeZone: t,
      calendar: o
    } = n,
    r = ((e, n, t) => we(n, e(fn(t, n))))(computeDayFloor, e(t), n);
  return Yn(r, t, o);
}
function roundDateTime(e, n, t, o) {
  return roundDateTimeToNano(e, computeNanoInc(n, t), o);
}
function roundDateTimeToNano(e, n, t) {
  const [o, r] = roundTimeToNano(e, n, t);
  return checkIsoDateTimeInBounds({
    ...moveByDays(e, r),
    ...o
  });
}
function roundTimeToNano(e, n, t) {
  return nanoToIsoTimeAndDay(roundByInc(isoTimeFieldsToNano(e), n, t));
}
function roundToMinute(e) {
  return roundByInc(e, Jr, 7);
}
function computeNanoInc(e, n) {
  return Xr[e] * n;
}
function computeDayInterval(e) {
  const n = computeDayFloor(e);
  return [n, moveByDays(n, 1)];
}
function computeDayFloor(e) {
  return Ci(6, e);
}
function roundDayTimeDurationByInc(e, n, t) {
  const o = Math.min(getMaxDurationUnit(e), 6);
  return nanoToDurationDayTimeFields(roundBigNanoByInc(durationFieldsToBigNano(e, o), n, t), o);
}
function roundRelativeDuration(e, n, t, o, r, i, a, s, c, u) {
  if (0 === o && 1 === r) {
    return e;
  }
  const l = isUniformUnit(o, s) ? isZonedEpochSlots(s) && o < 6 && t >= 6 ? nudgeZonedTimeDuration : nudgeDayTimeDuration : nudgeRelativeDuration;
  let [f, d, m] = l(e, n, t, o, r, i, a, s, c, u);
  return m && 7 !== o && (f = ((e, n, t, o, r, i, a, s) => {
    const c = computeDurationSign(e);
    for (let u = o + 1; u <= t; u++) {
      if (7 === u && 7 !== t) {
        continue;
      }
      const o = bi(u, e);
      o[F[u]] += c;
      const l = oe(re(a(s(r, i, o)), n));
      if (l && Math.sign(l) !== c) {
        break;
      }
      e = o;
    }
    return e;
  })(f, d, t, Math.max(6, o), a, s, c, u)), f;
}
function roundBigNano(e, n, t, o, r) {
  if (6 === n) {
    const n = (e => e[0] + e[1] / Qr)(e);
    return [roundByInc(n, t, o), 0];
  }
  return roundBigNanoByInc(e, computeNanoInc(n, t), o, r);
}
function roundBigNanoByInc(e, n, t, o) {
  let [r, i] = e;
  o && i < 0 && (i += Qr, r -= 1);
  const [a, s] = divModFloor(roundByInc(i, n, t), Qr);
  return createBigNano(r + a, s);
}
function roundByInc(e, n, t) {
  return roundWithMode(e / n, t) * n;
}
function roundWithMode(e, n) {
  return ga[n](e);
}
function nudgeDayTimeDuration(e, n, t, o, r, i) {
  const a = computeDurationSign(e),
    s = durationFieldsToBigNano(e),
    c = roundBigNano(s, o, r, i),
    u = re(s, c),
    l = Math.sign(c[0] - s[0]) === a,
    f = nanoToDurationDayTimeFields(c, Math.min(t, 6));
  return [{
    ...e,
    ...f
  }, addBigNanos(n, u), l];
}
function nudgeZonedTimeDuration(e, n, t, o, r, i, a, s, c, u) {
  const l = computeDurationSign(e),
    f = oe(durationFieldsToBigNano(e, 5)),
    d = computeNanoInc(o, r);
  let m = roundByInc(f, d, i);
  const [p, h] = clampRelativeDuration(a, {
      ...e,
      ...Fi
    }, 6, l, s, c, u),
    g = m - oe(re(p, h));
  let T = 0;
  g && Math.sign(g) !== l ? n = moveBigNano(p, m) : (T += l, m = roundByInc(g, d, i), n = moveBigNano(h, m));
  const D = nanoToDurationTimeFields(m);
  return [{
    ...e,
    ...D,
    days: e.days + T
  }, n, Boolean(T)];
}
function nudgeRelativeDuration(e, n, t, o, r, i, a, s, c, u) {
  const l = computeDurationSign(e),
    f = F[o],
    d = bi(o, e);
  7 === o && (e = {
    ...e,
    weeks: e.weeks + Math.trunc(e.days / 7)
  });
  const m = divTrunc(e[f], r) * r;
  d[f] = m;
  const [p, h] = clampRelativeDuration(a, d, o, r * l, s, c, u),
    g = m + computeEpochNanoFrac(n, p, h) * l * r,
    T = roundByInc(g, r, i),
    D = Math.sign(T - g) === l;
  return d[f] = T, [d, D ? h : p, D];
}
function me(e, n, t, o) {
  const [r, i, a, s] = (e => {
      const n = refineTimeDisplayTuple(e = normalizeOptions(e));
      return [e.timeZone, ...n];
    })(o),
    c = void 0 !== r;
  return ((e, n, t, o, r, i) => {
    t = roundBigNanoByInc(t, r, o, 1);
    const a = n.getOffsetNanosecondsFor(t);
    return formatIsoDateTimeFields(Ie(t, a), i) + (e ? Fe(roundToMinute(a)) : "Z");
  })(c, n(c ? e(r) : Ta), t.epochNanoseconds, i, a, s);
}
function In(e, n, t) {
  const [o, r, i, a, s, c] = (e => {
    e = normalizeOptions(e);
    const n = da(e),
      t = refineSubsecDigits(e),
      o = pa(e),
      r = ha(e, 4),
      i = aa(e, 4);
    return [n, ma(e), o, r, ...refineSmallestUnitAndSubsecDigits(i, t)];
  })(t);
  return ((e, n, t, o, r, i, a, s, c, u) => {
    o = roundBigNanoByInc(o, c, s, 1);
    const l = e(t).getOffsetNanosecondsFor(o);
    return formatIsoDateTimeFields(Ie(o, l), u) + Fe(roundToMinute(l), a) + ((e, n) => 1 !== n ? "[" + (2 === n ? "!" : "") + I(e) + "]" : "")(t, i) + formatCalendar(n, r);
  })(e, n.calendar, n.timeZone, n.epochNanoseconds, o, r, i, a, s, c);
}
function Tt(e, n) {
  const [t, o, r, i] = (e => (e = normalizeOptions(e), [da(e), ...refineTimeDisplayTuple(e)]))(n);
  return a = e.calendar, s = t, c = i, formatIsoDateTimeFields(roundDateTimeToNano(e, r, o), c) + formatCalendar(a, s);
  var a, s, c;
}
function yt(e, n) {
  return t = e.calendar, o = e, r = refineDateDisplayOptions(n), formatIsoDateFields(o) + formatCalendar(t, r);
  var t, o, r;
}
function et(e, n) {
  return formatDateLikeIso(e.calendar, formatIsoYearMonthFields, e, refineDateDisplayOptions(n));
}
function W(e, n) {
  return formatDateLikeIso(e.calendar, formatIsoMonthDayFields, e, refineDateDisplayOptions(n));
}
function qe(e, n) {
  const [t, o, r] = refineTimeDisplayOptions(n);
  return i = r, formatIsoTimeFields(roundTimeToNano(e, o, t)[0], i);
  var i;
}
function zt(e, n) {
  const [t, o, r] = refineTimeDisplayOptions(n, 3);
  return o > 1 && (e = {
    ...e,
    ...roundDayTimeDurationByInc(e, o, t)
  }), ((e, n) => {
    const {
        sign: t
      } = e,
      o = -1 === t ? negateDurationFields(e) : e,
      {
        hours: r,
        minutes: i
      } = o,
      [a, s] = divModBigNano(durationFieldsToBigNano(o, 3), _r, divModTrunc);
    checkDurationTimeUnit(a);
    const c = formatSubsecNano(s, n),
      u = n >= 0 || !t || c;
    return (t < 0 ? "-" : "") + "P" + formatDurationFragments({
      Y: formatDurationNumber(o.years),
      M: formatDurationNumber(o.months),
      W: formatDurationNumber(o.weeks),
      D: formatDurationNumber(o.days)
    }) + (r || i || a || u ? "T" + formatDurationFragments({
      H: formatDurationNumber(r),
      M: formatDurationNumber(i),
      S: formatDurationNumber(a, u) + c
    }) : "");
  })(e, r);
}
function formatDateLikeIso(e, n, t, o) {
  const r = I(e),
    i = o > 1 || 0 === o && r !== X;
  return 1 === o ? r === X ? n(t) : formatIsoDateFields(t) : i ? formatIsoDateFields(t) + formatCalendarId(r, 2 === o) : n(t);
}
function formatDurationFragments(e) {
  const n = [];
  for (const t in e) {
    const o = e[t];
    o && n.push(o, t);
  }
  return n.join("");
}
function formatIsoDateTimeFields(e, n) {
  return formatIsoDateFields(e) + "T" + formatIsoTimeFields(e, n);
}
function formatIsoDateFields(e) {
  return formatIsoYearMonthFields(e) + "-" + xr(e.isoDay);
}
function formatIsoYearMonthFields(e) {
  const {
    isoYear: n
  } = e;
  return (n < 0 || n > 9999 ? getSignStr(n) + padNumber(6, Math.abs(n)) : padNumber(4, n)) + "-" + xr(e.isoMonth);
}
function formatIsoMonthDayFields(e) {
  return xr(e.isoMonth) + "-" + xr(e.isoDay);
}
function formatIsoTimeFields(e, n) {
  const t = [xr(e.isoHour), xr(e.isoMinute)];
  return -1 !== n && t.push(xr(e.isoSecond) + ((e, n, t, o) => formatSubsecNano(e * be + n * Vr + t, o))(e.isoMillisecond, e.isoMicrosecond, e.isoNanosecond, n)), t.join(":");
}
function Fe(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (1 === n) {
    return "";
  }
  const [t, o] = divModFloor(Math.abs(e), Kr),
    [r, i] = divModFloor(o, Jr),
    [a, s] = divModFloor(i, _r);
  return getSignStr(e) + xr(t) + ":" + xr(r) + (a || s ? ":" + xr(a) + formatSubsecNano(s) : "");
}
function formatCalendar(e, n) {
  if (1 !== n) {
    const t = I(e);
    if (n > 1 || 0 === n && t !== X) {
      return formatCalendarId(t, 2 === n);
    }
  }
  return "";
}
function formatCalendarId(e, n) {
  return "[" + (n ? "!" : "") + "u-ca=" + e + "]";
}
function formatSubsecNano(e, n) {
  let t = padNumber(9, e);
  return t = void 0 === n ? t.replace(Na, "") : t.slice(0, n), t ? "." + t : "";
}
function getSignStr(e) {
  return e < 0 ? "-" : "+";
}
function formatDurationNumber(e, n) {
  return e || n ? e.toLocaleString("fullwide", {
    useGrouping: 0
  }) : "";
}
function _zonedEpochSlotsToIso(e, n) {
  const {
      epochNanoseconds: t
    } = e,
    o = (n.getOffsetNanosecondsFor ? n : n(e.timeZone)).getOffsetNanosecondsFor(t),
    r = Ie(t, o);
  return {
    calendar: e.calendar,
    ...r,
    offsetNanoseconds: o
  };
}
function mn(e, n) {
  const t = fn(n, e);
  return {
    calendar: n.calendar,
    ...Vn(Yi, t),
    offset: Fe(t.offsetNanoseconds),
    timeZone: n.timeZone
  };
}
function getMatchingInstantFor(e, n, t) {
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  let i = arguments.length > 5 ? arguments[5] : undefined;
  let a = arguments.length > 6 ? arguments[6] : undefined;
  if (void 0 !== t && 1 === o && (1 === o || a)) {
    return isoToEpochNanoWithOffset(n, t);
  }
  const s = e.getPossibleInstantsFor(n);
  if (void 0 !== t && 3 !== o) {
    const e = ((e, n, t, o) => {
      const r = isoToEpochNano(n);
      o && (t = roundToMinute(t));
      for (const n of e) {
        let e = oe(re(n, r));
        if (o && (e = roundToMinute(e)), e === t) {
          return n;
        }
      }
    })(s, n, t, i);
    if (void 0 !== e) {
      return e;
    }
    if (0 === o) {
      throw new RangeError(kr);
    }
  }
  return a ? isoToEpochNano(n) : we(e, n, r, s);
}
function we(e, n) {
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : e.getPossibleInstantsFor(n);
  if (1 === o.length) {
    return o[0];
  }
  if (1 === t) {
    throw new RangeError(Yr);
  }
  if (o.length) {
    return o[3 === t ? 1 : 0];
  }
  const r = isoToEpochNano(n),
    i = ((e, n) => {
      const t = e.getOffsetNanosecondsFor(moveBigNano(n, -Qr));
      return ne(e.getOffsetNanosecondsFor(moveBigNano(n, Qr)) - t);
    })(e, r),
    a = i * (2 === t ? -1 : 1);
  return (o = e.getPossibleInstantsFor(Ie(r, a)))[2 === t ? 0 : o.length - 1];
}
function ae(e) {
  if (Math.abs(e) >= Qr) {
    throw new RangeError(wr);
  }
  return e;
}
function ne(e) {
  if (e > Qr) {
    throw new RangeError(Br);
  }
  return e;
}
function se(e, n, t) {
  return _(checkEpochNanoInBounds(addBigNanos(n.epochNanoseconds, (e => {
    if (durationHasDateParts(e)) {
      throw new RangeError(qr);
    }
    return durationFieldsToBigNano(e, 5);
  })(e ? negateDurationFields(t) : t))));
}
function hn(e, n, t, o, r) {
  let i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Object.create(null);
  const a = n(o.timeZone),
    s = e(o.calendar);
  return {
    ...o,
    ...moveZonedEpochs(a, s, o, t ? negateDurationFields(r) : r, i)
  };
}
function ct(e, n, t, o) {
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Object.create(null);
  const {
    calendar: i
  } = t;
  return ee(moveDateTime(e(i), t, n ? negateDurationFields(o) : o, r), i);
}
function bt(e, n, t, o, r) {
  const {
    calendar: i
  } = t;
  return v(moveDate(e(i), t, n ? negateDurationFields(o) : o, r), i);
}
function Qe(e, n, t, o) {
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Object.create(null);
  const i = t.calendar,
    a = e(i);
  let s = moveToDayOfMonthUnsafe(a, t);
  n && (o = xt(o)), o.sign < 0 && (s = a.dateAdd(s, {
    ...Si,
    months: 1
  }), s = moveByDays(s, -1));
  const c = a.dateAdd(s, o, r);
  return createPlainYearMonthSlots(moveToDayOfMonthUnsafe(a, c), i);
}
function Ye(e, n, t) {
  return Ge(moveTime(n, e ? negateDurationFields(t) : t)[0]);
}
function moveZonedEpochs(e, n, t, o, r) {
  const i = durationFieldsToBigNano(o, 5);
  let a = t.epochNanoseconds;
  if (durationHasDateParts(o)) {
    const s = fn(t, e);
    a = addBigNanos(we(e, {
      ...moveDate(n, s, {
        ...o,
        ...Fi
      }, r),
      ...Vn(j, s)
    }), i);
  } else {
    a = addBigNanos(a, i), H(r);
  }
  return {
    epochNanoseconds: checkEpochNanoInBounds(a)
  };
}
function moveDateTime(e, n, t, o) {
  const [r, i] = moveTime(n, t);
  return checkIsoDateTimeInBounds({
    ...moveDate(e, n, {
      ...t,
      ...Fi,
      days: t.days + i
    }, o),
    ...r
  });
}
function moveDate(e, n, t, o) {
  if (t.years || t.months || t.weeks) {
    return e.dateAdd(n, t, o);
  }
  H(o);
  const r = t.days + durationFieldsToBigNano(t, 5)[0];
  return r ? checkIsoDateInBounds(moveByDays(n, r)) : n;
}
function moveToDayOfMonthUnsafe(e, n) {
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return moveByDays(n, t - e.day(n));
}
function moveTime(e, n) {
  const [t, o] = durationFieldsToBigNano(n, 5),
    [r, i] = nanoToIsoTimeAndDay(isoTimeFieldsToNano(e) + o);
  return [r, t + i];
}
function moveByDays(e, n) {
  return n ? {
    ...e,
    ...epochMilliToIso(isoToEpochMilli(e) + n * Gr)
  } : e;
}
function createMarkerSystem(e, n, t) {
  const o = e(t.calendar);
  return isZonedEpochSlots(t) ? [t, o, n(t.timeZone)] : [{
    ...t,
    ...Dt
  }, o];
}
function createMarkerToEpochNano(e) {
  return e ? extractEpochNano : isoToEpochNano;
}
function createMoveMarker(e) {
  return e ? E(moveZonedEpochs, e) : moveDateTime;
}
function createDiffMarkers(e) {
  return e ? E(diffZonedEpochsExact, e) : diffDateTimesExact;
}
function isZonedEpochSlots(e) {
  return e && e.epochNanoseconds;
}
function isUniformUnit(e, n) {
  return e <= 6 - (isZonedEpochSlots(n) ? 1 : 0);
}
function Wt(e, n, t, o, r, i, a) {
  const s = e(normalizeOptions(a).relativeTo),
    c = Math.max(getMaxDurationUnit(r), getMaxDurationUnit(i));
  if (isUniformUnit(c, s)) {
    return Vt(checkDurationUnits(((e, n, t, o) => {
      const r = addBigNanos(durationFieldsToBigNano(e), durationFieldsToBigNano(n), o ? -1 : 1);
      if (!Number.isFinite(r[0])) {
        throw new RangeError(Cr);
      }
      return {
        ...Si,
        ...nanoToDurationDayTimeFields(r, t)
      };
    })(r, i, c, o)));
  }
  if (!s) {
    throw new RangeError(zr);
  }
  o && (i = negateDurationFields(i));
  const [u, l, f] = createMarkerSystem(n, t, s),
    d = createMoveMarker(f),
    m = createDiffMarkers(f),
    p = d(l, u, r);
  return Vt(m(l, u, d(l, p, i), c));
}
function Gt(e, n, t, o, r) {
  const i = getMaxDurationUnit(o),
    [a, s, c, u, l] = ((e, n, t) => {
      e = normalizeOptionsOrString(e, Hi);
      let o = sa(e);
      const r = t(e[Ki]);
      let i = parseRoundingIncInteger(e);
      const a = ha(e, 7);
      let s = aa(e);
      if (void 0 === o && void 0 === s) {
        throw new RangeError(Ur);
      }
      return null == s && (s = 0), null == o && (o = Math.max(s, n)), checkLargestSmallestUnit(o, s), i = refineRoundingInc(i, s, 1), [o, s, i, a, r];
    })(r, i, e),
    f = Math.max(i, a);
  if (!isZonedEpochSlots(l) && f <= 6) {
    return Vt(checkDurationUnits(((e, n, t, o, r) => {
      const i = roundBigNano(durationFieldsToBigNano(e), t, o, r);
      return {
        ...Si,
        ...nanoToDurationDayTimeFields(i, n)
      };
    })(o, a, s, c, u)));
  }
  if (!l) {
    throw new RangeError(zr);
  }
  const [d, m, p] = createMarkerSystem(n, t, l),
    h = createMarkerToEpochNano(p),
    g = createMoveMarker(p),
    T = createDiffMarkers(p),
    D = g(m, d, o);
  let I = T(m, d, D, a);
  const M = o.sign,
    N = computeDurationSign(I);
  if (M && N && M !== N) {
    throw new RangeError(vr);
  }
  return N && (I = roundRelativeDuration(I, h(D), a, s, c, u, m, d, h, g)), Vt(I);
}
function Rt(e) {
  return -1 === e.sign ? xt(e) : e;
}
function xt(e) {
  return Vt(negateDurationFields(e));
}
function negateDurationFields(e) {
  const n = {};
  for (const t of F) {
    n[t] = -1 * e[t] || 0;
  }
  return n;
}
function Jt(e) {
  return !e.sign;
}
function computeDurationSign(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : F;
  let t = 0;
  for (const o of n) {
    const n = Math.sign(e[o]);
    if (n) {
      if (t && t !== n) {
        throw new RangeError(Rr);
      }
      t = n;
    }
  }
  return t;
}
function checkDurationUnits(e) {
  for (const n of vi) {
    clampEntity(n, e[n], -ya, ya, 1);
  }
  return checkDurationTimeUnit(oe(durationFieldsToBigNano(e), _r)), e;
}
function checkDurationTimeUnit(e) {
  if (!Number.isSafeInteger(e)) {
    throw new RangeError(Zr);
  }
}
function durationFieldsToBigNano(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
  return givenFieldsToBigNano(e, n, F);
}
function nanoToDurationDayTimeFields(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
  const [t, o] = e,
    r = nanoToGivenFields(o, n, F);
  if (r[F[n]] += t * (Qr / Xr[n]), !Number.isFinite(r[F[n]])) {
    throw new RangeError(Cr);
  }
  return r;
}
function nanoToDurationTimeFields(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  return nanoToGivenFields(e, n, F);
}
function durationHasDateParts(e) {
  return Boolean(computeDurationSign(e, Pi));
}
function getMaxDurationUnit(e) {
  let n = 9;
  for (; n > 0 && !e[F[n]]; n--) {}
  return n;
}
function createSplitTuple(e, n) {
  return [e, n];
}
function computePeriod(e) {
  const n = Math.floor(e / Da) * Da;
  return [n, n + Da];
}
function pe(e) {
  const n = parseDateTimeLike(e = toStringViaPrimitive(e));
  if (!n) {
    throw new RangeError(failedParse(e));
  }
  let t;
  if (n.m) {
    t = 0;
  } else {
    if (!n.offset) {
      throw new RangeError(failedParse(e));
    }
    t = parseOffsetNano(n.offset);
  }
  return n.timeZone && parseOffsetNanoMaybe(n.timeZone, 1), _(isoToEpochNanoWithOffset(checkIsoDateTimeFields(n), t));
}
function Xt(e) {
  const n = parseDateTimeLike(m(e));
  if (!n) {
    throw new RangeError(failedParse(e));
  }
  if (n.timeZone) {
    return finalizeZonedDateTime(n, n.offset ? parseOffsetNano(n.offset) : void 0);
  }
  if (n.m) {
    throw new RangeError(failedParse(e));
  }
  return finalizeDate(n);
}
function Mn(e, n) {
  const t = parseDateTimeLike(m(e));
  if (!t || !t.timeZone) {
    throw new RangeError(failedParse(e));
  }
  const {
      offset: o
    } = t,
    r = o ? parseOffsetNano(o) : void 0,
    [, i, a] = wn(n);
  return finalizeZonedDateTime(t, r, i, a);
}
function parseOffsetNano(e) {
  const n = parseOffsetNanoMaybe(e);
  if (void 0 === n) {
    throw new RangeError(failedParse(e));
  }
  return n;
}
function Ct(e) {
  const n = parseDateTimeLike(m(e));
  if (!n || n.m) {
    throw new RangeError(failedParse(e));
  }
  return ee(finalizeDateTime(n));
}
function At(e) {
  const n = parseDateTimeLike(m(e));
  if (!n || n.m) {
    throw new RangeError(failedParse(e));
  }
  return v(n.p ? finalizeDateTime(n) : finalizeDate(n));
}
function ot(e, n) {
  const t = parseYearMonthOnly(m(n));
  if (t) {
    return requireIsoCalendar(t), createPlainYearMonthSlots(checkIsoYearMonthInBounds(checkIsoDateFields(t)));
  }
  const o = At(n);
  return createPlainYearMonthSlots(moveToDayOfMonthUnsafe(e(o.calendar), o));
}
function requireIsoCalendar(e) {
  if (e.calendar !== X) {
    throw new RangeError(invalidSubstring(e.calendar));
  }
}
function Q(e, n) {
  const t = parseMonthDayOnly(m(n));
  if (t) {
    return requireIsoCalendar(t), createPlainMonthDaySlots(checkIsoDateFields(t));
  }
  const o = At(n),
    {
      calendar: r
    } = o,
    i = e(r),
    [a, s, c] = i.h(o),
    [u, l] = i.I(a, s),
    [f, d] = i.N(u, l, c);
  return createPlainMonthDaySlots(checkIsoDateInBounds(i.P(f, d, c)), r);
}
function ze(e) {
  let n,
    t = (e => {
      const n = Ca.exec(e);
      return n ? (organizeAnnotationParts(n[10]), organizeTimeParts(n)) : void 0;
    })(m(e));
  if (!t) {
    if (t = parseDateTimeLike(e), !t) {
      throw new RangeError(failedParse(e));
    }
    if (!t.p) {
      throw new RangeError(failedParse(e));
    }
    if (t.m) {
      throw new RangeError(invalidSubstring("Z"));
    }
    requireIsoCalendar(t);
  }
  if ((n = parseYearMonthOnly(e)) && isIsoDateFieldsValid(n)) {
    throw new RangeError(failedParse(e));
  }
  if ((n = parseMonthDayOnly(e)) && isIsoDateFieldsValid(n)) {
    throw new RangeError(failedParse(e));
  }
  return Ge(constrainIsoTimeFields(t, 1));
}
function Kt(e) {
  const n = (e => {
    const n = za.exec(e);
    return n ? (e => {
      function parseUnit(e, r, i) {
        let a = 0,
          s = 0;
        if (i && ([a, o] = divModFloor(o, Xr[i])), void 0 !== e) {
          if (t) {
            throw new RangeError(invalidSubstring(e));
          }
          s = (e => {
            const n = parseInt(e);
            if (!Number.isFinite(n)) {
              throw new RangeError(invalidSubstring(e));
            }
            return n;
          })(e), n = 1, r && (o = parseSubsecNano(r) * (Xr[i] / _r), t = 1);
        }
        return a + s;
      }
      let n = 0,
        t = 0,
        o = 0,
        r = {
          ...zipProps(F, [parseUnit(e[2]), parseUnit(e[3]), parseUnit(e[4]), parseUnit(e[5]), parseUnit(e[6], e[7], 5), parseUnit(e[8], e[9], 4), parseUnit(e[10], e[11], 3)]),
          ...nanoToGivenFields(o, 2, F)
        };
      if (!n) {
        throw new RangeError(noValidFields(F));
      }
      return parseSign(e[1]) < 0 && (r = negateDurationFields(r)), r;
    })(n) : void 0;
  })(m(e));
  if (!n) {
    throw new RangeError(failedParse(e));
  }
  return Vt(checkDurationUnits(n));
}
function sn(e) {
  const n = parseDateTimeLike(e) || parseYearMonthOnly(e) || parseMonthDayOnly(e);
  return n ? n.calendar : e;
}
function Ne(e) {
  const n = parseDateTimeLike(e);
  return n && (n.timeZone || n.m && Ta || n.offset) || e;
}
function finalizeZonedDateTime(e, n) {
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  const r = ye(e.timeZone),
    i = ie(r);
  return Yn(getMatchingInstantFor(i, checkIsoDateTimeFields(e), n, t, o, !i.v, e.m), r, an(e.calendar));
}
function finalizeDateTime(e) {
  return resolveSlotsCalendar(checkIsoDateTimeInBounds(checkIsoDateTimeFields(e)));
}
function finalizeDate(e) {
  return resolveSlotsCalendar(checkIsoDateInBounds(checkIsoDateFields(e)));
}
function resolveSlotsCalendar(e) {
  return {
    ...e,
    calendar: an(e.calendar)
  };
}
function parseDateTimeLike(e) {
  const n = Ya.exec(e);
  return n ? (e => {
    const n = e[10],
      t = "Z" === (n || "").toUpperCase();
    return {
      isoYear: organizeIsoYearParts(e),
      isoMonth: parseInt(e[4]),
      isoDay: parseInt(e[5]),
      ...organizeTimeParts(e.slice(5)),
      ...organizeAnnotationParts(e[16]),
      p: Boolean(e[6]),
      m: t,
      offset: t ? void 0 : n
    };
  })(n) : void 0;
}
function parseYearMonthOnly(e) {
  const n = Ba.exec(e);
  return n ? (e => ({
    isoYear: organizeIsoYearParts(e),
    isoMonth: parseInt(e[4]),
    isoDay: 1,
    ...organizeAnnotationParts(e[5])
  }))(n) : void 0;
}
function parseMonthDayOnly(e) {
  const n = ka.exec(e);
  return n ? (e => ({
    isoYear: ji,
    isoMonth: parseInt(e[1]),
    isoDay: parseInt(e[2]),
    ...organizeAnnotationParts(e[3])
  }))(n) : void 0;
}
function parseOffsetNanoMaybe(e, n) {
  const t = Za.exec(e);
  return t ? ((e, n) => {
    const t = e[4] || e[5];
    if (n && t) {
      throw new RangeError(invalidSubstring(t));
    }
    return ae((parseInt0(e[2]) * Kr + parseInt0(e[3]) * Jr + parseInt0(e[4]) * _r + parseSubsecNano(e[5] || "")) * parseSign(e[1]));
  })(t, n) : void 0;
}
function organizeIsoYearParts(e) {
  const n = parseSign(e[1]),
    t = parseInt(e[2] || e[3]);
  if (n < 0 && !t) {
    throw new RangeError(invalidSubstring(-0));
  }
  return n * t;
}
function organizeTimeParts(e) {
  const n = parseInt0(e[3]);
  return {
    ...nanoToIsoTimeAndDay(parseSubsecNano(e[4] || ""))[0],
    isoHour: parseInt0(e[1]),
    isoMinute: parseInt0(e[2]),
    isoSecond: 60 === n ? 59 : n
  };
}
function organizeAnnotationParts(e) {
  let n, t;
  const o = [];
  if (e.replace(Ra, (e, r, i) => {
    const a = Boolean(r),
      [s, c] = i.split("=").reverse();
    if (c) {
      if ("u-ca" === c) {
        o.push(s), n || (n = a);
      } else if (a || /[A-Z]/.test(c)) {
        throw new RangeError(invalidSubstring(e));
      }
    } else {
      if (t) {
        throw new RangeError(invalidSubstring(e));
      }
      t = s;
    }
    return "";
  }), o.length > 1 && n) {
    throw new RangeError(invalidSubstring(e));
  }
  return {
    timeZone: t,
    calendar: o[0] || X
  };
}
function parseSubsecNano(e) {
  return parseInt(e.padEnd(9, "0"));
}
function createRegExp(e) {
  return new RegExp(`^${e}$`, "i");
}
function parseSign(e) {
  return e && "+" !== e ? -1 : 1;
}
function parseInt0(e) {
  return void 0 === e ? 0 : parseInt(e);
}
function Me(e) {
  return ye(m(e));
}
function ye(e) {
  const n = getTimeZoneEssence(e);
  return "number" == typeof n ? Fe(n) : n ? (e => {
    if (Ua.test(e)) {
      throw new RangeError(br);
    }
    return e.toLowerCase().split("/").map((e, n) => (e.length <= 3 || /\d/.test(e)) && !/etc|yap/.test(e) ? e.toUpperCase() : e.replace(/baja|dumont|[a-z]+/g, (e, t) => e.length <= 2 && !n || "in" === e || "chat" === e ? e.toUpperCase() : e.length > 2 || !t ? capitalize(e).replace(/island|noronha|murdo|rivadavia|urville/, capitalize) : e)).join("/");
  })(e) : Ta;
}
function getTimeZoneAtomic(e) {
  const n = getTimeZoneEssence(e);
  return "number" == typeof n ? n : n ? n.resolvedOptions().timeZone : Ta;
}
function getTimeZoneEssence(e) {
  const n = parseOffsetNanoMaybe(e = e.toUpperCase(), 1);
  return void 0 !== n ? n : e !== Ta ? qa(e) : void 0;
}
function Ze(e, n) {
  return te(e.epochNanoseconds, n.epochNanoseconds);
}
function yn(e, n) {
  return te(e.epochNanoseconds, n.epochNanoseconds);
}
function $t(e, n, t, o, r, i) {
  const a = e(normalizeOptions(i).relativeTo),
    s = Math.max(getMaxDurationUnit(o), getMaxDurationUnit(r));
  if (allPropsEqual(F, o, r)) {
    return 0;
  }
  if (isUniformUnit(s, a)) {
    return te(durationFieldsToBigNano(o), durationFieldsToBigNano(r));
  }
  if (!a) {
    throw new RangeError(zr);
  }
  const [c, u, l] = createMarkerSystem(n, t, a),
    f = createMarkerToEpochNano(l),
    d = createMoveMarker(l);
  return te(f(d(u, c, o)), f(d(u, c, r)));
}
function gt(e, n) {
  return rt(e, n) || He(e, n);
}
function rt(e, n) {
  return compareNumbers(isoToEpochMilli(e), isoToEpochMilli(n));
}
function He(e, n) {
  return compareNumbers(isoTimeFieldsToNano(e), isoTimeFieldsToNano(n));
}
function ue(e, n) {
  return !Ze(e, n);
}
function gn(e, n) {
  return !yn(e, n) && !!je(e.timeZone, n.timeZone) && isIdLikeEqual(e.calendar, n.calendar);
}
function ft(e, n) {
  return !gt(e, n) && isIdLikeEqual(e.calendar, n.calendar);
}
function It(e, n) {
  return !rt(e, n) && isIdLikeEqual(e.calendar, n.calendar);
}
function $e(e, n) {
  return !rt(e, n) && isIdLikeEqual(e.calendar, n.calendar);
}
function x(e, n) {
  return !rt(e, n) && isIdLikeEqual(e.calendar, n.calendar);
}
function Ve(e, n) {
  return !He(e, n);
}
function je(e, n) {
  if (e === n) {
    return 1;
  }
  const t = I(e),
    o = I(n);
  if (t === o) {
    return 1;
  }
  try {
    return getTimeZoneAtomic(t) === getTimeZoneAtomic(o);
  } catch (e) {}
}
function le(e, n, t, o) {
  const r = refineDiffOptions(e, U(o), 3, 5),
    i = diffEpochNanos(n.epochNanoseconds, t.epochNanoseconds, ...r);
  return Vt(e ? negateDurationFields(i) : i);
}
function Dn(e, n, t, o, r, i) {
  const a = getCommonCalendarSlot(o.calendar, r.calendar),
    s = U(i),
    [c, u, l, f] = refineDiffOptions(t, s, 5),
    d = o.epochNanoseconds,
    m = r.epochNanoseconds,
    p = te(m, d);
  let h;
  if (p) {
    if (c < 6) {
      h = diffEpochNanos(d, m, c, u, l, f);
    } else {
      const t = n(((e, n) => {
          if (!je(e, n)) {
            throw new RangeError(Fr);
          }
          return e;
        })(o.timeZone, r.timeZone)),
        i = e(a);
      h = diffZonedEpochsBig(i, t, o, r, p, c, s), h = roundRelativeDuration(h, m, c, u, l, f, i, o, extractEpochNano, E(moveZonedEpochs, t));
    }
  } else {
    h = Si;
  }
  return Vt(t ? negateDurationFields(h) : h);
}
function ut(e, n, t, o, r) {
  const i = getCommonCalendarSlot(t.calendar, o.calendar),
    a = U(r),
    [s, c, u, l] = refineDiffOptions(n, a, 6),
    f = isoToEpochNano(t),
    d = isoToEpochNano(o),
    m = te(d, f);
  let p;
  if (m) {
    if (s <= 6) {
      p = diffEpochNanos(f, d, s, c, u, l);
    } else {
      const n = e(i);
      p = diffDateTimesBig(n, t, o, m, s, a), p = roundRelativeDuration(p, d, s, c, u, l, n, t, isoToEpochNano, moveDateTime);
    }
  } else {
    p = Si;
  }
  return Vt(n ? negateDurationFields(p) : p);
}
function Ft(e, n, t, o, r) {
  const i = getCommonCalendarSlot(t.calendar, o.calendar),
    a = U(r);
  return diffDateLike(n, () => e(i), t, o, ...refineDiffOptions(n, a, 6, 9, 6), a);
}
function Xe(e, n, t, o, r) {
  const i = getCommonCalendarSlot(t.calendar, o.calendar),
    a = U(r),
    s = refineDiffOptions(n, a, 9, 9, 8),
    c = e(i);
  return diffDateLike(n, () => c, moveToDayOfMonthUnsafe(c, t), moveToDayOfMonthUnsafe(c, o), ...s, a);
}
function diffDateLike(e, n, t, o, r, i, a, s, c) {
  const u = isoToEpochNano(t),
    l = isoToEpochNano(o);
  let f;
  if (te(l, u)) {
    if (6 === r) {
      f = diffEpochNanos(u, l, r, i, a, s);
    } else {
      const e = n();
      f = e.dateUntil(t, o, r, c), 6 === i && 1 === a || (f = roundRelativeDuration(f, l, r, i, a, s, e, t, isoToEpochNano, moveDate));
    }
  } else {
    f = Si;
  }
  return Vt(e ? negateDurationFields(f) : f);
}
function Ae(e, n, t, o) {
  const r = U(o),
    [i, a, s, c] = refineDiffOptions(e, r, 5, 5),
    u = roundByInc(diffTimes(n, t), computeNanoInc(a, s), c),
    l = {
      ...Si,
      ...nanoToDurationTimeFields(u, i)
    };
  return Vt(e ? negateDurationFields(l) : l);
}
function diffZonedEpochsExact(e, n, t, o, r, i) {
  const a = te(o.epochNanoseconds, t.epochNanoseconds);
  return a ? r < 6 ? diffEpochNanosExact(t.epochNanoseconds, o.epochNanoseconds, r) : diffZonedEpochsBig(n, e, t, o, a, r, i) : Si;
}
function diffDateTimesExact(e, n, t, o, r) {
  const i = isoToEpochNano(n),
    a = isoToEpochNano(t),
    s = te(a, i);
  return s ? o <= 6 ? diffEpochNanosExact(i, a, o) : diffDateTimesBig(e, n, t, s, o, r) : Si;
}
function diffZonedEpochsBig(e, n, t, o, r, i, a) {
  const [s, c, u] = ((e, n, t, o) => {
    function updateMid() {
      return l = {
        ...moveByDays(a, c++ * -o),
        ...i
      }, f = we(e, l), te(s, f) === -o;
    }
    const r = fn(n, e),
      i = Vn(j, r),
      a = fn(t, e),
      s = t.epochNanoseconds;
    let c = 0;
    const u = diffTimes(r, a);
    let l, f;
    if (Math.sign(u) === -o && c++, updateMid() && (-1 === o || updateMid())) {
      throw new RangeError(vr);
    }
    const d = oe(re(f, s));
    return [r, l, d];
  })(n, t, o, r);
  var l, f;
  return {
    ...(6 === i ? (l = s, f = c, {
      ...Si,
      days: diffDays(l, f)
    }) : e.dateUntil(s, c, i, a)),
    ...nanoToDurationTimeFields(u)
  };
}
function diffDateTimesBig(e, n, t, o, r, i) {
  const [a, s, c] = ((e, n, t) => {
    let o = n,
      r = diffTimes(e, n);
    return Math.sign(r) === -t && (o = moveByDays(n, -t), r += Qr * t), [e, o, r];
  })(n, t, o);
  return {
    ...e.dateUntil(a, s, r, i),
    ...nanoToDurationTimeFields(c)
  };
}
function diffEpochNanos(e, n, t, o, r, i) {
  return {
    ...Si,
    ...nanoToDurationDayTimeFields(roundBigNano(re(e, n), o, r, i), t)
  };
}
function diffEpochNanosExact(e, n, t) {
  return {
    ...Si,
    ...nanoToDurationDayTimeFields(re(e, n), t)
  };
}
function diffDays(e, n) {
  return diffEpochMilliByDay(isoToEpochMilli(e), isoToEpochMilli(n));
}
function diffEpochMilliByDay(e, n) {
  return Math.trunc((n - e) / Gr);
}
function diffTimes(e, n) {
  return isoTimeFieldsToNano(n) - isoTimeFieldsToNano(e);
}
function getCommonCalendarSlot(e, n) {
  if (!isIdLikeEqual(e, n)) {
    throw new RangeError(Er);
  }
  return e;
}
function createIntlCalendar(e) {
  function epochMilliToIntlFields(e) {
    return ((e, n) => ({
      ...parseIntlYear(e, n),
      F: e.month,
      day: parseInt(e.day)
    }))(hashIntlFormatParts(n, e), t);
  }
  const n = La(e),
    t = computeCalendarIdBase(e);
  return {
    id: e,
    O: createIntlFieldCache(epochMilliToIntlFields),
    B: createIntlYearDataCache(epochMilliToIntlFields)
  };
}
function createIntlFieldCache(e) {
  return Jn(n => {
    const t = isoToEpochMilli(n);
    return e(t);
  }, WeakMap);
}
function createIntlYearDataCache(e) {
  const n = e(0).year - Wi;
  return Jn(t => {
    let o,
      r = isoArgsToEpochMilli(t - n);
    const i = [],
      a = [];
    do {
      r += 400 * Gr;
    } while ((o = e(r)).year <= t);
    do {
      r += (1 - o.day) * Gr, o.year === t && (i.push(r), a.push(o.F)), r -= Gr;
    } while ((o = e(r)).year >= t);
    return {
      k: i.reverse(),
      C: Wr(a.reverse())
    };
  });
}
function parseIntlYear(e, n) {
  let t,
    o,
    r = parseIntlPartsYear(e);
  if (e.era) {
    const i = Di[n];
    void 0 !== i && (t = "islamic" === n ? "ah" : e.era.normalize("NFD").toLowerCase().replace(/[^a-z0-9]/g, ""), "bc" === t || "b" === t ? t = "bce" : "ad" !== t && "a" !== t || (t = "ce"), o = r, r = eraYearToYear(o, i[t] || 0));
  }
  return {
    era: t,
    eraYear: o,
    year: r
  };
}
function parseIntlPartsYear(e) {
  return parseInt(e.relatedYear || e.year);
}
function computeIntlDateParts(e) {
  const {
      year: n,
      F: t,
      day: o
    } = this.O(e),
    {
      C: r
    } = this.B(n);
  return [n, r[t] + 1, o];
}
function computeIntlEpochMilli(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return this.B(e).k[n - 1] + (t - 1) * Gr;
}
function computeIntlLeapMonth(e) {
  const n = queryMonthStrings(this, e),
    t = queryMonthStrings(this, e - 1),
    o = n.length;
  if (o > t.length) {
    const e = getCalendarLeapMonthMeta(this);
    if (e < 0) {
      return -e;
    }
    for (let e = 0; e < o; e++) {
      if (n[e] !== t[e]) {
        return e + 1;
      }
    }
  }
}
function computeIntlDaysInYear(e) {
  return diffEpochMilliByDay(computeIntlEpochMilli.call(this, e), computeIntlEpochMilli.call(this, e + 1));
}
function computeIntlDaysInMonth(e, n) {
  const {
    k: t
  } = this.B(e);
  let o = n + 1,
    r = t;
  return o > t.length && (o = 1, r = this.B(e + 1).k), diffEpochMilliByDay(t[n - 1], r[o - 1]);
}
function computeIntlMonthsInYear(e) {
  return this.B(e).k.length;
}
function queryMonthStrings(e, n) {
  return Object.keys(e.B(n).C);
}
function rn(e) {
  return an(m(e));
}
function an(e) {
  if ((e = e.toLowerCase()) !== X && e !== gi && computeCalendarIdBase(e) !== computeCalendarIdBase(La(e).resolvedOptions().calendar)) {
    throw new RangeError(invalidCalendar(e));
  }
  return e;
}
function computeCalendarIdBase(e) {
  return "islamicc" === e && (e = "islamic"), e.split("-")[0];
}
function computeNativeWeekOfYear(e) {
  return this.R(e)[0];
}
function computeNativeYearOfWeek(e) {
  return this.R(e)[1];
}
function computeNativeDayOfYear(e) {
  const [n] = this.h(e);
  return diffEpochMilliByDay(this.q(n), isoToEpochMilli(e)) + 1;
}
function parseMonthCode(e) {
  const n = Wa.exec(e);
  if (!n) {
    throw new RangeError(invalidMonthCode(e));
  }
  return [parseInt(n[1]), Boolean(n[2])];
}
function monthCodeNumberToMonth(e, n, t) {
  return e + (n || t && e >= t ? 1 : 0);
}
function monthToMonthCodeNumber(e, n) {
  return e - (n && e >= n ? 1 : 0);
}
function eraYearToYear(e, n) {
  return (n + e) * (Math.sign(n) || 1) || 0;
}
function getCalendarEraOrigins(e) {
  return Di[getCalendarIdBase(e)];
}
function getCalendarLeapMonthMeta(e) {
  return Ii[getCalendarIdBase(e)];
}
function getCalendarIdBase(e) {
  return computeCalendarIdBase(e.id || X);
}
function Qt(e, n, t, o) {
  const r = refineCalendarFields(t, o, en, [], ri);
  if (void 0 !== r.timeZone) {
    const o = t.dateFromFields(r),
      i = refineTimeBag(r),
      a = e(r.timeZone);
    return {
      epochNanoseconds: getMatchingInstantFor(n(a), {
        ...o,
        ...i
      }, void 0 !== r.offset ? parseOffsetNano(r.offset) : void 0),
      timeZone: a
    };
  }
  return {
    ...t.dateFromFields(r),
    ...Dt
  };
}
function jn(e, n, t, o, r, i) {
  const a = refineCalendarFields(t, r, en, ti, ri),
    s = e(a.timeZone),
    [c, u, l] = wn(i),
    f = t.dateFromFields(a, overrideOverflowOptions(i, c)),
    d = refineTimeBag(a, c);
  return Yn(getMatchingInstantFor(n(s), {
    ...f,
    ...d
  }, void 0 !== a.offset ? parseOffsetNano(a.offset) : void 0, u, l), s, o);
}
function Pt(e, n, t) {
  const o = refineCalendarFields(e, n, en, [], w),
    r = H(t);
  return ee(checkIsoDateTimeInBounds({
    ...e.dateFromFields(o, overrideOverflowOptions(t, r)),
    ...refineTimeBag(o, r)
  }));
}
function Yt(e, n, t) {
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  const r = refineCalendarFields(e, n, en, o);
  return e.dateFromFields(r, t);
}
function nt(e, n, t, o) {
  const r = refineCalendarFields(e, n, fi, o);
  return e.yearMonthFromFields(r, t);
}
function K(e, n, t, o) {
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  const i = refineCalendarFields(e, t, en, r);
  return n && void 0 !== i.month && void 0 === i.monthCode && void 0 === i.year && (i.year = ji), e.monthDayFromFields(i, o);
}
function Ue(e, n) {
  const t = H(n);
  return Ge(refineTimeBag(refineFields(e, ei, [], 1), t));
}
function Ht(e) {
  const n = refineFields(e, Ni);
  return Vt(checkDurationUnits({
    ...Si,
    ...n
  }));
}
function refineCalendarFields(e, n, t) {
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  return refineFields(n, [...e.fields(t), ...r].sort(), o);
}
function refineFields(e, n, t) {
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : !t;
  const r = {};
  let i,
    a = 0;
  for (const o of n) {
    if (o === i) {
      throw new RangeError(duplicateFields(o));
    }
    if ("constructor" === o || "__proto__" === o) {
      throw new RangeError(tn(o));
    }
    let n = e[o];
    if (void 0 !== n) {
      a = 1, Ga[o] && (n = Ga[o](n, o)), r[o] = n;
    } else if (t) {
      if (t.includes(o)) {
        throw new TypeError(missingField(o));
      }
      r[o] = hi[o];
    }
    i = o;
  }
  if (o && !a) {
    throw new TypeError(noValidFields(n));
  }
  return r;
}
function refineTimeBag(e, n) {
  return constrainIsoTimeFields(Ha({
    ...hi,
    ...e
  }), n);
}
function Sn(e, n, t, o, r, i) {
  const a = U(i),
    {
      calendar: s,
      timeZone: c
    } = t;
  return Yn(((e, n, t, o, r) => {
    const i = mergeCalendarFields(e, t, o, en, oi, ni),
      [a, s, c] = wn(r, 2);
    return getMatchingInstantFor(n, {
      ...e.dateFromFields(i, overrideOverflowOptions(r, a)),
      ...refineTimeBag(i, a)
    }, parseOffsetNano(i.offset), s, c);
  })(e(s), n(c), o, r, a), c, s);
}
function at(e, n, t, o, r) {
  const i = U(r);
  return ee(((e, n, t, o) => {
    const r = mergeCalendarFields(e, n, t, en, w),
      i = H(o);
    return checkIsoDateTimeInBounds({
      ...e.dateFromFields(r, overrideOverflowOptions(o, i)),
      ...refineTimeBag(r, i)
    });
  })(e(n.calendar), t, o, i));
}
function Zt(e, n, t, o, r) {
  const i = U(r);
  return ((e, n, t, o) => {
    const r = mergeCalendarFields(e, n, t, en);
    return e.dateFromFields(r, o);
  })(e(n.calendar), t, o, i);
}
function Ke(e, n, t, o, r) {
  const i = U(r);
  return createPlainYearMonthSlots(((e, n, t, o) => {
    const r = mergeCalendarFields(e, n, t, fi);
    return e.yearMonthFromFields(r, o);
  })(e(n.calendar), t, o, i));
}
function k(e, n, t, o, r) {
  const i = U(r);
  return ((e, n, t, o) => {
    const r = mergeCalendarFields(e, n, t, en);
    return e.monthDayFromFields(r, o);
  })(e(n.calendar), t, o, i);
}
function Be(e, n, t) {
  return Ge(((e, n, t) => {
    const o = H(t);
    return refineTimeBag({
      ...Vn(ei, e),
      ...refineFields(n, ei)
    }, o);
  })(e, n, t));
}
function kt(e, n) {
  return Vt((t = e, o = n, checkDurationUnits({
    ...t,
    ...refineFields(o, Ni)
  })));
  var t, o;
}
function mergeCalendarFields(e, n, t, o) {
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  let i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  const a = [...e.fields(o), ...r].sort();
  let s = refineFields(n, a, i);
  const c = refineFields(t, a);
  return s = e.mergeFields(s, c), refineFields(s, a, []);
}
function convertToPlainMonthDay(e, n) {
  const t = refineCalendarFields(e, n, pi);
  return e.monthDayFromFields(t);
}
function convertToPlainYearMonth(e, n, t) {
  const o = refineCalendarFields(e, n, di);
  return e.yearMonthFromFields(o, t);
}
function convertToIso(e, n, t, o, r) {
  n = Vn(t = e.fields(t), n), o = refineFields(o, r = e.fields(r), []);
  let i = e.mergeFields(n, o);
  return i = refineFields(i, [...t, ...r].sort(), []), e.dateFromFields(i);
}
function refineYear(e, n) {
  let {
    era: t,
    eraYear: o,
    year: r
  } = n;
  const i = getCalendarEraOrigins(e);
  if (void 0 !== t || void 0 !== o) {
    if (void 0 === t || void 0 === o) {
      throw new TypeError(Dr);
    }
    if (!i) {
      throw new RangeError(gr);
    }
    const e = i[t];
    if (void 0 === e) {
      throw new RangeError(invalidEra(t));
    }
    const n = eraYearToYear(o, e);
    if (void 0 !== r && r !== n) {
      throw new RangeError(Ir);
    }
    r = n;
  } else if (void 0 === r) {
    throw new TypeError(missingYear(i));
  }
  return r;
}
function refineMonth(e, n, t, o) {
  let {
    month: r,
    monthCode: i
  } = n;
  if (void 0 !== i) {
    const n = ((e, n, t, o) => {
      const r = e.U(t),
        [i, a] = parseMonthCode(n);
      let s = monthCodeNumberToMonth(i, a, r);
      if (a) {
        const n = getCalendarLeapMonthMeta(e);
        if (void 0 === n) {
          throw new RangeError(Pr);
        }
        if (n > 0) {
          if (s > n) {
            throw new RangeError(Pr);
          }
          if (void 0 === r) {
            if (1 === o) {
              throw new RangeError(Pr);
            }
            s--;
          }
        } else {
          if (s !== -n) {
            throw new RangeError(Pr);
          }
          if (void 0 === r && 1 === o) {
            throw new RangeError(Pr);
          }
        }
      }
      return s;
    })(e, i, t, o);
    if (void 0 !== r && r !== n) {
      throw new RangeError(Mr);
    }
    r = n, o = 1;
  } else if (void 0 === r) {
    throw new TypeError(Nr);
  }
  return clampEntity("month", r, 1, e.L(t), o);
}
function refineDay(e, n, t, o, r) {
  return clampProp(n, "day", 1, e.j(o, t), r);
}
function spliceFields(e, n, t, o) {
  let r = 0;
  const i = [];
  for (const e of t) {
    void 0 !== n[e] ? r = 1 : i.push(e);
  }
  if (Object.assign(e, n), r) {
    for (const n of o || i) {
      delete e[n];
    }
  }
}
function Se(e) {
  return _(checkEpochNanoInBounds(bigIntToBigNano(toBigInt(e))));
}
function vn(e, n, t, o) {
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : X;
  return Yn(checkEpochNanoInBounds(bigIntToBigNano(toBigInt(t))), n(o), e(r));
}
function pt(e, n, t, o) {
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  let i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  let a = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  let s = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
  let c = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
  let u = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
  let l = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : X;
  return ee(checkIsoDateTimeInBounds(checkIsoDateTimeFields(T(toInteger, zipProps(wi, [n, t, o, r, i, a, s, c, u])))), e(l));
}
function Nt(e, n, t, o) {
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : X;
  return v(checkIsoDateInBounds(checkIsoDateFields(T(toInteger, {
    isoYear: n,
    isoMonth: t,
    isoDay: o
  }))), e(r));
}
function tt(e, n, t) {
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : X;
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  const i = toInteger(n),
    a = toInteger(t),
    s = e(o);
  return createPlainYearMonthSlots(checkIsoYearMonthInBounds(checkIsoDateFields({
    isoYear: i,
    isoMonth: a,
    isoDay: toInteger(r)
  })), s);
}
function G(e, n, t) {
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : X;
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : ji;
  const i = toInteger(n),
    a = toInteger(t),
    s = e(o);
  return createPlainMonthDaySlots(checkIsoDateInBounds(checkIsoDateFields({
    isoYear: toInteger(r),
    isoMonth: i,
    isoDay: a
  })), s);
}
function ke() {
  let e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  let i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  return Ge(constrainIsoTimeFields(T(toInteger, zipProps(j, [e, n, t, o, r, i])), 1));
}
function Lt() {
  let e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let o = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  let r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  let i = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  let a = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  let s = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
  let c = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
  let u = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
  return Vt(checkDurationUnits(T(toStrictInteger, zipProps(F, [e, n, t, o, r, i, a, s, c, u]))));
}
function fe(e, n) {
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : X;
  return Yn(e.epochNanoseconds, n, t);
}
function Zn(e) {
  return _(e.epochNanoseconds);
}
function ht(e, n) {
  return ee(fn(n, e));
}
function Bt(e, n) {
  return v(fn(n, e));
}
function bn(e, n, t) {
  return convertToPlainYearMonth(e(n.calendar), t);
}
function Fn(e, n, t) {
  return convertToPlainMonthDay(e(n.calendar), t);
}
function Re(e, n) {
  return Ge(fn(n, e));
}
function mt(e, n, t, o) {
  const r = ((e, n, t, o) => {
    const r = ve(o);
    return we(e(n), t, r);
  })(e, t, n, o);
  return Yn(checkEpochNanoInBounds(r), t, n.calendar);
}
function St(e, n, t) {
  const o = e(n.calendar);
  return createPlainYearMonthSlots({
    ...n,
    ...convertToPlainYearMonth(o, t)
  });
}
function Ot(e, n, t) {
  return convertToPlainMonthDay(e(n.calendar), t);
}
function vt(e, n, t, o, r) {
  const i = e(r.timeZone),
    a = r.plainTime,
    s = void 0 !== a ? n(a) : Dt;
  return Yn(we(t(i), {
    ...o,
    ...s
  }), i, o.calendar);
}
function wt(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Dt;
  return ee(checkIsoDateTimeInBounds({
    ...e,
    ...n
  }));
}
function jt(e, n, t) {
  return convertToPlainYearMonth(e(n.calendar), t);
}
function Mt(e, n, t) {
  return convertToPlainMonthDay(e(n.calendar), t);
}
function _e(e, n, t, o) {
  return ((e, n, t) => convertToIso(e, n, di, de(t), li))(e(n.calendar), t, o);
}
function R(e, n, t, o) {
  return ((e, n, t) => convertToIso(e, n, pi, de(t), si))(e(n.calendar), t, o);
}
function Je(e, n, t, o, r) {
  const i = de(r),
    a = n(i.plainDate),
    s = e(i.timeZone);
  return Yn(we(t(s), {
    ...a,
    ...o
  }), s, a.calendar);
}
function Le(e, n) {
  return ee(checkIsoDateTimeInBounds({
    ...e,
    ...n
  }));
}
function De(e) {
  return _(checkEpochNanoInBounds(he(e, _r)));
}
function Pe(e) {
  return _(checkEpochNanoInBounds(he(e, be)));
}
function Ce(e) {
  return _(checkEpochNanoInBounds(bigIntToBigNano(toBigInt(e), Vr)));
}
function ge(e) {
  return _(checkEpochNanoInBounds(bigIntToBigNano(toBigInt(e))));
}
function pn(e, n) {
  let t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Dt;
  const o = n.timeZone,
    r = e(o),
    i = {
      ...fn(n, r),
      ...t
    };
  return Yn(getMatchingInstantFor(r, i, i.offsetNanoseconds, 2), o, n.calendar);
}
function Tn(e, n, t) {
  const o = n.timeZone,
    r = e(o),
    i = {
      ...fn(n, r),
      ...t
    },
    a = getPreferredCalendarSlot(n.calendar, t.calendar);
  return Yn(getMatchingInstantFor(r, i, i.offsetNanoseconds, 2), o, a);
}
function lt(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Dt;
  return ee({
    ...e,
    ...n
  });
}
function st(e, n) {
  return ee({
    ...e,
    ...n
  }, getPreferredCalendarSlot(e.calendar, n.calendar));
}
function it(e, n) {
  return {
    ...e,
    calendar: n
  };
}
function On(e, n) {
  return {
    ...e,
    timeZone: n
  };
}
function getPreferredCalendarSlot(e, n) {
  if (e === n) {
    return e;
  }
  const t = I(e),
    o = I(n);
  if (t === o || t === X) {
    return n;
  }
  if (o === X) {
    return e;
  }
  throw new RangeError(Er);
}
function createNativeOpsCreator(e, n) {
  return t => t === X ? e : t === gi || t === Ti ? Object.assign(Object.create(e), {
    id: t
  }) : Object.assign(Object.create(n), Aa(t));
}
function createOptionsTransformer(e, n, t) {
  const o = new Set(t);
  return r => (((e, n) => {
    for (const t of n) {
      if (t in e) {
        return 1;
      }
    }
    return 0;
  })(r = V(o, r), e) || Object.assign(r, n), t && (r.timeZone = Ta, ["full", "long"].includes(r.timeStyle) && (r.timeStyle = "medium")), r);
}
function e(e) {
  let n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : qn;
  const [t,,, o] = e;
  return function (r) {
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Ns;
    for (var _len4 = arguments.length, a = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
      a[_key4 - 2] = arguments[_key4];
    }
    const s = n(o && o(...a), r, i, t),
      c = s.resolvedOptions();
    return [s, ...toEpochMillis(e, c, a)];
  };
}
function qn(e, n, t, o) {
  if (t = o(t), e) {
    if (void 0 !== t.timeZone) {
      throw new TypeError(Lr);
    }
    t.timeZone = e;
  }
  return new En(n, t);
}
function toEpochMillis(e, n, t) {
  const [, o, r] = e;
  return t.map(e => (e.calendar && ((e, n, t) => {
    if ((t || e !== X) && e !== n) {
      throw new RangeError(Er);
    }
  })(I(e.calendar), n.calendar, r), o(e, n)));
}
function An(e) {
  const n = Bn();
  return Ie(n, e.getOffsetNanosecondsFor(n));
}
function Bn() {
  return he(Date.now(), be);
}
function Nn() {
  return ys || (ys = new En().resolvedOptions().timeZone);
}
const expectedInteger = (e, n) => `Non-integer ${e}: ${n}`,
  expectedPositive = (e, n) => `Non-positive ${e}: ${n}`,
  expectedFinite = (e, n) => `Non-finite ${e}: ${n}`,
  forbiddenBigIntToNumber = e => `Cannot convert bigint to ${e}`,
  invalidBigInt = e => `Invalid bigint: ${e}`,
  pr = "Cannot convert Symbol to string",
  hr = "Invalid object",
  numberOutOfRange = (e, n, t, o, r) => r ? numberOutOfRange(e, r[n], r[t], r[o]) : invalidEntity(e, n) + `; must be between ${t}-${o}`,
  invalidEntity = (e, n) => `Invalid ${e}: ${n}`,
  missingField = e => `Missing ${e}`,
  tn = e => `Invalid field ${e}`,
  duplicateFields = e => `Duplicate field ${e}`,
  noValidFields = e => "No valid fields: " + e.join(),
  Z = "Invalid bag",
  invalidChoice = (e, n, t) => invalidEntity(e, n) + "; must be " + Object.keys(t).join(),
  A = "Cannot use valueOf",
  P = "Invalid calling context",
  gr = "Forbidden era/eraYear",
  Dr = "Mismatching era/eraYear",
  Ir = "Mismatching year/eraYear",
  invalidEra = e => `Invalid era: ${e}`,
  missingYear = e => "Missing year" + (e ? "/era/eraYear" : ""),
  invalidMonthCode = e => `Invalid monthCode: ${e}`,
  Mr = "Mismatching month/monthCode",
  Nr = "Missing month/monthCode",
  yr = "Cannot guess year",
  Pr = "Invalid leap month",
  g = "Invalid protocol",
  vr = "Invalid protocol results",
  Er = "Mismatching Calendars",
  invalidCalendar = e => `Invalid Calendar: ${e}`,
  Fr = "Mismatching TimeZones",
  br = "Forbidden ICU TimeZone",
  wr = "Out-of-bounds offset",
  Br = "Out-of-bounds TimeZone gap",
  kr = "Invalid TimeZone offset",
  Yr = "Ambiguous offset",
  Cr = "Out-of-bounds date",
  Zr = "Out-of-bounds duration",
  Rr = "Cannot mix duration signs",
  zr = "Missing relativeTo",
  qr = "Cannot use large units",
  Ur = "Required smallestUnit or largestUnit",
  Ar = "smallestUnit > largestUnit",
  failedParse = e => `Cannot parse: ${e}`,
  invalidSubstring = e => `Invalid substring: ${e}`,
  Ln = e => `Cannot format ${e}`,
  kn = "Mismatching types for formatting",
  Lr = "Cannot specify TimeZone",
  Wr = /*@__PURE__*/E(b, (e, n) => n),
  jr = /*@__PURE__*/E(b, (e, n, t) => t),
  xr = /*@__PURE__*/E(padNumber, 2),
  $r = {
    nanosecond: 0,
    microsecond: 1,
    millisecond: 2,
    second: 3,
    minute: 4,
    hour: 5,
    day: 6,
    week: 7,
    month: 8,
    year: 9
  },
  Et = /*@__PURE__*/Object.keys($r),
  Gr = 864e5,
  Hr = 1e3,
  Vr = 1e3,
  be = 1e6,
  _r = 1e9,
  Jr = 6e10,
  Kr = 36e11,
  Qr = 864e11,
  Xr = [1, Vr, be, _r, Jr, Kr, Qr],
  w = /*@__PURE__*/Et.slice(0, 6),
  ei = /*@__PURE__*/sortStrings(w),
  ni = ["offset"],
  ti = ["timeZone"],
  oi = /*@__PURE__*/w.concat(ni),
  ri = /*@__PURE__*/oi.concat(ti),
  ii = ["era", "eraYear"],
  ai = /*@__PURE__*/ii.concat(["year"]),
  si = ["year"],
  ci = ["monthCode"],
  ui = /*@__PURE__*/["month"].concat(ci),
  li = ["day"],
  fi = /*@__PURE__*/ui.concat(si),
  di = /*@__PURE__*/ci.concat(si),
  en = /*@__PURE__*/li.concat(fi),
  mi = /*@__PURE__*/li.concat(ui),
  pi = /*@__PURE__*/li.concat(ci),
  hi = /*@__PURE__*/jr(w, 0),
  X = "iso8601",
  gi = "gregory",
  Ti = "japanese",
  Di = {
    [gi]: {
      bce: -1,
      ce: 0
    },
    [Ti]: {
      bce: -1,
      ce: 0,
      meiji: 1867,
      taisho: 1911,
      showa: 1925,
      heisei: 1988,
      reiwa: 2018
    },
    ethioaa: {
      era0: 0
    },
    ethiopic: {
      era0: 0,
      era1: 5500
    },
    coptic: {
      era0: -1,
      era1: 0
    },
    roc: {
      beforeroc: -1,
      minguo: 0
    },
    buddhist: {
      be: 0
    },
    islamic: {
      ah: 0
    },
    indian: {
      saka: 0
    },
    persian: {
      ap: 0
    }
  },
  Ii = {
    chinese: 13,
    dangi: 13,
    hebrew: -6
  },
  m = /*@__PURE__*/E(requireType, "string"),
  f = /*@__PURE__*/E(requireType, "boolean"),
  Mi = /*@__PURE__*/E(requireType, "number"),
  $ = /*@__PURE__*/E(requireType, "function"),
  F = /*@__PURE__*/Et.map(e => e + "s"),
  Ni = /*@__PURE__*/sortStrings(F),
  yi = /*@__PURE__*/F.slice(0, 6),
  Pi = /*@__PURE__*/F.slice(6),
  vi = /*@__PURE__*/Pi.slice(1),
  Ei = /*@__PURE__*/Wr(F),
  Si = /*@__PURE__*/jr(F, 0),
  Fi = /*@__PURE__*/jr(yi, 0),
  bi = /*@__PURE__*/E(zeroOutProps, F),
  j = ["isoNanosecond", "isoMicrosecond", "isoMillisecond", "isoSecond", "isoMinute", "isoHour"],
  Oi = ["isoDay", "isoMonth", "isoYear"],
  wi = /*@__PURE__*/j.concat(Oi),
  Bi = /*@__PURE__*/sortStrings(Oi),
  ki = /*@__PURE__*/sortStrings(j),
  Yi = /*@__PURE__*/sortStrings(wi),
  Dt = /*@__PURE__*/jr(ki, 0),
  Ci = /*@__PURE__*/E(zeroOutProps, wi),
  En = Intl.DateTimeFormat,
  Zi = "en-GB",
  Ri = 1e8,
  zi = Ri * Gr,
  qi = [Ri, 0],
  Ui = [-Ri, 0],
  Ai = 275760,
  Li = -271821,
  Wi = 1970,
  ji = 1972,
  xi = 12,
  $i = /*@__PURE__*/isoArgsToEpochMilli(1868, 9, 8),
  Gi = /*@__PURE__*/Jn(computeJapaneseEraParts, WeakMap),
  Hi = "smallestUnit",
  Vi = "unit",
  _i = "roundingIncrement",
  Ji = "fractionalSecondDigits",
  Ki = "relativeTo",
  Qi = {
    constrain: 0,
    reject: 1
  },
  Xi = /*@__PURE__*/Object.keys(Qi),
  ea = {
    compatible: 0,
    reject: 1,
    earlier: 2,
    later: 3
  },
  na = {
    reject: 0,
    use: 1,
    prefer: 2,
    ignore: 3
  },
  ta = {
    auto: 0,
    never: 1,
    critical: 2,
    always: 3
  },
  oa = {
    auto: 0,
    never: 1,
    critical: 2
  },
  ra = {
    auto: 0,
    never: 1
  },
  ia = {
    floor: 0,
    halfFloor: 1,
    ceil: 2,
    halfCeil: 3,
    trunc: 4,
    halfTrunc: 5,
    expand: 6,
    halfExpand: 7,
    halfEven: 8
  },
  aa = /*@__PURE__*/E(refineUnitOption, Hi),
  sa = /*@__PURE__*/E(refineUnitOption, "largestUnit"),
  ca = /*@__PURE__*/E(refineUnitOption, Vi),
  ua = /*@__PURE__*/E(refineChoiceOption, "overflow", Qi),
  la = /*@__PURE__*/E(refineChoiceOption, "disambiguation", ea),
  fa = /*@__PURE__*/E(refineChoiceOption, "offset", na),
  da = /*@__PURE__*/E(refineChoiceOption, "calendarName", ta),
  ma = /*@__PURE__*/E(refineChoiceOption, "timeZoneName", oa),
  pa = /*@__PURE__*/E(refineChoiceOption, "offset", ra),
  ha = /*@__PURE__*/E(refineChoiceOption, "roundingMode", ia),
  L = "PlainYearMonth",
  q = "PlainMonthDay",
  J = "PlainDate",
  We = "PlainDateTime",
  xe = "PlainTime",
  Te = "ZonedDateTime",
  Oe = "Instant",
  qt = "Duration",
  ga = [Math.floor, e => hasHalf(e) ? Math.floor(e) : Math.round(e), Math.ceil, e => hasHalf(e) ? Math.ceil(e) : Math.round(e), Math.trunc, e => hasHalf(e) ? Math.trunc(e) || 0 : Math.round(e), e => e < 0 ? Math.floor(e) : Math.ceil(e), e => Math.sign(e) * Math.round(Math.abs(e)) || 0, e => hasHalf(e) ? (e = Math.trunc(e) || 0) + e % 2 : Math.round(e)],
  Ta = "UTC",
  Da = 5184e3,
  Ia = /*@__PURE__*/isoArgsToEpochSec(1847),
  Ma = /*@__PURE__*/isoArgsToEpochSec(/*@__PURE__*/(/*@__PURE__*/new Date()).getUTCFullYear() + 10),
  Na = /0+$/,
  fn = /*@__PURE__*/Jn(_zonedEpochSlotsToIso, WeakMap),
  ya = 2 ** 32 - 1,
  ie = /*@__PURE__*/Jn(e => {
    const n = getTimeZoneEssence(e);
    return "object" == typeof n ? new IntlTimeZone(n) : new FixedTimeZone(n || 0);
  });
class FixedTimeZone {
  constructor(e) {
    this.v = e;
  }
  getOffsetNanosecondsFor() {
    return this.v;
  }
  getPossibleInstantsFor(e) {
    return [isoToEpochNanoWithOffset(e, this.v)];
  }
  l() {}
}
class IntlTimeZone {
  constructor(e) {
    this.$ = (e => {
      function getOffsetSec(e) {
        const i = clampNumber(e, o, r),
          [a, s] = computePeriod(i),
          c = n(a),
          u = n(s);
        return c === u ? c : pinch(t(a, s), c, u, e);
      }
      function pinch(n, t, o, r) {
        let i, a;
        for (; (void 0 === r || void 0 === (i = r < n[0] ? t : r >= n[1] ? o : void 0)) && (a = n[1] - n[0]);) {
          const t = n[0] + Math.floor(a / 2);
          e(t) === o ? n[1] = t : n[0] = t + 1;
        }
        return i;
      }
      const n = Jn(e),
        t = Jn(createSplitTuple);
      let o = Ia,
        r = Ma;
      return {
        G(e) {
          const n = getOffsetSec(e - 86400),
            t = getOffsetSec(e + 86400),
            o = e - n,
            r = e - t;
          if (n === t) {
            return [o];
          }
          const i = getOffsetSec(o);
          return i === getOffsetSec(r) ? [e - i] : n > t ? [o, r] : [];
        },
        V: getOffsetSec,
        l(e, i) {
          const a = clampNumber(e, o, r);
          let [s, c] = computePeriod(a);
          const u = Da * i,
            l = i < 0 ? () => c > o || (o = a, 0) : () => s < r || (r = a, 0);
          for (; l();) {
            const o = n(s),
              r = n(c);
            if (o !== r) {
              const n = t(s, c);
              pinch(n, o, r);
              const a = n[0];
              if ((compareNumbers(a, e) || 1) === i) {
                return a;
              }
            }
            s += u, c += u;
          }
        }
      };
    })((e => n => {
      const t = hashIntlFormatParts(e, n * Hr);
      return isoArgsToEpochSec(parseIntlPartsYear(t), parseInt(t.month), parseInt(t.day), parseInt(t.hour), parseInt(t.minute), parseInt(t.second)) - n;
    })(e));
  }
  getOffsetNanosecondsFor(e) {
    return this.$.V(epochNanoToSec(e)) * _r;
  }
  getPossibleInstantsFor(e) {
    const [n, t] = [isoArgsToEpochSec((o = e).isoYear, o.isoMonth, o.isoDay, o.isoHour, o.isoMinute, o.isoSecond), o.isoMillisecond * be + o.isoMicrosecond * Vr + o.isoNanosecond];
    var o;
    return this.$.G(n).map(e => checkEpochNanoInBounds(moveBigNano(he(e, _r), t)));
  }
  l(e, n) {
    const [t, o] = epochNanoToSecMod(e),
      r = this.$.l(t + (n > 0 || o ? 1 : 0), n);
    if (void 0 !== r) {
      return he(r, _r);
    }
  }
}
const Pa = "([+−-])",
  va = "(?:[.,](\\d{1,9}))?",
  Ea = `(?:(?:${Pa}(\\d{6}))|(\\d{4}))-?(\\d{2})`,
  Sa = "(\\d{2})(?::?(\\d{2})(?::?(\\d{2})" + va + ")?)?",
  Fa = Pa + Sa,
  ba = Ea + "-?(\\d{2})(?:[T ]" + Sa + "(Z|" + Fa + ")?)?",
  Oa = "\\[(!?)([^\\]]*)\\]",
  wa = `((?:${Oa}){0,9})`,
  Ba = /*@__PURE__*/createRegExp(Ea + wa),
  ka = /*@__PURE__*/createRegExp("(?:--)?(\\d{2})-?(\\d{2})" + wa),
  Ya = /*@__PURE__*/createRegExp(ba + wa),
  Ca = /*@__PURE__*/createRegExp("T?" + Sa + "(?:" + Fa + ")?" + wa),
  Za = /*@__PURE__*/createRegExp(Fa),
  Ra = /*@__PURE__*/new RegExp(Oa, "g"),
  za = /*@__PURE__*/createRegExp(`${Pa}?P(\\d+Y)?(\\d+M)?(\\d+W)?(\\d+D)?(?:T(?:(\\d+)${va}H)?(?:(\\d+)${va}M)?(?:(\\d+)${va}S)?)?`),
  qa = /*@__PURE__*/Jn(e => new En(Zi, {
    timeZone: e,
    era: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  })),
  Ua = /^(AC|AE|AG|AR|AS|BE|BS|CA|CN|CS|CT|EA|EC|IE|IS|JS|MI|NE|NS|PL|PN|PR|PS|SS|VS)T$/,
  Aa = /*@__PURE__*/Jn(createIntlCalendar),
  La = /*@__PURE__*/Jn(e => new En(Zi, {
    calendar: e,
    timeZone: Ta,
    era: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  })),
  Wa = /^M(\d{2})(L?)$/,
  ja = {
    era: toStringViaPrimitive,
    eraYear: toInteger,
    year: toInteger,
    month: toPositiveInteger,
    monthCode: toStringViaPrimitive,
    day: toPositiveInteger
  },
  xa = /*@__PURE__*/jr(w, toInteger),
  $a = /*@__PURE__*/jr(F, toStrictInteger),
  Ga = /*@__PURE__*/Object.assign({}, ja, xa, $a, {
    offset: toStringViaPrimitive
  }),
  Ha = /*@__PURE__*/E(remapProps, w, j),
  Va = {
    dateAdd(e, n, t) {
      const o = H(t);
      let r,
        {
          years: i,
          months: a,
          weeks: s,
          days: c
        } = n;
      if (c += durationFieldsToBigNano(n, 5)[0], i || a) {
        r = ((e, n, t, o, r) => {
          let [i, a, s] = e.h(n);
          if (t) {
            const [n, o] = e.I(i, a);
            i += t, a = monthCodeNumberToMonth(n, o, e.U(i)), a = clampEntity("month", a, 1, e.L(i), r);
          }
          return o && ([i, a] = e._(i, a, o)), s = clampEntity("day", s, 1, e.j(i, a), r), e.q(i, a, s);
        })(this, e, i, a, o);
      } else {
        if (!s && !c) {
          return e;
        }
        r = isoToEpochMilli(e);
      }
      return r += (7 * s + c) * Gr, checkIsoDateInBounds(epochMilliToIso(r));
    },
    dateUntil(e, n, t) {
      if (t <= 7) {
        let o = 0,
          r = diffDays({
            ...e,
            ...Dt
          }, {
            ...n,
            ...Dt
          });
        return 7 === t && ([o, r] = divModTrunc(r, 7)), {
          ...Si,
          weeks: o,
          days: r
        };
      }
      const o = this.h(e),
        r = this.h(n);
      let [i, a, s] = ((e, n, t, o, r, i, a) => {
        let s = r - n,
          c = i - t,
          u = a - o;
        if (s || c) {
          const l = Math.sign(s || c);
          let f = e.j(r, i),
            d = 0;
          if (Math.sign(u) === -l) {
            const o = f;
            [r, i] = e._(r, i, -l), s = r - n, c = i - t, f = e.j(r, i), d = l < 0 ? -o : f;
          }
          if (u = a - Math.min(o, f) + d, s) {
            const [o, a] = e.I(n, t),
              [u, f] = e.I(r, i);
            if (c = u - o || Number(f) - Number(a), Math.sign(c) === -l) {
              const t = l < 0 && -e.L(r);
              s = (r -= l) - n, c = i - monthCodeNumberToMonth(o, a, e.U(r)) + (t || e.L(r));
            }
          }
        }
        return [s, c, u];
      })(this, ...o, ...r);
      return 8 === t && (a += this.J(i, o[0]), i = 0), {
        ...Si,
        years: i,
        months: a,
        days: s
      };
    },
    dateFromFields(e, n) {
      const t = H(n),
        o = refineYear(this, e),
        r = refineMonth(this, e, o, t),
        i = refineDay(this, e, r, o, t);
      return v(checkIsoDateInBounds(this.P(o, r, i)), this.id || X);
    },
    yearMonthFromFields(e, n) {
      const t = H(n),
        o = refineYear(this, e),
        r = refineMonth(this, e, o, t);
      return createPlainYearMonthSlots(checkIsoYearMonthInBounds(this.P(o, r, 1)), this.id || X);
    },
    monthDayFromFields(e, n) {
      const t = H(n),
        o = !this.id,
        {
          monthCode: r,
          year: i,
          month: a
        } = e;
      let s, c, u, l, f;
      if (void 0 !== r) {
        [s, c] = parseMonthCode(r), f = getDefinedProp(e, "day");
        const n = this.N(s, c, f);
        if (!n) {
          throw new RangeError(yr);
        }
        if ([u, l] = n, void 0 !== a && a !== l) {
          throw new RangeError(Mr);
        }
        o && (l = clampEntity("month", l, 1, xi, 1), f = clampEntity("day", f, 1, computeIsoDaysInMonth(void 0 !== i ? i : u, l), t));
      } else {
        u = void 0 === i && o ? ji : refineYear(this, e), l = refineMonth(this, e, u, t), f = refineDay(this, e, l, u, t);
        const n = this.U(u);
        c = l === n, s = monthToMonthCodeNumber(l, n);
        const r = this.N(s, c, f);
        if (!r) {
          throw new RangeError(yr);
        }
        [u, l] = r;
      }
      return createPlainMonthDaySlots(checkIsoDateInBounds(this.P(u, l, f)), this.id || X);
    },
    fields(e) {
      return getCalendarEraOrigins(this) && e.includes("year") ? [...e, ...ii] : e;
    },
    mergeFields(e, n) {
      const t = Object.assign(Object.create(null), e);
      return spliceFields(t, n, ui), getCalendarEraOrigins(this) && (spliceFields(t, n, ai), this.id === Ti && spliceFields(t, n, mi, ii)), t;
    },
    inLeapYear(e) {
      const [n] = this.h(e);
      return this.K(n);
    },
    monthsInYear(e) {
      const [n] = this.h(e);
      return this.L(n);
    },
    daysInMonth(e) {
      const [n, t] = this.h(e);
      return this.j(n, t);
    },
    daysInYear(e) {
      const [n] = this.h(e);
      return this.X(n);
    },
    dayOfYear: computeNativeDayOfYear,
    era(e) {
      return this.ee(e)[0];
    },
    eraYear(e) {
      return this.ee(e)[1];
    },
    monthCode(e) {
      const [n, t] = this.h(e),
        [o, r] = this.I(n, t);
      return ((e, n) => "M" + xr(e) + (n ? "L" : ""))(o, r);
    },
    dayOfWeek: computeIsoDayOfWeek,
    daysInWeek() {
      return 7;
    }
  },
  _a = {
    dayOfYear: computeNativeDayOfYear,
    h: computeIsoDateParts,
    q: isoArgsToEpochMilli
  },
  Ja = /*@__PURE__*/Object.assign({}, _a, {
    weekOfYear: computeNativeWeekOfYear,
    yearOfWeek: computeNativeYearOfWeek,
    R(e) {
      function computeWeekShift(e) {
        return (7 - e < n ? 7 : 0) - e;
      }
      function computeWeeksInYear(e) {
        const n = computeIsoDaysInYear(l + e),
          t = e || 1,
          o = computeWeekShift(modFloor(a + n * t, 7));
        return c = (n + (o - s) * t) / 7;
      }
      const n = this.id ? 1 : 4,
        t = computeIsoDayOfWeek(e),
        o = this.dayOfYear(e),
        r = modFloor(t - 1, 7),
        i = o - 1,
        a = modFloor(r - i, 7),
        s = computeWeekShift(a);
      let c,
        u = Math.floor((i - s) / 7) + 1,
        l = e.isoYear;
      return u ? u > computeWeeksInYear(0) && (u = 1, l++) : (u = computeWeeksInYear(-1), l--), [u, l, c];
    }
  }),
  Ka = {
    dayOfYear: computeNativeDayOfYear,
    h: computeIntlDateParts,
    q: computeIntlEpochMilli,
    weekOfYear: computeNativeWeekOfYear,
    yearOfWeek: computeNativeYearOfWeek,
    R() {
      return [];
    }
  },
  Y = /*@__PURE__*/createNativeOpsCreator(/*@__PURE__*/Object.assign({}, Va, Ja, {
    h: computeIsoDateParts,
    ee(e) {
      return this.id === gi ? computeGregoryEraParts(e) : this.id === Ti ? Gi(e) : [];
    },
    I: (e, n) => [n, 0],
    N(e, n) {
      if (!n) {
        return [ji, e];
      }
    },
    K: computeIsoInLeapYear,
    U() {},
    L: computeIsoMonthsInYear,
    J: e => e * xi,
    j: computeIsoDaysInMonth,
    X: computeIsoDaysInYear,
    P: (e, n, t) => ({
      isoYear: e,
      isoMonth: n,
      isoDay: t
    }),
    q: isoArgsToEpochMilli,
    _: (e, n, t) => (e += divTrunc(t, xi), (n += modTrunc(t, xi)) < 1 ? (e--, n += xi) : n > xi && (e++, n -= xi), [e, n]),
    year(e) {
      return e.isoYear;
    },
    month(e) {
      return e.isoMonth;
    },
    day: e => e.isoDay
  }), /*@__PURE__*/Object.assign({}, Va, Ka, {
    h: computeIntlDateParts,
    ee(e) {
      const n = this.O(e);
      return [n.era, n.eraYear];
    },
    I(e, n) {
      const t = computeIntlLeapMonth.call(this, e);
      return [monthToMonthCodeNumber(n, t), t === n];
    },
    N(e, n, t) {
      let [o, r, i] = computeIntlDateParts.call(this, {
        isoYear: ji,
        isoMonth: xi,
        isoDay: 31
      });
      const a = computeIntlLeapMonth.call(this, o),
        s = r === a;
      1 === (compareNumbers(e, monthToMonthCodeNumber(r, a)) || compareNumbers(Number(n), Number(s)) || compareNumbers(t, i)) && o--;
      for (let r = 0; r < 100; r++) {
        const i = o - r,
          a = computeIntlLeapMonth.call(this, i),
          s = monthCodeNumberToMonth(e, n, a);
        if (n === (s === a) && t <= computeIntlDaysInMonth.call(this, i, s)) {
          return [i, s];
        }
      }
    },
    K(e) {
      const n = computeIntlDaysInYear.call(this, e);
      return n > computeIntlDaysInYear.call(this, e - 1) && n > computeIntlDaysInYear.call(this, e + 1);
    },
    U: computeIntlLeapMonth,
    L: computeIntlMonthsInYear,
    J(e, n) {
      const t = n + e,
        o = Math.sign(e),
        r = o < 0 ? -1 : 0;
      let i = 0;
      for (let e = n; e !== t; e += o) {
        i += computeIntlMonthsInYear.call(this, e + r);
      }
      return i;
    },
    j: computeIntlDaysInMonth,
    X: computeIntlDaysInYear,
    P(e, n, t) {
      return epochMilliToIso(computeIntlEpochMilli.call(this, e, n, t));
    },
    q: computeIntlEpochMilli,
    _(e, n, t) {
      if (t) {
        if (n += t, !Number.isSafeInteger(n)) {
          throw new RangeError(Cr);
        }
        if (t < 0) {
          for (; n < 1;) {
            n += computeIntlMonthsInYear.call(this, --e);
          }
        } else {
          let t;
          for (; n > (t = computeIntlMonthsInYear.call(this, e));) {
            n -= t, e++;
          }
        }
      }
      return [e, n];
    },
    year(e) {
      return this.O(e).year;
    },
    month(e) {
      const {
          year: n,
          F: t
        } = this.O(e),
        {
          C: o
        } = this.B(n);
      return o[t] + 1;
    },
    day(e) {
      return this.O(e).day;
    }
  })),
  Qa = "numeric",
  Xa = ["timeZoneName"],
  es = {
    month: Qa,
    day: Qa
  },
  ns = {
    year: Qa,
    month: Qa
  },
  ts = /*@__PURE__*/Object.assign({}, ns, {
    day: Qa
  }),
  os = {
    hour: Qa,
    minute: Qa,
    second: Qa
  },
  rs = /*@__PURE__*/Object.assign({}, ts, os),
  is = /*@__PURE__*/Object.assign({}, rs, {
    timeZoneName: "short"
  }),
  as = /*@__PURE__*/Object.keys(ns),
  ss = /*@__PURE__*/Object.keys(es),
  cs = /*@__PURE__*/Object.keys(ts),
  us = /*@__PURE__*/Object.keys(os),
  ls = ["dateStyle"],
  fs = /*@__PURE__*/as.concat(ls),
  ds = /*@__PURE__*/ss.concat(ls),
  ms = /*@__PURE__*/cs.concat(ls, ["weekday"]),
  ps = /*@__PURE__*/us.concat(["dayPeriod", "timeStyle"]),
  hs = /*@__PURE__*/ms.concat(ps),
  gs = /*@__PURE__*/hs.concat(Xa),
  Ts = /*@__PURE__*/Xa.concat(ps),
  Ds = /*@__PURE__*/Xa.concat(ms),
  Is = /*@__PURE__*/Xa.concat(["day", "weekday"], ps),
  Ms = /*@__PURE__*/Xa.concat(["year", "weekday"], ps),
  Ns = {},
  t = [/*@__PURE__*/createOptionsTransformer(hs, rs), y],
  s = [/*@__PURE__*/createOptionsTransformer(gs, is), y, 0, (e, n) => {
    const t = I(e.timeZone);
    if (n && I(n.timeZone) !== t) {
      throw new RangeError(Fr);
    }
    return t;
  }],
  n = [/*@__PURE__*/createOptionsTransformer(hs, rs, Xa), isoToEpochMilli],
  o = [/*@__PURE__*/createOptionsTransformer(ms, ts, Ts), isoToEpochMilli],
  r = [/*@__PURE__*/createOptionsTransformer(ps, os, Ds), e => isoTimeFieldsToNano(e) / be],
  a = [/*@__PURE__*/createOptionsTransformer(fs, ns, Is), isoToEpochMilli, 1],
  i = [/*@__PURE__*/createOptionsTransformer(ds, es, Ms), isoToEpochMilli, 1];
let ys;

function createSlotClass(e, t, n, o, r) {
  function Class() {
    if (!(this instanceof Class)) {
      throw new TypeError(P);
    }
    oo(this, t(...arguments));
  }
  function bindMethod(e, t) {
    return Object.defineProperties(function () {
      for (var _len = arguments.length, t = new Array(_len), _key = 0; _key < _len; _key++) {
        t[_key] = arguments[_key];
      }
      return e.call(this, getSpecificSlots(this), ...t);
    }, D$1(t));
  }
  function getSpecificSlots(t) {
    const n = no(t);
    if (!n || n.branding !== e) {
      throw new TypeError(P);
    }
    return n;
  }
  return Object.defineProperties(Class.prototype, {
    ...O(T(bindMethod, n)),
    ...p(T(bindMethod, o)),
    ...h("Temporal." + e)
  }), Object.defineProperties(Class, {
    ...p(r),
    ...D$1(e)
  }), [Class, e => {
    const t = Object.create(Class.prototype);
    return oo(t, e), t;
  }, getSpecificSlots];
}
function createProtocolValidator(e) {
  return e = e.concat("id").sort(), t => {
    if (!C(t, e)) {
      throw new TypeError(g);
    }
    return t;
  };
}
function rejectInvalidBag(e) {
  if (no(e) || void 0 !== e.calendar || void 0 !== e.timeZone) {
    throw new TypeError(Z);
  }
  return e;
}
function createCalendarFieldMethods(e, t) {
  const n = {};
  for (const o in e) {
    n[o] = (_ref, n) => {
      let {
        o: e
      } = _ref;
      const r = no(n) || {},
        {
          branding: a
        } = r,
        i = a === J || t.includes(a) ? r : toPlainDateSlots(n);
      return e[o](i);
    };
  }
  return n;
}
function createCalendarGetters(e) {
  const t = {};
  for (const n in e) {
    t[n] = e => {
      const {
        calendar: t
      } = e;
      return (o = t, "string" == typeof o ? Y(o) : (r = o, Object.assign(Object.create(co), {
        i: r
      })))[n](e);
      var o, r;
    };
  }
  return t;
}
function neverValueOf() {
  throw new TypeError(A);
}
function createCalendarFromSlots(_ref2) {
  let {
    calendar: e
  } = _ref2;
  return "string" == typeof e ? new lr(e) : e;
}
function toPlainMonthDaySlots(e, t) {
  if (t = U(t), z(e)) {
    const n = no(e);
    if (n && n.branding === q) {
      return H(t), n;
    }
    const o = extractCalendarSlotFromBag(e);
    return K(Qo(o || X), !o, e, t);
  }
  const n = Q(Y, e);
  return H(t), n;
}
function getOffsetNanosecondsForAdapter(e, t, n) {
  return o = t.call(e, Co(_(n))), ae(u(o));
  var o;
}
function createAdapterOps(e) {
  let t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ho;
  const n = Object.keys(t).sort(),
    o = {};
  for (const r of n) {
    o[r] = E(t[r], e, $(e[r]));
  }
  return o;
}
function createTimeZoneOps(e, t) {
  return "string" == typeof e ? ie(e) : createAdapterOps(e, t);
}
function createTimeZoneOffsetOps(e) {
  return createTimeZoneOps(e, Do);
}
function toInstantSlots(e) {
  if (z(e)) {
    const t = no(e);
    if (t) {
      switch (t.branding) {
        case Oe:
          return t;
        case Te:
          return _(t.epochNanoseconds);
      }
    }
  }
  return pe(e);
}
function toTemporalInstant() {
  return Co(_(he(this.valueOf(), be)));
}
function getImplTransition(e, t, n) {
  const o = t.l(toInstantSlots(n).epochNanoseconds, e);
  return o ? Co(_(o)) : null;
}
function refineTimeZoneSlot(e) {
  return z(e) ? (no(e) || {}).timeZone || Fo(e) : (e => ye(Ne(m(e))))(e);
}
function toPlainTimeSlots(e, t) {
  if (z(e)) {
    const n = no(e) || {};
    switch (n.branding) {
      case xe:
        return H(t), n;
      case We:
        return H(t), Ge(n);
      case Te:
        return H(t), Re(createTimeZoneOffsetOps, n);
    }
    return Ue(e, t);
  }
  return H(t), ze(e);
}
function optionalToPlainTimeFields(e) {
  return void 0 === e ? void 0 : toPlainTimeSlots(e);
}
function toPlainYearMonthSlots(e, t) {
  if (t = U(t), z(e)) {
    const n = no(e);
    return n && n.branding === L ? (H(t), n) : nt(Ho(getCalendarSlotFromBag(e)), e, t);
  }
  const n = ot(Y, e);
  return H(t), n;
}
function toPlainDateTimeSlots(e, t) {
  if (t = U(t), z(e)) {
    const n = no(e) || {};
    switch (n.branding) {
      case We:
        return H(t), n;
      case J:
        return H(t), ee({
          ...n,
          ...Dt
        });
      case Te:
        return H(t), ht(createTimeZoneOffsetOps, n);
    }
    return Pt(Ko(getCalendarSlotFromBag(e)), e, t);
  }
  const n = Ct(e);
  return H(t), n;
}
function toPlainDateSlots(e, t) {
  if (t = U(t), z(e)) {
    const n = no(e) || {};
    switch (n.branding) {
      case J:
        return H(t), n;
      case We:
        return H(t), v(n);
      case Te:
        return H(t), Bt(createTimeZoneOffsetOps, n);
    }
    return Yt(Ko(getCalendarSlotFromBag(e)), e, t);
  }
  const n = At(e);
  return H(t), n;
}
function dayAdapter(e, t, n) {
  return d(t.call(e, Yo(v(n, e))));
}
function createCompoundOpsCreator(e) {
  return t => "string" == typeof t ? Y(t) : ((e, t) => {
    const n = Object.keys(t).sort(),
      o = {};
    for (const r of n) {
      o[r] = E(t[r], e, e[r]);
    }
    return o;
  })(t, e);
}
function toDurationSlots(e) {
  if (z(e)) {
    const t = no(e);
    return t && t.branding === qt ? t : Ht(e);
  }
  return Kt(e);
}
function refinePublicRelativeTo(e) {
  if (void 0 !== e) {
    if (z(e)) {
      const t = no(e) || {};
      switch (t.branding) {
        case Te:
        case J:
          return t;
        case We:
          return v(t);
      }
      const n = getCalendarSlotFromBag(e);
      return {
        ...Qt(refineTimeZoneSlot, createTimeZoneOps, Ko(n), e),
        calendar: n
      };
    }
    return Xt(e);
  }
}
function getCalendarSlotFromBag(e) {
  return extractCalendarSlotFromBag(e) || X;
}
function extractCalendarSlotFromBag(e) {
  const {
    calendar: t
  } = e;
  if (void 0 !== t) {
    return refineCalendarSlot(t);
  }
}
function refineCalendarSlot(e) {
  return z(e) ? (no(e) || {}).calendar || cr(e) : (e => an(sn(m(e))))(e);
}
function toZonedDateTimeSlots(e, t) {
  if (t = U(t), z(e)) {
    const n = no(e);
    if (n && n.branding === Te) {
      return wn(t), n;
    }
    const o = getCalendarSlotFromBag(e);
    return jn(refineTimeZoneSlot, createTimeZoneOps, Ko(o), o, e, t);
  }
  return Mn(e, t);
}
function adaptDateMethods(e) {
  return T(e => t => e(slotsToIso(t)), e);
}
function slotsToIso(e) {
  return fn(e, createTimeZoneOffsetOps);
}
function createDateTimeFormatClass() {
  const e = En.prototype,
    t = Object.getOwnPropertyDescriptors(e),
    n = Object.getOwnPropertyDescriptors(En),
    DateTimeFormat = function (e) {
      let t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!(this instanceof DateTimeFormat)) {
        return new DateTimeFormat(e, t);
      }
      Or.set(this, function (e) {
        let t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        const n = new En(e, t),
          o = n.resolvedOptions(),
          r = o.locale,
          a = Vn(Object.keys(t), o),
          i = Jn(createFormatPrepperForBranding),
          prepFormat = function () {
            let t;
            for (var _len2 = arguments.length, e = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              e[_key2] = arguments[_key2];
            }
            const o = e.map((e, n) => {
              const o = no(e),
                r = (o || {}).branding;
              if (n && t && t !== r) {
                throw new TypeError(kn);
              }
              return t = r, o;
            });
            return t ? i(t)(r, a, ...o) : [n, ...e];
          };
        return prepFormat.u = n, prepFormat;
      }(e, t));
    };
  for (const e in t) {
    const n = t[e],
      o = e.startsWith("format") && createFormatMethod(e);
    "function" == typeof n.value ? n.value = "constructor" === e ? DateTimeFormat : o || createProxiedMethod(e) : o && (n.get = function () {
      return o.bind(this);
    });
  }
  return n.prototype.value = Object.create(e, t), Object.defineProperties(DateTimeFormat, n), DateTimeFormat;
}
function createFormatMethod(e) {
  return function () {
    const n = Or.get(this),
      [o, ...r] = n(...arguments);
    return o[e](...r);
  };
}
function createProxiedMethod(e) {
  return function () {
    return Or.get(this).u[e](...arguments);
  };
}
function createFormatPrepperForBranding(t) {
  const n = xn[t];
  if (!n) {
    throw new TypeError(Ln(t));
  }
  return e(n, Jn(qn));
}
const xn = {
    Instant: t,
    PlainDateTime: n,
    PlainDate: o,
    PlainTime: r,
    PlainYearMonth: a,
    PlainMonthDay: i
  },
  Rn = /*@__PURE__*/e(t),
  Wn = /*@__PURE__*/e(s),
  Gn = /*@__PURE__*/e(n),
  Un = /*@__PURE__*/e(o),
  zn = /*@__PURE__*/e(r),
  Hn = /*@__PURE__*/e(a),
  Kn = /*@__PURE__*/e(i),
  Qn = {
    era: l,
    eraYear: c,
    year: u,
    month: d,
    daysInMonth: d,
    daysInYear: d,
    inLeapYear: f,
    monthsInYear: d
  },
  Xn = {
    monthCode: m
  },
  $n = {
    day: d
  },
  _n = {
    dayOfWeek: d,
    dayOfYear: d,
    weekOfYear: S,
    yearOfWeek: c,
    daysInWeek: d
  },
  eo = /*@__PURE__*/Object.assign({}, Qn, Xn, $n, _n),
  to = /*@__PURE__*/new WeakMap(),
  no = /*@__PURE__*/to.get.bind(to),
  oo = /*@__PURE__*/to.set.bind(to),
  ro = {
    ...createCalendarFieldMethods(Qn, [L]),
    ...createCalendarFieldMethods(_n, []),
    ...createCalendarFieldMethods(Xn, [L, q]),
    ...createCalendarFieldMethods($n, [q])
  },
  ao = /*@__PURE__*/createCalendarGetters(eo),
  io = /*@__PURE__*/createCalendarGetters({
    ...Qn,
    ...Xn
  }),
  so = /*@__PURE__*/createCalendarGetters({
    ...Xn,
    ...$n
  }),
  lo = {
    calendarId: e => I(e.calendar)
  },
  co = /*@__PURE__*/T((e, t) => function (n) {
    const {
      i: o
    } = this;
    return e(o[t](Yo(v(n, o))));
  }, eo),
  uo = /*@__PURE__*/b(e => t => t[e], F.concat("sign")),
  fo = /*@__PURE__*/b((e, t) => e => e[j[t]], w),
  mo = {
    epochSeconds: M,
    epochMilliseconds: y,
    epochMicroseconds: N,
    epochNanoseconds: B
  },
  So = /*@__PURE__*/E(V, new Set(["branding"])),
  [Oo, To, po] = createSlotClass(q, E(G, refineCalendarSlot), {
    ...lo,
    ...so
  }, {
    getISOFields: So,
    getCalendar: createCalendarFromSlots,
    with(e, t, n) {
      return To(k(_o, e, this, rejectInvalidBag(t), n));
    },
    equals: (e, t) => x(e, toPlainMonthDaySlots(t)),
    toPlainDate(e, t) {
      return Yo(R($o, e, this, t));
    },
    toLocaleString(e, t, n) {
      const [o, r] = Kn(t, n, e);
      return o.format(r);
    },
    toString: W,
    toJSON: e => W(e),
    valueOf: neverValueOf
  }, {
    from: (e, t) => To(toPlainMonthDaySlots(e, t))
  }),
  ho = {
    getOffsetNanosecondsFor: getOffsetNanosecondsForAdapter,
    getPossibleInstantsFor(e, t, n) {
      const o = [...t.call(e, No(ee(n, X)))].map(e => go(e).epochNanoseconds),
        r = o.length;
      return r > 1 && (o.sort(te), ne(oe(re(o[0], o[r - 1])))), o;
    }
  },
  Do = {
    getOffsetNanosecondsFor: getOffsetNanosecondsForAdapter
  },
  [Po, Co, go] = createSlotClass(Oe, Se, mo, {
    add: (e, t) => Co(se(0, e, toDurationSlots(t))),
    subtract: (e, t) => Co(se(1, e, toDurationSlots(t))),
    until: (e, t, n) => ar(le(0, e, toInstantSlots(t), n)),
    since: (e, t, n) => ar(le(1, e, toInstantSlots(t), n)),
    round: (e, t) => Co(ce(e, t)),
    equals: (e, t) => ue(e, toInstantSlots(t)),
    toZonedDateTime(e, t) {
      const n = de(t);
      return dr(fe(e, refineTimeZoneSlot(n.timeZone), refineCalendarSlot(n.calendar)));
    },
    toZonedDateTimeISO: (e, t) => dr(fe(e, refineTimeZoneSlot(t))),
    toLocaleString(e, t, n) {
      const [o, r] = Rn(t, n, e);
      return o.format(r);
    },
    toString: (e, t) => me(refineTimeZoneSlot, createTimeZoneOffsetOps, e, t),
    toJSON: e => me(refineTimeZoneSlot, createTimeZoneOffsetOps, e),
    valueOf: neverValueOf
  }, {
    from: e => Co(toInstantSlots(e)),
    fromEpochSeconds: e => Co(De(e)),
    fromEpochMilliseconds: e => Co(Pe(e)),
    fromEpochMicroseconds: e => Co(Ce(e)),
    fromEpochNanoseconds: e => Co(ge(e)),
    compare: (e, t) => Ze(toInstantSlots(e), toInstantSlots(t))
  }),
  [Zo, bo] = createSlotClass("TimeZone", e => {
    const t = Me(e);
    return {
      branding: "TimeZone",
      id: t,
      o: ie(t)
    };
  }, {
    id: e => e.id
  }, {
    getPossibleInstantsFor: (_ref3, t) => {
      let {
        o: e
      } = _ref3;
      return e.getPossibleInstantsFor(toPlainDateTimeSlots(t)).map(e => Co(_(e)));
    },
    getOffsetNanosecondsFor: (_ref4, t) => {
      let {
        o: e
      } = _ref4;
      return e.getOffsetNanosecondsFor(toInstantSlots(t).epochNanoseconds);
    },
    getOffsetStringFor(e, t) {
      const n = toInstantSlots(t).epochNanoseconds,
        o = createAdapterOps(this, Do).getOffsetNanosecondsFor(n);
      return Fe(o);
    },
    getPlainDateTimeFor(e, t) {
      let n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : X;
      const o = toInstantSlots(t).epochNanoseconds,
        r = createAdapterOps(this, Do).getOffsetNanosecondsFor(o);
      return No(ee(Ie(o, r), refineCalendarSlot(n)));
    },
    getInstantFor(e, t, n) {
      const o = toPlainDateTimeSlots(t),
        r = ve(n),
        a = createAdapterOps(this);
      return Co(_(we(a, o, r)));
    },
    getNextTransition: (_ref5, t) => {
      let {
        o: e
      } = _ref5;
      return getImplTransition(1, e, t);
    },
    getPreviousTransition: (_ref6, t) => {
      let {
        o: e
      } = _ref6;
      return getImplTransition(-1, e, t);
    },
    equals(e, t) {
      return !!je(this, refineTimeZoneSlot(t));
    },
    toString: e => e.id,
    toJSON: e => e.id
  }, {
    from(e) {
      const t = refineTimeZoneSlot(e);
      return "string" == typeof t ? new Zo(t) : t;
    }
  }),
  Fo = /*@__PURE__*/createProtocolValidator(Object.keys(ho)),
  [Io, vo] = createSlotClass(xe, ke, fo, {
    getISOFields: So,
    with(e, t, n) {
      return vo(Be(this, rejectInvalidBag(t), n));
    },
    add: (e, t) => vo(Ye(0, e, toDurationSlots(t))),
    subtract: (e, t) => vo(Ye(1, e, toDurationSlots(t))),
    until: (e, t, n) => ar(Ae(0, e, toPlainTimeSlots(t), n)),
    since: (e, t, n) => ar(Ae(1, e, toPlainTimeSlots(t), n)),
    round: (e, t) => vo(Ee(e, t)),
    equals: (e, t) => Ve(e, toPlainTimeSlots(t)),
    toZonedDateTime: (e, t) => dr(Je(refineTimeZoneSlot, toPlainDateSlots, createTimeZoneOps, e, t)),
    toPlainDateTime: (e, t) => No(Le(e, toPlainDateSlots(t))),
    toLocaleString(e, t, n) {
      const [o, r] = zn(t, n, e);
      return o.format(r);
    },
    toString: qe,
    toJSON: e => qe(e),
    valueOf: neverValueOf
  }, {
    from: (e, t) => vo(toPlainTimeSlots(e, t)),
    compare: (e, t) => He(toPlainTimeSlots(e), toPlainTimeSlots(t))
  }),
  [wo, jo, Mo] = createSlotClass(L, E(tt, refineCalendarSlot), {
    ...lo,
    ...io
  }, {
    getISOFields: So,
    getCalendar: createCalendarFromSlots,
    with(e, t, n) {
      return jo(Ke(Xo, e, this, rejectInvalidBag(t), n));
    },
    add: (e, t, n) => jo(Qe(nr, 0, e, toDurationSlots(t), n)),
    subtract: (e, t, n) => jo(Qe(nr, 1, e, toDurationSlots(t), n)),
    until: (e, t, n) => ar(Xe(or, 0, e, toPlainYearMonthSlots(t), n)),
    since: (e, t, n) => ar(Xe(or, 1, e, toPlainYearMonthSlots(t), n)),
    equals: (e, t) => $e(e, toPlainYearMonthSlots(t)),
    toPlainDate(e, t) {
      return Yo(_e($o, e, this, t));
    },
    toLocaleString(e, t, n) {
      const [o, r] = Hn(t, n, e);
      return o.format(r);
    },
    toString: et,
    toJSON: e => et(e),
    valueOf: neverValueOf
  }, {
    from: (e, t) => jo(toPlainYearMonthSlots(e, t)),
    compare: (e, t) => rt(toPlainYearMonthSlots(e), toPlainYearMonthSlots(t))
  }),
  [yo, No] = createSlotClass(We, E(pt, refineCalendarSlot), {
    ...lo,
    ...ao,
    ...fo
  }, {
    getISOFields: So,
    getCalendar: createCalendarFromSlots,
    with(e, t, n) {
      return No(at($o, e, this, rejectInvalidBag(t), n));
    },
    withCalendar: (e, t) => No(it(e, refineCalendarSlot(t))),
    withPlainDate: (e, t) => No(st(e, toPlainDateSlots(t))),
    withPlainTime: (e, t) => No(lt(e, optionalToPlainTimeFields(t))),
    add: (e, t, n) => No(ct(er, 0, e, toDurationSlots(t), n)),
    subtract: (e, t, n) => No(ct(er, 1, e, toDurationSlots(t), n)),
    until: (e, t, n) => ar(ut(tr, 0, e, toPlainDateTimeSlots(t), n)),
    since: (e, t, n) => ar(ut(tr, 1, e, toPlainDateTimeSlots(t), n)),
    round: (e, t) => No(dt(e, t)),
    equals: (e, t) => ft(e, toPlainDateTimeSlots(t)),
    toZonedDateTime: (e, t, n) => dr(mt(createTimeZoneOps, e, refineTimeZoneSlot(t), n)),
    toPlainDate: e => Yo(v(e)),
    toPlainTime: e => vo(Ge(e)),
    toPlainYearMonth(e) {
      return jo(St(Ho, e, this));
    },
    toPlainMonthDay(e) {
      return To(Ot(Qo, e, this));
    },
    toLocaleString(e, t, n) {
      const [o, r] = Gn(t, n, e);
      return o.format(r);
    },
    toString: Tt,
    toJSON: e => Tt(e),
    valueOf: neverValueOf
  }, {
    from: (e, t) => No(toPlainDateTimeSlots(e, t)),
    compare: (e, t) => gt(toPlainDateTimeSlots(e), toPlainDateTimeSlots(t))
  }),
  [Bo, Yo, Ao] = createSlotClass(J, E(Nt, refineCalendarSlot), {
    ...lo,
    ...ao
  }, {
    getISOFields: So,
    getCalendar: createCalendarFromSlots,
    with(e, t, n) {
      return Yo(Zt($o, e, this, rejectInvalidBag(t), n));
    },
    withCalendar: (e, t) => Yo(it(e, refineCalendarSlot(t))),
    add: (e, t, n) => Yo(bt(er, 0, e, toDurationSlots(t), n)),
    subtract: (e, t, n) => Yo(bt(er, 1, e, toDurationSlots(t), n)),
    until: (e, t, n) => ar(Ft(tr, 0, e, toPlainDateSlots(t), n)),
    since: (e, t, n) => ar(Ft(tr, 1, e, toPlainDateSlots(t), n)),
    equals: (e, t) => It(e, toPlainDateSlots(t)),
    toZonedDateTime(e, t) {
      const n = !z(t) || t instanceof Zo ? {
        timeZone: t
      } : t;
      return dr(vt(refineTimeZoneSlot, toPlainTimeSlots, createTimeZoneOps, e, n));
    },
    toPlainDateTime: (e, t) => No(wt(e, optionalToPlainTimeFields(t))),
    toPlainYearMonth(e) {
      return jo(jt(Ho, e, this));
    },
    toPlainMonthDay(e) {
      return To(Mt(Qo, e, this));
    },
    toLocaleString(e, t, n) {
      const [o, r] = Un(t, n, e);
      return o.format(r);
    },
    toString: yt,
    toJSON: e => yt(e),
    valueOf: neverValueOf
  }, {
    from: (e, t) => Yo(toPlainDateSlots(e, t)),
    compare: (e, t) => rt(toPlainDateSlots(e), toPlainDateSlots(t))
  }),
  Eo = {
    fields(e, t, n) {
      return [...t.call(e, n)];
    }
  },
  Vo = /*@__PURE__*/Object.assign({
    dateFromFields(e, t, n, o) {
      return Ao(t.call(e, Object.assign(Object.create(null), n), o));
    }
  }, Eo),
  Jo = /*@__PURE__*/Object.assign({
    yearMonthFromFields(e, t, n, o) {
      return Mo(t.call(e, Object.assign(Object.create(null), n), o));
    }
  }, Eo),
  Lo = /*@__PURE__*/Object.assign({
    monthDayFromFields(e, t, n, o) {
      return po(t.call(e, Object.assign(Object.create(null), n), o));
    }
  }, Eo),
  qo = {
    mergeFields(e, t, n, o) {
      return de(t.call(e, Object.assign(Object.create(null), n), Object.assign(Object.create(null), o)));
    }
  },
  ko = /*@__PURE__*/Object.assign({}, Vo, qo),
  xo = /*@__PURE__*/Object.assign({}, Jo, qo),
  Ro = /*@__PURE__*/Object.assign({}, Lo, qo),
  Wo = {
    dateAdd(e, t, n, o, r) {
      return Ao(t.call(e, Yo(v(n, e)), ar(Vt(o)), r));
    }
  },
  Go = /*@__PURE__*/Object.assign({}, Wo, {
    dateUntil(e, t, n, o, r, a) {
      return ir(t.call(e, Yo(v(n, e)), Yo(v(o, e)), Object.assign(Object.create(null), a, {
        largestUnit: Et[r]
      })));
    }
  }),
  Uo = /*@__PURE__*/Object.assign({}, Wo, {
    day: dayAdapter
  }),
  zo = /*@__PURE__*/Object.assign({}, Go, {
    day: dayAdapter
  }),
  Ho = /*@__PURE__*/createCompoundOpsCreator(Jo),
  Ko = /*@__PURE__*/createCompoundOpsCreator(Vo),
  Qo = /*@__PURE__*/createCompoundOpsCreator(Lo),
  Xo = /*@__PURE__*/createCompoundOpsCreator(xo),
  $o = /*@__PURE__*/createCompoundOpsCreator(ko),
  _o = /*@__PURE__*/createCompoundOpsCreator(Ro),
  er = /*@__PURE__*/createCompoundOpsCreator(Wo),
  tr = /*@__PURE__*/createCompoundOpsCreator(Go),
  nr = /*@__PURE__*/createCompoundOpsCreator(Uo),
  or = /*@__PURE__*/createCompoundOpsCreator(zo),
  [rr, ar, ir] = createSlotClass(qt, Lt, {
    ...uo,
    blank: Jt
  }, {
    with: (e, t) => ar(kt(e, t)),
    negated: e => ar(xt(e)),
    abs: e => ar(Rt(e)),
    add: (e, t, n) => ar(Wt(refinePublicRelativeTo, tr, createTimeZoneOps, 0, e, toDurationSlots(t), n)),
    subtract: (e, t, n) => ar(Wt(refinePublicRelativeTo, tr, createTimeZoneOps, 1, e, toDurationSlots(t), n)),
    round: (e, t) => ar(Gt(refinePublicRelativeTo, tr, createTimeZoneOps, e, t)),
    total: (e, t) => Ut(refinePublicRelativeTo, tr, createTimeZoneOps, e, t),
    toLocaleString(e, t, n) {
      return Intl.DurationFormat ? new Intl.DurationFormat(t, n).format(this) : zt(e);
    },
    toString: zt,
    toJSON: e => zt(e),
    valueOf: neverValueOf
  }, {
    from: e => ar(toDurationSlots(e)),
    compare: (e, t, n) => $t(refinePublicRelativeTo, er, createTimeZoneOps, toDurationSlots(e), toDurationSlots(t), n)
  }),
  sr = {
    toString: e => e.id,
    toJSON: e => e.id,
    ...ro,
    dateAdd: (_ref7, n, o, r) => {
      let {
        id: e,
        o: t
      } = _ref7;
      return Yo(v(t.dateAdd(toPlainDateSlots(n), toDurationSlots(o), r), e));
    },
    dateUntil: (_ref8, t, n, o) => {
      let {
        o: e
      } = _ref8;
      return ar(Vt(e.dateUntil(toPlainDateSlots(t), toPlainDateSlots(n), _t(o))));
    },
    dateFromFields: (_ref9, n, o) => {
      let {
        id: e,
        o: t
      } = _ref9;
      return Yo(Yt(t, n, o, ln(e)));
    },
    yearMonthFromFields: (_ref10, n, o) => {
      let {
        id: e,
        o: t
      } = _ref10;
      return jo(nt(t, n, o, un(e)));
    },
    monthDayFromFields: (_ref11, n, o) => {
      let {
        id: e,
        o: t
      } = _ref11;
      return To(K(t, 0, n, o, cn(e)));
    },
    fields(_ref12, t) {
      let {
        o: e
      } = _ref12;
      const n = new Set(en),
        o = [];
      for (const e of t) {
        if (m(e), !n.has(e)) {
          throw new RangeError(tn(e));
        }
        n.delete(e), o.push(e);
      }
      return e.fields(o);
    },
    mergeFields: (_ref13, t, n) => {
      let {
        o: e
      } = _ref13;
      return e.mergeFields(nn(on(t)), nn(on(n)));
    }
  },
  [lr] = createSlotClass("Calendar", e => {
    const t = rn(e);
    return {
      branding: "Calendar",
      id: t,
      o: Y(t)
    };
  }, {
    id: e => e.id
  }, sr, {
    from(e) {
      const t = refineCalendarSlot(e);
      return "string" == typeof t ? new lr(t) : t;
    }
  }),
  cr = /*@__PURE__*/createProtocolValidator(Object.keys(sr).slice(4)),
  [ur, dr] = createSlotClass(Te, E(vn, refineCalendarSlot, refineTimeZoneSlot), {
    ...mo,
    ...lo,
    ...adaptDateMethods(ao),
    ...adaptDateMethods(fo),
    offset: e => Fe(slotsToIso(e).offsetNanoseconds),
    offsetNanoseconds: e => slotsToIso(e).offsetNanoseconds,
    timeZoneId: e => I(e.timeZone),
    hoursInDay: e => dn(createTimeZoneOps, e)
  }, {
    getISOFields: e => mn(createTimeZoneOffsetOps, e),
    getCalendar: createCalendarFromSlots,
    getTimeZone: _ref14 => {
      let {
        timeZone: e
      } = _ref14;
      return "string" == typeof e ? new Zo(e) : e;
    },
    with(e, t, n) {
      return dr(Sn($o, createTimeZoneOps, e, this, rejectInvalidBag(t), n));
    },
    withCalendar: (e, t) => dr(it(e, refineCalendarSlot(t))),
    withTimeZone: (e, t) => dr(On(e, refineTimeZoneSlot(t))),
    withPlainDate: (e, t) => dr(Tn(createTimeZoneOps, e, toPlainDateSlots(t))),
    withPlainTime: (e, t) => dr(pn(createTimeZoneOps, e, optionalToPlainTimeFields(t))),
    add: (e, t, n) => dr(hn(er, createTimeZoneOps, 0, e, toDurationSlots(t), n)),
    subtract: (e, t, n) => dr(hn(er, createTimeZoneOps, 1, e, toDurationSlots(t), n)),
    until: (e, t, n) => ar(Vt(Dn(tr, createTimeZoneOps, 0, e, toZonedDateTimeSlots(t), n))),
    since: (e, t, n) => ar(Vt(Dn(tr, createTimeZoneOps, 1, e, toZonedDateTimeSlots(t), n))),
    round: (e, t) => dr(Pn(createTimeZoneOps, e, t)),
    startOfDay: e => dr(Cn(createTimeZoneOps, e)),
    equals: (e, t) => gn(e, toZonedDateTimeSlots(t)),
    toInstant: e => Co(Zn(e)),
    toPlainDateTime: e => No(ht(createTimeZoneOffsetOps, e)),
    toPlainDate: e => Yo(Bt(createTimeZoneOffsetOps, e)),
    toPlainTime: e => vo(Re(createTimeZoneOffsetOps, e)),
    toPlainYearMonth(e) {
      return jo(bn(Ho, e, this));
    },
    toPlainMonthDay(e) {
      return To(Fn(Qo, e, this));
    },
    toLocaleString(e, t) {
      let n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      const [o, r] = Wn(t, n, e);
      return o.format(r);
    },
    toString: (e, t) => In(createTimeZoneOffsetOps, e, t),
    toJSON: e => In(createTimeZoneOffsetOps, e),
    valueOf: neverValueOf
  }, {
    from: (e, t) => dr(toZonedDateTimeSlots(e, t)),
    compare: (e, t) => yn(toZonedDateTimeSlots(e), toZonedDateTimeSlots(t))
  }),
  fr = /*@__PURE__*/Object.defineProperties({}, {
    ...h("Temporal.Now"),
    ...p({
      timeZoneId: () => Nn(),
      instant: () => Co(_(Bn())),
      zonedDateTime: function (e) {
        let t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Nn();
        return dr(Yn(Bn(), refineTimeZoneSlot(t), refineCalendarSlot(e)));
      },
      zonedDateTimeISO: function () {
        let e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Nn();
        return dr(Yn(Bn(), refineTimeZoneSlot(e), X));
      },
      plainDateTime: function (e) {
        let t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Nn();
        return No(ee(An(createTimeZoneOffsetOps(refineTimeZoneSlot(t))), refineCalendarSlot(e)));
      },
      plainDateTimeISO: function () {
        let e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Nn();
        return No(ee(An(createTimeZoneOffsetOps(refineTimeZoneSlot(e))), X));
      },
      plainDate: function (e) {
        let t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Nn();
        return Yo(v(An(createTimeZoneOffsetOps(refineTimeZoneSlot(t))), refineCalendarSlot(e)));
      },
      plainDateISO: function () {
        let e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Nn();
        return Yo(v(An(createTimeZoneOffsetOps(refineTimeZoneSlot(e))), X));
      },
      plainTimeISO: function () {
        let e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Nn();
        return vo(Ge(An(createTimeZoneOffsetOps(refineTimeZoneSlot(e)))));
      }
    })
  }),
  mr = /*@__PURE__*/Object.defineProperties({}, {
    ...h("Temporal"),
    ...p({
      PlainYearMonth: wo,
      PlainMonthDay: Oo,
      PlainDate: Bo,
      PlainTime: Io,
      PlainDateTime: yo,
      ZonedDateTime: ur,
      Instant: Po,
      Calendar: lr,
      TimeZone: Zo,
      Duration: rr,
      Now: fr
    })
  }),
  Sr = /*@__PURE__*/createDateTimeFormatClass(),
  Or = /*@__PURE__*/new WeakMap();
  /*@__PURE__*/Object.defineProperties(Object.create(Intl), p({
    DateTimeFormat: Sr
  }));

/**
 * java.lang.Math.toRadians
 * @private
 * @param degrees
 */
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}
/**
 * java.lang.Math.toDegrees
 * @private
 * @param radians
 */
function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}
/**
 * A class that contains location information such as latitude and longitude required for astronomical calculations. The
 * elevation field may not be used by some calculation engines and would be ignored if set.
 *
 * @author &copy; Eliyahu Hershfeld 2004 - 2016
 * @version 1.1
 */
class GeoLocation {
  /**
   * GeoLocation constructor with parameters for all required fields.
   *
   * @param {string} name
   *            The location name for display use such as &quot;Lakewood, NJ&quot;
   * @param {number} latitude
   *            the latitude in a double format such as 40.095965 for Lakewood, NJ.
   *            <b>Note: </b> For latitudes south of the equator, a negative value should be used.
   * @param {number} longitude
   *            double the longitude in a double format such as -74.222130 for Lakewood, NJ.
   *            <b>Note: </b> For longitudes west of the <a href="http://en.wikipedia.org/wiki/Prime_Meridian">Prime
   *            Meridian </a> (Greenwich), a negative value should be used.
   * @param {number} elevation
   *            the elevation above sea level in Meters. Elevation is not used in most algorithms used for calculating
   *            sunrise and set.
   * @param {string} timeZoneId
   *            the <code>TimeZone</code> for the location.
   */
  constructor(name, latitude, longitude, elevation, timeZoneId) {
    /**
     * @private
     */
    this.locationName = null;
    this.setLocationName(name);
    this.setLatitude(latitude);
    this.setLongitude(longitude);
    this.setElevation(elevation);
    this.setTimeZone(timeZoneId);
  }
  /**
   * Method to get the elevation in Meters.
   *
   * @return {number} Returns the elevation in Meters.
   */
  getElevation() {
    return this.elevation;
  }
  /**
   * Method to set the elevation in Meters <b>above </b> sea level.
   *
   * @param {number} elevation
   *            The elevation to set in Meters. An Error will be thrown if the value is a negative.
   */
  setElevation(elevation) {
    if (typeof elevation !== 'number') throw new TypeError('Invalid elevation');
    if (elevation < 0) {
      throw new RangeError(`elevation ${elevation} must be zero or positive`);
    }
    this.elevation = elevation;
  }
  setLatitude(latitude) {
    if (typeof latitude !== 'number') throw new TypeError('Invalid latitude');
    if (latitude < -90 || latitude > 90) {
      throw new RangeError(`Latitude ${latitude} out of range [-90,90]`);
    }
    this.latitude = latitude;
  }
  /**
   * @return {number} Returns the latitude.
   */
  getLatitude() {
    return this.latitude;
  }
  setLongitude(longitude) {
    if (typeof longitude !== 'number') throw new TypeError('Invalid longitude');
    if (longitude < -180 || longitude > 180) {
      throw new RangeError(`Longitude ${longitude} out of range [-180,180]`);
    }
    this.longitude = longitude;
  }
  /**
   * @return {number} Returns the longitude.
   */
  getLongitude() {
    return this.longitude;
  }
  /**
   * @return {string|null} Returns the location name.
   */
  getLocationName() {
    return this.locationName;
  }
  /**
   * @param {string|null} name
   *            The setter method for the display name.
   */
  setLocationName(name) {
    this.locationName = name;
  }
  /**
   * @return {string} Returns the timeZone.
   */
  getTimeZone() {
    return this.timeZoneId;
  }
  /**
   * Method to set the TimeZone.
   * @param {string} timeZoneId
   *            The timeZone to set.
   */
  setTimeZone(timeZoneId) {
    this.timeZoneId = timeZoneId;
  }
}
/**
 * The commonly used average solar refraction. Calendrical Calculations lists a more accurate global average of
 * 34.478885263888294
 * @private
 */
const refraction = 34 / 60;
// private double refraction = 34.478885263888294 / 60d;
/**
 * The commonly used average solar radius in minutes of a degree.
 * @private
 */
const solarRadius = 16 / 60;
/**
 * The commonly used average earth radius in KM. At this time, this only affects elevation adjustment and not the
 * sunrise and sunset calculations. The value currently defaults to 6356.9 KM.
 * @private
 */
const earthRadius = 6356.9; // in KM
/**
 * Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
 * href="http://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
 * href="http://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>'s <a href =
 * "http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA's <a
 * href="http://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
 * href="http://www.willbell.com/math/mc1.htm">Astronomical Algorithms</a> by <a
 * href="http://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
 * to account for elevation. The algorithm can be found in the <a
 * href="http://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.
 *
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 */
class NOAACalculator {
  /**
   * A constructor that takes in <a href="http://en.wikipedia.org/wiki/Geolocation">geolocation</a> information as a
   * parameter.
   *
   * @param {GeoLocation} geoLocation
   *            The location information used for calculating astronomical sun times.
   * @param {Temporal.PlainDate} date
   */
  constructor(geoLocation, date) {
    this.date = date;
    this.geoLocation = geoLocation;
  }
  /**
   * The getSunrise method Returns a `Date` representing the
   * {@link getElevationAdjustment elevation adjusted} sunrise time. The zenith used
   * for the calculation uses {@link GEOMETRIC_ZENITH geometric zenith} of 90&deg; plus
   * {@link getElevationAdjustment}. This is adjusted
   * to add approximately 50/60 of a degree to account for 34 archminutes of refraction
   * and 16 archminutes for the sun's radius for a total of {@link adjustZenith 90.83333&deg;}.
   *
   * @return {Temporal.ZonedDateTime | null} the `Date` representing the exact sunrise time. If the calculation can't be computed such as
   *         in the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
   *         does not set, a null will be returned. See detailed explanation on top of the page.
   * @see adjustZenith
   * @see getSeaLevelSunrise()
   * @see getUTCSunrise
   */
  getSunrise() {
    const sunrise = this.getUTCSunrise0(NOAACalculator.GEOMETRIC_ZENITH);
    if (isNaN(sunrise)) return null;
    return this.getDateFromTime(sunrise, true);
  }
  /**
   * A method that returns the sunrise without {@link getElevationAdjustment elevation
   * adjustment}. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
   * something that is not affected by elevation. This method returns sunrise calculated at sea level. This forms the
   * base for dawn calculations that are calculated as a dip below the horizon before sunrise.
   *
   * @return {Temporal.ZonedDateTime | null} the `Date` representing the exact sea-level sunrise time. If the calculation can't be computed
   *         such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
   *         where it does not set, a null will be returned. See detailed explanation on top of the page.
   * @see getSunrise
   * @see getUTCSeaLevelSunrise
   * @see getSeaLevelSunset()
   */
  getSeaLevelSunrise() {
    const sunrise = this.getUTCSeaLevelSunrise(NOAACalculator.GEOMETRIC_ZENITH);
    if (isNaN(sunrise)) return null;
    return this.getDateFromTime(sunrise, true);
  }
  /**
   * A method that returns the beginning of civil twilight (dawn) using a zenith of {@link CIVIL_ZENITH 96&deg;}.
   *
   * @return {Temporal.ZonedDateTime | null} The `Date` of the beginning of civil twilight using a zenith of 96&deg;. If the calculation
   *         can't be computed, null will be returned. See detailed explanation on top of the page.
   * @see CIVIL_ZENITH
   */
  getBeginCivilTwilight() {
    return this.getSunriseOffsetByDegrees(NOAACalculator.CIVIL_ZENITH);
  }
  /**
   * A method that returns the beginning of nautical twilight using a zenith of {@link NAUTICAL_ZENITH 102&deg;}.
   *
   * @return {Temporal.ZonedDateTime | null} The `Date` of the beginning of nautical twilight using a zenith of 102&deg;. If the
   *         calculation can't be computed null will be returned. See detailed explanation on top of the page.
   * @see NAUTICAL_ZENITH
   */
  getBeginNauticalTwilight() {
    return this.getSunriseOffsetByDegrees(NOAACalculator.NAUTICAL_ZENITH);
  }
  /**
   * A method that returns the beginning of astronomical twilight using a zenith of {@link ASTRONOMICAL_ZENITH
   * 108&deg;}.
   *
   * @return {Temporal.ZonedDateTime | null} The `Date` of the beginning of astronomical twilight using a zenith of 108&deg;. If the
   *         calculation can't be computed, null will be returned. See detailed explanation on top of the page.
   * @see ASTRONOMICAL_ZENITH
   */
  getBeginAstronomicalTwilight() {
    return this.getSunriseOffsetByDegrees(NOAACalculator.ASTRONOMICAL_ZENITH);
  }
  /**
   * The getSunset method Returns a `Date` representing the
   * {@link getElevationAdjustment elevation adjusted} sunset time. The zenith used for
   * the calculation uses {@link GEOMETRIC_ZENITH geometric zenith} of 90&deg; plus
   * {@link getElevationAdjustment}. This is adjusted
   * to add approximately 50/60 of a degree to account for 34 archminutes of refraction
   * and 16 archminutes for the sun's radius for a total of {@link adjustZenith 90.83333&deg;}.
   * Note:
   * In certain cases the calculates sunset will occur before sunrise. This will typically happen when a timezone
   * other than the local timezone is used (calculating Los Angeles sunset using a GMT timezone for example). In this
   * case the sunset date will be incremented to the following date.
   *
   * @return {Temporal.ZonedDateTime | null} The `Date` representing the exact sunset time. If the calculation can't be computed such as in
   *         the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
   *         does not set, a null will be returned. See detailed explanation on top of the page.
   * @see adjustZenith
   * @see getSeaLevelSunset()
   * @see getUTCSunset
   */
  getSunset() {
    const sunset = this.getUTCSunset0(NOAACalculator.GEOMETRIC_ZENITH);
    if (isNaN(sunset)) return null;
    return this.getDateFromTime(sunset, false);
  }
  /**
   * A method that returns the sunset without {@link getElevationAdjustment elevation
   * adjustment}. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
   * something that is not affected by elevation. This method returns sunset calculated at sea level. This forms the
   * base for dusk calculations that are calculated as a dip below the horizon after sunset.
   *
   * @return {Temporal.ZonedDateTime | null} The `Date` representing the exact sea-level sunset time. If the calculation can't be computed
   *         such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
   *         where it does not set, a null will be returned. See detailed explanation on top of the page.
   * @see getSunset
   * @see getUTCSeaLevelSunset
   */
  getSeaLevelSunset() {
    const sunset = this.getUTCSeaLevelSunset(NOAACalculator.GEOMETRIC_ZENITH);
    if (isNaN(sunset)) return null;
    return this.getDateFromTime(sunset, false);
  }
  /**
   * A method that returns the end of civil twilight using a zenith of {@link CIVIL_ZENITH 96&deg;}.
   *
   * @return {Temporal.ZonedDateTime | null} The `Date` of the end of civil twilight using a zenith of {@link CIVIL_ZENITH 96&deg;}. If
   *         the calculation can't be computed, null will be returned. See detailed explanation on top of the page.
   * @see CIVIL_ZENITH
   */
  getEndCivilTwilight() {
    return this.getSunsetOffsetByDegrees(NOAACalculator.CIVIL_ZENITH);
  }
  /**
   * A method that returns the end of nautical twilight using a zenith of {@link NAUTICAL_ZENITH 102&deg;}.
   *
   * @return {Temporal.ZonedDateTime | null} The `Date` of the end of nautical twilight using a zenith of {@link NAUTICAL_ZENITH 102&deg;}
   *         . If the calculation can't be computed, null will be returned. See detailed explanation on top of the
   *         page.
   * @see NAUTICAL_ZENITH
   */
  getEndNauticalTwilight() {
    return this.getSunsetOffsetByDegrees(NOAACalculator.NAUTICAL_ZENITH);
  }
  /**
   * A method that returns the end of astronomical twilight using a zenith of {@link ASTRONOMICAL_ZENITH 108&deg;}.
   *
   * @return {Temporal.ZonedDateTime | null} The `Date` of the end of astronomical twilight using a zenith of {@link ASTRONOMICAL_ZENITH
   *         108&deg;}. If the calculation can't be computed, null will be returned. See detailed explanation on top
   *         of the page.
   * @see ASTRONOMICAL_ZENITH
   */
  getEndAstronomicalTwilight() {
    return this.getSunsetOffsetByDegrees(NOAACalculator.ASTRONOMICAL_ZENITH);
  }
  /**
   * A utility method that returns a date offset by the offset time passed in. Please note that the level of light
   * during twilight is not affected by elevation, so if this is being used to calculate an offset before sunrise or
   * after sunset with the intent of getting a rough "level of light" calculation, the sunrise or sunset time passed
   * to this method should be sea level sunrise and sunset.
   *
   * @param {Temporal.ZonedDateTime | null} time
   *            the start time
   * @param {number} offset
   *            the offset in milliseconds to add to the time.
   * @return {Temporal.ZonedDateTime | null} the `Date` with the offset in milliseconds added to it
   */
  static getTimeOffset(time, offset) {
    if (time === null || isNaN(offset)) {
      return null;
    }
    return time.add({
      milliseconds: offset
    });
  }
  /**
   * A utility method that returns the time of an offset by degrees below or above the horizon of
   * {@link getSunrise() sunrise}. Note that the degree offset is from the vertical, so for a calculation of 14&deg;
   * before sunrise, an offset of 14 + {@link GEOMETRIC_ZENITH} = 104 would have to be passed as a parameter.
   *
   * @param {number} offsetZenith
   *            the degrees before {@link getSunrise} to use in the calculation. For time after sunrise use
   *            negative numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg;
   *            before sunrise, an offset of 14 + {@link GEOMETRIC_ZENITH} = 104 would have to be passed as a
   *            parameter.
   * @return {Temporal.ZonedDateTime | null} The `Date` of the offset after (or before) {@link getSunrise}. If the calculation
   *         can't be computed such as in the Arctic Circle where there is at least one day a year where the sun does
   *         not rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
   *         page.
   */
  getSunriseOffsetByDegrees(offsetZenith) {
    const dawn = this.getUTCSunrise0(offsetZenith);
    if (isNaN(dawn)) return null;
    return this.getDateFromTime(dawn, true);
  }
  /**
   * A utility method that returns the time of an offset by degrees below or above the horizon of {@link getSunset()
   * sunset}. Note that the degree offset is from the vertical, so for a calculation of 14&deg; after sunset, an
   * offset of 14 + {@link GEOMETRIC_ZENITH} = 104 would have to be passed as a parameter.
   *
   * @param {number} offsetZenith
   *            the degrees after {@link getSunset} to use in the calculation. For time before sunset use negative
   *            numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg; after
   *            sunset, an offset of 14 + {@link GEOMETRIC_ZENITH} = 104 would have to be passed as a parameter.
   * @return {Temporal.ZonedDateTime | null} The `Date`of the offset after (or before) {@link getSunset}. If the calculation can't
   *         be computed such as in the Arctic Circle where there is at least one day a year where the sun does not
   *         rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
   *         page.
   */
  getSunsetOffsetByDegrees(offsetZenith) {
    const sunset = this.getUTCSunset0(offsetZenith);
    if (isNaN(sunset)) return null;
    return this.getDateFromTime(sunset, false);
  }
  /**
   * A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
   * daylight savings time.
   *
   * @param {number} zenith
   *            the degrees below the horizon. For time after sunrise use negative numbers.
   * @return {number} The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, `NaN` will be returned. See detailed explanation on top of the page.
   */
  getUTCSunrise0(zenith) {
    return this.getUTCSunrise(this.getAdjustedDate(), this.geoLocation, zenith, true);
  }
  /**
   * A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
   * daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible
   * light, something that is not affected by elevation. This method returns UTC sunrise calculated at sea level. This
   * forms the base for dawn calculations that are calculated as a dip below the horizon before sunrise.
   *
   * @param {number} zenith
   *            the degrees below the horizon. For time after sunrise use negative numbers.
   * @return {number} The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, `NaN` will be returned. See detailed explanation on top of the page.
   * @see getUTCSunrise
   * @see getUTCSeaLevelSunset
   */
  getUTCSeaLevelSunrise(zenith) {
    return this.getUTCSunrise(this.getAdjustedDate(), this.geoLocation, zenith, false);
  }
  /**
   * A method that returns the sunset in UTC time without correction for time zone offset from GMT and without using
   * daylight savings time.
   *
   * @param {number} zenith
   *            the degrees below the horizon. For time after sunset use negative numbers.
   * @return {number} The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, `NaN` will be returned. See detailed explanation on top of the page.
   * @see getUTCSeaLevelSunset
   */
  getUTCSunset0(zenith) {
    return this.getUTCSunset(this.getAdjustedDate(), this.geoLocation, zenith, true);
  }
  /**
   * A method that returns the sunset in UTC time without correction for elevation, time zone offset from GMT and
   * without using daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the
   * amount of visible light, something that is not affected by elevation. This method returns UTC sunset calculated
   * at sea level. This forms the base for dusk calculations that are calculated as a dip below the horizon after
   * sunset.
   *
   * @param {number} zenith
   *            the degrees below the horizon. For time before sunset use negative numbers.
   * @return {number} The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, `NaN` will be returned. See detailed explanation on top of the page.
   * @see getUTCSunset
   * @see getUTCSeaLevelSunrise
   */
  getUTCSeaLevelSunset(zenith) {
    return this.getUTCSunset(this.getAdjustedDate(), this.geoLocation, zenith, false);
  }
  /**
   * Adjusts the <code>Calendar</code> to deal with edge cases where the location crosses the antimeridian.
   * @private
   * @see GeoLocation#getAntimeridianAdjustment()
   * @return the adjusted Calendar
   */
  getAdjustedDate() {
    return this.date;
  }
  /**
   * Method to return the adjustment to the zenith required to account for the elevation. Since a person at a higher
   * elevation can see farther below the horizon, the calculation for sunrise / sunset is calculated below the horizon
   * used at sea level. This is only used for sunrise and sunset and not times before or after it such as
   * {@link getBeginNauticalTwilight() nautical twilight} since those
   * calculations are based on the level of available light at the given dip below the horizon, something that is not
   * affected by elevation, the adjustment should only made if the zenith == 90&deg; {@link adjustZenith adjusted}
   * for refraction and solar radius. The algorithm used is
   *
   * <pre>
   * elevationAdjustment = Math.toDegrees(Math.acos(earthRadiusInMeters / (earthRadiusInMeters + elevationMeters)));
   * </pre>
   *
   * The source of this algorithm is <a href="http://www.calendarists.com">Calendrical Calculations</a> by Edward M.
   * Reingold and Nachum Dershowitz. An alternate algorithm that produces an almost identical (but not accurate)
   * result found in Ma'aglay Tzedek by Moishe Kosower and other sources is:
   *
   * <pre>
   * elevationAdjustment = 0.0347 * Math.sqrt(elevationMeters);
   * </pre>
   *
   * @param {number} elevation
   *            elevation in Meters.
   * @return {number} the adjusted zenith
   */
  getElevationAdjustment(elevation) {
    // double elevationAdjustment = 0.0347 * Math.sqrt(elevation);
    const elevationAdjustment = radiansToDegrees(Math.acos(earthRadius / (earthRadius + elevation / 1000)));
    return elevationAdjustment;
  }
  /**
   * Adjusts the zenith of astronomical sunrise and sunset to account for solar refraction, solar radius and
   * elevation. The value for Sun's zenith and true rise/set Zenith (used in this class and subclasses) is the angle
   * that the center of the Sun makes to a line perpendicular to the Earth's surface. If the Sun were a point and the
   * Earth were without an atmosphere, true sunset and sunrise would correspond to a 90&deg; zenith. Because the Sun
   * is not a point, and because the atmosphere refracts light, this 90&deg; zenith does not, in fact, correspond to
   * true sunset or sunrise, instead the centre of the Sun's disk must lie just below the horizon for the upper edge
   * to be obscured. This means that a zenith of just above 90&deg; must be used. The Sun subtends an angle of 16
   * minutes of arc, and atmospheric refraction
   * accounts for 34 minutes or so, giving a total
   * of 50 arcminutes. The total value for ZENITH is 90+(5/6) or 90.8333333&deg; for true sunrise/sunset. Since a
   * person at an elevation can see blow the horizon of a person at sea level, this will also adjust the zenith to
   * account for elevation if available. Note that this will only adjust the value if the zenith is exactly 90 degrees.
   * For values below and above this no correction is done. As an example, astronomical twilight is when the sun is
   * 18&deg; below the horizon or {@link ASTRONOMICAL_ZENITH 108&deg;
   * below the zenith}. This is traditionally calculated with none of the above mentioned adjustments. The same goes
   * for various <em>tzais</em> and <em>alos</em> times such as the
   * {@link ZmanimCalendar#ZENITH_16_POINT_1 16.1&deg;} dip used in
   * {@link ComplexZmanimCalendar#getAlos16Point1Degrees}.
   *
   * @param {number} zenith
   *            the azimuth below the vertical zenith of 90&deg;. For sunset typically the {@link adjustZenith
   *            zenith} used for the calculation uses geometric zenith of 90&deg; and {@link adjustZenith adjusts}
   *            this slightly to account for solar refraction and the sun's radius. Another example would be
   *            {@link getEndNauticalTwilight} that passes
   *            {@link NAUTICAL_ZENITH} to this method.
   * @param {number} elevation
   *            elevation in Meters.
   * @return {number} The zenith adjusted to include the sun's radius, refracton
   *         and {@link getElevationAdjustment elevation} adjustment. This will only be adjusted for
   *         sunrise and sunset (if the zenith == 90&deg;)
   * @see getElevationAdjustment
   */
  adjustZenith(zenith, elevation) {
    let adjustedZenith = zenith;
    if (zenith === NOAACalculator.GEOMETRIC_ZENITH) {
      // only adjust if it is exactly sunrise or sunset
      adjustedZenith = zenith + (solarRadius + refraction + this.getElevationAdjustment(elevation));
    }
    return adjustedZenith;
  }
  /**
   * A method that calculates UTC sunrise as well as any time based on an angle above or below sunrise.
   * @param date
   *            Used to calculate day of year.
   * @param geoLocation
   *            The location information used for astronomical calculating sun times.
   * @param zenith
   *            the azimuth below the vertical zenith of 90 degrees. for sunrise typically the {@link adjustZenith
   *            zenith} used for the calculation uses geometric zenith of 90&deg; and {@link adjustZenith adjusts}
   *            this slightly to account for solar refraction and the sun's radius. Another example would be
   *            {@link getBeginNauticalTwilight} that passes
   *            {@link NAUTICAL_ZENITH} to this method.
   * @param adjustForElevation
   *            Should the time be adjusted for elevation
   * @return The UTC time of sunrise in 24 hour format. 5:45:00 AM will return 5.75.0. If an error was encountered in
   *         the calculation (expected behavior for some locations such as near the poles,
   *         `NaN` will be returned.
   */
  getUTCSunrise(date, geoLocation, zenith, adjustForElevation) {
    const elevation = adjustForElevation ? geoLocation.getElevation() : 0;
    const adjustedZenith = this.adjustZenith(zenith, elevation);
    let sunrise = NOAACalculator.getSunriseUTC(NOAACalculator.getJulianDay(date), geoLocation.getLatitude(), -geoLocation.getLongitude(), adjustedZenith);
    sunrise = sunrise / 60;
    // ensure that the time is >= 0 and < 24
    while (sunrise < 0) {
      sunrise += 24;
    }
    while (sunrise >= 24) {
      sunrise -= 24;
    }
    return sunrise;
  }
  /**
   * A method that calculates UTC sunset as well as any time based on an angle above or below sunset.
   * @param date
   *            Used to calculate day of year.
   * @param geoLocation
   *            The location information used for astronomical calculating sun times.
   * @param zenith
   *            the azimuth below the vertical zenith of 90&deg;. For sunset typically the {@link adjustZenith
   *            zenith} used for the calculation uses geometric zenith of 90&deg; and {@link adjustZenith adjusts}
   *            this slightly to account for solar refraction and the sun's radius. Another example would be
   *            {@link getEndNauticalTwilight} that passes
   *            {@link NAUTICAL_ZENITH} to this method.
   * @param adjustForElevation
   *            Should the time be adjusted for elevation
   * @return The UTC time of sunset in 24 hour format. 5:45:00 AM will return 5.75.0. If an error was encountered in
   *         the calculation (expected behavior for some locations such as near the poles,
   *         `NaN` will be returned.
   */
  getUTCSunset(date, geoLocation, zenith, adjustForElevation) {
    const elevation = adjustForElevation ? geoLocation.getElevation() : 0;
    const adjustedZenith = this.adjustZenith(zenith, elevation);
    let sunset = NOAACalculator.getSunsetUTC(NOAACalculator.getJulianDay(date), geoLocation.getLatitude(), -geoLocation.getLongitude(), adjustedZenith);
    sunset = sunset / 60;
    // ensure that the time is >= 0 and < 24
    while (sunset < 0) {
      sunset += 24;
    }
    while (sunset >= 24) {
      sunset -= 24;
    }
    return sunset;
  }
  /**
   * A utility method that will allow the calculation of a temporal (solar) hour based on the sunrise and sunset
   * passed as parameters to this method. An example of the use of this method would be the calculation of a
   * non-elevation adjusted temporal hour by passing in {@link getSeaLevelSunrise() sea level sunrise} and
   * {@link getSeaLevelSunset() sea level sunset} as parameters.
   *
   * @param {Temporal.ZonedDateTime | null} startOfDay
   *            The start of the day.
   * @param {Temporal.ZonedDateTime | null} endOfDay
   *            The end of the day.
   *
   * @return {number} the <code>long</code> millisecond length of the temporal hour. If the calculation can't be computed a
   *         `NaN` will be returned. See detailed explanation on top of the page.
   *
   * @see getTemporalHour()
   */
  getTemporalHour() {
    let startOfDay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getSeaLevelSunrise();
    let endOfDay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getSeaLevelSunset();
    if (startOfDay === null || endOfDay === null) {
      return NaN;
    }
    const delta = endOfDay.epochMilliseconds - startOfDay.epochMilliseconds;
    return Math.floor(delta / 12);
  }
  /**
   * A method that returns sundial or solar noon. It occurs when the Sun is <a href
   * ="http://en.wikipedia.org/wiki/Transit_%28astronomy%29">transiting</a> the <a
   * href="http://en.wikipedia.org/wiki/Meridian_%28astronomy%29">celestial meridian</a>. In this class it is
   * calculated as halfway between the sunrise and sunset passed to this method. This time can be slightly off the
   * real transit time due to changes in declination (the lengthening or shortening day).
   *
   * @param {Temporal.ZonedDateTime | null} startOfDay
   *            the start of day for calculating the sun's transit. This can be sea level sunrise, visual sunrise (or
   *            any arbitrary start of day) passed to this method.
   * @param {Temporal.ZonedDateTime | null} endOfDay
   *            the end of day for calculating the sun's transit. This can be sea level sunset, visual sunset (or any
   *            arbitrary end of day) passed to this method.
   *
   * @return {Temporal.ZonedDateTime | null} The `Date` representing Sun's transit. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, null will be returned. See detailed explanation on top of the page.
   */
  getSunTransit() {
    let startOfDay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getSeaLevelSunrise();
    let endOfDay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getSeaLevelSunset();
    const temporalHour = this.getTemporalHour(startOfDay, endOfDay);
    return NOAACalculator.getTimeOffset(startOfDay, temporalHour * 6);
  }
  /**
   * A method that returns a `Date` from the time passed in as a parameter.
   * @protected
   * @param {number} time
   *            The time to be set as the time for the `Date`. The time expected is in the format: 18.75
   *            for 6:45:00 PM.
   * @param {boolean} isSunrise true if the time is sunrise, and false if it is sunset
   * @return {Temporal.ZonedDateTime | null} The Date.
   */
  getDateFromTime(time, isSunrise) {
    if (isNaN(time)) {
      return null;
    }
    let calculatedTime = time;
    let cal = this.getAdjustedDate();
    //    let cal = new Temporal.PlainDate(adj.year, adj.month, adj.day);
    const hours = Math.trunc(calculatedTime); // retain only the hours
    calculatedTime -= hours;
    const minutes = Math.trunc(calculatedTime *= 60); // retain only the minutes
    calculatedTime -= minutes;
    const seconds = Math.trunc(calculatedTime *= 60); // retain only the seconds
    calculatedTime -= seconds; // remaining milliseconds
    // Check if a date transition has occurred, or is about to occur - this indicates the date of the event is
    // actually not the target date, but the day prior or after
    const localTimeHours = Math.trunc(this.geoLocation.getLongitude() / 15);
    if (isSunrise && localTimeHours + hours > 18) {
      cal = cal.add({
        days: -1
      });
      //      cal = cal.minus({days: 1});
    } else if (!isSunrise && localTimeHours + hours < 6) {
      cal = cal.add({
        days: 1
      });
    }
    return cal.toZonedDateTime({
      timeZone: 'UTC',
      plainTime: new mr.PlainTime(hours, minutes, seconds, Math.trunc(calculatedTime * 1000))
    }).withTimeZone(this.geoLocation.getTimeZone());
  }
  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a> from a Java Calendar
   * @private
   * @param {Temporal.ZonedDateTime} date
   *            The Java Calendar
   * @return the Julian day corresponding to the date Note: Number is returned for start of day. Fractional days
   *         should be added later.
   */
  static getJulianDay(date) {
    let {
      year,
      month
    } = date;
    const {
      day
    } = date;
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const a = Math.trunc(year / 100);
    const b = Math.trunc(2 - a + a / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  }
  /**
   * Convert <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a> to centuries since J2000.0.
   * @private
   * @param julianDay
   *            the Julian Day to convert
   * @return the centuries since 2000 Julian corresponding to the Julian Day
   */
  static getJulianCenturiesFromJulianDay(julianDay) {
    return (julianDay - NOAACalculator.JULIAN_DAY_JAN_1_2000) / NOAACalculator.JULIAN_DAYS_PER_CENTURY;
  }
  /**
   * Convert centuries since J2000.0 to <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a>.
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the Julian Day corresponding to the Julian centuries passed in
   */
  static getJulianDayFromJulianCenturies(julianCenturies) {
    return julianCenturies * NOAACalculator.JULIAN_DAYS_PER_CENTURY + NOAACalculator.JULIAN_DAY_JAN_1_2000;
  }
  /**
   * Returns the Geometric <a href="http://en.wikipedia.org/wiki/Mean_longitude">Mean Longitude</a> of the Sun.
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the Geometric Mean Longitude of the Sun in degrees
   */
  static getSunGeometricMeanLongitude(julianCenturies) {
    let longitude = 280.46646 + julianCenturies * (36000.76983 + 0.0003032 * julianCenturies);
    while (longitude > 360) {
      longitude -= 360;
    }
    while (longitude < 0) {
      longitude += 360;
    }
    return longitude; // in degrees
  }
  /**
   * Returns the Geometric <a href="http://en.wikipedia.org/wiki/Mean_anomaly">Mean Anomaly</a> of the Sun.
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the Geometric Mean Anomaly of the Sun in degrees
   */
  static getSunGeometricMeanAnomaly(julianCenturies) {
    return 357.52911 + julianCenturies * (35999.05029 - 0.0001537 * julianCenturies); // in degrees
  }
  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Eccentricity_%28orbit%29">eccentricity of earth's orbit</a>.
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the unitless eccentricity
   */
  static getEarthOrbitEccentricity(julianCenturies) {
    return 0.016708634 - julianCenturies * (0.000042037 + 0.0000001267 * julianCenturies); // unitless
  }
  /**
   * Returns the <a href="http://en.wikipedia.org/wiki/Equation_of_the_center">equation of center</a> for the sun.
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the equation of center for the sun in degrees
   */
  static getSunEquationOfCenter(julianCenturies) {
    const m = NOAACalculator.getSunGeometricMeanAnomaly(julianCenturies);
    const mrad = degreesToRadians(m);
    const sinm = Math.sin(mrad);
    const sin2m = Math.sin(mrad + mrad);
    const sin3m = Math.sin(mrad + mrad + mrad);
    return sinm * (1.914602 - julianCenturies * (0.004817 + 0.000014 * julianCenturies)) + sin2m * (0.019993 - 0.000101 * julianCenturies) + sin3m * 0.000289; // in degrees
  }
  /**
   * Return the true longitude of the sun
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the sun's true longitude in degrees
   */
  static getSunTrueLongitude(julianCenturies) {
    const sunLongitude = NOAACalculator.getSunGeometricMeanLongitude(julianCenturies);
    const center = NOAACalculator.getSunEquationOfCenter(julianCenturies);
    return sunLongitude + center; // in degrees
  }
  /**
   * Return the apparent longitude of the sun
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return sun's apparent longitude in degrees
   */
  static getSunApparentLongitude(julianCenturies) {
    const sunTrueLongitude = NOAACalculator.getSunTrueLongitude(julianCenturies);
    const omega = 125.04 - 1934.136 * julianCenturies;
    const lambda = sunTrueLongitude - 0.00569 - 0.00478 * Math.sin(degreesToRadians(omega));
    return lambda; // in degrees
  }
  /**
   * Returns the mean <a href="http://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial tilt).
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the mean obliquity in degrees
   */
  static getMeanObliquityOfEcliptic(julianCenturies) {
    const seconds = 21.448 - julianCenturies * (46.815 + julianCenturies * (0.00059 - julianCenturies * 0.001813));
    return 23 + (26 + seconds / 60) / 60; // in degrees
  }
  /**
   * Returns the corrected <a href="http://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial
   * tilt).
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the corrected obliquity in degrees
   */
  static getObliquityCorrection(julianCenturies) {
    const obliquityOfEcliptic = NOAACalculator.getMeanObliquityOfEcliptic(julianCenturies);
    const omega = 125.04 - 1934.136 * julianCenturies;
    return obliquityOfEcliptic + 0.00256 * Math.cos(degreesToRadians(omega)); // in degrees
  }
  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Declination">declination</a> of the sun.
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return
   *            the sun's declination in degrees
   */
  static getSunDeclination(julianCenturies) {
    const obliquityCorrection = NOAACalculator.getObliquityCorrection(julianCenturies);
    const lambda = NOAACalculator.getSunApparentLongitude(julianCenturies);
    const sint = Math.sin(degreesToRadians(obliquityCorrection)) * Math.sin(degreesToRadians(lambda));
    const theta = radiansToDegrees(Math.asin(sint));
    return theta; // in degrees
  }
  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Equation_of_time">Equation of Time</a> - the difference between
   * true solar time and mean solar time
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return equation of time in minutes of time
   */
  static getEquationOfTime(julianCenturies) {
    const epsilon = NOAACalculator.getObliquityCorrection(julianCenturies);
    const geomMeanLongSun = NOAACalculator.getSunGeometricMeanLongitude(julianCenturies);
    const eccentricityEarthOrbit = NOAACalculator.getEarthOrbitEccentricity(julianCenturies);
    const geomMeanAnomalySun = NOAACalculator.getSunGeometricMeanAnomaly(julianCenturies);
    let y = Math.tan(degreesToRadians(epsilon) / 2);
    y *= y;
    const sin2l0 = Math.sin(2 * degreesToRadians(geomMeanLongSun));
    const sinm = Math.sin(degreesToRadians(geomMeanAnomalySun));
    const cos2l0 = Math.cos(2 * degreesToRadians(geomMeanLongSun));
    const sin4l0 = Math.sin(4 * degreesToRadians(geomMeanLongSun));
    const sin2m = Math.sin(2 * degreesToRadians(geomMeanAnomalySun));
    const equationOfTime = y * sin2l0 - 2 * eccentricityEarthOrbit * sinm + 4 * eccentricityEarthOrbit * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * eccentricityEarthOrbit * eccentricityEarthOrbit * sin2m;
    return radiansToDegrees(equationOfTime) * 4; // in minutes of time
  }
  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Hour_angle">hour angle</a> of the sun at sunrise for the
   * latitude.
   * @private
   * @param {number} lat
   *            , the latitude of observer in degrees
   * @param solarDec
   *            the declination angle of sun in degrees
   * @param {number} zenith
   *            the zenith
   * @return hour angle of sunrise in radians
   */
  static getSunHourAngleAtSunrise(lat, solarDec, zenith) {
    const latRad = degreesToRadians(lat);
    const sdRad = degreesToRadians(solarDec);
    return Math.acos(Math.cos(degreesToRadians(zenith)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)); // in radians
  }
  /**
   * Returns the <a href="http://en.wikipedia.org/wiki/Hour_angle">hour angle</a> of the sun at sunset for the
   * latitude.
   * @private
   * @param {number} lat
   *            the latitude of observer in degrees
   * @param solarDec
   *            the declination angle of sun in degrees
   * @param {number} zenith
   *            the zenith
   * @return the hour angle of sunset in radians
   */
  static getSunHourAngleAtSunset(lat, solarDec, zenith) {
    const latRad = degreesToRadians(lat);
    const sdRad = degreesToRadians(solarDec);
    const hourAngle = Math.acos(Math.cos(degreesToRadians(zenith)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
    return -hourAngle; // in radians
  }
  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Elevation</a> for the
   * horizontal coordinate system at the given location at the given time. Can be negative if the sun is below the
   * horizon. Not corrected for altitude.
   *
   * @param {Temporal.ZonedDateTime} date
   *            time of calculation
   * @param {number} lat
   *            latitude of location for calculation
   * @param {number} lon
   *            longitude of location for calculation
   * @return {number} solar elevation in degrees - horizon is 0 degrees, civil twilight is -6 degrees
   */
  static getSolarElevation(date, lat, lon) {
    const julianDay = NOAACalculator.getJulianDay(date.toPlainDate());
    const julianCenturies = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);
    const equationOfTime = NOAACalculator.getEquationOfTime(julianCenturies);
    let longitude = date.hour + 12 + (date.minute + equationOfTime + date.second / 60) / 60;
    longitude = -(longitude * 360 / 24) % 360;
    const hourAngleRad = degreesToRadians(lon - longitude);
    const declination = NOAACalculator.getSunDeclination(julianCenturies);
    const decRad = degreesToRadians(declination);
    const latRad = degreesToRadians(lat);
    return radiansToDegrees(Math.asin(Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad)));
  }
  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Azimuth</a> for the
   * horizontal coordinate system at the given location at the given time. Not corrected for altitude. True south is 0
   * degrees.
   *
   * @param {Temporal.ZonedDateTime} date
   *            time of calculation
   * @param {number} latitude
   *            latitude of location for calculation
   * @param {number} lon
   *            longitude of location for calculation
   * @return {number}
   */
  static getSolarAzimuth(date, latitude, lon) {
    const julianDay = NOAACalculator.getJulianDay(date.toPlainDate());
    const julianCenturies = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);
    const equationOfTime = NOAACalculator.getEquationOfTime(julianCenturies);
    let longitude = date.hour + 12 + (date.minute + equationOfTime + date.second / 60) / 60;
    longitude = -(longitude * 360 / 24) % 360;
    const hourAngleRad = degreesToRadians(lon - longitude);
    const declination = NOAACalculator.getSunDeclination(julianCenturies);
    const decRad = degreesToRadians(declination);
    const latRad = degreesToRadians(latitude);
    return radiansToDegrees(Math.atan(Math.sin(hourAngleRad) / (Math.cos(hourAngleRad) * Math.sin(latRad) - Math.tan(decRad) * Math.cos(latRad)))) + 180;
  }
  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of sunrise for the given day at the given location on earth
   * @private
   * @param julianDay
   *            the Julian day
   * @param {number} latitude
   *            the latitude of observer in degrees
   * @param {number} longitude
   *            the longitude of observer in degrees
   * @param {number} zenith
   *            the zenith
   * @return the time in minutes from zero UTC
   */
  static getSunriseUTC(julianDay, latitude, longitude, zenith) {
    const julianCenturies = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);
    // Find the time of solar noon at the location, and use that declination. This is better than start of the
    // Julian day
    const noonmin = NOAACalculator.getSolarNoonUTC(julianCenturies, longitude);
    const tnoon = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + noonmin / 1440);
    // First pass to approximate sunrise (using solar noon)
    let eqTime = NOAACalculator.getEquationOfTime(tnoon);
    let solarDec = NOAACalculator.getSunDeclination(tnoon);
    let hourAngle = NOAACalculator.getSunHourAngleAtSunrise(latitude, solarDec, zenith);
    let delta = longitude - radiansToDegrees(hourAngle);
    let timeDiff = 4 * delta; // in minutes of time
    let timeUTC = 720 + timeDiff - eqTime; // in minutes
    // Second pass includes fractional Julian Day in gamma calc
    const newt = NOAACalculator.getJulianCenturiesFromJulianDay(NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) + timeUTC / 1440);
    eqTime = NOAACalculator.getEquationOfTime(newt);
    solarDec = NOAACalculator.getSunDeclination(newt);
    hourAngle = NOAACalculator.getSunHourAngleAtSunrise(latitude, solarDec, zenith);
    delta = longitude - radiansToDegrees(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - eqTime; // in minutes
    return timeUTC;
  }
  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of <a href="http://en.wikipedia.org/wiki/Noon#Solar_noon">solar noon</a> for the given day at the given location
   * on earth.
   * @private
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @param {number} longitude
   *            the longitude of observer in degrees
   * @return the time in minutes from zero UTC
   */
  static getSolarNoonUTC(julianCenturies, longitude) {
    // First pass uses approximate solar noon to calculate eqtime
    const tnoon = NOAACalculator.getJulianCenturiesFromJulianDay(NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) + longitude / 360);
    let eqTime = NOAACalculator.getEquationOfTime(tnoon);
    const solNoonUTC = 720 + longitude * 4 - eqTime; // min
    const newt = NOAACalculator.getJulianCenturiesFromJulianDay(NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) - 0.5 + solNoonUTC / 1440);
    eqTime = NOAACalculator.getEquationOfTime(newt);
    return 720 + longitude * 4 - eqTime; // min
  }
  /**
   * Return the <a href="http://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of sunset for the given day at the given location on earth
   * @private
   * @param julianDay
   *            the Julian day
   * @param {number} latitude
   *            the latitude of observer in degrees
   * @param {number} longitude
   *            : longitude of observer in degrees
   * @param {number} zenith
   *            the zenith
   * @return the time in minutes from zero Universal Coordinated Time (UTC)
   */
  static getSunsetUTC(julianDay, latitude, longitude, zenith) {
    const julianCenturies = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);
    // Find the time of solar noon at the location, and use that declination. This is better than start of the
    // Julian day
    const noonmin = NOAACalculator.getSolarNoonUTC(julianCenturies, longitude);
    const tnoon = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + noonmin / 1440);
    // First calculates sunrise and approx length of day
    let eqTime = NOAACalculator.getEquationOfTime(tnoon);
    let solarDec = NOAACalculator.getSunDeclination(tnoon);
    let hourAngle = NOAACalculator.getSunHourAngleAtSunset(latitude, solarDec, zenith);
    let delta = longitude - radiansToDegrees(hourAngle);
    let timeDiff = 4 * delta;
    let timeUTC = 720 + timeDiff - eqTime;
    // Second pass includes fractional Julian Day in gamma calc
    const newt = NOAACalculator.getJulianCenturiesFromJulianDay(NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) + timeUTC / 1440);
    eqTime = NOAACalculator.getEquationOfTime(newt);
    solarDec = NOAACalculator.getSunDeclination(newt);
    hourAngle = NOAACalculator.getSunHourAngleAtSunset(latitude, solarDec, zenith);
    delta = longitude - radiansToDegrees(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - eqTime; // in minutes
    return timeUTC;
  }
}
/**
 * The zenith of astronomical sunrise and sunset. The sun is 90&deg; from the vertical 0&deg;
 * @private
 */
NOAACalculator.GEOMETRIC_ZENITH = 90;
/**
 * Default value for Sun's zenith and true rise/set Zenith (used in this class and subclasses) is the angle that the
 * center of the Sun makes to a line perpendicular to the Earth's surface. If the Sun were a point and the Earth
 * were without an atmosphere, true sunset and sunrise would correspond to a 90&deg; zenith. Because the Sun is not
 * a point, and because the atmosphere refracts light, this 90&deg; zenith does not, in fact, correspond to true
 * sunset or sunrise, instead the center of the Sun's disk must lie just below the horizon for the upper edge to be
 * obscured. This means that a zenith of just above 90&deg; must be used. The Sun subtends an angle of 16 minutes of
 * arc, and atmospheric refraction accounts for
 * 34 minutes or so, giving a total of 50
 * arcminutes. The total value for ZENITH is 90+(5/6) or 90.8333333&deg; for true sunrise/sunset.
 */
// const ZENITH: number = GEOMETRIC_ZENITH + 5.0 / 6.0;
/** Sun's zenith at civil twilight (96&deg;). */
NOAACalculator.CIVIL_ZENITH = 96;
/** Sun's zenith at nautical twilight (102&deg;). */
NOAACalculator.NAUTICAL_ZENITH = 102;
/** Sun's zenith at astronomical twilight (108&deg;). */
NOAACalculator.ASTRONOMICAL_ZENITH = 108;
/**
 * The <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a> of January 1, 2000
 * @private
 */
NOAACalculator.JULIAN_DAY_JAN_1_2000 = 2451545;
/**
 * Julian days per century
 * @private
 */
NOAACalculator.JULIAN_DAYS_PER_CENTURY = 36525;

/*
    Hebcal - A Jewish Calendar Generator
    Copyright (c) 1994-2020 Danny Sadinoff
    Portions copyright Eyal Schachter and Michael J. Radwin

    https://github.com/hebcal/hebcal-es6

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const classicCities0 = [
    ['Ashdod', 'IL', 31.79213, 34.64966, 'Asia/Jerusalem', 27],
    ['Atlanta', 'US', 33.749, -84.38798, 'America/New_York', 336],
    ['Austin', 'US', 30.26715, -97.74306, 'America/Chicago', 165],
    ['Baghdad', 'IQ', 33.34058, 44.40088, 'Asia/Baghdad', 41],
    ['Beer Sheva', 'IL', 31.25181, 34.7913, 'Asia/Jerusalem', 285],
    ['Berlin', 'DE', 52.52437, 13.41053, 'Europe/Berlin', 43],
    ['Baltimore', 'US', 39.29038, -76.61219, 'America/New_York', 35],
    ['Bogota', 'CO', 4.60971, -74.08175, 'America/Bogota', 2582],
    ['Boston', 'US', 42.35843, -71.05977, 'America/New_York', 38],
    ['Budapest', 'HU', 47.49801, 19.03991, 'Europe/Budapest', 104],
    [
        'Buenos Aires',
        'AR',
        -34.61315,
        -58.37723,
        'America/Argentina/Buenos_Aires',
        31,
    ],
    ['Buffalo', 'US', 42.88645, -78.87837, 'America/New_York', 191],
    ['Chicago', 'US', 41.85003, -87.65005, 'America/Chicago', 180],
    ['Cincinnati', 'US', 39.162, -84.45689, 'America/New_York', 267],
    ['Cleveland', 'US', 41.4995, -81.69541, 'America/New_York', 204],
    ['Dallas', 'US', 32.78306, -96.80667, 'America/Chicago', 139],
    ['Denver', 'US', 39.73915, -104.9847, 'America/Denver', 1636],
    ['Detroit', 'US', 42.33143, -83.04575, 'America/Detroit', 192],
    ['Eilat', 'IL', 29.55805, 34.94821, 'Asia/Jerusalem', 63],
    ['Gibraltar', 'GI', 36.14474, -5.35257, 'Europe/Gibraltar', 11],
    ['Haifa', 'IL', 32.81841, 34.9885, 'Asia/Jerusalem', 40],
    ['Hawaii', 'US', 21.30694, -157.85833, 'Pacific/Honolulu', 18],
    ['Helsinki', 'FI', 60.16952, 24.93545, 'Europe/Helsinki', 26],
    ['Houston', 'US', 29.76328, -95.36327, 'America/Chicago', 30],
    ['Jerusalem', 'IL', 31.76904, 35.21633, 'Asia/Jerusalem', 786],
    ['Johannesburg', 'ZA', -26.20227, 28.04363, 'Africa/Johannesburg', 1767],
    ['Kiev', 'UA', 50.45466, 30.5238, 'Europe/Kiev', 187],
    ['La Paz', 'BO', -16.5, -68.15, 'America/La_Paz', 3782],
    ['Livingston', 'US', 40.79593, -74.31487, 'America/New_York', 98],
    ['Las Vegas', 'US', 36.17497, -115.13722, 'America/Los_Angeles', 613],
    ['London', 'GB', 51.50853, -0.12574, 'Europe/London', 25],
    ['Los Angeles', 'US', 34.05223, -118.24368, 'America/Los_Angeles', 96],
    ['Marseilles', 'FR', 43.29695, 5.38107, 'Europe/Paris', 28],
    ['Miami', 'US', 25.77427, -80.19366, 'America/New_York', 25],
    ['Minneapolis', 'US', 44.97997, -93.26384, 'America/Chicago', 262],
    ['Melbourne', 'AU', -37.814, 144.96332, 'Australia/Melbourne', 25],
    ['Mexico City', 'MX', 19.42847, -99.12766, 'America/Mexico_City', 2240],
    ['Montreal', 'CA', 45.50884, -73.58781, 'America/Toronto', 216],
    ['Moscow', 'RU', 55.75222, 37.61556, 'Europe/Moscow', 144],
    ['New York', 'US', 40.71427, -74.00597, 'America/New_York', 57],
    ['Omaha', 'US', 41.25861, -95.93779, 'America/Chicago', 315],
    ['Ottawa', 'CA', 45.41117, -75.69812, 'America/Toronto', 71],
    ['Panama City', 'PA', 8.9936, -79.51973, 'America/Panama', 17],
    ['Paris', 'FR', 48.85341, 2.3488, 'Europe/Paris', 42],
    ['Pawtucket', 'US', 41.87871, -71.38256, 'America/New_York', 0], // -11
    ['Petach Tikvah', 'IL', 32.08707, 34.88747, 'Asia/Jerusalem', 54],
    ['Philadelphia', 'US', 39.95233, -75.16379, 'America/New_York', 8],
    ['Phoenix', 'US', 33.44838, -112.07404, 'America/Phoenix', 366],
    ['Pittsburgh', 'US', 40.44062, -79.99589, 'America/New_York', 239],
    ['Providence', 'US', 41.82399, -71.41283, 'America/New_York', 0], // -15
    ['Portland', 'US', 45.52345, -122.67621, 'America/Los_Angeles', 15],
    ['Saint Louis', 'US', 38.62727, -90.19789, 'America/Chicago', 149],
    ['Saint Petersburg', 'RU', 59.93863, 30.31413, 'Europe/Moscow', 11],
    ['San Diego', 'US', 32.71533, -117.15726, 'America/Los_Angeles', 20],
    ['San Francisco', 'US', 37.77493, -122.41942, 'America/Los_Angeles', 28],
    ['Sao Paulo', 'BR', -23.5475, -46.63611, 'America/Sao_Paulo', 769],
    ['Seattle', 'US', 47.60621, -122.33207, 'America/Los_Angeles', 56],
    ['Sydney', 'AU', -33.86785, 151.20732, 'Australia/Sydney', 58],
    ['Tel Aviv', 'IL', 32.08088, 34.78057, 'Asia/Jerusalem', 15],
    ['Tiberias', 'IL', 32.79221, 35.53124, 'Asia/Jerusalem', 0], // -140
    ['Toronto', 'CA', 43.70011, -79.4163, 'America/Toronto', 175],
    ['Vancouver', 'CA', 49.24966, -123.11934, 'America/Vancouver', 70],
    ['White Plains', 'US', 41.03399, -73.76291, 'America/New_York', 82],
    ['Washington DC', 'US', 38.89511, -77.03637, 'America/New_York', 6],
    ['Worcester', 'US', 42.26259, -71.80229, 'America/New_York', 164],
];
const classicCities = new Map();
// Zip-Codes.com TimeZone IDs
const ZIPCODES_TZ_MAP = {
    '0': 'UTC',
    '4': 'America/Puerto_Rico', // Atlantic (GMT -04:00)
    '5': 'America/New_York', //    Eastern  (GMT -05:00)
    '6': 'America/Chicago', //     Central  (GMT -06:00)
    '7': 'America/Denver', //      Mountain (GMT -07:00)
    '8': 'America/Los_Angeles', // Pacific  (GMT -08:00)
    '9': 'America/Anchorage', //   Alaska   (GMT -09:00)
    '10': 'Pacific/Honolulu', //   Hawaii-Aleutian Islands (GMT -10:00)
    '11': 'Pacific/Pago_Pago', //  American Samoa (GMT -11:00)
    '13': 'Pacific/Funafuti', //   Marshall Islands (GMT +12:00)
    '14': 'Pacific/Guam', //       Guam     (GMT +10:00)
    '15': 'Pacific/Palau', //      Palau    (GMT +9:00)
    '16': 'Pacific/Chuuk', //      Micronesia (GMT +11:00)
};
/** @private */
const timeFormatCache = new Map();
/**
 * Gets a 24-hour time formatter (e.g. 07:41 or 20:03) from cache
 * or makes a new one if needed
 * @private
 */
function getFormatter(tzid) {
    const fmt = timeFormatCache.get(tzid);
    if (fmt)
        return fmt;
    const f = new Intl.DateTimeFormat('en-US', {
        timeZone: tzid,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
    timeFormatCache.set(tzid, f);
    return f;
}
/** Class representing Location */
class Location extends GeoLocation {
    /**
     * Initialize a Location instance
     * @param latitude - Latitude as a decimal, valid range -90 thru +90 (e.g. 41.85003)
     * @param longitude - Longitude as a decimal, valid range -180 thru +180 (e.g. -87.65005)
     * @param il - in Israel (true) or Diaspora (false)
     * @param tzid - Olson timezone ID, e.g. "America/Chicago"
     * @param [cityName] - optional descriptive city name
     * @param [countryCode] - ISO 3166 alpha-2 country code (e.g. "FR")
     * @param [geoid] - optional string or numeric geographic ID
     * @param [elevation] - in meters (default `0`)
     */
    constructor(latitude, longitude, il, tzid, cityName, countryCode, geoid, elevation) {
        const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
            throw new RangeError(`Latitude ${latitude} out of range [-90,90]`);
        }
        const long = typeof longitude === 'number' ? longitude : parseFloat(longitude);
        if (isNaN(long) || long < -180 || long > 180) {
            throw new RangeError(`Longitude ${longitude} out of range [-180,180]`);
        }
        const elev = typeof elevation === 'number' && elevation > 0 ? elevation : 0;
        super(cityName || null, lat, long, elev, tzid);
        this.il = Boolean(il);
        this.cc = countryCode;
        this.geoid = geoid;
    }
    getIsrael() {
        return this.il;
    }
    getName() {
        return this.getLocationName();
    }
    /**
     * Returns the location name, up to the first comma
     */
    getShortName() {
        const name = this.getLocationName();
        if (!name)
            return name;
        const comma = name.indexOf(', ');
        if (comma === -1)
            return name;
        if (this.cc === 'US' && name[comma + 2] === 'D') {
            if (name[comma + 3] === 'C') {
                return name.substring(0, comma + 4);
            }
            else if (name[comma + 3] === '.' && name[comma + 4] === 'C') {
                return name.substring(0, comma + 6);
            }
        }
        return name.substring(0, comma);
    }
    getCountryCode() {
        return this.cc;
    }
    getTzid() {
        return this.getTimeZone();
    }
    /**
     * Gets a 24-hour time formatter (e.g. 07:41 or 20:03) for this location
     */
    getTimeFormatter() {
        return getFormatter(this.getTimeZone());
    }
    getGeoId() {
        return this.geoid;
    }
    /**
     * Creates a location object from one of 60 "classic" Hebcal city names.
     * The following city names are supported:
     * 'Ashdod', 'Atlanta', 'Austin', 'Baghdad', 'Beer Sheva',
     * 'Berlin', 'Baltimore', 'Bogota', 'Boston', 'Budapest',
     * 'Buenos Aires', 'Buffalo', 'Chicago', 'Cincinnati', 'Cleveland',
     * 'Dallas', 'Denver', 'Detroit', 'Eilat', 'Gibraltar', 'Haifa',
     * 'Hawaii', 'Helsinki', 'Houston', 'Jerusalem', 'Johannesburg',
     * 'Kiev', 'La Paz', 'Livingston', 'Las Vegas', 'London', 'Los Angeles',
     * 'Marseilles', 'Miami', 'Minneapolis', 'Melbourne', 'Mexico City',
     * 'Montreal', 'Moscow', 'New York', 'Omaha', 'Ottawa', 'Panama City',
     * 'Paris', 'Pawtucket', 'Petach Tikvah', 'Philadelphia', 'Phoenix',
     * 'Pittsburgh', 'Providence', 'Portland', 'Saint Louis', 'Saint Petersburg',
     * 'San Diego', 'San Francisco', 'Sao Paulo', 'Seattle', 'Sydney',
     * 'Tel Aviv', 'Tiberias', 'Toronto', 'Vancouver', 'White Plains',
     * 'Washington DC', 'Worcester'
     * @param name
     */
    static lookup(name) {
        return classicCities.get(name.toLowerCase());
    }
    toString() {
        return JSON.stringify(this);
    }
    /**
     * Converts legacy Hebcal timezone to a standard Olson tzid.
     * @param tz integer, GMT offset in hours
     * @param dst 'none', 'eu', 'usa', or 'israel'
     */
    static legacyTzToTzid(tz, dst) {
        tz = +tz;
        if (dst === 'none') {
            if (tz === 0) {
                return 'UTC';
            }
            else {
                const plus = tz > 0 ? '+' : '';
                return `Etc/GMT${plus}${tz}`;
            }
        }
        else if (tz === 2 && dst === 'israel') {
            return 'Asia/Jerusalem';
        }
        else if (dst === 'eu') {
            switch (tz) {
                case -2:
                    return 'Atlantic/Cape_Verde';
                case -1:
                    return 'Atlantic/Azores';
                case 0:
                    return 'Europe/London';
                case 1:
                    return 'Europe/Paris';
                case 2:
                    return 'Europe/Athens';
            }
        }
        else if (dst === 'usa') {
            return ZIPCODES_TZ_MAP[String(tz * -1)];
        }
        return undefined;
    }
    /**
     * Converts timezone info from Zip-Codes.com to a standard Olson tzid.
     * @example
     * Location.getUsaTzid('AZ', 7, 'Y') // 'America/Denver'
     * @param state two-letter all-caps US state abbreviation like 'CA'
     * @param tz positive number, 5=America/New_York, 8=America/Los_Angeles
     * @param dst single char 'Y' or 'N'
     */
    static getUsaTzid(state, tz, dst) {
        tz = +tz;
        if (tz === 10 && state === 'AK') {
            return 'America/Adak';
        }
        else if (tz === 7 && state === 'AZ') {
            return dst === 'Y' ? 'America/Denver' : 'America/Phoenix';
        }
        else {
            return ZIPCODES_TZ_MAP[tz];
        }
    }
    /**
     * Adds a location name for `Location.lookup()` only if the name isn't
     * already being used. Returns `false` if the name is already taken
     * and `true` if successfully added.
     */
    static addLocation(cityName, location) {
        const name = cityName.toLowerCase();
        if (classicCities.has(name)) {
            return false;
        }
        classicCities.set(name, location);
        return true;
    }
}
for (const city of classicCities0) {
    const location = new Location(city[2], city[3], city[1] === 'IL', city[4], city[0], city[1], undefined, city[5]);
    Location.addLocation(city[0], location);
}

Object.defineProperties(globalThis, p({
  Temporal: mr
})), Object.defineProperties(Intl, p({
  DateTimeFormat: Sr
})), Object.defineProperties(Date.prototype, p({
  toTemporalInstant: toTemporalInstant
}));

/**
 * @private
 */
function zdtToDate(zdt) {
    if (zdt === null) {
        return new Date(NaN);
    }
    const res = new Date(zdt.epochMilliseconds);
    res.setMilliseconds(0);
    return res;
}
function getDate(date) {
    if (isDate(date))
        return date;
    if (HDate.isHDate(date))
        return date.greg();
    throw new TypeError(`invalid date: ${date}`);
}
/**
 * Calculate halachic times (zmanim / זְמַנִּים) for a given day and location.
 * Calculations are available for tzeit / tzais (nightfall),
 * shkiah (sunset) and more.
 *
 * Zmanim are estimated using an algorithm published by the US National Oceanic
 * and Atmospheric Administration. The NOAA solar calculator is based on equations
 * from _Astronomical Algorithms_ by Jean Meeus.
 *
 * The sunrise and sunset results are theoretically accurate to within a minute for
 * locations between +/- 72° latitude, and within 10 minutes outside of those latitudes.
 * However, due to variations in atmospheric composition, temperature, pressure and
 * conditions, observed values may vary from calculations.
 * https://gml.noaa.gov/grad/solcalc/calcdetails.html
 *
 * @example
 * const {GeoLocation, Zmanim} = require('@hebcal/core');
 * const latitude = 41.822232;
 * const longitude = -71.448292;
 * const tzid = 'America/New_York';
 * const friday = new Date(2023, 8, 8);
 * const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
 * const zmanim = new Zmanim(gloc, friday, false);
 * const candleLighting = zmanim.sunsetOffset(-18, true);
 * const timeStr = Zmanim.formatISOWithTimeZone(tzid, candleLighting);
 */
class Zmanim {
    /**
     * Initialize a Zmanim instance.
     * @param gloc GeoLocation including latitude, longitude, and timezone
     * @param date Regular or Hebrew Date. If `date` is a regular `Date`,
     *    hours, minutes, seconds and milliseconds are ignored.
     * @param useElevation use elevation for calculations (default `false`).
     *    If `true`, use elevation to affect the calculation of all sunrise/sunset based
     *    zmanim. Note: there are some zmanim such as degree-based zmanim that are driven
     *    by the amount of light in the sky and are not impacted by elevation.
     *    These zmanim intentionally do not support elevation adjustment.
     */
    constructor(gloc, date, useElevation) {
        const dt = getDate(date);
        this.date = dt;
        this.gloc = gloc;
        const plainDate = Temporal.PlainDate.from({
            year: dt.getFullYear(),
            month: dt.getMonth() + 1,
            day: dt.getDate(),
        });
        this.noaa = new NOAACalculator(gloc, plainDate);
        this.useElevation = Boolean(useElevation);
    }
    /**
     * Returns `true` if elevation adjustment is enabled
     * for zmanim support elevation adjustment
     */
    getUseElevation() {
        return this.useElevation;
    }
    /**
     * Enables or disables elevation adjustment for zmanim support elevation adjustment
     * @param useElevation
     */
    setUseElevation(useElevation) {
        this.useElevation = useElevation;
    }
    /**
     * Convenience function to get the time when sun is above or below the horizon
     * for a certain angle (in degrees).
     * This function does not support elevation adjustment.
     * @param angle
     * @param rising
     */
    timeAtAngle(angle, rising) {
        const offsetZenith = 90 + angle;
        const zdt = rising
            ? this.noaa.getSunriseOffsetByDegrees(offsetZenith)
            : this.noaa.getSunsetOffsetByDegrees(offsetZenith);
        return zdtToDate(zdt);
    }
    /**
     * Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon)
     * If elevation is enabled, this function will include elevation in the calculation.
     */
    sunrise() {
        const zdt = this.useElevation
            ? this.noaa.getSunrise()
            : this.noaa.getSeaLevelSunrise();
        return zdtToDate(zdt);
    }
    /**
     * Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon).
     * This function does not support elevation adjustment.
     */
    seaLevelSunrise() {
        const zdt = this.noaa.getSeaLevelSunrise();
        return zdtToDate(zdt);
    }
    /**
     * When the upper edge of the Sun disappears below the horizon (0.833° below horizon).
     * If elevation is enabled, this function will include elevation in the calculation.
     */
    sunset() {
        const zdt = this.useElevation
            ? this.noaa.getSunset()
            : this.noaa.getSeaLevelSunset();
        return zdtToDate(zdt);
    }
    /**
     * When the upper edge of the Sun disappears below the horizon (0.833° below horizon).
     * This function does not support elevation adjustment.
     */
    seaLevelSunset() {
        const zdt = this.noaa.getSeaLevelSunset();
        return zdtToDate(zdt);
    }
    /**
     * Civil dawn; Sun is 6° below the horizon in the morning.
     * Because degree-based functions estimate the amount of light in the sky,
     * the result is not impacted by elevation.
     */
    dawn() {
        const zdt = this.noaa.getBeginCivilTwilight();
        return zdtToDate(zdt);
    }
    /**
     * Civil dusk; Sun is 6° below the horizon in the evening.
     * Because degree-based functions estimate the amount of light in the sky,
     * the result is not impacted by elevation.
     */
    dusk() {
        const zdt = this.noaa.getEndCivilTwilight();
        return zdtToDate(zdt);
    }
    /**
     * Returns sunset for the previous day.
     * If elevation is enabled, this function will include elevation in the calculation.
     */
    gregEve() {
        const prev = new Date(this.date);
        prev.setDate(prev.getDate() - 1);
        const zman = new Zmanim(this.gloc, prev, this.useElevation);
        return zman.sunset();
    }
    /**
     * @private
     */
    nightHour() {
        return (this.sunrise().getTime() - this.gregEve().getTime()) / 12; // ms in hour
    }
    /**
     * Midday – Chatzot; Sunrise plus 6 halachic hours
     */
    chatzot() {
        const startOfDay = this.noaa.getSeaLevelSunrise();
        const endOfDay = this.noaa.getSeaLevelSunset();
        const zdt = this.noaa.getSunTransit(startOfDay, endOfDay);
        return zdtToDate(zdt);
    }
    /**
     * Midnight – Chatzot; Sunset plus 6 halachic hours.
     * If elevation is enabled, this function will include elevation in the calculation.
     */
    chatzotNight() {
        return new Date(this.sunrise().getTime() - this.nightHour() * 6);
    }
    /**
     * Dawn – Alot haShachar; Sun is 16.1° below the horizon in the morning.
     * Because degree-based functions estimate the amount of light in the sky,
     * the result is not impacted by elevation.
     */
    alotHaShachar() {
        return this.timeAtAngle(16.1, true);
    }
    /**
     * Earliest talis & tefillin – Misheyakir; Sun is 11.5° below the horizon in the morning.
     * Because degree-based functions estimate the amount of light in the sky,
     * the result is not impacted by elevation.
     */
    misheyakir() {
        return this.timeAtAngle(11.5, true);
    }
    /**
     * Earliest talis & tefillin – Misheyakir Machmir; Sun is 10.2° below the horizon in the morning.
     * Because degree-based functions estimate the amount of light in the sky,
     * the result is not impacted by elevation.
     */
    misheyakirMachmir() {
        return this.timeAtAngle(10.2, true);
    }
    /**
     * Utility method for using elevation-aware sunrise/sunset
     * @private
     * @param hours
     */
    getShaahZmanisBasedZman(hours) {
        const startOfDay = this.useElevation
            ? this.noaa.getSunrise()
            : this.noaa.getSeaLevelSunrise();
        const endOfDay = this.useElevation
            ? this.noaa.getSunset()
            : this.noaa.getSeaLevelSunset();
        const temporalHour = this.noaa.getTemporalHour(startOfDay, endOfDay);
        const offset = Math.round(temporalHour * hours);
        const zdt = NOAACalculator.getTimeOffset(startOfDay, offset);
        return zdtToDate(zdt);
    }
    /**
     * Latest Shema (Gra); Sunrise plus 3 halachic hours, according to the Gra.
     * If elevation is enabled, this function will include elevation in the calculation.
     */
    sofZmanShma() {
        // Gra
        return this.getShaahZmanisBasedZman(3);
    }
    /**
     * Latest Shacharit (Gra); Sunrise plus 4 halachic hours, according to the Gra.
     *
     * This method returns the latest *zman tfila* (time to recite shema in the morning)
     * that is 4 *shaos zmaniyos* (solar hours) after sunrise or sea level sunrise
     * (depending on the `useElevation` setting), according
     * to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).
     *
     * If elevation is enabled, this function will include elevation in the calculation.
     */
    sofZmanTfilla() {
        // Gra
        return this.getShaahZmanisBasedZman(4);
    }
    /**
     * Returns an array with alot (Date) and ms in hour (number)
     * @private
     */
    getTemporalHour72(forceSeaLevel) {
        const alot72 = this.sunriseOffset(-72, false, forceSeaLevel);
        const tzeit72 = this.sunsetOffset(72, false, forceSeaLevel);
        const temporalHour = (tzeit72.getTime() - alot72.getTime()) / 12;
        return [alot72, temporalHour];
    }
    /**
     * Returns an array with alot (Date) and ms in hour (number)
     * @private
     */
    getTemporalHourByDeg(angle) {
        const alot = this.timeAtAngle(angle, true);
        const tzeit = this.timeAtAngle(angle, false);
        const temporalHour = (tzeit.getTime() - alot.getTime()) / 12;
        return [alot, temporalHour];
    }
    /**
     * Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
     * Based on the opinion of the MGA that the day is calculated from
     * dawn being fixed 72 minutes before sea-level sunrise, and nightfall is fixed
     * 72 minutes after sea-level sunset.
     */
    sofZmanShmaMGA() {
        // Magen Avraham
        const [alot72, temporalHour] = this.getTemporalHour72(true);
        const offset = Math.floor(3 * temporalHour);
        return new Date(alot72.getTime() + offset);
    }
    /**
     * Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
     * Based on the opinion of the MGA that the day is calculated from
     * dawn to nightfall with both being 16.1° below the horizon.
     */
    sofZmanShmaMGA16Point1() {
        const [alot, temporalHour] = this.getTemporalHourByDeg(16.1);
        const offset = Math.floor(3 * temporalHour);
        return new Date(alot.getTime() + offset);
    }
    /**
     * Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
     * Based on the opinion of the MGA that the day is calculated from
     * dawn to nightfall with both being 19.8° below the horizon.
     *
     * This calculation is based on the position of the sun 90 minutes after sunset in Jerusalem
     * around the equinox / equilux which calculates to 19.8° below geometric zenith.
     * https://kosherjava.com/2022/01/12/equinox-vs-equilux-zmanim-calculations/
     */
    sofZmanShmaMGA19Point8() {
        const [alot, temporalHour] = this.getTemporalHourByDeg(19.8);
        const offset = Math.floor(3 * temporalHour);
        return new Date(alot.getTime() + offset);
    }
    /**
     * Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham
     */
    sofZmanTfillaMGA() {
        // Magen Avraham
        const [alot72, temporalHour] = this.getTemporalHour72(true);
        const offset = Math.floor(4 * temporalHour);
        return new Date(alot72.getTime() + offset);
    }
    /**
     * Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham.
     * Based on the opinion of the MGA that the day is calculated from
     * dawn to nightfall with both being 16.1° below the horizon.
     */
    sofZmanTfillaMGA16Point1() {
        const [alot, temporalHour] = this.getTemporalHourByDeg(16.1);
        const offset = Math.floor(4 * temporalHour);
        return new Date(alot.getTime() + offset);
    }
    /**
     * Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham.
     * Based on the opinion of the MGA that the day is calculated from
     * dawn to nightfall with both being 19.8° below the horizon.
     *
     * This calculation is based on the position of the sun 90 minutes after sunset in Jerusalem
     * around the equinox / equilux which calculates to 19.8° below geometric zenith.
     * https://kosherjava.com/2022/01/12/equinox-vs-equilux-zmanim-calculations/
     */
    sofZmanTfillaMGA19Point8() {
        const [alot, temporalHour] = this.getTemporalHourByDeg(19.8);
        const offset = Math.floor(4 * temporalHour);
        return new Date(alot.getTime() + offset);
    }
    /**
     * Earliest Mincha – Mincha Gedola (GRA); Sunrise plus 6.5 halachic hours.
     * If elevation is enabled, this function will include elevation in the calculation.
     *
     * This method returns the latest mincha gedola, the earliest time one can pray mincha
     * that is 6.5 shaos zmaniyos (solar hours) after sunrise or sea level sunrise
     * (depending on the `useElevation` setting), according
     * to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).
     *
     * The Ramba"m is of the opinion that it is better to delay *mincha* until
     * *mincha ketana* while the Ra"sh, Tur, GRA and others are of the
     * opinion that *mincha* can be prayed *lechatchila* starting at *mincha gedola*.
     */
    minchaGedola() {
        return this.getShaahZmanisBasedZman(6.5);
    }
    /**
     * Earliest Mincha – Mincha Gedola (MGA); Sunrise plus 6.5 halachic hours.
     * If elevation is enabled, this function will include elevation in the calculation.
     *
     * This method returns the time of *mincha gedola* according to the Magen Avraham
     * with the day starting 72 minutes before sunrise and ending 72 minutes after sunset.
     * This is the earliest time to pray *mincha*.
     */
    minchaGedolaMGA() {
        const [alot72, temporalHour] = this.getTemporalHour72(false);
        const offset = Math.floor(6.5 * temporalHour);
        return new Date(alot72.getTime() + offset);
    }
    /**
     * Preferable earliest time to recite Minchah – Mincha Ketana; Sunrise plus 9.5 halachic hours.
     * If elevation is enabled, this function will include elevation in the calculation.
     *
     * This method returns *mincha ketana*, the preferred earliest time to pray *mincha* in the
     * opinion of the [Rambam](https://en.wikipedia.org/wiki/Maimonides) and others,
     * that is 9.5 *shaos zmaniyos* (solar hours) after sunrise or sea level sunrise
     * (depending on the `useElevation` setting), according
     * to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).
     */
    minchaKetana() {
        return this.getShaahZmanisBasedZman(9.5);
    }
    /**
     * This method returns the time of *mincha ketana* according to the Magen Avraham
     * with the day starting 72 minutes before sunrise and ending 72 minutes after sunset.
     * This is the preferred earliest time to pray *mincha* according to the opinion of
     * the [Rambam](https://en.wikipedia.org/wiki/Maimonides) and others.
     *
     * If elevation is enabled, this function will include elevation in the calculation.
     */
    minchaKetanaMGA() {
        const [alot72, temporalHour] = this.getTemporalHour72(false);
        return new Date(alot72.getTime() + Math.floor(9.5 * temporalHour));
    }
    /**
     * Plag haMincha; Sunrise plus 10.75 halachic hours.
     * If elevation is enabled, this function will include elevation in the calculation.
     */
    plagHaMincha() {
        return this.getShaahZmanisBasedZman(10.75);
    }
    /**
     * @param [angle=8.5] optional time for solar depression.
     *   Default is 8.5 degrees for 3 small stars, use 7.083 degrees for 3 medium-sized stars.
     * Because degree-based functions estimate the amount of light in the sky,
     * the result is not impacted by elevation.
     */
    tzeit(angle = 8.5) {
        return this.timeAtAngle(angle, false);
    }
    /**
     * Alias for sunrise
     */
    neitzHaChama() {
        return this.sunrise();
    }
    /**
     * Alias for sunset
     */
    shkiah() {
        return this.sunset();
    }
    /**
     * Rabbeinu Tam holds that bein hashmashos is a specific time
     * between sunset and tzeis hakochavim.
     * One opinion on how to calculate this time is that
     * it is 13.5 minutes before tzies 7.083.
     * Because degree-based functions estimate the amount of light in the sky,
     * the result is not impacted by elevation.
     */
    beinHaShmashos() {
        const tzeit = this.tzeit(7.083);
        const millis = tzeit.getTime();
        if (isNaN(millis)) {
            return tzeit;
        }
        return new Date(millis - 13.5 * 60 * 1000);
    }
    /**
     * Uses timeFormat to return a date like '20:34'
     */
    static formatTime(dt, timeFormat) {
        const time = timeFormat.format(dt);
        const hm = time.split(':');
        if (hm[0] === '24') {
            return '00:' + hm[1];
        }
        return time;
    }
    /**
     * Discards seconds, rounding to nearest minute.
     * @param dt
     */
    static roundTime(dt) {
        const millis = dt.getTime();
        if (isNaN(millis)) {
            return dt;
        }
        // Round up to next minute if needed
        const millisOnly = dt.getMilliseconds();
        const seconds = dt.getSeconds();
        if (seconds === 0 && millisOnly === 0) {
            return dt;
        }
        const secAndMillis = seconds * 1000 + millisOnly;
        const delta = secAndMillis >= 30000 ? 60000 - secAndMillis : -1 * secAndMillis;
        return new Date(millis + delta);
    }
    /**
     * Get offset string (like "+05:00" or "-08:00") from tzid (like "Europe/Moscow")
     * @param tzid
     * @param date
     */
    static timeZoneOffset(tzid, date) {
        const offset = getTimezoneOffset(tzid, date);
        const offsetAbs = Math.abs(offset);
        const hours = Math.floor(offsetAbs / 60);
        const minutes = offsetAbs % 60;
        return (offset < 0 ? '+' : '-') + pad2(hours) + ':' + pad2(minutes);
    }
    /**
     * Returns a string like "2022-04-01T13:06:00-11:00"
     * @param tzid
     * @param date
     */
    static formatISOWithTimeZone(tzid, date) {
        if (isNaN(date.getTime())) {
            return '0000-00-00T00:00:00Z';
        }
        return (getPseudoISO(tzid, date).substring(0, 19) +
            Zmanim.timeZoneOffset(tzid, date));
    }
    /**
     * Returns sunrise + `offset` minutes (either positive or negative).
     * If elevation is enabled, this function will include elevation in the calculation
     *  unless `forceSeaLevel` is `true`.
     * @param offset minutes
     * @param roundMinute round time to nearest minute (default true)
     * @param forceSeaLevel use sea-level sunrise (default false)
     */
    sunriseOffset(offset, roundMinute = true, forceSeaLevel = false) {
        const sunrise = forceSeaLevel ? this.seaLevelSunrise() : this.sunrise();
        if (isNaN(sunrise.getTime())) {
            return sunrise;
        }
        if (roundMinute) {
            // For positive offsets only, round up to next minute if needed
            if (offset > 0 && sunrise.getSeconds() >= 30) {
                offset++;
            }
            sunrise.setSeconds(0, 0);
        }
        return new Date(sunrise.getTime() + offset * 60 * 1000);
    }
    /**
     * Returns sunset + `offset` minutes (either positive or negative).
     * If elevation is enabled, this function will include elevation in the calculation
     *  unless `forceSeaLevel` is `true`.
     * @param offset minutes
     * @param roundMinute round time to nearest minute (default true)
     * @param forceSeaLevel use sea-level sunset (default false)
     */
    sunsetOffset(offset, roundMinute = true, forceSeaLevel = false) {
        const sunset = forceSeaLevel ? this.seaLevelSunset() : this.sunset();
        if (isNaN(sunset.getTime())) {
            return sunset;
        }
        if (roundMinute) {
            // For Havdalah only, round up to next minute if needed
            if (offset > 0 && sunset.getSeconds() >= 30) {
                offset++;
            }
            sunset.setSeconds(0, 0);
        }
        return new Date(sunset.getTime() + offset * 60 * 1000);
    }
    /**
     * Returns the Hebrew date relative to the specified location and Gregorian date,
     * taking into consideration whether the time is before or after sunset.
     *
     * For example, if the given date and is `2024-09-22T10:35` (before sunset), and
     * sunset for the specified location is **19:04**, then this function would
     * return a Hebrew date of `19th of Elul, 5784`.
     * If the given date is the same Gregorian day after sunset
     * (for example `2024-09-22T20:07`), this function would return a
     * Hebrew date of `20th of Elul, 5784`.
     * @example
     * const {GeoLocation, Zmanim, HDate} = require('@hebcal/core');
     * const latitude = 48.85341;
     * const longitude = 2.3488;
     * const timezone = 'Europe/Paris';
     * const gloc = new GeoLocation(null, latitude, longitude, 0, timezone);
     * const before = Zmanim.makeSunsetAwareHDate(gloc, new Date('2024-09-22T17:38:46.123Z'), false);
     * console.log(before.toString()); // '19 Elul 5784'
     * const after = Zmanim.makeSunsetAwareHDate(gloc, new Date('2024-09-22T23:45:18.345Z'), false);
     * console.log(after.toString()); // '20 Elul 5784'
     */
    static makeSunsetAwareHDate(gloc, date, useElevation) {
        const zmanim = new Zmanim(gloc, date, useElevation);
        const sunset = zmanim.sunset();
        let hd = new HDate(date);
        const sunsetMillis = sunset.getTime();
        if (isNaN(sunsetMillis)) {
            return hd;
        }
        if (date.getTime() >= sunsetMillis) {
            hd = hd.next();
        }
        return hd;
    }
}

const hour12cc = {
    US: 1,
    CA: 1,
    BR: 1,
    AU: 1,
    NZ: 1,
    DO: 1,
    PR: 1,
    GR: 1,
    IN: 1,
    KR: 1,
    NP: 1,
    ZA: 1,
};
/**
 * @private
 * @param timeStr - original time like "20:30"
 * @param suffix - "p" or "pm" or " P.M.". Add leading space if you want it
 * @param options
 */
function reformatTimeStr(timeStr, suffix, options) {
    var _a;
    if (typeof timeStr !== 'string')
        throw new TypeError(`Bad timeStr: ${timeStr}`);
    const cc = ((_a = options === null || options === void 0 ? void 0 : options.location) === null || _a === void 0 ? void 0 : _a.getCountryCode()) || ((options === null || options === void 0 ? void 0 : options.il) ? 'IL' : 'US');
    const hour12 = options === null || options === void 0 ? void 0 : options.hour12;
    if (typeof hour12 !== 'undefined' && !hour12) {
        return timeStr;
    }
    if (!hour12 && typeof hour12cc[cc] === 'undefined') {
        return timeStr;
    }
    const hm = timeStr.split(':');
    let hour = parseInt(hm[0], 10);
    if (hour < 12 && suffix) {
        suffix = suffix.replace('p', 'a').replace('P', 'A');
        if (hour === 0) {
            hour = 12;
        }
    }
    else if (hour > 12) {
        hour = hour % 12;
    }
    else if (hour === 0) {
        hour = '00';
    }
    return `${hour}:${hm[1]}${suffix}`;
}

/** An event that has an `eventTime` and `eventTimeStr` */
class TimedEvent extends Event {
    /**
     * @param desc Description (not translated)
     */
    constructor(date, desc, mask, eventTime, location, linkedEvent, options) {
        super(date, desc, mask);
        this.eventTime = Zmanim.roundTime(eventTime);
        this.location = location;
        const timeFormat = location.getTimeFormatter();
        this.eventTimeStr = Zmanim.formatTime(this.eventTime, timeFormat);
        const opts = Object.assign(Object.assign({}, options), { location });
        this.fmtTime = reformatTimeStr(this.eventTimeStr, 'pm', opts);
        if (typeof linkedEvent !== 'undefined') {
            this.linkedEvent = linkedEvent;
        }
    }
    /**
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale) {
        return Locale.gettext(this.getDesc(), locale) + ': ' + this.fmtTime;
    }
    /**
     * Returns translation of "Candle lighting" without the time.
     * @param [locale] Optional locale name (defaults to active locale).
     */
    renderBrief(locale) {
        return Locale.gettext(this.getDesc(), locale);
    }
    getCategories() {
        const desc = this.getDesc();
        switch (desc) {
            // LIGHT_CANDLES or LIGHT_CANDLES_TZEIS
            case 'Candle lighting':
                return ['candles'];
            // YOM_TOV_ENDS
            case 'Havdalah':
                return ['havdalah'];
            // flags.MINOR_FAST or flags.MAJOR_FAST
            case 'Fast begins':
            case 'Fast ends':
                return ['zmanim', 'fast'];
        }
        /* NOTREACHED */
        return ['unknown'];
    }
}
/** Candle lighting before Shabbat or holiday */
class CandleLightingEvent extends TimedEvent {
    constructor(date, mask, eventTime, location, linkedEvent, options) {
        super(date, 'Candle lighting', mask, eventTime, location, linkedEvent, options);
    }
    getEmoji() {
        return '🕯️';
    }
}
/** Havdalah after Shabbat or holiday */
class HavdalahEvent extends TimedEvent {
    constructor(date, mask, eventTime, location, havdalahMins, linkedEvent, options) {
        super(date, 'Havdalah', mask, eventTime, location, linkedEvent, options);
        if (havdalahMins) {
            this.havdalahMins = havdalahMins;
        }
    }
    /**
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale) {
        return this.renderBrief(locale) + ': ' + this.fmtTime;
    }
    /**
     * Returns translation of "Havdalah" without the time.
     * @param [locale] Optional locale name (defaults to active locale).
     */
    renderBrief(locale) {
        let str = Locale.gettext(this.getDesc(), locale);
        if (this.havdalahMins) {
            const min = Locale.gettext('min', locale);
            str += ` (${this.havdalahMins} ${min})`;
        }
        return str;
    }
    getEmoji() {
        return '✨';
    }
}

/* eslint-disable camelcase */
const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const heDayNames = [
    'רִאשׁוֹן',
    'שֵׁנִי',
    'שְׁלִישִׁי',
    'רְבִיעִי',
    'חֲמִישִׁי',
    'שִׁישִּׁי',
    'שַׁבָּת',
];
const night = 'בַּלַּ֥יְלָה';
function getHebrewTimeOfDay(hour) {
    if (hour < 5)
        return night;
    else if (hour < 12)
        return 'בַּבֹּקֶר';
    else if (hour < 17)
        return 'בַּצׇּהֳרַיִים';
    else if (hour < 21)
        return 'בָּעֶרֶב';
    return night;
}
/**
 * Represents a molad, the moment when the new moon is "born"
 */
class Molad {
    /**
     * Calculates the molad for a Hebrew month
     * @param year
     * @param month
     */
    constructor(year, month) {
        this.m = molad(year, month);
    }
    /**
     */
    getYear() {
        return this.m.year;
    }
    /**
     */
    getMonth() {
        return this.m.month;
    }
    /**
     */
    getMonthName() {
        return HDate.getMonthName(this.m.month, this.m.year);
    }
    /**
     * @returns Day of Week (0=Sunday, 6=Saturday)
     */
    getDow() {
        return this.m.dayOfWeek;
    }
    /**
     * @returns hour of day (0-23)
     */
    getHour() {
        return this.m.hour;
    }
    /**
     * @returns minutes past hour (0-59)
     */
    getMinutes() {
        return this.m.minutes;
    }
    /**
     * @returns parts of a minute (0-17)
     */
    getChalakim() {
        return this.m.chalakim;
    }
    /**
     * @param [locale] Optional locale name (defaults to active locale)
     * @param options
     */
    render(locale, options) {
        var _a;
        locale = locale !== null && locale !== void 0 ? locale : Locale.getLocaleName();
        if (typeof locale === 'string') {
            locale = locale.toLowerCase();
        }
        const isHebrewLocale = locale === 'he' || locale === 'he-x-nonikud' || locale === 'h';
        const monthName = Locale.gettext(this.getMonthName(), locale);
        const dayNames = isHebrewLocale ? heDayNames : shortDayNames;
        const dow = dayNames[this.getDow()];
        const minutes = this.getMinutes();
        const hour = this.getHour();
        const chalakim = this.getChalakim();
        const moladStr = Locale.gettext('Molad', locale);
        const minutesStr = (_a = Locale.lookupTranslation('min', locale)) !== null && _a !== void 0 ? _a : 'minutes';
        const chalakimStr = Locale.gettext('chalakim', locale);
        if (isHebrewLocale) {
            const ampm = getHebrewTimeOfDay(hour);
            const result = `${moladStr} ${monthName} יִהְיֶה בַּיּוֹם ${dow} בשָׁבוּעַ, ` +
                `בְּשָׁעָה ${hour} ${ampm}, ` +
                `ו-${minutes} ${minutesStr} ` +
                `ו-${chalakim} ${chalakimStr}`;
            if (locale === 'he-x-nonikud') {
                return Locale.hebrewStripNikkud(result);
            }
            return result;
        }
        const fmtTime = reformatTimeStr(`${hour}:00`, 'pm', options);
        const month = monthName.replace(/'/g, '’');
        return `${moladStr} ${month}: ${dow}, ${minutes} ${minutesStr} and ${chalakim} ${chalakimStr} after ${fmtTime}`;
    }
}
/** Represents a Molad announcement on Shabbat Mevarchim */
class MoladEvent extends Event {
    /**
     * @param date Hebrew date event occurs
     * @param hyear molad year
     * @param hmonth molad month
     * @param options
     */
    constructor(date, hyear, hmonth, options) {
        const m = new Molad(hyear, hmonth);
        const monthName = m.getMonthName();
        super(date, `Molad ${monthName} ${hyear}`, flags.MOLAD);
        this.molad = m;
        this.options = options;
    }
    /**
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale) {
        return this.molad.render(locale, this.options);
    }
}

/** Represents a day 1-49 of counting the Omer from Pesach to Shavuot */
class OmerEvent extends Event {
    /**
     * @param date
     * @param omerDay
     */
    constructor(date, omerDay) {
        super(date, `Omer ${omerDay}`, flags.OMER_COUNT);
        if (omerDay < 1 || omerDay > 49) {
            throw new RangeError(`Invalid Omer day ${omerDay}`);
        }
        this.weekNumber = Math.floor((omerDay - 1) / 7) + 1;
        this.daysWithinWeeks = omerDay % 7 || 7;
        this.omer = omerDay;
    }
    /**
     * @param lang
     */
    sefira(lang = 'en') {
        if (lang !== 'he' && lang !== 'translit') {
            lang = 'en';
        }
        return omerSefira(this.omer, lang);
    }
    /**
     * @todo use gettext()
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale) {
        locale = locale !== null && locale !== void 0 ? locale : Locale.getLocaleName();
        if (typeof locale === 'string') {
            locale = locale.toLowerCase();
        }
        const isHebrewLocale = locale === 'he' || locale === 'he-x-nonikud' || locale === 'h';
        const omer = this.omer;
        const nth = isHebrewLocale ? gematriya(omer) : Locale.ordinal(omer, locale);
        return nth + ' ' + Locale.gettext('day of the Omer', locale);
    }
    /**
     * Returns translation of "Omer day 22" without ordinal numbers.
     * @param [locale] Optional locale name (defaults to active locale).
     */
    renderBrief(locale) {
        return (Locale.gettext('Omer', locale) +
            ' ' +
            Locale.gettext('day', locale) +
            ' ' +
            this.omer);
    }
    getEmoji() {
        if (typeof this.emoji === 'string')
            return this.emoji;
        return omerEmoji(this.omer);
    }
    getWeeks() {
        const day7 = this.daysWithinWeeks === 7;
        return day7 ? this.weekNumber : this.weekNumber - 1;
    }
    getDaysWithinWeeks() {
        return this.daysWithinWeeks;
    }
    /**
     * @param locale
     */
    getTodayIs(locale) {
        locale = locale !== null && locale !== void 0 ? locale : Locale.getLocaleName();
        if (typeof locale === 'string') {
            locale = locale.toLowerCase();
        }
        const omerLang = locale === 'he' || locale === 'he-x-nonikud' ? 'he' : 'en';
        const str = omerTodayIs(this.omer, omerLang);
        if (locale === 'he-x-nonikud') {
            return Locale.hebrewStripNikkud(str);
        }
        return str;
    }
    url() {
        return `https://www.hebcal.com/omer/${this.getDate().getFullYear()}/${this.omer}`;
    }
}

class QuickLRU extends Map {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super();
    if (!(options.maxSize && options.maxSize > 0)) {
      throw new TypeError('`maxSize` must be a number greater than 0');
    }
    if (typeof options.maxAge === 'number' && options.maxAge === 0) {
      throw new TypeError('`maxAge` must be a number greater than 0');
    }

    // TODO: Use private class fields when ESLint supports them.
    this.maxSize = options.maxSize;
    this.maxAge = options.maxAge || Number.POSITIVE_INFINITY;
    this.onEviction = options.onEviction;
    this.cache = new Map();
    this.oldCache = new Map();
    this._size = 0;
  }

  // TODO: Use private class methods when targeting Node.js 16.
  _emitEvictions(cache) {
    if (typeof this.onEviction !== 'function') {
      return;
    }
    for (const [key, item] of cache) {
      this.onEviction(key, item.value);
    }
  }
  _deleteIfExpired(key, item) {
    if (typeof item.expiry === 'number' && item.expiry <= Date.now()) {
      if (typeof this.onEviction === 'function') {
        this.onEviction(key, item.value);
      }
      return this.delete(key);
    }
    return false;
  }
  _getOrDeleteIfExpired(key, item) {
    const deleted = this._deleteIfExpired(key, item);
    if (deleted === false) {
      return item.value;
    }
  }
  _getItemValue(key, item) {
    return item.expiry ? this._getOrDeleteIfExpired(key, item) : item.value;
  }
  _peek(key, cache) {
    const item = cache.get(key);
    return this._getItemValue(key, item);
  }
  _set(key, value) {
    this.cache.set(key, value);
    this._size++;
    if (this._size >= this.maxSize) {
      this._size = 0;
      this._emitEvictions(this.oldCache);
      this.oldCache = this.cache;
      this.cache = new Map();
    }
  }
  _moveToRecent(key, item) {
    this.oldCache.delete(key);
    this._set(key, item);
  }
  *_entriesAscending() {
    for (const item of this.oldCache) {
      const [key, value] = item;
      if (!this.cache.has(key)) {
        const deleted = this._deleteIfExpired(key, value);
        if (deleted === false) {
          yield item;
        }
      }
    }
    for (const item of this.cache) {
      const [key, value] = item;
      const deleted = this._deleteIfExpired(key, value);
      if (deleted === false) {
        yield item;
      }
    }
  }
  get(key) {
    if (this.cache.has(key)) {
      const item = this.cache.get(key);
      return this._getItemValue(key, item);
    }
    if (this.oldCache.has(key)) {
      const item = this.oldCache.get(key);
      if (this._deleteIfExpired(key, item) === false) {
        this._moveToRecent(key, item);
        return item.value;
      }
    }
  }
  set(key, value) {
    let {
      maxAge = this.maxAge
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const expiry = typeof maxAge === 'number' && maxAge !== Number.POSITIVE_INFINITY ? Date.now() + maxAge : undefined;
    if (this.cache.has(key)) {
      this.cache.set(key, {
        value,
        expiry
      });
    } else {
      this._set(key, {
        value,
        expiry
      });
    }
    return this;
  }
  has(key) {
    if (this.cache.has(key)) {
      return !this._deleteIfExpired(key, this.cache.get(key));
    }
    if (this.oldCache.has(key)) {
      return !this._deleteIfExpired(key, this.oldCache.get(key));
    }
    return false;
  }
  peek(key) {
    if (this.cache.has(key)) {
      return this._peek(key, this.cache);
    }
    if (this.oldCache.has(key)) {
      return this._peek(key, this.oldCache);
    }
  }
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this._size--;
    }
    return this.oldCache.delete(key) || deleted;
  }
  clear() {
    this.cache.clear();
    this.oldCache.clear();
    this._size = 0;
  }
  resize(newSize) {
    if (!(newSize && newSize > 0)) {
      throw new TypeError('`maxSize` must be a number greater than 0');
    }
    const items = [...this._entriesAscending()];
    const removeCount = items.length - newSize;
    if (removeCount < 0) {
      this.cache = new Map(items);
      this.oldCache = new Map();
      this._size = items.length;
    } else {
      if (removeCount > 0) {
        this._emitEvictions(items.slice(0, removeCount));
      }
      this.oldCache = new Map(items.slice(removeCount));
      this.cache = new Map();
      this._size = 0;
    }
    this.maxSize = newSize;
  }
  *keys() {
    for (const [key] of this) {
      yield key;
    }
  }
  *values() {
    for (const [, value] of this) {
      yield value;
    }
  }
  *[Symbol.iterator]() {
    for (const item of this.cache) {
      const [key, value] = item;
      const deleted = this._deleteIfExpired(key, value);
      if (deleted === false) {
        yield [key, value.value];
      }
    }
    for (const item of this.oldCache) {
      const [key, value] = item;
      if (!this.cache.has(key)) {
        const deleted = this._deleteIfExpired(key, value);
        if (deleted === false) {
          yield [key, value.value];
        }
      }
    }
  }
  *entriesDescending() {
    let items = [...this.cache];
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i];
      const [key, value] = item;
      const deleted = this._deleteIfExpired(key, value);
      if (deleted === false) {
        yield [key, value.value];
      }
    }
    items = [...this.oldCache];
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i];
      const [key, value] = item;
      if (!this.cache.has(key)) {
        const deleted = this._deleteIfExpired(key, value);
        if (deleted === false) {
          yield [key, value.value];
        }
      }
    }
  }
  *entriesAscending() {
    for (const [key, value] of this._entriesAscending()) {
      yield [key, value.value];
    }
  }
  get size() {
    if (!this._size) {
      return this.oldCache.size;
    }
    let oldCacheSize = 0;
    for (const key of this.oldCache.keys()) {
      if (!this.cache.has(key)) {
        oldCacheSize++;
      }
    }
    return Math.min(this._size + oldCacheSize, this.maxSize);
  }
  entries() {
    return this.entriesAscending();
  }
  forEach(callbackFunction) {
    let thisArgument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
    for (const [key, value] of this.entriesAscending()) {
      callbackFunction.call(thisArgument, value, key, this);
    }
  }
  get [Symbol.toStringTag]() {
    return JSON.stringify([...this.entriesAscending()]);
  }
}

/*
    Hebcal - A Jewish Calendar Generator
    Copyright (c) 1994-2020 Danny Sadinoff
    Portions copyright Eyal Schachter and Michael J. Radwin

    https://github.com/hebcal/hebcal-es6

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
/*
 * Many of the following algorithms were taken from hebrew calendar
 * routines by Maimonedes, from his Mishneh Torah, and implemented by
 *  Nachum Dershowitz                Department of Computer Science
 *  (217) 333-4219                   University of Illinois at Urbana-Champaign
 *  nachum@cs.uiuedu               1304 West Springfield Avenue
 *                                   Urbana, Illinois 61801
 *
 * The routines were included in the emacs 19 distribution.
 *
 */
const INCOMPLETE = 0;
const REGULAR = 1;
const COMPLETE = 2;
function yearType(hyear) {
    const longC = HDate.longCheshvan(hyear);
    const shortK = HDate.shortKislev(hyear);
    if (longC && !shortK) {
        return COMPLETE;
    }
    else if (!longC && shortK) {
        return INCOMPLETE;
    }
    else {
        return REGULAR;
    }
}
/**
 * Represents Parashah HaShavua for an entire Hebrew year
 */
class Sedra {
    /**
     * Caculates the Parashah HaShavua for an entire Hebrew year
     * @param hyear - Hebrew year (e.g. 5749)
     * @param il - Use Israel sedra schedule (false for Diaspora)
     */
    constructor(hyear, il) {
        hyear = +hyear;
        this.year = hyear;
        const rh0 = new HDate(1, months.TISHREI, hyear);
        const rh = rh0.abs();
        const rhDay = rh0.getDay() + 1;
        // find the first Saturday on or after Rosh Hashana
        this.firstSaturday = HDate.dayOnOrBefore(6, rh + 6);
        const leap = +HDate.isLeapYear(hyear);
        this.il = Boolean(il);
        const type = yearType(hyear);
        let key = `${leap}${rhDay}${type}`;
        if (types[key]) {
            this.theSedraArray = types[key];
        }
        else {
            key = key + +this.il; // cast to num, then concat
            this.theSedraArray = types[key];
        }
        if (!this.theSedraArray) {
            throw new Error(`improper sedra year type ${key} calculated for ${hyear}`);
        }
    }
    /**
     * Returns the parsha (or parshiyot) read on Hebrew date
     * @param hd Hebrew date or R.D. days
     */
    get(hd) {
        return this.lookup(hd).parsha;
    }
    /**
     * Looks up parsha for the date, then returns a translated or transliterated string
     * @param hd Hebrew date or R.D. days
     * @param [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale
     */
    getString(hd, locale) {
        const parsha = this.get(hd);
        const locale0 = locale || Locale.getLocaleName();
        let name = Locale.gettext(parsha[0], locale0);
        if (parsha.length === 2) {
            const hyphen = locale0 === 'he' ? '־' : '-';
            name += hyphen + Locale.gettext(parsha[1], locale0);
        }
        name = name.replace(/'/g, '’');
        return Locale.gettext('Parashat', locale0) + ' ' + name;
    }
    /**
     * Checks to see if this day would be a regular parasha HaShavua
     * Torah reading or special holiday reading
     * @param hd Hebrew date or R.D. days
     */
    isParsha(hd) {
        return !this.lookup(hd).chag;
    }
    /**
     * Returns the date that a parsha occurs
     * or `null` if the parsha doesn't occur this year
     */
    find(parsha) {
        if (typeof parsha === 'number') {
            if (parsha >= parshiot.length || (parsha < 0 && !isValidDouble(parsha))) {
                throw new RangeError(`Invalid parsha number: ${parsha}`);
            }
            const idx = this.theSedraArray.indexOf(parsha);
            if (idx === -1) {
                return null; // doesn't occur this year
            }
            return new HDate(this.firstSaturday + idx * 7);
        }
        else if (typeof parsha === 'string') {
            const num = parsha2id.get(parsha);
            if (typeof num === 'number') {
                return this.find(num);
            }
            else if (parsha.indexOf('-') !== -1) {
                return this.find(parsha.split('-'));
            }
            else {
                // try to find Saturday holiday like 'Yom Kippur'
                const idx = this.theSedraArray.indexOf(parsha);
                if (idx === -1) {
                    return null; // doesn't occur this year
                }
                return new HDate(this.firstSaturday + idx * 7);
            }
        }
        else if (Array.isArray(parsha)) {
            const plen = parsha.length;
            if ((plen !== 1 && plen !== 2) || typeof parsha[0] !== 'string') {
                throw new TypeError(`Invalid parsha argument: ${JSON.stringify(parsha)}`);
            }
            if (plen === 1) {
                return this.find(parsha[0]);
            }
            const p1 = parsha[0];
            const p2 = parsha[1];
            const num1 = parsha2id.get(p1);
            const num2 = parsha2id.get(p2);
            if (typeof num1 !== 'number' ||
                typeof num2 !== 'number' ||
                num2 !== num1 + 1 ||
                !isValidDouble(-num1)) {
                throw new RangeError(`Unrecognized parsha name: ${p1}-${p2}`);
            }
            return this.find(-num1);
        }
        return null; /* NOTREACHED */
    }
    /**
     * Returns the underlying annual sedra schedule.
     * Used by `@hebcal/triennial`
     */
    getSedraArray() {
        return this.theSedraArray;
    }
    /**
     * R.D. date of the first Saturday on or after Rosh Hashana
     */
    getFirstSaturday() {
        return this.firstSaturday;
    }
    getYear() {
        return this.year;
    }
    /**
     * Returns an object describing the parsha on the first Saturday on or after `hd`
     * @param hd Hebrew date or R.D. days
     */
    lookup(hd) {
        const abs = typeof hd === 'number' ? hd : HDate.isHDate(hd) ? hd.abs() : NaN;
        if (isNaN(abs)) {
            throw new TypeError(`Bad date argument: ${hd}`);
        }
        // find the first saturday on or after today's date
        const saturday = HDate.dayOnOrBefore(6, abs + 6);
        const weekNum = (saturday - this.firstSaturday) / 7;
        const index = this.theSedraArray[weekNum];
        if (typeof index === 'undefined') {
            const sedra = getSedra_(this.year + 1, this.il);
            return sedra.lookup(saturday); // must be next year
        }
        if (typeof index === 'string') {
            // Shabbat has a chag. Return a description
            return { parsha: [index], chag: true };
        }
        if (index >= 0) {
            return { parsha: [parshiot[index]], chag: false, num: index + 1 };
        }
        const p1 = D(index); // undouble the parsha
        return {
            parsha: [parshiot[p1], parshiot[p1 + 1]],
            chag: false,
            num: [p1 + 1, p1 + 2],
        };
    }
}
/**
 * The 54 parshiyot of the Torah as transilterated strings
 * parshiot[0] == 'Bereshit', parshiot[1] == 'Noach', parshiot[52] == "Ha'azinu".
 * @readonly
 * @type {string[]}
 */
const parshiot = [
    'Bereshit',
    'Noach',
    'Lech-Lecha',
    'Vayera',
    'Chayei Sara',
    'Toldot',
    'Vayetzei',
    'Vayishlach',
    'Vayeshev',
    'Miketz',
    'Vayigash',
    'Vayechi',
    'Shemot',
    'Vaera',
    'Bo',
    'Beshalach',
    'Yitro',
    'Mishpatim',
    'Terumah',
    'Tetzaveh',
    'Ki Tisa',
    'Vayakhel',
    'Pekudei',
    'Vayikra',
    'Tzav',
    'Shmini',
    'Tazria',
    'Metzora',
    'Achrei Mot',
    'Kedoshim',
    'Emor',
    'Behar',
    'Bechukotai',
    'Bamidbar',
    'Nasso',
    "Beha'alotcha",
    "Sh'lach",
    'Korach',
    'Chukat',
    'Balak',
    'Pinchas',
    'Matot',
    'Masei',
    'Devarim',
    'Vaetchanan',
    'Eikev',
    "Re'eh",
    'Shoftim',
    'Ki Teitzei',
    'Ki Tavo',
    'Nitzavim',
    'Vayeilech',
    "Ha'azinu",
];
const parsha2id = new Map();
for (let id = 0; id < parshiot.length; id++) {
    const name = parshiot[id];
    parsha2id.set(name, id);
}
/**
 * @private
 * @param id
 */
function isValidDouble(id) {
    switch (id) {
        case -21: // Vayakhel-Pekudei
        case -26: // Tazria-Metzora
        case -28: // Achrei Mot-Kedoshim
        case -31: // Behar-Bechukotai
        case -38: // Chukat-Balak
        case -41: // Matot-Masei
        case -50: // Nitzavim-Vayeilech
            return true;
    }
    return false;
}
/**
 * parsha doubler/undoubler
 * @private
 * @param p
 */
function D(p) {
    return -p;
}
const RH = 'Rosh Hashana'; // 0
const YK = 'Yom Kippur'; // 1
const SUKKOT = 'Sukkot'; // 0
const CHMSUKOT = 'Sukkot Shabbat Chol ha-Moed'; // 0
const SHMINI = 'Shmini Atzeret'; // 0
const PESACH = 'Pesach'; // 25
const PESACH1 = 'Pesach I';
const CHMPESACH = 'Pesach Shabbat Chol ha-Moed'; // 25
const PESACH7 = 'Pesach VII'; // 25
const PESACH8 = 'Pesach VIII';
const SHAVUOT$1 = 'Shavuot'; // 33
/**
 * Returns an array from start to end
 * @private
 * @param start beginning number, inclusive
 * @param stop ending number, inclusive
 */
function range$1(start, stop) {
    return Array.from({ length: stop - start + 1 }, (v, k) => k + start);
}
const yearStartVayeilech = [51, 52, CHMSUKOT];
const yearStartHaazinu = [52, YK, CHMSUKOT];
const yearStartRH = [RH, 52, SUKKOT, SHMINI];
const r020 = range$1(0, 20);
const r027 = range$1(0, 27);
const r3340 = range$1(33, 40);
const r4349 = range$1(43, 49);
const r4350 = range$1(43, 50);
/**
 * The ordinary year types (keviot)
 * names are leap/nonleap - day - incomplete/regular/complete - diaspora/Israel
 * @private
 * @readonly
 */
const types = {
    /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Tuesday. */
    // e.g. 5753
    '020': yearStartVayeilech.concat(r020, D(21), 23, 24, PESACH, 25, D(26), D(28), 30, D(31), r3340, D(41), r4349, D(50)),
    /* Hebrew year that starts on Monday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Thursday. */
    // e.g. 5756
    '0220': yearStartVayeilech.concat(r020, D(21), 23, 24, PESACH, 25, D(26), D(28), 30, D(31), 33, SHAVUOT$1, range$1(34, 37), D(38), 40, D(41), r4349, D(50)),
    /* Hebrew year that starts on Thursday, is `regular' (Heshvan has 29
     * days and Kislev has 30 days), and has Passover start on Saturday. */
    // e.g. 5701
    '0510': yearStartHaazinu.concat(r020, D(21), 23, 24, PESACH1, PESACH8, 25, D(26), D(28), 30, D(31), r3340, D(41), r4350),
    /* Hebrew year that starts on Thursday, is `regular' (Heshvan has 29
     * days and Kislev has 30 days), and has Passover start on Saturday. */
    // e.g. 5745
    '0511': yearStartHaazinu.concat(r020, D(21), 23, 24, PESACH, 25, D(26), D(28), range$1(30, 40), D(41), r4350),
    /* Hebrew year that starts on Thursday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Sunday. */
    // e.g. 5754
    '052': yearStartHaazinu.concat(range$1(0, 24), PESACH7, 25, D(26), D(28), 30, D(31), r3340, D(41), r4350),
    /* Hebrew year that starts on Saturday, is `incomplete' (Heshvan and Kislev
     * each have 29 days), and has Passover start on Sunday. */
    // e.g. 5761
    '070': yearStartRH.concat(r020, D(21), 23, 24, PESACH7, 25, D(26), D(28), 30, D(31), r3340, D(41), r4350),
    /* Hebrew year that starts on Saturday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Tuesday. */
    // e.g. 5716
    '072': yearStartRH.concat(r020, D(21), 23, 24, CHMPESACH, 25, D(26), D(28), 30, D(31), r3340, D(41), r4349, D(50)),
    /* --  The leap year types (keviot) -- */
    /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Thursday. */
    // e.g. 5746
    '1200': yearStartVayeilech.concat(r027, CHMPESACH, range$1(28, 33), SHAVUOT$1, range$1(34, 37), D(38), 40, D(41), r4349, D(50)),
    /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Thursday. */
    // e.g. 5746
    '1201': yearStartVayeilech.concat(r027, CHMPESACH, range$1(28, 40), D(41), r4349, D(50)),
    /* Hebrew year that starts on Monday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Saturday. */
    // e.g.5752
    '1220': yearStartVayeilech.concat(r027, PESACH1, PESACH8, range$1(28, 40), D(41), r4350),
    /* Hebrew year that starts on Monday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Saturday. */
    // e.g.5752
    '1221': yearStartVayeilech.concat(r027, PESACH, range$1(28, 50)),
    /* Hebrew year that starts on Thursday, is `incomplete' (Heshvan and
     * Kislev both have 29 days), and has Passover start on Sunday. */
    // e.g. 5768
    '150': yearStartHaazinu.concat(range$1(0, 28), PESACH7, range$1(29, 50)),
    /* Hebrew year that starts on Thursday, is `complete' (Heshvan and
     * Kislev both have 30 days), and has Passover start on Tuesday. */
    // eg. 5771
    '152': yearStartHaazinu.concat(range$1(0, 28), CHMPESACH, range$1(29, 49), D(50)),
    /* Hebrew year that starts on Saturday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Tuesday. */
    // e.g.5757
    '170': yearStartRH.concat(r027, CHMPESACH, range$1(28, 40), D(41), r4349, D(50)),
    /* Hebrew year that starts on Saturday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Thursday. */
    '1720': yearStartRH.concat(r027, CHMPESACH, range$1(28, 33), SHAVUOT$1, range$1(34, 37), D(38), 40, D(41), r4349, D(50)),
};
/* Hebrew year that starts on Monday, is `complete' (Heshvan and
 * Kislev each have 30 days), and has Passover start on Thursday. */
types['0221'] = types['020'];
/* Hebrew year that starts on Tuesday, is `regular' (Heshvan has 29
 * days and Kislev has 30 days), and has Passover start on Thursday. */
// e.g. 5715
types['0310'] = types['0220'];
/* Hebrew year that starts on Tuesday, is `regular' (Heshvan has 29
 * days and Kislev has 30 days), and has Passover start on Thursday. */
types['0311'] = types['020'];
/* Hebrew year that starts on Tuesday, is `regular' (Heshvan has 29
 * days and Kislev has 30 days), and has Passover start on Saturday. */
// e.g. 5715
types['1310'] = types['1220'];
/* Hebrew year that starts on Tuesday, is `regular' (Heshvan has 29
 * days and Kislev has 30 days), and has Passover start on Saturday. */
types['1311'] = types['1221'];
/* Hebrew year that starts on Saturday, is `complete' (Heshvan and
 * Kislev each have 30 days), and has Passover start on Thursday. */
types['1721'] = types['170'];
const sedraCache = new QuickLRU({ maxSize: 400 });
/**
 * Convenience function to create an instance of `Sedra` or reuse a previously
 * created and cached instance.
 * @private
 * @param hyear
 * @param il
 */
function getSedra_(hyear, il) {
    const cacheKey = `${hyear}-${il ? 1 : 0}`;
    let sedra = sedraCache.get(cacheKey);
    if (!sedra) {
        sedra = new Sedra(hyear, il);
        sedraCache.set(cacheKey, sedra);
    }
    return sedra;
}

/**
 * Represents one of 54 weekly Torah portions, always on a Saturday
 */
class ParshaEvent extends Event {
    /**
     * @param parsha - untranslated name of single or double parsha,
     *   such as ['Bereshit'] or ['Achrei Mot', 'Kedoshim']
     */
    constructor(date, parsha, il = false, num = -1) {
        if (!Array.isArray(parsha) || parsha.length === 0 || parsha.length > 2) {
            throw new TypeError('Bad parsha argument');
        }
        const desc = 'Parashat ' + parsha.join('-');
        super(date, desc, flags.PARSHA_HASHAVUA);
        this.parsha = parsha;
        this.il = Boolean(il);
        this.num = num || -1;
    }
    /**
     * @param [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
     */
    render(locale) {
        const locale0 = locale !== null && locale !== void 0 ? locale : Locale.getLocaleName();
        const parsha = this.parsha;
        let name = Locale.gettext(parsha[0], locale);
        if (parsha.length === 2) {
            const hyphen = locale0 === 'he' ? '־' : '-';
            name += hyphen + Locale.gettext(parsha[1], locale);
        }
        name = name.replace(/'/g, '’');
        const str = Locale.gettext('Parashat', locale) + ' ' + name;
        return str.normalize();
    }
    basename() {
        return this.parsha.join('-');
    }
    url() {
        const year = this.getDate().greg().getFullYear();
        if (year < 100) {
            return undefined;
        }
        const dt = this.urlDateSuffix();
        const url = 'https://www.hebcal.com/sedrot/' +
            this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') +
            '-' +
            dt;
        return this.il ? url + '?i=on' : url;
    }
    urlDateSuffix() {
        const isoDate = isoDateString(this.getDate().greg());
        return isoDate.replace(/-/g, '');
    }
}

const Nisan = months.NISAN;
const Iyyar = months.IYYAR;
const Sivan = months.SIVAN;
const Tamuz = months.TAMUZ;
const Av = months.AV;
const Elul = months.ELUL;
const Tishrei = months.TISHREI;
const Cheshvan = months.CHESHVAN;
const Kislev = months.KISLEV;
const Shvat = months.SHVAT;
const Adar2 = months.ADAR_II;
const CHAG$1 = flags.CHAG;
const LIGHT_CANDLES$2 = flags.LIGHT_CANDLES;
const YOM_TOV_ENDS$1 = flags.YOM_TOV_ENDS;
const CHUL_ONLY$1 = flags.CHUL_ONLY;
const IL_ONLY$2 = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS$3 = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES$2 = flags.CHANUKAH_CANDLES;
const MAJOR_FAST$2 = flags.MAJOR_FAST;
const MINOR_HOLIDAY$2 = flags.MINOR_HOLIDAY;
const EREV$2 = flags.EREV;
const CHOL_HAMOED$1 = flags.CHOL_HAMOED;
const emojiPesach = '🫓';
const emojiSukkot = '🌿🍋';
const ROSH_HASHANA_II = 'Rosh Hashana II';
const EREV_YOM_KIPPUR = 'Erev Yom Kippur';
const YOM_KIPPUR = 'Yom Kippur';
const EREV_SUKKOT = 'Erev Sukkot';
const SUKKOT_I = 'Sukkot I';
const SUKKOT_II = 'Sukkot II';
const SUKKOT_III_CHM = "Sukkot III (CH''M)";
const SUKKOT_IV_CHM = "Sukkot IV (CH''M)";
const SUKKOT_V_CHM = "Sukkot V (CH''M)";
const SUKKOT_VI_CHM = "Sukkot VI (CH''M)";
const SHMINI_ATZERET = 'Shmini Atzeret';
const SIMCHAT_TORAH = 'Simchat Torah';
const SUKKOT_II_CHM = "Sukkot II (CH''M)";
const SUKKOT_VII_HOSHANA_RABA = 'Sukkot VII (Hoshana Raba)';
const CHANUKAH_1_CANDLE = 'Chanukah: 1 Candle';
const TU_BISHVAT = 'Tu BiShvat';
const EREV_PURIM = 'Erev Purim';
const PURIM = 'Purim';
const SHUSHAN_PURIM = 'Shushan Purim';
const EREV_PESACH = 'Erev Pesach';
const PESACH_I = 'Pesach I';
const PESACH_II = 'Pesach II';
const PESACH_II_CHM = "Pesach II (CH''M)";
const PESACH_III_CHM = "Pesach III (CH''M)";
const PESACH_IV_CHM = "Pesach IV (CH''M)";
const PESACH_V_CHM = "Pesach V (CH''M)";
const PESACH_VI_CHM = "Pesach VI (CH''M)";
const PESACH_VII = 'Pesach VII';
const PESACH_VIII = 'Pesach VIII';
const PESACH_SHENI = 'Pesach Sheni';
const LAG_BAOMER = 'Lag BaOmer';
const EREV_SHAVUOT = 'Erev Shavuot';
const SHAVUOT = 'Shavuot';
const SHAVUOT_I = 'Shavuot I';
const SHAVUOT_II = 'Shavuot II';
const TU_BAV = "Tu B'Av";
const ROSH_HASHANA_LABEHEMOT = 'Rosh Hashana LaBehemot';
const EREV_ROSH_HASHANA = 'Erev Rosh Hashana';
const YOM_YERUSHALAYIM = 'Yom Yerushalayim';
const BEN_GURION_DAY = 'Ben-Gurion Day';
const FAMILY_DAY = 'Family Day';
const YITZHAK_RABIN_MEMORIAL_DAY = 'Yitzhak Rabin Memorial Day';
const HERZL_DAY = 'Herzl Day';
const JABOTINSKY_DAY = 'Jabotinsky Day';
const SIGD = 'Sigd';
const YOM_HAALIYAH = 'Yom HaAliyah';
const YOM_HAALIYAH_SCHOOL_OBSERVANCE = 'Yom HaAliyah School Observance';
const HEBREW_LANGUAGE_DAY = 'Hebrew Language Day';
/**
 * Transliterated names of holidays, used by `Event.getDesc()`
 * @readonly
 * @enum {string}
 */
const holidayDesc = {
    /** Asara B'Tevet */
    ASARA_BTEVET: "Asara B'Tevet",
    /** Birkat Hachamah */
    BIRKAT_HACHAMAH: 'Birkat Hachamah',
    /** Chag HaBanot */
    CHAG_HABANOT: 'Chag HaBanot',
    /** Chanukah: 8th Day */
    CHANUKAH_8TH_DAY: 'Chanukah: 8th Day',
    /** Erev Tish'a B'Av */
    EREV_TISHA_BAV: "Erev Tish'a B'Av",
    /** Leil Selichot */
    LEIL_SELICHOT: 'Leil Selichot',
    /** Purim Katan */
    PURIM_KATAN: 'Purim Katan',
    /** Purim Meshulash */
    PURIM_MESHULASH: 'Purim Meshulash',
    /** Shabbat Chazon */
    SHABBAT_CHAZON: 'Shabbat Chazon',
    /** Shabbat HaChodesh */
    SHABBAT_HACHODESH: 'Shabbat HaChodesh',
    /** Shabbat HaGadol */
    SHABBAT_HAGADOL: 'Shabbat HaGadol',
    /** Shabbat Nachamu */
    SHABBAT_NACHAMU: 'Shabbat Nachamu',
    /** Shabbat Parah */
    SHABBAT_PARAH: 'Shabbat Parah',
    /** Shabbat Shekalim */
    SHABBAT_SHEKALIM: 'Shabbat Shekalim',
    /** Shabbat Shirah */
    SHABBAT_SHIRAH: 'Shabbat Shirah',
    /** Shabbat Shuva */
    SHABBAT_SHUVA: 'Shabbat Shuva',
    /** Shabbat Zachor */
    SHABBAT_ZACHOR: 'Shabbat Zachor',
    /** Shushan Purim Katan */
    SHUSHAN_PURIM_KATAN: 'Shushan Purim Katan',
    /** Ta'anit Bechorot */
    TAANIT_BECHOROT: "Ta'anit Bechorot",
    /** Ta'anit Esther */
    TAANIT_ESTHER: "Ta'anit Esther",
    /** Tish'a B'Av */
    TISHA_BAV: "Tish'a B'Av",
    /** Tzom Gedaliah */
    TZOM_GEDALIAH: 'Tzom Gedaliah',
    /** Tzom Tammuz */
    TZOM_TAMMUZ: 'Tzom Tammuz',
    /** Yom HaAtzma'ut */
    YOM_HAATZMA_UT: "Yom HaAtzma'ut",
    /** Yom HaShoah */
    YOM_HASHOAH: 'Yom HaShoah',
    /** Yom HaZikaron */
    YOM_HAZIKARON: 'Yom HaZikaron',
    /** Ben-Gurion Day */
    BEN_GURION_DAY,
    /** Chanukah: 1 Candle */
    CHANUKAH_1_CANDLE,
    /** Erev Pesach */
    EREV_PESACH,
    /** Erev Purim */
    EREV_PURIM,
    /** Erev Rosh Hashana */
    EREV_ROSH_HASHANA,
    /** Erev Shavuot */
    EREV_SHAVUOT,
    /** Erev Sukkot */
    EREV_SUKKOT,
    /** Erev Yom Kippur */
    EREV_YOM_KIPPUR,
    /** Family Day */
    FAMILY_DAY,
    /** Hebrew Language Day */
    HEBREW_LANGUAGE_DAY,
    /** Herzl Day */
    HERZL_DAY,
    /** Jabotinsky Day */
    JABOTINSKY_DAY,
    /** Lag BaOmer */
    LAG_BAOMER,
    /** Pesach I */
    PESACH_I,
    /** Pesach II */
    PESACH_II,
    /** Pesach III (CH''M) */
    PESACH_III_CHM,
    /** Pesach II (CH''M) */
    PESACH_II_CHM,
    /** Pesach IV (CH''M) */
    PESACH_IV_CHM,
    /** Pesach Sheni */
    PESACH_SHENI,
    /** Pesach VII */
    PESACH_VII,
    /** Pesach VIII */
    PESACH_VIII,
    /** Pesach VI (CH''M) */
    PESACH_VI_CHM,
    /** Pesach V (CH''M) */
    PESACH_V_CHM,
    /** Purim */
    PURIM,
    /** Rosh Hashana II */
    ROSH_HASHANA_II,
    /** Rosh Hashana LaBehemot */
    ROSH_HASHANA_LABEHEMOT,
    /** Shavuot */
    SHAVUOT,
    /** Shavuot I */
    SHAVUOT_I,
    /** Shavuot II */
    SHAVUOT_II,
    /** Shmini Atzeret */
    SHMINI_ATZERET,
    /** Shushan Purim */
    SHUSHAN_PURIM,
    /** Sigd */
    SIGD,
    /** Simchat Torah */
    SIMCHAT_TORAH,
    /** Sukkot I */
    SUKKOT_I,
    /** Sukkot II */
    SUKKOT_II,
    /** Sukkot III (CH''M) */
    SUKKOT_III_CHM,
    /** Sukkot II (CH''M) */
    SUKKOT_II_CHM,
    /** Sukkot IV (CH''M) */
    SUKKOT_IV_CHM,
    /** Sukkot VII (Hoshana Raba) */
    SUKKOT_VII_HOSHANA_RABA,
    /** Sukkot VI (CH''M) */
    SUKKOT_VI_CHM,
    /** Sukkot V (CH''M) */
    SUKKOT_V_CHM,
    /** Tu B\'Av */
    TU_BAV,
    /** Tu BiShvat */
    TU_BISHVAT,
    /** Yitzhak Rabin Memorial Day */
    YITZHAK_RABIN_MEMORIAL_DAY,
    /** Yom HaAliyah */
    YOM_HAALIYAH,
    /** Yom HaAliyah School Observance */
    YOM_HAALIYAH_SCHOOL_OBSERVANCE,
    /** Yom Kippur */
    YOM_KIPPUR,
    /** Yom Yerushalayim */
    YOM_YERUSHALAYIM,
};
const staticHolidays = [
    {
        mm: Tishrei,
        dd: 2,
        desc: ROSH_HASHANA_II,
        flags: CHAG$1 | YOM_TOV_ENDS$1,
        emoji: '🍏🍯',
    },
    { mm: Tishrei, dd: 9, desc: EREV_YOM_KIPPUR, flags: EREV$2 | LIGHT_CANDLES$2 },
    {
        mm: Tishrei,
        dd: 10,
        desc: YOM_KIPPUR,
        flags: CHAG$1 | MAJOR_FAST$2 | YOM_TOV_ENDS$1,
    },
    {
        mm: Tishrei,
        dd: 14,
        desc: EREV_SUKKOT,
        flags: CHUL_ONLY$1 | EREV$2 | LIGHT_CANDLES$2,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 15,
        desc: SUKKOT_I,
        flags: CHUL_ONLY$1 | CHAG$1 | LIGHT_CANDLES_TZEIS$3,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 16,
        desc: SUKKOT_II,
        flags: CHUL_ONLY$1 | CHAG$1 | YOM_TOV_ENDS$1,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 17,
        desc: SUKKOT_III_CHM,
        flags: CHUL_ONLY$1 | CHOL_HAMOED$1,
        chmDay: 1,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 18,
        desc: SUKKOT_IV_CHM,
        flags: CHUL_ONLY$1 | CHOL_HAMOED$1,
        chmDay: 2,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 19,
        desc: SUKKOT_V_CHM,
        flags: CHUL_ONLY$1 | CHOL_HAMOED$1,
        chmDay: 3,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 20,
        desc: SUKKOT_VI_CHM,
        flags: CHUL_ONLY$1 | CHOL_HAMOED$1,
        chmDay: 4,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 22,
        desc: SHMINI_ATZERET,
        flags: CHUL_ONLY$1 | CHAG$1 | LIGHT_CANDLES_TZEIS$3,
    },
    {
        mm: Tishrei,
        dd: 23,
        desc: SIMCHAT_TORAH,
        flags: CHUL_ONLY$1 | CHAG$1 | YOM_TOV_ENDS$1,
    },
    {
        mm: Tishrei,
        dd: 14,
        desc: EREV_SUKKOT,
        flags: IL_ONLY$2 | EREV$2 | LIGHT_CANDLES$2,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 15,
        desc: SUKKOT_I,
        flags: IL_ONLY$2 | CHAG$1 | YOM_TOV_ENDS$1,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 16,
        desc: SUKKOT_II_CHM,
        flags: IL_ONLY$2 | CHOL_HAMOED$1,
        chmDay: 1,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 17,
        desc: SUKKOT_III_CHM,
        flags: IL_ONLY$2 | CHOL_HAMOED$1,
        chmDay: 2,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 18,
        desc: SUKKOT_IV_CHM,
        flags: IL_ONLY$2 | CHOL_HAMOED$1,
        chmDay: 3,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 19,
        desc: SUKKOT_V_CHM,
        flags: IL_ONLY$2 | CHOL_HAMOED$1,
        chmDay: 4,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 20,
        desc: SUKKOT_VI_CHM,
        flags: IL_ONLY$2 | CHOL_HAMOED$1,
        chmDay: 5,
        emoji: emojiSukkot,
    },
    {
        mm: Tishrei,
        dd: 22,
        desc: SHMINI_ATZERET,
        flags: IL_ONLY$2 | CHAG$1 | YOM_TOV_ENDS$1,
    },
    {
        mm: Tishrei,
        dd: 21,
        desc: SUKKOT_VII_HOSHANA_RABA,
        flags: LIGHT_CANDLES$2 | CHOL_HAMOED$1,
        chmDay: -1,
        emoji: emojiSukkot,
    },
    {
        mm: Kislev,
        dd: 24,
        desc: CHANUKAH_1_CANDLE,
        flags: EREV$2 | MINOR_HOLIDAY$2 | CHANUKAH_CANDLES$2,
        emoji: '🕎1️⃣',
    },
    { mm: Shvat, dd: 15, desc: TU_BISHVAT, flags: MINOR_HOLIDAY$2, emoji: '🌳' },
    {
        mm: Adar2,
        dd: 13,
        desc: EREV_PURIM,
        flags: EREV$2 | MINOR_HOLIDAY$2,
        emoji: '🎭️📜',
    },
    { mm: Adar2, dd: 14, desc: PURIM, flags: MINOR_HOLIDAY$2, emoji: '🎭️📜' },
    {
        mm: Adar2,
        dd: 15,
        desc: SHUSHAN_PURIM,
        flags: MINOR_HOLIDAY$2,
        emoji: '🎭️📜',
    },
    // Pesach Israel
    {
        mm: Nisan,
        dd: 14,
        desc: EREV_PESACH,
        flags: IL_ONLY$2 | EREV$2 | LIGHT_CANDLES$2,
        emoji: '🫓🍷',
    },
    {
        mm: Nisan,
        dd: 15,
        desc: PESACH_I,
        flags: IL_ONLY$2 | CHAG$1 | YOM_TOV_ENDS$1,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 16,
        desc: PESACH_II_CHM,
        flags: IL_ONLY$2 | CHOL_HAMOED$1,
        chmDay: 1,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 17,
        desc: PESACH_III_CHM,
        flags: IL_ONLY$2 | CHOL_HAMOED$1,
        chmDay: 2,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 18,
        desc: PESACH_IV_CHM,
        flags: IL_ONLY$2 | CHOL_HAMOED$1,
        chmDay: 3,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 19,
        desc: PESACH_V_CHM,
        flags: IL_ONLY$2 | CHOL_HAMOED$1,
        chmDay: 4,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 20,
        desc: PESACH_VI_CHM,
        flags: IL_ONLY$2 | CHOL_HAMOED$1 | LIGHT_CANDLES$2,
        chmDay: 5,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 21,
        desc: PESACH_VII,
        flags: IL_ONLY$2 | CHAG$1 | YOM_TOV_ENDS$1,
        emoji: emojiPesach,
    },
    // Pesach chutz l'aretz
    {
        mm: Nisan,
        dd: 14,
        desc: EREV_PESACH,
        flags: CHUL_ONLY$1 | EREV$2 | LIGHT_CANDLES$2,
        emoji: '🫓🍷',
    },
    {
        mm: Nisan,
        dd: 15,
        desc: PESACH_I,
        flags: CHUL_ONLY$1 | CHAG$1 | LIGHT_CANDLES_TZEIS$3,
        emoji: '🫓🍷',
    },
    {
        mm: Nisan,
        dd: 16,
        desc: PESACH_II,
        flags: CHUL_ONLY$1 | CHAG$1 | YOM_TOV_ENDS$1,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 17,
        desc: PESACH_III_CHM,
        flags: CHUL_ONLY$1 | CHOL_HAMOED$1,
        chmDay: 1,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 18,
        desc: PESACH_IV_CHM,
        flags: CHUL_ONLY$1 | CHOL_HAMOED$1,
        chmDay: 2,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 19,
        desc: PESACH_V_CHM,
        flags: CHUL_ONLY$1 | CHOL_HAMOED$1,
        chmDay: 3,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 20,
        desc: PESACH_VI_CHM,
        flags: CHUL_ONLY$1 | CHOL_HAMOED$1 | LIGHT_CANDLES$2,
        chmDay: 4,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 21,
        desc: PESACH_VII,
        flags: CHUL_ONLY$1 | CHAG$1 | LIGHT_CANDLES_TZEIS$3,
        emoji: emojiPesach,
    },
    {
        mm: Nisan,
        dd: 22,
        desc: PESACH_VIII,
        flags: CHUL_ONLY$1 | CHAG$1 | YOM_TOV_ENDS$1,
        emoji: emojiPesach,
    },
    { mm: Iyyar, dd: 14, desc: PESACH_SHENI, flags: MINOR_HOLIDAY$2 },
    { mm: Iyyar, dd: 18, desc: LAG_BAOMER, flags: MINOR_HOLIDAY$2, emoji: '🔥' },
    {
        mm: Sivan,
        dd: 5,
        desc: EREV_SHAVUOT,
        flags: EREV$2 | LIGHT_CANDLES$2,
        emoji: '⛰️🌸',
    },
    {
        mm: Sivan,
        dd: 6,
        desc: SHAVUOT,
        flags: IL_ONLY$2 | CHAG$1 | YOM_TOV_ENDS$1,
        emoji: '⛰️🌸',
    },
    {
        mm: Sivan,
        dd: 6,
        desc: SHAVUOT_I,
        flags: CHUL_ONLY$1 | CHAG$1 | LIGHT_CANDLES_TZEIS$3,
        emoji: '⛰️🌸',
    },
    {
        mm: Sivan,
        dd: 7,
        desc: SHAVUOT_II,
        flags: CHUL_ONLY$1 | CHAG$1 | YOM_TOV_ENDS$1,
        emoji: '⛰️🌸',
    },
    { mm: Av, dd: 15, desc: TU_BAV, flags: MINOR_HOLIDAY$2, emoji: '❤️' },
    {
        mm: Elul,
        dd: 1,
        desc: ROSH_HASHANA_LABEHEMOT,
        flags: MINOR_HOLIDAY$2,
        emoji: '🐑',
    },
    {
        mm: Elul,
        dd: 29,
        desc: EREV_ROSH_HASHANA,
        flags: EREV$2 | LIGHT_CANDLES$2,
        emoji: '🍏🍯',
    },
];
const staticModernHolidays = [
    { firstYear: 5727, mm: Iyyar, dd: 28, desc: YOM_YERUSHALAYIM, chul: true },
    {
        firstYear: 5737,
        mm: Kislev,
        dd: 6,
        desc: BEN_GURION_DAY,
        satPostponeToSun: true,
        friPostponeToSun: true,
    },
    { firstYear: 5750, mm: Shvat, dd: 30, desc: FAMILY_DAY },
    {
        firstYear: 5758,
        mm: Cheshvan,
        dd: 12,
        desc: YITZHAK_RABIN_MEMORIAL_DAY,
        friSatMovetoThu: true,
    },
    { firstYear: 5764, mm: Iyyar, dd: 10, desc: HERZL_DAY, satPostponeToSun: true },
    {
        firstYear: 5765,
        mm: Tamuz,
        dd: 29,
        desc: JABOTINSKY_DAY,
        satPostponeToSun: true,
    },
    {
        firstYear: 5769,
        mm: Cheshvan,
        dd: 29,
        desc: SIGD,
        chul: true,
        suppressEmoji: true,
    },
    { firstYear: 5777, mm: Nisan, dd: 10, desc: YOM_HAALIYAH, chul: true },
    { firstYear: 5777, mm: Cheshvan, dd: 7, desc: YOM_HAALIYAH_SCHOOL_OBSERVANCE },
    // https://www.gov.il/he/departments/policies/2012_des5234
    {
        firstYear: 5773,
        mm: months.TEVET,
        dd: 21,
        desc: HEBREW_LANGUAGE_DAY,
        friSatMovetoThu: true,
    },
];

/** Represents a built-in holiday like Pesach, Purim or Tu BiShvat */
class HolidayEvent extends Event {
    basename() {
        return this.getDesc()
            .replace(/ \d{4}$/, '')
            .replace(/ \(CH''M\)$/, '')
            .replace(/ \(observed\)$/, '')
            .replace(/ \(Hoshana Raba\)$/, '')
            .replace(/ [IV]+$/, '')
            .replace(/: \d Candles?$/, '')
            .replace(/: 8th Day$/, '')
            .replace(/^Erev /, '');
    }
    url() {
        const year = this.getDate().greg().getFullYear();
        if (year < 100) {
            return undefined;
        }
        const url = 'https://www.hebcal.com/holidays/' +
            this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') +
            '-' +
            this.urlDateSuffix();
        return this.getFlags() & flags.IL_ONLY ? url + '?i=on' : url;
    }
    urlDateSuffix() {
        const year = this.getDate().greg().getFullYear();
        return String(year);
    }
    getEmoji() {
        if (this.emoji) {
            return this.emoji;
        }
        else if (this.getFlags() & flags.SPECIAL_SHABBAT) {
            return '🕍';
        }
        else {
            return '✡️';
        }
    }
    getCategories() {
        if (this.cholHaMoedDay) {
            return ['holiday', 'major', 'cholhamoed'];
        }
        const cats = super.getCategories();
        if (cats[0] !== 'unknown') {
            return cats;
        }
        // Don't depend on flags.MINOR_HOLIDAY always being set. Look for minor holidays.
        const desc = this.getDesc();
        switch (desc) {
            case holidayDesc.LAG_BAOMER:
            case holidayDesc.LEIL_SELICHOT:
            case holidayDesc.PESACH_SHENI:
            case holidayDesc.EREV_PURIM:
            case holidayDesc.PURIM_KATAN:
            case holidayDesc.SHUSHAN_PURIM:
            case holidayDesc.TU_BAV:
            case holidayDesc.TU_BISHVAT:
            case holidayDesc.ROSH_HASHANA_LABEHEMOT:
                return ['holiday', 'minor'];
        }
        return ['holiday', 'major'];
    }
    /**
     * Returns (translated) description of this event
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale) {
        const str = super.render(locale);
        return str.replace(/'/g, '’');
    }
    /**
     * Returns a brief (translated) description of this event.
     * For most events, this is the same as render(). For some events, it procudes
     * a shorter text (e.g. without a time or added description).
     * @param [locale] Optional locale name (defaults to active locale).
     */
    renderBrief(locale) {
        const str = super.renderBrief(locale);
        return str.replace(/'/g, '’');
    }
    /**
     * Makes a clone of this Event object
     */
    clone() {
        const ev = new HolidayEvent(this.date, this.desc, this.mask);
        for (const property in this) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.hasOwnProperty(property)) {
                Object.defineProperty(ev, property, { value: this[property] });
            }
        }
        return ev;
    }
}
/**
 * Because Asara B'Tevet often occurs twice in the same Gregorian year,
 * we subclass HolidayEvent to override the `url()` method.
 */
class AsaraBTevetEvent extends HolidayEvent {
    urlDateSuffix() {
        const isoDate = isoDateString(this.getDate().greg());
        return isoDate.replace(/-/g, '');
    }
}
/** Represents Rosh Hashana, the Jewish New Year */
class RoshHashanaEvent extends HolidayEvent {
    /**
     * @private
     * @param date Hebrew date event occurs
     * @param hyear Hebrew year
     * @param mask optional holiday flags
     */
    constructor(date, hyear, mask) {
        super(date, `Rosh Hashana ${hyear}`, mask);
        this.hyear = hyear;
    }
    /**
     * Returns (translated) description of this event
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale) {
        return Locale.gettext('Rosh Hashana', locale) + ' ' + this.hyear;
    }
    getEmoji() {
        return '🍏🍯';
    }
}
const roshChodeshStr = 'Rosh Chodesh';
/** Represents Rosh Chodesh, the beginning of a new month */
class RoshChodeshEvent extends HolidayEvent {
    /**
     * Constructs Rosh Chodesh event
     * @param date Hebrew date event occurs
     * @param monthName Hebrew month name (not translated)
     */
    constructor(date, monthName) {
        super(date, `${roshChodeshStr} ${monthName}`, flags.ROSH_CHODESH);
    }
    /**
     * Returns (translated) description of this event
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale) {
        const monthName = this.getDesc().substring(roshChodeshStr.length + 1);
        const monthName0 = Locale.gettext(monthName, locale);
        const monthName1 = monthName0.replace(/'/g, '’');
        return Locale.gettext(roshChodeshStr, locale) + ' ' + monthName1;
    }
    basename() {
        return this.getDesc();
    }
    getEmoji() {
        return this.emoji || '🌒';
    }
}

const mevarchimChodeshStr = 'Shabbat Mevarchim Chodesh';
/** Represents Mevarchim haChodesh, the announcement of the new month */
class MevarchimChodeshEvent extends Event {
    /**
     * Constructs Mevarchim haChodesh event
     * @param date Hebrew date event occurs
     * @param monthName Hebrew month name (not translated)
     * @param [memo]
     */
    constructor(date, monthName, memo) {
        super(date, `${mevarchimChodeshStr} ${monthName}`, flags.SHABBAT_MEVARCHIM);
        this.monthName = monthName;
        if (memo) {
            this.memo = memo;
        }
        else {
            const hyear = date.getFullYear();
            const hmonth = date.getMonth();
            const monNext = hmonth === HDate.monthsInYear(hyear) ? months.NISAN : hmonth + 1;
            const molad = new Molad(hyear, monNext);
            this.memo = molad.render('en', { hour12: false });
        }
    }
    basename() {
        return this.getDesc();
    }
    /**
     * Returns (translated) description of this event
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale) {
        const monthName0 = Locale.gettext(this.monthName, locale);
        const monthName = monthName0.replace(/'/g, '’');
        return Locale.gettext(mevarchimChodeshStr, locale) + ' ' + monthName;
    }
    /**
     * Returns (translated) description of this event
     * @param [locale] Optional locale name (defaults to active locale).
     */
    renderBrief(locale) {
        const str = this.render(locale);
        const space = str.indexOf(' ');
        return str.substring(space + 1);
    }
}

/** @private */
const cals = new Map();
/**
 * Plug-ins for daily learning calendars such as Daf Yomi, Mishna Yomi, Nach Yomi, etc.
 *
 * Learning schedules are provided by the `@hebcal/learning` package.
 */
class DailyLearning {
    /**
     * Register a new learning calendar.
     */
    static addCalendar(name, calendar) {
        if (typeof calendar !== 'function') {
            throw new TypeError(`Invalid calendar function: ${calendar}`);
        }
        cals.set(name, calendar);
    }
    /**
     * Returns an event from daily calendar for a given date. Returns `null` if there
     * is no learning from this calendar on this date.
     * @param name
     * @param hd
     * @param il
     */
    static lookup(name, hd, il) {
        const fn = cals.get(name);
        if (typeof fn === 'function') {
            return fn(hd, il);
        }
        return null;
    }
}

/* eslint-disable max-len */
const LIGHT_CANDLES$1 = flags.LIGHT_CANDLES;
const LIGHT_CANDLES_TZEIS$2 = flags.LIGHT_CANDLES_TZEIS;
/**
 * @private
 */
function makeCandleEvent(ev, hd, options, isFriday, isSaturday) {
    let havdalahTitle = false;
    let useHavdalahOffset = isSaturday;
    let mask = ev ? ev.getFlags() : LIGHT_CANDLES$1;
    if (typeof ev !== 'undefined') {
        // if linked event && dow == FRI, use Candle lighting time & title
        if (!isFriday) {
            if (mask & (LIGHT_CANDLES_TZEIS$2 | flags.CHANUKAH_CANDLES)) {
                useHavdalahOffset = true;
            }
            else if (mask & flags.YOM_TOV_ENDS) {
                havdalahTitle = true;
                useHavdalahOffset = true;
            }
        }
    }
    else if (isSaturday) {
        havdalahTitle = true;
        mask = LIGHT_CANDLES_TZEIS$2;
    }
    // if offset is 0 or undefined, we'll use tzeit time
    const offset = useHavdalahOffset
        ? options.havdalahMins
        : options.candleLightingMins;
    const location = options.location;
    const useElevation = Boolean(options.useElevation);
    const zmanim = new Zmanim(location, hd, useElevation);
    const time = offset
        ? zmanim.sunsetOffset(offset, true)
        : zmanim.tzeit(options.havdalahDeg);
    if (isNaN(time.getTime())) {
        return undefined; // no sunset
    }
    if (havdalahTitle) {
        return new HavdalahEvent(hd, mask, time, location, options.havdalahMins, ev, options);
    }
    else {
        mask |= LIGHT_CANDLES$1;
        return new CandleLightingEvent(hd, mask, time, location, ev, options);
    }
}
const FAST_BEGINS = 'Fast begins';
const FAST_ENDS = 'Fast ends';
/**
 * Makes a pair of events representing fast start and end times
 * @private
 */
function makeFastStartEnd(ev, options) {
    const desc = ev.getDesc();
    if (desc === 'Yom Kippur') {
        return ev;
    }
    ev = ev.clone();
    const hd = ev.getDate();
    const dt = hd.greg();
    const location = options.location;
    const fastEndDeg = options.fastEndDeg;
    const useElevation = Boolean(options.useElevation);
    const zmanim = new Zmanim(location, dt, useElevation);
    if (desc === "Erev Tish'a B'Av") {
        const sunset = zmanim.sunset();
        if (!isNaN(sunset.getTime())) {
            ev.startEvent = makeTimedEvent(ev, sunset, FAST_BEGINS, options);
        }
    }
    else if (desc.startsWith("Tish'a B'Av")) {
        const tzeit = zmanim.tzeit(fastEndDeg);
        if (!isNaN(tzeit.getTime())) {
            ev.endEvent = makeTimedEvent(ev, tzeit, FAST_ENDS, options);
        }
    }
    else {
        const dawn = zmanim.alotHaShachar();
        if (!isNaN(dawn.getTime())) {
            ev.startEvent = makeTimedEvent(ev, dawn, FAST_BEGINS, options);
        }
        if (dt.getDay() !== 5 &&
            !(hd.getDate() === 14 && hd.getMonth() === months.NISAN)) {
            const tzeit = zmanim.tzeit(fastEndDeg);
            if (!isNaN(tzeit.getTime())) {
                ev.endEvent = makeTimedEvent(ev, tzeit, FAST_ENDS, options);
            }
        }
    }
    return ev;
}
/**
 * @private
 */
function makeTimedEvent(ev, time, desc, options) {
    const location = options.location;
    const hd = ev.getDate();
    return new TimedEvent(hd, desc, ev.getFlags(), time, location, ev, options);
}
class TimedChanukahEvent extends HolidayEvent {
    constructor(date, desc, mask, eventTime, location) {
        super(date, desc, mask);
        this.eventTime = Zmanim.roundTime(eventTime);
        const timeFormat = location.getTimeFormatter();
        this.eventTimeStr = Zmanim.formatTime(this.eventTime, timeFormat);
        this.location = location;
    }
}
/**
 * Makes a candle-lighting event for Chankah (not on Friday/Saturday).
 * At one point this used civil dusk (6 degrees below horizon).
 * Another source suggests 4.6667 degrees below horizon.
 * @private
 */
function makeWeekdayChanukahCandleLighting(ev, hd, options) {
    const location = options.location;
    const useElevation = Boolean(options.useElevation);
    const zmanim = new Zmanim(location, hd.greg(), useElevation);
    const candleLightingTime = zmanim.beinHaShmashos();
    if (isNaN(candleLightingTime.getTime())) {
        return null;
    }
    const ev2 = new TimedChanukahEvent(hd, ev.getDesc(), ev.getFlags(), candleLightingTime, location);
    ev2.emoji = ev.emoji;
    ev2.chanukahDay = ev.chanukahDay;
    return ev2;
}

const NONE$1 = 0;
const HALF = 1;
const WHOLE = 2;
/**
 * @private
 */
function hallel_(events, hdate) {
    const whole = events
        .filter(ev => {
        const desc = ev.getDesc();
        const hd = ev.getDate();
        const month = hd.getMonth();
        const mday = hd.getDate();
        return (desc.startsWith('Chanukah') ||
            desc.startsWith('Shavuot') ||
            desc.startsWith('Sukkot') ||
            (month === months.NISAN &&
                (mday === 15 || mday === 16) &&
                ev.getFlags() & flags.CHAG) || // Pesach
            desc === "Yom HaAtzma'ut" ||
            desc === 'Yom Yerushalayim');
    })
        .map(ev => {
        return ev.getDate().abs();
    });
    const abs = hdate.abs();
    if (whole.includes(abs)) {
        return WHOLE;
    }
    const half = events
        .filter(ev => {
        const desc = ev.getDesc();
        return (ev.getFlags() & flags.ROSH_CHODESH ||
            (desc.startsWith('Pesach') &&
                desc !== 'Pesach I' &&
                desc !== 'Pesach II'));
    })
        .map(ev => {
        return ev.getDate().abs();
    });
    if (half.includes(abs)) {
        return HALF;
    }
    return NONE$1;
}

const SUN$1 = 0;
const TUE$1 = 2;
const FRI$2 = 5;
const SAT$2 = 6;
const NISAN$2 = months.NISAN;
const IYYAR = months.IYYAR;
/**
 * Yom HaShoah first observed in 1951.
 * When the actual date of Yom Hashoah falls on a Friday, the
 * state of Israel observes Yom Hashoah on the preceding
 * Thursday. When it falls on a Sunday, Yom Hashoah is observed
 * on the following Monday.
 * http://www.ushmm.org/remembrance/dor/calendar/
 * @private
 * @param year
 */
function dateYomHaShoah(year) {
    if (year < 5711) {
        return null;
    }
    let nisan27dt = new HDate(27, NISAN$2, year);
    if (nisan27dt.getDay() === FRI$2) {
        nisan27dt = new HDate(26, NISAN$2, year);
    }
    else if (nisan27dt.getDay() === SUN$1) {
        nisan27dt = new HDate(28, NISAN$2, year);
    }
    return nisan27dt;
}
/**
 * Yom HaAtzma'ut only celebrated after 1948
 * @private
 * @param year
 */
function dateYomHaZikaron(year) {
    if (year < 5708) {
        return null;
    }
    let day;
    const pesach = new HDate(15, NISAN$2, year);
    const pdow = pesach.getDay();
    if (pdow === SUN$1) {
        day = 2;
    }
    else if (pdow === SAT$2) {
        day = 3;
    }
    else if (year < 5764) {
        day = 4;
    }
    else if (pdow === TUE$1) {
        day = 5;
    }
    else {
        day = 4;
    }
    return new HDate(day, IYYAR, year);
}

const ykk = 'Yom Kippur Katan';
/** YKK is minor day of atonement on the day preceeding each Rosh Chodesh */
class YomKippurKatanEvent extends HolidayEvent {
    /**
     * @private
     * @param date Hebrew date event occurs
     * @param nextMonthName name of the upcoming month
     */
    constructor(date, nextMonthName) {
        super(date, `${ykk} ${nextMonthName}`, flags.MINOR_FAST | flags.YOM_KIPPUR_KATAN);
        this.nextMonthName = nextMonthName;
        this.memo = `Minor Day of Atonement on the day preceeding Rosh Chodesh ${nextMonthName}`;
    }
    basename() {
        return this.getDesc();
    }
    /**
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale) {
        const monthName0 = Locale.gettext(this.nextMonthName, locale);
        const monthName = monthName0.replace(/'/g, '’');
        return Locale.gettext(ykk, locale) + ' ' + monthName;
    }
    /**
     * @param [locale] Optional locale name (defaults to active locale).
     */
    renderBrief(locale) {
        return Locale.gettext(ykk, locale);
    }
    url() {
        return undefined;
    }
}

/*
    Hebcal - A Jewish Calendar Generator
    Copyright (c) 1994-2020 Danny Sadinoff
    Portions copyright Eyal Schachter and Michael J. Radwin

    https://github.com/hebcal/hebcal-es6

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const CHAG = flags.CHAG;
const IL_ONLY$1 = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS$1 = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES$1 = flags.CHANUKAH_CANDLES;
const MINOR_FAST$1 = flags.MINOR_FAST;
const SPECIAL_SHABBAT$1 = flags.SPECIAL_SHABBAT;
const MODERN_HOLIDAY$1 = flags.MODERN_HOLIDAY;
const MAJOR_FAST$1 = flags.MAJOR_FAST;
const MINOR_HOLIDAY$1 = flags.MINOR_HOLIDAY;
const EREV$1 = flags.EREV;
const SUN = 0;
const TUE = 2;
const THU = 4;
const FRI$1 = 5;
const SAT$1 = 6;
const NISAN$1 = months.NISAN;
const TAMUZ = months.TAMUZ;
const AV = months.AV;
const TISHREI$2 = months.TISHREI;
const KISLEV = months.KISLEV;
const TEVET = months.TEVET;
const ADAR_I = months.ADAR_I;
const ADAR_II = months.ADAR_II;
const emojiIsraelFlag = { emoji: '🇮🇱' };
const chanukahEmoji = '🕎';
const yearCache = new QuickLRU({ maxSize: 400 });
const KEYCAP_DIGITS = [
    '0️⃣',
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
];
/**
 * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
 * `HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
 * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme.
 * @private
 */
function getHolidaysForYear_(year) {
    if (typeof year !== 'number') {
        throw new TypeError(`bad Hebrew year: ${year}`);
    }
    else if (year < 1 || year > 32658) {
        throw new RangeError(`Hebrew year ${year} out of range 1-32658`);
    }
    const cached = yearCache.get(year);
    if (cached) {
        return cached;
    }
    const RH = new HDate(1, TISHREI$2, year);
    const pesach = new HDate(15, NISAN$1, year);
    const map = new Map();
    function add(...events) {
        for (const ev of events) {
            const key = ev.date.toString();
            const arr = map.get(key);
            if (typeof arr === 'object') {
                if (arr[0].getFlags() & EREV$1) {
                    arr.unshift(ev);
                }
                else {
                    arr.push(ev);
                }
            }
            else {
                map.set(key, [ev]);
            }
        }
    }
    for (const h of staticHolidays) {
        const hd = new HDate(h.dd, h.mm, year);
        const ev = new HolidayEvent(hd, h.desc, h.flags);
        if (h.emoji)
            ev.emoji = h.emoji;
        if (h.chmDay)
            ev.cholHaMoedDay = h.chmDay;
        add(ev);
    }
    // standard holidays that don't shift based on year
    add(new RoshHashanaEvent(RH, year, CHAG | LIGHT_CANDLES_TZEIS$1));
    // Variable date holidays
    const tzomGedaliahDay = RH.getDay() === THU ? 4 : 3;
    add(new HolidayEvent(new HDate(tzomGedaliahDay, TISHREI$2, year), holidayDesc.TZOM_GEDALIAH, MINOR_FAST$1));
    // first SAT after RH
    add(new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT$1, 7 + RH.abs())), holidayDesc.SHABBAT_SHUVA, SPECIAL_SHABBAT$1));
    const rchTevet = HDate.shortKislev(year)
        ? new HDate(1, TEVET, year)
        : new HDate(30, KISLEV, year);
    add(new HolidayEvent(rchTevet, holidayDesc.CHAG_HABANOT, MINOR_HOLIDAY$1));
    // yes, we know Kislev 30-32 are wrong
    // HDate() corrects the month automatically
    for (let candles = 2; candles <= 8; candles++) {
        const hd = new HDate(23 + candles, KISLEV, year);
        add(new HolidayEvent(hd, `Chanukah: ${candles} Candles`, MINOR_HOLIDAY$1 | CHANUKAH_CANDLES$1, {
            chanukahDay: candles - 1,
            emoji: chanukahEmoji + KEYCAP_DIGITS[candles],
        }));
    }
    add(new HolidayEvent(new HDate(32, KISLEV, year), holidayDesc.CHANUKAH_8TH_DAY, MINOR_HOLIDAY$1, { chanukahDay: 8, emoji: chanukahEmoji }));
    add(new AsaraBTevetEvent(new HDate(10, TEVET, year), holidayDesc.ASARA_BTEVET, MINOR_FAST$1));
    const pesachAbs = pesach.abs();
    add(new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT$1, pesachAbs - 43)), holidayDesc.SHABBAT_SHEKALIM, SPECIAL_SHABBAT$1), new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT$1, pesachAbs - 30)), holidayDesc.SHABBAT_ZACHOR, SPECIAL_SHABBAT$1), new HolidayEvent(new HDate(pesachAbs - (pesach.getDay() === TUE ? 33 : 31)), holidayDesc.TAANIT_ESTHER, MINOR_FAST$1));
    const haChodeshAbs = HDate.dayOnOrBefore(SAT$1, pesachAbs - 14);
    add(new HolidayEvent(new HDate(haChodeshAbs - 7), holidayDesc.SHABBAT_PARAH, SPECIAL_SHABBAT$1), new HolidayEvent(new HDate(haChodeshAbs), holidayDesc.SHABBAT_HACHODESH, SPECIAL_SHABBAT$1), new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT$1, pesachAbs - 1)), holidayDesc.SHABBAT_HAGADOL, SPECIAL_SHABBAT$1), new HolidayEvent(
    // if the fast falls on Shabbat, move to Thursday
    pesach.prev().getDay() === SAT$1
        ? pesach.onOrBefore(THU)
        : new HDate(14, NISAN$1, year), holidayDesc.TAANIT_BECHOROT, MINOR_FAST$1));
    add(new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT$1, new HDate(1, TISHREI$2, year + 1).abs() - 4)), holidayDesc.LEIL_SELICHOT, MINOR_HOLIDAY$1, { emoji: '🕍' }));
    if (pesach.getDay() === SUN) {
        add(new HolidayEvent(new HDate(16, ADAR_II, year), holidayDesc.PURIM_MESHULASH, MINOR_HOLIDAY$1));
    }
    if (HDate.isLeapYear(year)) {
        add(new HolidayEvent(new HDate(14, ADAR_I, year), holidayDesc.PURIM_KATAN, MINOR_HOLIDAY$1, { emoji: '🎭️' }));
        add(new HolidayEvent(new HDate(15, ADAR_I, year), holidayDesc.SHUSHAN_PURIM_KATAN, MINOR_HOLIDAY$1, { emoji: '🎭️' }));
    }
    const nisan27dt = dateYomHaShoah(year);
    if (nisan27dt) {
        add(new HolidayEvent(nisan27dt, holidayDesc.YOM_HASHOAH, MODERN_HOLIDAY$1));
    }
    const yomHaZikaronDt = dateYomHaZikaron(year);
    if (yomHaZikaronDt) {
        add(new HolidayEvent(yomHaZikaronDt, holidayDesc.YOM_HAZIKARON, MODERN_HOLIDAY$1, emojiIsraelFlag), new HolidayEvent(yomHaZikaronDt.next(), holidayDesc.YOM_HAATZMA_UT, MODERN_HOLIDAY$1, emojiIsraelFlag));
    }
    for (const h of staticModernHolidays) {
        if (year >= h.firstYear) {
            let hd = new HDate(h.dd, h.mm, year);
            const dow = hd.getDay();
            if (h.friSatMovetoThu && (dow === FRI$1 || dow === SAT$1)) {
                hd = hd.onOrBefore(THU);
            }
            else if (h.friPostponeToSun && dow === FRI$1) {
                hd = new HDate(hd.abs() + 2);
            }
            else if (h.satPostponeToSun && dow === SAT$1) {
                hd = hd.next();
            }
            const mask = h.chul ? MODERN_HOLIDAY$1 : MODERN_HOLIDAY$1 | IL_ONLY$1;
            const ev = new HolidayEvent(hd, h.desc, mask);
            if (!h.suppressEmoji) {
                ev.emoji = '🇮🇱';
            }
            add(ev);
        }
    }
    let tamuz17 = new HDate(17, TAMUZ, year);
    let tamuz17attrs;
    if (tamuz17.getDay() === SAT$1) {
        tamuz17 = new HDate(18, TAMUZ, year);
        tamuz17attrs = { observed: true };
    }
    add(new HolidayEvent(tamuz17, holidayDesc.TZOM_TAMMUZ, MINOR_FAST$1, tamuz17attrs));
    let av9dt = new HDate(9, AV, year);
    let av9title = holidayDesc.TISHA_BAV;
    let av9attrs;
    if (av9dt.getDay() === SAT$1) {
        av9dt = av9dt.next();
        av9attrs = { observed: true };
        av9title += ' (observed)';
    }
    const av9abs = av9dt.abs();
    add(new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT$1, av9abs)), holidayDesc.SHABBAT_CHAZON, SPECIAL_SHABBAT$1), new HolidayEvent(av9dt.prev(), holidayDesc.EREV_TISHA_BAV, EREV$1 | MAJOR_FAST$1, av9attrs), new HolidayEvent(av9dt, av9title, MAJOR_FAST$1, av9attrs), new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT$1, av9abs + 7)), holidayDesc.SHABBAT_NACHAMU, SPECIAL_SHABBAT$1));
    const monthsInYear = HDate.monthsInYear(year);
    for (let month = 1; month <= monthsInYear; month++) {
        const monthName = HDate.getMonthName(month, year);
        if ((month === NISAN$1
            ? HDate.daysInMonth(HDate.monthsInYear(year - 1), year - 1)
            : HDate.daysInMonth(month - 1, year)) === 30) {
            add(new RoshChodeshEvent(new HDate(1, month, year), monthName));
            add(new RoshChodeshEvent(new HDate(30, month - 1, year), monthName));
        }
        else if (month !== TISHREI$2) {
            add(new RoshChodeshEvent(new HDate(1, month, year), monthName));
        }
    }
    // Begin: Yom Kippur Katan
    // start at Iyyar because one may not fast during Nisan
    for (let month = months.IYYAR; month <= monthsInYear; month++) {
        const nextMonth = month + 1;
        // Yom Kippur Katan is not observed on the day before Rosh Hashanah.
        // Not observed prior to Rosh Chodesh Cheshvan because Yom Kippur has just passed.
        // Not observed before Rosh Chodesh Tevet, because that day is Hanukkah.
        if (nextMonth === TISHREI$2 ||
            nextMonth === months.CHESHVAN ||
            nextMonth === TEVET) {
            continue;
        }
        let ykk = new HDate(29, month, year);
        const dow = ykk.getDay();
        if (dow === FRI$1 || dow === SAT$1) {
            ykk = ykk.onOrBefore(THU);
        }
        const nextMonthName = HDate.getMonthName(nextMonth, year);
        const ev = new YomKippurKatanEvent(ykk, nextMonthName);
        add(ev);
    }
    const sedra = getSedra_(year, false);
    const beshalachHd = sedra.find(15);
    add(new HolidayEvent(beshalachHd, holidayDesc.SHABBAT_SHIRAH, SPECIAL_SHABBAT$1));
    // Birkat Hachamah appears only once every 28 years
    const birkatHaChama = getBirkatHaChama(year);
    if (birkatHaChama) {
        const hd = new HDate(birkatHaChama);
        add(new HolidayEvent(hd, holidayDesc.BIRKAT_HACHAMAH, MINOR_HOLIDAY$1, { emoji: '☀️' }));
    }
    yearCache.set(year, map);
    return map;
}
/**
 * Birkat Hachamah appears only once every 28 years.
 * Although almost always in Nisan, it can occur in Adar II.
 *   - 27 Adar II 5461 (Gregorian year 1701)
 *   - 29 Adar II 5993 (Gregorian year 2233)
 *
 * Due to drift, this will eventually slip into Iyyar
 *   - 2 Iyyar 7141 (Gregorian year 3381)
 * @private
 */
function getBirkatHaChama(year) {
    const leap = HDate.isLeapYear(year);
    const startMonth = leap ? ADAR_II : NISAN$1;
    const startDay = leap ? 20 : 1;
    const baseRd = HDate.hebrew2abs(year, startMonth, startDay);
    for (let day = 0; day <= 40; day++) {
        const abs = baseRd + day;
        const elapsed = abs + 1373429;
        if (elapsed % 10227 === 172) {
            return abs;
        }
    }
    return 0;
}

function range(start, end) {
    const arr = [];
    for (let i = start; i <= end; i++) {
        arr.push(i);
    }
    return arr;
}
const NONE = {
    shacharit: false,
    mincha: false,
    allCongs: false,
};
function tachanun_(hdate, il) {
    return tachanun0(hdate, il, true);
}
function tachanun0(hdate, il, checkNext) {
    const year = hdate.yy;
    const dates = tachanunYear(year, il);
    const abs = hdate.abs();
    if (dates.none.indexOf(abs) > -1) {
        return NONE;
    }
    const dow = hdate.getDay();
    const ret = {
        shacharit: false,
        mincha: false,
        allCongs: false,
    };
    if (dates.some.indexOf(abs) === -1) {
        ret.allCongs = true;
    }
    if (dow !== 6) {
        ret.shacharit = true;
    }
    const tomorrow = abs + 1;
    if (checkNext && dates.yesPrev.indexOf(tomorrow) === -1) {
        const tmp = tachanun0(new HDate(tomorrow), il, false);
        ret.mincha = tmp.shacharit;
    }
    else {
        ret.mincha = dow !== 5;
    }
    if (ret.allCongs && !ret.mincha && !ret.shacharit) {
        return NONE;
    }
    return ret;
}
function tachanunYear(year, il) {
    const leap = HDate.isLeapYear(year);
    const monthsInYear = HDate.monthsInYear(year);
    let av9dt = new HDate(9, months.AV, year);
    if (av9dt.getDay() === 6) {
        av9dt = av9dt.next();
    }
    let shushPurim = new HDate(15, months.ADAR_II, year);
    if (shushPurim.getDay() === 6) {
        shushPurim = shushPurim.next();
    }
    const none = [
        new HDate(2, months.TISHREI, year), // Rosh Hashana II
    ].concat(
    // Rosh Chodesh - 1st of every month. Also includes RH day 1 (1 Tishrei)
    range(1, monthsInYear).map(month => new HDate(1, month, year)), 
    // Rosh Chodesh - 30th of months that have one
    range(1, monthsInYear)
        .filter(month => HDate.daysInMonth(month, year) === 30)
        .map(month => new HDate(30, month, year)), 
    // entire month of Nisan
    range(1, HDate.daysInMonth(months.NISAN, year)).map(mday => new HDate(mday, months.NISAN, year)), new HDate(18, months.IYYAR, year), // Lag BaOmer
    // Rosh Chodesh Sivan thru Isru Chag
    range(1, 8 - (il ? 1 : 0)).map(mday => new HDate(mday, months.SIVAN, year)), av9dt, // Tisha B'Av
    new HDate(15, months.AV, year), // Tu B'Av
    new HDate(29, months.ELUL, year), // Erev Rosh Hashanah
    // Erev Yom Kippur thru Isru Chag
    range(9, 24 - (il ? 1 : 0)).map(mday => new HDate(mday, months.TISHREI, year)), 
    // Chanukah
    range(25, 33).map(mday => new HDate(mday, months.KISLEV, year)), new HDate(15, months.SHVAT, year), // Tu BiShvat
    new HDate(14, months.ADAR_II, year), // Purim
    shushPurim, leap ? new HDate(14, months.ADAR_I, year) : [] // Purim Katan
    );
    const some = [
        new HDate(14, months.IYYAR, year), // Pesach Sheini
    ].concat(
    // Until 14 Sivan
    range(1, 13).map(mday => new HDate(mday, months.SIVAN, year)), 
    // Until after Rosh Chodesh Cheshvan
    range(20, 31).map(mday => new HDate(mday, months.TISHREI, year)), 
    // Yom HaAtzma'ut, which changes based on day of week
    year >= 5708 ? dateYomHaZikaron(year).next() : [], 
    // Yom Yerushalayim
    year >= 5727 ? new HDate(28, months.IYYAR, year) : []);
    const yesPrev = [
        new HDate(29, months.ELUL, year - 1), // Erev Rosh Hashanah
        new HDate(9, months.TISHREI, year), // Erev Yom Kippur
        new HDate(14, months.IYYAR, year), // Pesach Sheini
    ];
    return {
        none: none.map(hd => hd.abs()).sort((a, b) => a - b),
        some: some.map(hd => hd.abs()).sort((a, b) => a - b),
        yesPrev: yesPrev.map(hd => hd.abs()).sort((a, b) => a - b),
    };
}

const TISHREI$1 = months.TISHREI;
/**
 * Gets the R.D. days for a number, Date, or HDate
 * @private
 */
function getAbs(d) {
    if (typeof d === 'number')
        return d;
    if (isDate(d))
        return greg2abs(d);
    if (HDate.isHDate(d))
        return d.abs();
    throw new TypeError(`Invalid date type: ${d}`);
}
function getYear(options) {
    if (typeof options.year !== 'undefined') {
        return Number(options.year);
    }
    return options.isHebrewYear
        ? new HDate().getFullYear()
        : new Date().getFullYear();
}
/**
 * Parse options object to determine start & end days
 * @private
 */
function getStartAndEnd(options) {
    if ((options.start && !options.end) || (options.end && !options.start)) {
        throw new TypeError('Both options.start and options.end are required');
    }
    else if (options.start && options.end) {
        return [getAbs(options.start), getAbs(options.end)];
    }
    const isHebrewYear = Boolean(options.isHebrewYear);
    const theYear = getYear(options);
    if (isNaN(theYear)) {
        throw new RangeError(`Invalid year ${options.year}`);
    }
    else if (isHebrewYear && theYear < 1) {
        throw new RangeError(`Invalid Hebrew year ${theYear}`);
    }
    const theMonth = getMonth(options);
    const numYears = Number(options.numYears) || 1;
    if (isHebrewYear) {
        return startEndHebrew(theMonth, theYear, numYears);
    }
    else {
        return startEndGregorian(theMonth, theYear, numYears);
    }
}
function getMonth(options) {
    if (options.month) {
        if (options.isHebrewYear) {
            return HDate.monthNum(options.month);
        }
        else if (typeof options.month === 'number') {
            return options.month;
        }
    }
    return NaN;
}
function startEndGregorian(theMonth, theYear, numYears) {
    const gregMonth = theMonth ? theMonth - 1 : 0;
    const startGreg = new Date(theYear, gregMonth, 1);
    if (theYear < 100) {
        startGreg.setFullYear(theYear);
    }
    const startAbs = greg2abs(startGreg);
    let endAbs;
    if (theMonth) {
        endAbs = startAbs + daysInGregMonth(theMonth, theYear) - 1;
    }
    else {
        const endYear = theYear + numYears;
        const endGreg = new Date(endYear, 0, 1);
        if (endYear < 100) {
            endGreg.setFullYear(endYear);
        }
        endAbs = greg2abs(endGreg) - 1;
    }
    return [startAbs, endAbs];
}
function startEndHebrew(theMonth, theYear, numYears) {
    const startDate = new HDate(1, theMonth || TISHREI$1, theYear);
    let startAbs = startDate.abs();
    const endAbs = theMonth
        ? startAbs + startDate.daysInMonth()
        : new HDate(1, TISHREI$1, theYear + numYears).abs() - 1;
    // for full Hebrew year, start on Erev Rosh Hashana which
    // is technically in the previous Hebrew year
    // (but conveniently lets us get candle-lighting time for Erev)
    if (!theMonth && theYear > 1) {
        startAbs--;
    }
    return [startAbs, endAbs];
}

/*
    Hebcal - A Jewish Calendar Generator
    Copyright (c) 1994-2020 Danny Sadinoff
    Portions copyright Eyal Schachter and Michael J. Radwin

    https://github.com/hebcal/hebcal-es6

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const FRI = 5;
const SAT = 6;
const NISAN = months.NISAN;
const SIVAN = months.SIVAN;
const ELUL = months.ELUL;
const TISHREI = months.TISHREI;
const LIGHT_CANDLES = flags.LIGHT_CANDLES;
const YOM_TOV_ENDS = flags.YOM_TOV_ENDS;
const CHUL_ONLY = flags.CHUL_ONLY;
const IL_ONLY = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES = flags.CHANUKAH_CANDLES;
const MINOR_FAST = flags.MINOR_FAST;
const SPECIAL_SHABBAT = flags.SPECIAL_SHABBAT;
const MODERN_HOLIDAY = flags.MODERN_HOLIDAY;
const MAJOR_FAST = flags.MAJOR_FAST;
const ROSH_CHODESH = flags.ROSH_CHODESH;
const PARSHA_HASHAVUA = flags.PARSHA_HASHAVUA;
const DAF_YOMI = flags.DAF_YOMI;
const MISHNA_YOMI = flags.MISHNA_YOMI;
const NACH_YOMI = flags.NACH_YOMI;
const YERUSHALMI_YOMI = flags.YERUSHALMI_YOMI;
const OMER_COUNT = flags.OMER_COUNT;
const SHABBAT_MEVARCHIM = flags.SHABBAT_MEVARCHIM;
const MINOR_HOLIDAY = flags.MINOR_HOLIDAY;
const EREV = flags.EREV;
const CHOL_HAMOED = flags.CHOL_HAMOED;
const YOM_KIPPUR_KATAN = flags.YOM_KIPPUR_KATAN;
const unrecognizedAlreadyWarned = new Set();
const RECOGNIZED_OPTIONS = {
    location: 1,
    year: 1,
    isHebrewYear: 1,
    month: 1,
    numYears: 1,
    start: 1,
    end: 1,
    candlelighting: 1,
    candleLightingMins: 1,
    havdalahMins: 1,
    havdalahDeg: 1,
    fastEndDeg: 1,
    sedrot: 1,
    il: 1,
    noMinorFast: 1,
    noModern: 1,
    shabbatMevarchim: 1,
    noRoshChodesh: 1,
    noSpecialShabbat: 1,
    noHolidays: 1,
    omer: 1,
    molad: 1,
    ashkenazi: 1,
    locale: 1,
    addHebrewDates: 1,
    addHebrewDatesForEvents: 1,
    appendHebrewToSubject: 1,
    mask: 1,
    yomKippurKatan: 1,
    hour12: 1,
    dailyLearning: 1,
    useElevation: 1,
};
/**
 * @private
 */
function warnUnrecognizedOptions(options) {
    for (const k of Object.keys(options)) {
        if (typeof RECOGNIZED_OPTIONS[k] === 'undefined' &&
            !unrecognizedAlreadyWarned.has(k)) {
            console.warn(`Ignoring unrecognized HebrewCalendar option: ${k}`);
            unrecognizedAlreadyWarned.add(k);
        }
    }
}
const israelCityOffset = {
    Jerusalem: 40,
    Haifa: 30,
    "Zikhron Ya'aqov": 30,
    "Zikhron Ya'akov": 30,
    'Zikhron Yaakov': 30,
    "Zichron Ya'akov": 30,
    'Zichron Yaakov': 30,
};
const geoIdCandleOffset = {
    '281184': 40, // Jerusalem
    '294801': 30, // Haifa
    '293067': 30, // Zikhron Yaakov
};
/**
 * @private
 * @constant
 * This calculation is based on the position of the sun 36 minutes after sunset in Jerusalem
 * around the equinox / equilux, which is 8.5° below geometric zenith.
 * The Ohr Meir considers this the time that 3 small stars are visible,
 * which is later than the required 3 medium stars.
 * @see {https://kosherjava.com/zmanim/docs/api/com/kosherjava/zmanim/ZmanimCalendar.html#ZENITH_8_POINT_5}
 */
const TZEIT_3SMALL_STARS = 8.5;
/**
 * @private
 * @constant
 * This calculation is based on observation of 3 medium sized stars by Dr. Baruch Cohen
 * in his calendar published in in 1899 in Strasbourg, France.
 * This calculates to 7.0833333° below geometric zenith.
 * @see {https://kosherjava.com/zmanim/docs/api/com/kosherjava/zmanim/ComplexZmanimCalendar.html#ZENITH_7_POINT_083}
 */
const TZEIT_3MEDIUM_STARS = 7.0833333;
/**
 * Modifies options in-place
 * @private
 */
function checkCandleOptions(options) {
    if (!options.candlelighting) {
        return;
    }
    const location = options.location;
    if (typeof location === 'undefined' || !(location instanceof Location)) {
        throw new TypeError('options.candlelighting requires valid options.location');
    }
    if (typeof options.havdalahMins === 'number' &&
        typeof options.havdalahDeg === 'number') {
        throw new TypeError('options.havdalahMins and options.havdalahDeg are mutually exclusive');
    }
    let min = Number(options.candleLightingMins) || 18;
    if (location.getIsrael() && Math.abs(min) === 18) {
        min = overrideIsraelCandleMins(location, min);
    }
    options.candleLightingMins = -1 * Math.abs(min);
    if (typeof options.havdalahMins === 'number') {
        options.havdalahMins = Math.abs(options.havdalahMins);
    }
    else if (typeof options.havdalahDeg === 'number') {
        options.havdalahDeg = Math.abs(options.havdalahDeg);
    }
    else {
        options.havdalahDeg = TZEIT_3SMALL_STARS;
    }
    if (typeof options.fastEndDeg !== 'number') {
        options.fastEndDeg = TZEIT_3MEDIUM_STARS;
    }
}
function overrideIsraelCandleMins(location, min) {
    const geoid = location.getGeoId();
    if (geoid) {
        const offset = geoIdCandleOffset[geoid];
        if (typeof offset === 'number') {
            return offset;
        }
    }
    const shortName = location.getShortName();
    if (shortName) {
        const offset = israelCityOffset[shortName];
        if (typeof offset === 'number') {
            return offset;
        }
    }
    return min;
}
/**
 * Mask to filter Holiday array
 * @private
 */
function getMaskFromOptions(options) {
    var _a;
    if (typeof options.mask === 'number') {
        return setOptionsFromMask(options);
    }
    const il = options.il || ((_a = options.location) === null || _a === void 0 ? void 0 : _a.getIsrael()) || false;
    let mask = 0;
    // default options
    if (!options.noHolidays) {
        mask |=
            ROSH_CHODESH |
                YOM_TOV_ENDS |
                MINOR_FAST |
                SPECIAL_SHABBAT |
                MODERN_HOLIDAY |
                MAJOR_FAST |
                MINOR_HOLIDAY |
                EREV |
                CHOL_HAMOED |
                LIGHT_CANDLES |
                LIGHT_CANDLES_TZEIS |
                CHANUKAH_CANDLES;
    }
    if (options.candlelighting) {
        mask |= LIGHT_CANDLES | LIGHT_CANDLES_TZEIS | YOM_TOV_ENDS;
    }
    // suppression of defaults
    if (options.noRoshChodesh) {
        mask &= ~ROSH_CHODESH;
    }
    if (options.noModern) {
        mask &= ~MODERN_HOLIDAY;
    }
    if (options.noMinorFast) {
        mask &= ~MINOR_FAST;
    }
    if (options.noSpecialShabbat) {
        mask &= ~SPECIAL_SHABBAT;
        mask &= ~SHABBAT_MEVARCHIM;
    }
    if (il) {
        mask |= IL_ONLY;
    }
    else {
        mask |= CHUL_ONLY;
    }
    // non-default options
    if (options.sedrot) {
        mask |= PARSHA_HASHAVUA;
    }
    if (options.omer) {
        mask |= OMER_COUNT;
    }
    if (options.shabbatMevarchim) {
        mask |= SHABBAT_MEVARCHIM;
    }
    if (options.yomKippurKatan) {
        mask |= YOM_KIPPUR_KATAN;
    }
    if (options.dailyLearning) {
        const dailyLearning = options.dailyLearning;
        if (dailyLearning.dafYomi) {
            mask |= DAF_YOMI;
        }
        if (dailyLearning.mishnaYomi) {
            mask |= MISHNA_YOMI;
        }
        if (dailyLearning.nachYomi) {
            mask |= NACH_YOMI;
        }
        if (dailyLearning.yerushalmi) {
            mask |= YERUSHALMI_YOMI;
        }
    }
    return mask;
}
const MASK_LIGHT_CANDLES = LIGHT_CANDLES | LIGHT_CANDLES_TZEIS | CHANUKAH_CANDLES | YOM_TOV_ENDS;
const defaultLocation = new Location(0, 0, false, 'UTC');
/**
 * @private
 */
function setOptionsFromMask(options) {
    const m = options.mask || 0;
    if (m & ROSH_CHODESH)
        delete options.noRoshChodesh;
    if (m & MODERN_HOLIDAY)
        delete options.noModern;
    if (m & MINOR_FAST)
        delete options.noMinorFast;
    if (m & SPECIAL_SHABBAT)
        delete options.noSpecialShabbat;
    if (m & PARSHA_HASHAVUA)
        options.sedrot = true;
    if (m & (DAF_YOMI | MISHNA_YOMI | NACH_YOMI | YERUSHALMI_YOMI)) {
        options.dailyLearning = options.dailyLearning || {};
        if (m & DAF_YOMI) {
            options.dailyLearning.dafYomi = true;
        }
        if (m & MISHNA_YOMI) {
            options.dailyLearning.mishnaYomi = true;
        }
        if (m & NACH_YOMI) {
            options.dailyLearning.nachYomi = true;
        }
        if (m & YERUSHALMI_YOMI) {
            options.dailyLearning.yerushalmi = 1;
        }
    }
    if (m & OMER_COUNT)
        options.omer = true;
    if (m & SHABBAT_MEVARCHIM)
        options.shabbatMevarchim = true;
    if (m & YOM_KIPPUR_KATAN)
        options.yomKippurKatan = true;
    return m;
}
/**
 * @private
 */
function observedInIsrael(ev) {
    return ev.observedInIsrael();
}
/**
 * @private
 */
function observedInDiaspora(ev) {
    return ev.observedInDiaspora();
}
/**
 * HebrewCalendar is the main interface to the `@hebcal/core` library.
 * This namespace is used to calculate holidays, rosh chodesh, candle lighting & havdalah times,
 * Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
 * Event names can be rendered in several languges using the `locale` option.
 */
class HebrewCalendar {
    constructor() { }
    /**
     * Calculates holidays and other Hebrew calendar events based on {@link CalOptions}.
     *
     * Each holiday is represented by an {@link Event} object which includes a date,
     * a description, flags and optional attributes.
     * If given no options, returns holidays for the Diaspora for the current Gregorian year.
     *
     * The date range returned by this function can be controlled by:
     * * `options.year` - Gregorian (e.g. 1993) or Hebrew year (e.g. 5749)
     * * `options.isHebrewYear` - to interpret `year` as Hebrew year
     * * `options.numYears` - generate calendar for multiple years (default 1)
     * * `options.month` - Gregorian or Hebrew month (to filter results to a single month)
     *
     * Alternatively, specify start and end days with `Date` or {@link HDate} instances:
     * * `options.start` - use specific start date (requires `end` date)
     * * `options.end` - use specific end date (requires `start` date)
     *
     * Unless `options.noHolidays == true`, default holidays include:
     * * Major holidays - Rosh Hashana, Yom Kippur, Pesach, Sukkot, etc.
     * * Minor holidays - Purim, Chanukah, Tu BiShvat, Lag BaOmer, etc.
     * * Minor fasts - Ta'anit Esther, Tzom Gedaliah, etc. (unless `options.noMinorFast`)
     * * Special Shabbatot - Shabbat Shekalim, Zachor, etc. (unless `options.noSpecialShabbat`)
     * * Modern Holidays - Yom HaShoah, Yom HaAtzma'ut, etc. (unless `options.noModern`)
     * * Rosh Chodesh (unless `options.noRoshChodesh`)
     *
     * Holiday and Torah reading schedules differ between Israel and the Disapora.
     * Set `options.il=true` to use the Israeli schedule.
     *
     * Additional non-default event types can be specified:
     * * Parashat HaShavua - weekly Torah Reading on Saturdays (`options.sedrot`)
     * * Counting of the Omer (`options.omer`)
     * * Shabbat Mevarchim HaChodesh on Saturday before Rosh Chodesh (`options.shabbatMevarchim`)
     * * Molad announcement on Saturday before Rosh Chodesh (`options.molad`)
     * * Yom Kippur Katan (`options.yomKippurKatan`)
     *
     * Daily Study of texts are supported by the
     * {@link https://github.com/hebcal/hebcal-learning @hebcal/learning} package,
     * for example:
     * * Babylonian Talmud Daf Yomi (`options.dailyLearning.dafYomi`)
     * * Jerusalem Talmud (Yerushalmi) Yomi (`options.dailyLearning.yerushalmi`)
     * * Mishna Yomi (`options.dailyLearning.mishnaYomi`)
     * * Nach Yomi (`options.dailyLearning.nachYomi`)
     *
     * Candle-lighting and Havdalah times are approximated using latitude and longitude
     * specified by the {@link Location} class. The `Location` class contains a small
     * database of cities with their associated geographic information and time-zone information.
     * If you ever have any doubts about Hebcal's times, consult your local halachic authority.
     * If you enter geographic coordinates above the arctic circle or antarctic circle,
     * the times are guaranteed to be wrong.
     *
     * To add candle-lighting options, set `options.candlelighting=true` and set
     * `options.location` to an instance of `Location`. By default, candle lighting
     * time is 18 minutes before sundown (40 minutes for Jerusalem,
     * 30 minutes for Haifa and Zikhron Ya'akov) and Havdalah is
     * calculated according to Tzeit Hakochavim - Nightfall (the point when 3 small stars
     * are observable in the night time sky with the naked eye). The default Havdalah
     * option (Tzeit Hakochavim) is calculated when the sun is 8.5° below the horizon.
     * These defaults can be changed using these options:
     * * `options.candleLightingMins` - minutes before sundown to light candles
     * * `options.havdalahMins` - minutes after sundown for Havdalah (typical values are 42, 50, or 72).
     *    Havdalah times are suppressed when `options.havdalahMins=0`.
     * * `options.havdalahDeg` - degrees for solar depression for Havdalah.
     *    Default is 8.5 degrees for 3 small stars. Use 7.083 degrees for 3 medium-sized stars.
     *    Havdalah times are suppressed when `options.havdalahDeg=0`.
     *
     * If both `options.candlelighting=true` and `options.location` is specified,
     * Chanukah candle-lighting times and minor fast start/end times will also be generated.
     * Chanukah candle-lighting is at Bein HaShmashos (13.5 minutes before
     * the sun is 7.083° below the horizon in the evening)
     * on weekdays, at regular candle-lighting time on Fridays, and at regular Havdalah time on
     * Saturday night (see above).
     *
     * Minor fasts begin at Alot HaShachar (sun is 16.1° below the horizon in the morning) and
     * end when 3 medium-sized stars are observable in the night sky (sun is 7.083° below the horizon
     * in the evening).
     *
     * Two options also exist for generating an Event with the Hebrew date:
     * * `options.addHebrewDates` - print the Hebrew date for the entire date range
     * * `options.addHebrewDatesForEvents` - print the Hebrew date for dates with some events
     *
     * Lastly, translation and transliteration of event titles is controlled by
     * `options.locale` and the {@link Locale} API.
     * `@hebcal/core` supports three locales by default:
     * * `en` - default, Sephardic transliterations (e.g. "Shabbat")
     * * `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
     * * `he` - Hebrew (e.g. "שַׁבָּת")
     *
     * Additional locales (such as `ru` or `fr`) are supported by the
     * {@link https://github.com/hebcal/hebcal-locales @hebcal/locales} package
     *
     * @example
     * import {HebrewCalendar, HDate, Location, Event} from '@hebcal/core';
     * const options: CalOptions = {
     *   year: 1981,
     *   isHebrewYear: false,
     *   candlelighting: true,
     *   location: Location.lookup('San Francisco'),
     *   sedrot: true,
     *   omer: true,
     * };
     * const events = HebrewCalendar.calendar(options);
     * for (const ev of events) {
     *   const hd = ev.getDate();
     *   const date = hd.greg();
     *   console.log(date.toLocaleDateString(), ev.render('en'), hd.toString());
     * }
     */
    static calendar(options = {}) {
        options = Object.assign({}, options); // so we can modify freely
        checkCandleOptions(options);
        const location = (options.location = options.location || defaultLocation);
        const il = (options.il = options.il || location.getIsrael() || false);
        const hasUserMask = typeof options.mask === 'number';
        options.mask = getMaskFromOptions(options);
        if (options.ashkenazi || options.locale) {
            if (options.locale && typeof options.locale !== 'string') {
                throw new TypeError(`Invalid options.locale: ${options.locale}`);
            }
            const locale = options.ashkenazi
                ? 'ashkenazi'
                : options.locale;
            const translationObj = Locale.useLocale(locale);
            if (!translationObj) {
                throw new TypeError(`Locale '${locale}' not found; did you forget to import @hebcal/locales?`);
            }
        }
        else {
            Locale.useLocale('en');
        }
        const evts = [];
        let sedra;
        let holidaysYear;
        let beginOmer = -1;
        let endOmer = -1;
        let currentYear = -1;
        const startAndEnd = getStartAndEnd(options);
        warnUnrecognizedOptions(options);
        const startAbs = startAndEnd[0];
        const endAbs = startAndEnd[1];
        const startGreg = abs2greg(startAbs);
        if (startGreg.getFullYear() < 100) {
            options.candlelighting = false;
        }
        for (let abs = startAbs; abs <= endAbs; abs++) {
            const hd = new HDate(abs);
            const hyear = hd.getFullYear();
            if (hyear !== currentYear) {
                currentYear = hyear;
                holidaysYear = getHolidaysForYear_(currentYear);
                if (options.sedrot) {
                    sedra = getSedra_(currentYear, il);
                }
                if (options.omer) {
                    beginOmer = HDate.hebrew2abs(currentYear, NISAN, 16);
                    endOmer = HDate.hebrew2abs(currentYear, SIVAN, 5);
                }
            }
            const prevEventsLength = evts.length;
            const dow = hd.getDay();
            const isFriday = dow === FRI;
            const isSaturday = dow === SAT;
            let candlesEv;
            const holidays = holidaysYear.get(hd.toString()) || [];
            for (const ev of holidays) {
                candlesEv = appendHolidayAndRelated(candlesEv, evts, ev, options, isFriday, isSaturday, hasUserMask);
            }
            if (options.sedrot && isSaturday) {
                const parsha0 = sedra.lookup(abs);
                if (!parsha0.chag) {
                    evts.push(new ParshaEvent(hd, parsha0.parsha, il, parsha0.num));
                }
            }
            const dailyLearning = options.dailyLearning;
            if (typeof dailyLearning === 'object') {
                const events = makeDailyLearning(hd, dailyLearning, il);
                evts.push(...events);
            }
            if (options.omer && abs >= beginOmer && abs <= endOmer) {
                const omer = abs - beginOmer + 1;
                const omerEv = makeOmerEvent(hd, omer, options);
                evts.push(omerEv);
            }
            if (isSaturday && (options.molad || options.shabbatMevarchim)) {
                const events = makeMoladAndMevarchimChodesh(hd, options);
                evts.push(...events);
            }
            if (!candlesEv && options.candlelighting && (isFriday || isSaturday)) {
                candlesEv = makeCandleEvent(undefined, hd, options, isFriday, isSaturday);
                if (isFriday && candlesEv && sedra) {
                    candlesEv.memo = sedra.getString(abs, options.locale);
                }
            }
            // suppress Havdalah when options.havdalahMins=0 or options.havdalahDeg=0
            if (candlesEv instanceof HavdalahEvent &&
                (options.havdalahMins === 0 || options.havdalahDeg === 0)) {
                candlesEv = undefined;
            }
            if (candlesEv) {
                evts.push(candlesEv);
            }
            if (options.addHebrewDates ||
                (options.addHebrewDatesForEvents && prevEventsLength !== evts.length)) {
                const e2 = new HebrewDateEvent(hd);
                if (prevEventsLength === evts.length) {
                    evts.push(e2);
                }
                else {
                    evts.splice(prevEventsLength, 0, e2);
                }
            }
        }
        return evts;
    }
    /**
     * Calculates a birthday or anniversary (non-yahrzeit).
     * `hyear` must be after original `gdate` of anniversary.
     * Returns `undefined` when requested year preceeds or is same as original year.
     *
     * Hebcal uses the algorithm defined in "Calendrical Calculations"
     * by Edward M. Reingold and Nachum Dershowitz.
     *
     * The birthday of someone born in Adar of an ordinary year or Adar II of
     * a leap year is also always in the last month of the year, be that Adar
     * or Adar II. The birthday in an ordinary year of someone born during the
     * first 29 days of Adar I in a leap year is on the corresponding day of Adar;
     * in a leap year, the birthday occurs in Adar I, as expected.
     *
     * Someone born on the thirtieth day of Marcheshvan, Kislev, or Adar I
     * has his birthday postponed until the first of the following month in
     * years where that day does not occur. [Calendrical Calculations p. 111]
     * @example
     * import {HebrewCalendar} from '@hebcal/core';
     * const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
     * const hd = HebrewCalendar.getBirthdayOrAnniversary(5780, dt); // '1 Nisan 5780'
     * console.log(hd.greg().toLocaleDateString('en-US')); // '3/26/2020'
     * @param hyear Hebrew year
     * @param gdate Gregorian or Hebrew date of event
     * @returns anniversary occurring in `hyear`
     */
    static getBirthdayOrAnniversary(hyear, gdate) {
        const dt = getBirthdayHD(hyear, gdate);
        if (typeof dt === 'undefined') {
            return dt;
        }
        return new HDate(dt);
    }
    /**
     * Calculates yahrzeit.
     * `hyear` must be after original `gdate` of death.
     * Returns `undefined` when requested year preceeds or is same as original year.
     *
     * Hebcal uses the algorithm defined in "Calendrical Calculations"
     * by Edward M. Reingold and Nachum Dershowitz.
     *
     * The customary anniversary date of a death is more complicated and depends
     * also on the character of the year in which the first anniversary occurs.
     * There are several cases:
     *
     * * If the date of death is Marcheshvan 30, the anniversary in general depends
     *   on the first anniversary; if that first anniversary was not Marcheshvan 30,
     *   use the day before Kislev 1.
     * * If the date of death is Kislev 30, the anniversary in general again depends
     *   on the first anniversary — if that was not Kislev 30, use the day before
     *   Tevet 1.
     * * If the date of death is Adar II, the anniversary is the same day in the
     *   last month of the Hebrew year (Adar or Adar II).
     * * If the date of death is Adar I 30, the anniversary in a Hebrew year that
     *   is not a leap year (in which Adar only has 29 days) is the last day in
     *   Shevat.
     * * In all other cases, use the normal (that is, same month number) anniversary
     *   of the date of death. [Calendrical Calculations p. 113]
     * @example
     * import {HebrewCalendar} from '@hebcal/core';
     * const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
     * const hd = HebrewCalendar.getYahrzeit(5780, dt); // '30 Sh\'vat 5780'
     * console.log(hd.greg().toLocaleDateString('en-US')); // '2/25/2020'
     * @param hyear Hebrew year
     * @param gdate Gregorian or Hebrew date of death
     * @returns anniversary occurring in hyear
     */
    static getYahrzeit(hyear, gdate) {
        const dt = getYahrzeitHD(hyear, gdate);
        if (typeof dt === 'undefined') {
            return dt;
        }
        return new HDate(dt);
    }
    /**
     * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
     * `HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
     * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme.
     * @param year Hebrew year
     */
    static getHolidaysForYear(year) {
        return getHolidaysForYear_(year);
    }
    /**
     * Returns an array of holidays for the year
     * @param year Hebrew year
     * @param il use the Israeli schedule for holidays
     */
    static getHolidaysForYearArray(year, il) {
        const yearMap = getHolidaysForYear_(year);
        const startAbs = HDate.hebrew2abs(year, TISHREI, 1);
        const endAbs = HDate.hebrew2abs(year + 1, TISHREI, 1) - 1;
        let events = [];
        const myFilter = il ? observedInIsrael : observedInDiaspora;
        for (let absDt = startAbs; absDt <= endAbs; absDt++) {
            const hd = new HDate(absDt);
            const holidays = yearMap.get(hd.toString());
            if (holidays) {
                const filtered = holidays.filter(myFilter);
                events = events.concat(filtered);
            }
        }
        return events;
    }
    /**
     * Returns an array of Events on this date (or `undefined` if no events)
     * @param date Hebrew Date, Gregorian date, or absolute R.D. day number
     * @param [il] use the Israeli schedule for holidays
     */
    static getHolidaysOnDate(date, il) {
        const hd = HDate.isHDate(date) ? date : new HDate(date);
        const hdStr = hd.toString();
        const yearMap = getHolidaysForYear_(hd.getFullYear());
        const events = yearMap.get(hdStr);
        // if il isn't a boolean return both diaspora + IL for day
        if (typeof il === 'undefined' || typeof events === 'undefined') {
            return events;
        }
        const myFilter = il ? observedInIsrael : observedInDiaspora;
        const filtered = events.filter(myFilter);
        return filtered;
    }
    /**
     * Eruv Tavshilin
     */
    static eruvTavshilin(date, il) {
        if (date.getDay() < 3 || date.getDay() > 4) {
            return false;
        }
        const today = new HDate(date);
        const friday = today.after(5);
        const tomorrow = today.next();
        if (!isChag(friday, il) || isChag(today, il) || !isChag(tomorrow, il)) {
            return false;
        }
        return true;
    }
    /**
     * Helper function to format a 23-hour (00:00-23:59) time in US format ("8:13pm") or
     * keep as "20:13" for any other locale/country. Uses {@link CalOptions} to determine
     * locale.
     * If `options.hour12` is `false`, locale is ignored and always returns 24-hour time.
     * If `options.hour12` is `true`, locale is ignored and always returns 12-hour time.
     * @param timeStr - original time like "20:30"
     * @param suffix - "p" or "pm" or " P.M.". Add leading space if you want it
     * @param options
     */
    static reformatTimeStr(timeStr, suffix, options) {
        return reformatTimeStr(timeStr, suffix, options);
    }
    static version() {
        return version;
    }
    /**
     * Convenience function to create an instance of `Sedra` or reuse a previously
     * created and cached instance.
     */
    static getSedra(hyear, il) {
        return getSedra_(hyear, il);
    }
    /**
     * Return a number containing information on what Hallel is said on that day.
     *
     * Whole Hallel is said on Chanukah, the first Yom Tov of Pesach, Shavuot, Sukkot,
     * Yom Ha'atzmaut, and Yom Yerushalayim.
     *
     * Half Hallel is said on Rosh Chodesh (not Rosh Hashanah), and the last 6 days of Pesach.
     *
     * The number is one of the following values:
     *
     * 0 - No Hallel
     * 1 - Half Hallel
     * 2 - Whole Hallel
     */
    static hallel(hdate, il) {
        const events = HebrewCalendar.getHolidaysForYearArray(hdate.getFullYear(), il);
        return hallel_(events, hdate);
    }
    /**
     * Return details on what Tachanun (or Tzidchatcha on Shabbat) is said on `hdate`.
     *
     * Tachanun is not said on Rosh Chodesh, the month of Nisan, Lag Baomer,
     * Rosh Chodesh Sivan until Isru Chag, Tisha B'av, 15 Av, Erev Rosh Hashanah,
     * Rosh Hashanah, Erev Yom Kippur until after Simchat Torah, Chanukah,
     * Tu B'shvat, Purim and Shushan Purim, and Purim and Shushan Purim Katan.
     *
     * In some congregations Tachanun is not said until from Rosh Chodesh Sivan
     * until 14th Sivan, Sukkot until after Rosh Chodesh Cheshvan, Pesach Sheini,
     * Yom Ha'atzmaut, and Yom Yerushalayim.
     *
     * Tachanun is not said at Mincha on days before it is not said at Shacharit.
     *
     * Tachanun is not said at Shacharit on Shabbat, but is at Mincha, usually.
     */
    static tachanun(hdate, il) {
        return tachanun_(hdate, il);
    }
}
/**
 * @private
 */
function isChag(date, il) {
    const events = HebrewCalendar.getHolidaysOnDate(date, il) || [];
    const chag = events.filter(ev => ev.getFlags() & flags.CHAG);
    return chag.length !== 0;
}
/**
 * Appends the Event `ev` to the `events` array. Also may add related
 * timed events like candle-lighting or fast start/end
 * @private
 */
function appendHolidayAndRelated(candlesEv, events, ev, options, isFriday, isSaturday, hasUserMask) {
    const il = options.il || false;
    if (!ev.observedIn(il)) {
        return candlesEv; // holiday isn't observed here; bail out early
    }
    const eFlags = ev.getFlags();
    if ((!options.yomKippurKatan && eFlags & YOM_KIPPUR_KATAN) ||
        (options.noModern && eFlags & MODERN_HOLIDAY)) {
        return candlesEv; // bail out early
    }
    const isMajorFast = Boolean(eFlags & MAJOR_FAST);
    const isMinorFast = Boolean(eFlags & MINOR_FAST);
    if (options.candlelighting && (isMajorFast || isMinorFast)) {
        ev = makeFastStartEnd(ev, options);
        if (ev.startEvent &&
            (isMajorFast || (isMinorFast && !options.noMinorFast))) {
            events.push(ev.startEvent);
        }
    }
    if (eFlags & Number(options.mask) || (!eFlags && !hasUserMask)) {
        if (options.candlelighting && eFlags & MASK_LIGHT_CANDLES) {
            const hd = ev.getDate();
            candlesEv = makeCandleEvent(ev, hd, options, isFriday, isSaturday);
            if (eFlags & CHANUKAH_CANDLES && candlesEv && !options.noHolidays) {
                // Replace Chanukah event with a clone that includes candle lighting time.
                // For clarity, allow a "duplicate" candle lighting event to remain for Shabbat
                const chanukahEv = makeWeekdayChanukahCandleLighting(ev, hd, options);
                if (chanukahEv) {
                    if (isFriday || isSaturday) {
                        chanukahEv.eventTime = candlesEv.eventTime;
                        chanukahEv.eventTimeStr = candlesEv.eventTimeStr;
                    }
                    ev = chanukahEv;
                }
                candlesEv = undefined;
            }
        }
        if (!options.noHolidays ||
            (options.yomKippurKatan && eFlags & YOM_KIPPUR_KATAN)) {
            events.push(ev); // the original event itself
        }
    }
    if (ev.endEvent && (isMajorFast || (isMinorFast && !options.noMinorFast))) {
        events.push(ev.endEvent);
    }
    return candlesEv;
}
function makeMoladAndMevarchimChodesh(hd, options) {
    const evts = [];
    const hmonth = hd.getMonth();
    const hdate = hd.getDate();
    if (hmonth !== ELUL && hdate >= 23 && hdate <= 29) {
        const hyear = hd.getFullYear();
        const monNext = hmonth === HDate.monthsInYear(hyear) ? NISAN : hmonth + 1;
        if (options.molad) {
            evts.push(new MoladEvent(hd, hyear, monNext, options));
        }
        if (options.shabbatMevarchim) {
            const nextMonthName = HDate.getMonthName(monNext, hyear);
            const molad = new Molad(hyear, monNext);
            const memo = molad.render(options.locale || 'en', options);
            evts.push(new MevarchimChodeshEvent(hd, nextMonthName, memo));
        }
    }
    return evts;
}
function dailyLearningName(key, val) {
    if (key === 'yerushalmi') {
        return val === 2 ? 'yerushalmi-schottenstein' : 'yerushalmi-vilna';
    }
    return key;
}
function makeDailyLearning(hd, dailyLearning, il) {
    const evts = [];
    for (const [key, val] of Object.entries(dailyLearning)) {
        if (val) {
            const name = dailyLearningName(key, val);
            const learningEv = DailyLearning.lookup(name, hd, il);
            if (learningEv) {
                evts.push(learningEv);
            }
        }
    }
    return evts;
}
function makeOmerEvent(hd, omerDay, options) {
    const omerEv = new OmerEvent(hd, omerDay);
    if (options.candlelighting) {
        const location = options.location;
        const zmanim = new Zmanim(location, hd.prev(), false);
        const tzeit = zmanim.tzeit(7.0833);
        if (!isNaN(tzeit.getTime())) {
            omerEv.alarm = tzeit;
        }
    }
    return omerEv;
}

exports.AsaraBTevetEvent = AsaraBTevetEvent;
exports.CandleLightingEvent = CandleLightingEvent;
exports.DailyLearning = DailyLearning;
exports.Event = Event;
exports.GeoLocation = GeoLocation;
exports.HDate = HDate;
exports.HavdalahEvent = HavdalahEvent;
exports.HebrewCalendar = HebrewCalendar;
exports.HebrewDateEvent = HebrewDateEvent;
exports.HolidayEvent = HolidayEvent;
exports.Locale = Locale;
exports.Location = Location;
exports.MevarchimChodeshEvent = MevarchimChodeshEvent;
exports.Molad = Molad;
exports.MoladEvent = MoladEvent;
exports.NOAACalculator = NOAACalculator;
exports.OmerEvent = OmerEvent;
exports.ParshaEvent = ParshaEvent;
exports.RoshChodeshEvent = RoshChodeshEvent;
exports.RoshHashanaEvent = RoshHashanaEvent;
exports.Sedra = Sedra;
exports.TimedEvent = TimedEvent;
exports.Zmanim = Zmanim;
exports.flags = flags;
exports.gematriya = gematriya;
exports.gematriyaStrToNum = gematriyaStrToNum;
exports.holidayDesc = holidayDesc;
exports.months = months;
exports.parshiot = parshiot;
exports.version = version;

return exports;

})({});
//# sourceMappingURL=bundle.js.map

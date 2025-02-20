import React, { useState, useEffect } from "react";
import Select from "react-select";               // <-- react-select
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import OpenAI from 'openai';

// Initialize OpenAI with DeepSeek API
// const openai = new OpenAI({
//   baseURL: 'https://api.deepseek.com',
//   apiKey: '<DeepSeek API Key>',
//   dangerouslyAllowBrowser: true, // Replace with your actual API key
// });

// Function to track query limits per session
const getQueryCount = () => {
  return parseInt(localStorage.getItem('queryCount') || '0', 10);
};

const trackQuery = () => {
  localStorage.setItem('queryCount', getQueryCount() + 1);
};

const checkQueryLimit = () => {
  return getQueryCount() < 3;
};

//------------------------------------------
// 1) All Category Factors & Converters
//------------------------------------------

// Additional categories:
const cookingFactors = {
  Teaspoon: 1,
  Tablespoon: 3,
  Cup: 48,
  Ounce: 6,
  Pint: 96
};
function convertCooking(val, from, to) {
  const f1 = cookingFactors[from];
  const f2 = cookingFactors[to];
  return f1 && f2 ? (val * f1) / f2 : NaN;
}

const astronomyFactors = {
  "Astronomical Unit": 1,
  "Light Year": 63241.077,
  Parsec: 206265
};
function convertAstronomy(val, from, to) {
  const f1 = astronomyFactors[from];
  const f2 = astronomyFactors[to];
  return f1 && f2 ? (val * f1) / f2 : NaN;
}

const printingFactors = {
  Pixel: 1,
  Point: 1.3333,
  Pica: 8
};
function convertPrinting(val, from, to) {
  const f1 = printingFactors[from];
  const f2 = printingFactors[to];
  return f1 && f2 ? (val * f1) / f2 : NaN;
}

// Basic categories from your code
const lengthFactors = {
  Kilometer: 1000,
  Centimeter: 0.01,
  Millimeter: 0.001,
  Meter: 1,
  Micrometer: 1e-6,
  Nanometer: 1e-9,
  Mile: 1609.344,
  Yard: 0.9144,
  Foot: 0.3048,
  Inch: 0.0254,
  "Light Year": 9.461e15
};
function convertLength(value, from, to) {
  const f1 = lengthFactors[from];
  const f2 = lengthFactors[to];
  if (!f1 || !f2) return NaN;
  return (value * f1) / f2;
}

// Real temperature logic
function convertTemperature(value, from, to) {
  if (from === to) return value;

  let celsius;
  if (from === "Celsius") {
    celsius = value;
  } else if (from === "Fahrenheit") {
    celsius = (value - 32) * (5 / 9);
  } else {
    // from === "Kelvin"
    celsius = value - 273.15;
  }

  if (to === "Celsius") {
    return celsius;
  } else if (to === "Fahrenheit") {
    return celsius * (9 / 5) + 32;
  } else {
    // to === "Kelvin"
    return celsius + 273.15;
  }
}

const areaFactors = {
  "Square Meter": 1,
  "Square Kilometer": 1e6,
  "Square Centimeter": 1e-4,
  "Square Millimeter": 1e-6,
  "Square Micrometer": 1e-12,
  Hectare: 10000,
  "Square Mile": 2.58999e6,
  "Square Yard": 0.836127,
  "Square Foot": 0.092903,
  "Square Inch": 0.00064516,
  Acre: 4046.8564224
};
function convertArea(value, from, to) {
  const f1 = areaFactors[from];
  const f2 = areaFactors[to];
  if (!f1 || !f2) return NaN;
  return (value * f1) / f2;
}

const volumeFactors = {
  "Cubic Meter": 1,
  "Cubic Kilometer": 1e9,
  "Cubic Centimeter": 1e-6,
  "Cubic Millimeter": 1e-9,
  Liter: 0.001,
  Milliliter: 1e-6,
  "US Gallon": 0.003785411784,
  "US Quart": 0.000946352946,
  "US Pint": 0.000473176473,
  "US Cup": 0.0002365882365,
  "US Fluid Ounce": 2.9574e-5,
  "US Table Spoon": 1.47868e-5,
  "US Tea Spoon": 4.92892e-6,
  "Imperial Gallon": 0.00454609,
  "Imperial Quart": 0.0011365225,
  "Imperial Pint": 0.00056826125,
  "Imperial Fluid Ounce": 2.84130625e-5,
  "Imperial Table Spoon": 1.77582e-5,
  "Imperial Tea Spoon": 5.9194e-6,
  "Cubic Mile": 4.16818183e9,
  "Cubic Yard": 0.764554857984,
  "Cubic Foot": 0.028316846592,
  "Cubic Inch": 1.6387064e-5
};
function convertVolume(value, from, to) {
  const f1 = volumeFactors[from];
  const f2 = volumeFactors[to];
  if (!f1 || !f2) return NaN;
  return (value * f1) / f2;
}

const weightFactors = {
  Kilogram: 1,
  Gram: 0.001,
  Milligram: 1e-6,
  "Metric Ton": 1000,
  "Long Ton": 1016.0469088,
  "Short Ton": 907.18474,
  Pound: 0.45359237,
  Ounce: 0.028349523125,
  Carrat: 0.0002,
  "Atomic Mass Unit": 1.6605390666e-27
};
function convertWeight(value, from, to) {
  const f1 = weightFactors[from];
  const f2 = weightFactors[to];
  if (!f1 || !f2) return NaN;
  return (value * f1) / f2;
}

const timeFactors = {
  Second: 1,
  Millisecond: 1e-3,
  Microsecond: 1e-6,
  Nanosecond: 1e-9,
  Picosecond: 1e-12,
  Minute: 60,
  Hour: 3600,
  Day: 86400,
  Week: 604800,
  Month: 2629800,
  Year: 31557600
};
function convertTime(value, from, to) {
  const f1 = timeFactors[from];
  const f2 = timeFactors[to];
  if (!f1 || !f2) return NaN;
  return (value * f1) / f2;
}

const dataStorageFactors = {
  "bit [b]": 1 / 8,
  nibble: 1 / 2,
  "byte [B]": 1,
  character: 1,
  word: 2,
  "MAPM-word": 16,
  "quadruple-word": 8,
  block: 512,
  "kilobit [kb]": 125,
  "kilobyte [kB]": 1024,
  "kilobyte (10^3 bytes)": 1000,
  "megabit [Mb]": 125000,
  "megabyte [MB]": 1024 * 1024,
  "megabyte (10^6 bytes)": 1e6,
  "gigabit [Gb]": 125000000,
  "gigabyte [GB]": 1024 ** 3,
  "gigabyte (10^9 bytes)": 1e9,
  "terabit [Tb]": 125000000000,
  "terabyte [TB]": 1024 ** 4,
  "terabyte (10^12 bytes)": 1e12,
  "petabit [Pb]": 125000000000000,
  "petabyte [PB]": 1024 ** 5,
  "petabyte (10^15 bytes)": 1e15,
  "exabit [Eb]": 125000000000000000,
  "exabyte [EB]": 1024 ** 6,
  "exabyte (10^18 bytes)": 1e18,

  "floppy disk (3.5\", DD)": 737280,
  "floppy disk (3.5\", HD)": 1474560,
  "floppy disk (3.5\", ED)": 2949120,
  "floppy disk (5.25\", DD)": 368640,
  "floppy disk (5.25\", HD)": 1228800,
  "Zip 100": 100 * 1024 * 1024,
  "Zip 250": 250 * 1024 * 1024,
  "Jaz 1GB": 1 * 1024 * 1024 * 1024,
  "Jaz 2GB": 2 * 1024 * 1024 * 1024,
  "CD (74 minute)": 650 * 1024 * 1024,
  "CD (80 minute)": 700 * 1024 * 1024,
  "DVD (1 layer, 1 side)": 4.7e9,
  "DVD (2 layer, 1 side)": 8.5e9,
  "DVD (1 layer, 2 side)": 9.4e9,
  "DVD (2 layer, 2 side)": 1.71e10
};
function convertDataStorage(value, from, to) {
  const f1 = dataStorageFactors[from];
  const f2 = dataStorageFactors[to];
  if (!f1 || !f2) return NaN;
  return (value * f1) / f2;
}

const energyFactors = {
  "joule [J]": 1,
  "kilojoule [kJ]": 1e3,
  "kilowatt-hour [kW*h]": 3.6e6,
  "watt-hour [W*h]": 3600,
  "calorie (nutritional)": 4184,
  "horsepower (metric) hour": 735.49875 * 3600,
  "Btu (IT)": 1055.05585,
  "Btu (th)": 1054.35026444,
  "gigajoule [GJ]": 1e9,
  "megajoule [MJ]": 1e6,
  "millijoule [mJ]": 1e-3,
  "microjoule [µJ]": 1e-6,
  "nanojoule [nJ]": 1e-9,
  "attojoule [aJ]": 1e-18,
  "megaelectron-volt [MeV]": 1.602176634e-13,
  "kiloelectron-volt [kEv]": 1.602176634e-16,
  "electron-volt [eV]": 1.602176634e-19,
  erg: 1e-7,
  "gigawatt-hour [GW*h]": 3.6e12,
  "megawatt-hour [MW*h]": 3.6e9,
  "kilowatt-second [kW*s]": 1000,
  "watt-second [W*s]": 1,
  "newton meter [N*m]": 1,
  "horsepower hour [hp*h]": 745.7 * 3600,
  "kilocalorie (IT) [kcal (IT)]": 4184,
  "kilocalorie (th) [kcal (th)]": 4186.8,
  "calorie (IT) [cal (IT)]": 4.1868,
  "calorie (th) [cal (th)]": 4.184,
  "mega Btu (IT) [MBtu (IT)]": 1.05505585e9,
  "ton-hour (refrigeration)": 12660670,
  "fuel oil equivalent @kiloliter": 4.1868e10,
  "fuel oil equivalent @barrel (US)": 6.119e9,
  gigaton: 4.184e18,
  megaton: 4.184e15,
  kiloton: 4.184e12,
  "ton (explosives)": 4.184e9,
  "dyne centimeter [dyn*cm]": 1e-7,
  "gram-force meter [gf*m]": 0.00980665,
  "gram-force centimeter": 9.80665e-5,
  "kilogram-force centimeter": 0.0980665,
  "kilogram-force meter": 9.80665,
  "kilopond meter [kp*m]": 9.80665,
  "pound-force foot [lbf*ft]": 1.3558179483314,
  "pound-force inch [lbf*in]": 0.112984829027,
  "ounce-force inch [ozf*in]": 0.0070615518142,
  "foot-pound [ft*lbf]": 1.3558179483314,
  "inch-pound [in*lbf]": 0.112984829027,
  "inch-ounce [in*ozf]": 0.0070615518142,
  "poundal foot [pdl*ft]": 0.0421401100938,
  therm: 105505600,
  "therm (EC)": 105505600,
  "therm (US)": 105480400,
  "Hartree energy": 4.3597447222071e-18,
  Rydberg: 2.1798723611035e-18
};
function convertEnergy(value, from, to) {
  const f1 = energyFactors[from];
  const f2 = energyFactors[to];
  if (!f1 || !f2) return NaN;
  return (value * f1) / f2;
}

const powerFactors = {
  "watt [W]": 1,
  "exawatt [EW]": 1e18,
  "petawatt [PW]": 1e15,
  "terawatt [TW]": 1e12,
  "gigawatt [GW]": 1e9,
  "megawatt [MW]": 1e6,
  "kilowatt [kW]": 1e3,
  "hectowatt [hW]": 100,
  "dekawatt [daW]": 10,
  "deciwatt [dW]": 0.1,
  "centiwatt [cW]": 0.01,
  "milliwatt [mW]": 1e-3,
  "microwatt [µW]": 1e-6,
  "nanowatt [nW]": 1e-9,
  "picowatt [pW]": 1e-12,
  "femtowatt [fW]": 1e-15,
  "attowatt [aW]": 1e-18,
  "horsepower [hp, hp (UK)]": 745.7,
  "horsepower (550 ft*lbf/s)": 745.7,
  "horsepower (metric)": 735.49875,
  "horsepower (boiler)": 9809.5,
  "horsepower (electric)": 746,
  "horsepower (water)": 746,
  "pferdestarke (ps)": 735.49875,
  "Btu (IT)/hour [Btu/h]": 0.29307107,
  "Btu (IT)/minute [Btu/min]": 17.584264,
  "Btu (IT)/second [Btu/s]": 1054.96,
  "Btu (th)/hour [Btu (th)/h]": 0.292875,
  "Btu (th)/minute": 17.5725,
  "Btu (th)/second [Btu (th)/s]": 1054.35,
  "MBtu (IT)/hour [MBtu/h]": 293071.07,
  MBH: 293.07107,
  "ton (refrigeration)": 3516.8528421,
  "kilocalorie (IT)/hour [kcal/h]": 1.163,
  "kilocalorie (IT)/minute": 69.78,
  "kilocalorie (IT)/second": 4186.8,
  "kilocalorie (th)/hour": 1.16222,
  "kilocalorie (th)/minute": 69.7333,
  "kilocalorie (th)/second": 4184,
  "calorie (IT)/hour [cal/h]": 0.001163,
  "calorie (IT)/minute [cal/min]": 0.06978,
  "calorie (IT)/second [cal/s]": 4.1868,
  "calorie (th)/hour [cal (th)/h]": 0.00116222,
  "calorie (th)/minute": 0.0697333,
  "calorie (th)/second": 4.184,
  "foot pound-force/hour": 0.0003766161,
  "foot pound-force/minute": 0.022596966,
  "foot pound-force/second": 1.355818,
  "pound-foot/hour [lbf*ft/h]": 0.0003766161,
  "pound-foot/minute": 0.022596966,
  "pound-foot/second": 1.355818,
  "erg/second [erg/s]": 1e-7,
  "kilovolt ampere [kV*A]": 1000,
  "volt ampere [V*A]": 1,
  "newton meter/second": 1,
  "joule/second [J/s]": 1,
  "exajoule/second [EJ/s]": 1e18,
  "petajoule/second [PJ/s]": 1e15,
  "terajoule/second [TJ/s]": 1e12,
  "gigajoule/second [GJ/s]": 1e9,
  "megajoule/second [MJ/s]": 1e6,
  "kilojoule/second [kJ/s]": 1e3,
  "hectojoule/second [hJ/s]": 100,
  "dekajoule/second [daJ/s]": 10,
  "decijoule/second [dJ/s]": 0.1,
  "centijoule/second [cJ/s]": 0.01,
  "millijoule/second [mJ/s]": 1e-3,
  "microjoule/second [µJ/s]": 1e-6,
  "nanojoule/second [nJ/s]": 1e-9,
  "picojoule/second [pJ/s]": 1e-12,
  "femtojoule/second [fJ/s]": 1e-15,
  "attojoule/second [aJ/s]": 1e-18,
  "joule/hour [J/h]": 1 / 3600,
  "joule/minute [J/min]": 1 / 60,
  "kilojoule/hour [kJ/h]": 1e3 / 3600,
  "kilojoule/minute [kJ/min]": 1e3 / 60
};
function convertPower(value, from, to) {
  const f1 = powerFactors[from];
  const f2 = powerFactors[to];
  if (!f1 || !f2) return NaN;
  return (value * f1) / f2;
}

// -----------------------------------------------------------------------
// 2) Currency Setup
// -----------------------------------------------------------------------
async function fetchCurrencyRates(base = "USD") {
  console.log("Fetching currency rates from API..."); // debugging
  const url = `https://api.exchangerate.host/latest?base=${base}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.rates) {
      return data.rates;
    }
  } catch (err) {
    console.error("Currency fetch error:", err);
  }
  return null;
}

function convertCurrency(val, from, to, rates) {
  if (!rates || !rates[from] || !rates[to]) return NaN;
  // ratio approach
  return (val / rates[from]) * rates[to];
}

//------------------------------------------
// 3) Category Object
//------------------------------------------
const categories = {
  // Basic
  Length: {
    units: Object.keys(lengthFactors),
    convert: convertLength,
    tip: "Measurements based on meters (m)."
  },
  Temperature: {
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    convert: convertTemperature,
    tip: "Converts Celsius, Fahrenheit, Kelvin."
  },
  Area: {
    units: Object.keys(areaFactors),
    convert: convertArea,
    tip: "Square meters, acres, etc."
  },
  Volume: {
    units: Object.keys(volumeFactors),
    convert: convertVolume,
    tip: "Liters, gallons, etc."
  },
  Weight: {
    units: Object.keys(weightFactors),
    convert: convertWeight,
    tip: "Kilograms, pounds, etc."
  },
  Time: {
    units: Object.keys(timeFactors),
    convert: convertTime,
    tip: "Seconds, minutes, hours, etc."
  },

  // Advanced
  "Data Storage": {
    units: Object.keys(dataStorageFactors),
    convert: convertDataStorage,
    tip: "Bytes, kilobytes, etc."
  },
  Energy: {
    units: Object.keys(energyFactors),
    convert: convertEnergy,
    tip: "Joules, calories, kWh, etc."
  },
  Power: {
    units: Object.keys(powerFactors),
    convert: convertPower,
    tip: "Watts, horsepower, etc."
  },

  // Additional
  Cooking: {
    units: Object.keys(cookingFactors),
    convert: convertCooking,
    tip: "US cooking volumes."
  },
  Astronomy: {
    units: Object.keys(astronomyFactors),
    convert: convertAstronomy,
    tip: "Astronomical distances (AU, LY, parsec)."
  },
  Printing: {
    units: Object.keys(printingFactors),
    convert: convertPrinting,
    tip: "Typography (px, pt, pica)."
  },
  Currency: {
    units: [],
    convert: (val, from, to, rates) => convertCurrency(val, from, to, rates),
    tip: "Live exchange rates via API."
  }
};

// -----------------------------------------------------------------------
// 4) Multi-Language Strings
// -----------------------------------------------------------------------
const translations = {
  en: {
    title: "Common Converters",
    language: "Language",
    darkMode: "Dark Mode",
    category: "Category",
    from: "From",
    to: "To",
    placeholder: "Enter value",
    invalidInput: "Invalid Input",
    noConverter: "No converter function found",
    error: "Conversion Error",
    result: "Result",
    stepUp: "▲",
    stepDown: "▼",
    tip: "Tip"
  },
  es: {
    title: "Mega Convertidor",
    language: "Idioma",
    darkMode: "Modo Oscuro",
    category: "Categoría",
    from: "De",
    to: "A",
    placeholder: "Ingresa valor",
    invalidInput: "Entrada inválida",
    noConverter: "No existe función de conversión",
    error: "Error de conversión",
    result: "Resultado",
    stepUp: "▲",
    stepDown: "▼",
    tip: "Consejo"
  }
};

// -----------------------------------------------------------------------
// 5) The Main Component
// -----------------------------------------------------------------------
export default function UnitConverter() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  // Category
  const [category, setCategory] = useState("Length");

  // Currency
  const [currencyRates, setCurrencyRates] = useState(null);

  // fromUnit / toUnit
  const [fromUnit, setFromUnit] = useState(categories["Length"].units[0]);
  const [toUnit, setToUnit] = useState(categories["Length"].units[1] || categories["Length"].units[0]);

  // value & result
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

  // AI Conversion
  const [query, setQuery] = useState('');
  const [conversionResult, setConversionResult] = useState('');
  const [error, setError] = useState('');

  // 1) Fetch currency on mount
  useEffect(() => {
    (async function() {
      const rates = await fetchCurrencyRates("USD");
      if (rates) {
        // For simplicity, let’s just store all codes:
        categories.Currency.units = Object.keys(rates).sort();
        setCurrencyRates(rates);
      }
    })();
  }, []);

  // 2) Whenever we switch category, reset from/to if needed
  useEffect(() => {
    if (category === "Currency" && currencyRates) {
      const newUnits = categories.Currency.units;
      if (newUnits.length > 0) {
        setFromUnit(newUnits[0]);
        setToUnit(newUnits[1] || newUnits[0]);
      }
    } else {
      const newUnits = categories[category].units;
      setFromUnit(newUnits[0]);
      setToUnit(newUnits[1] || newUnits[0]);
    }
    setValue("");
    setResult("");
  }, [category, currencyRates]);

  // 3) Dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark", "bg-gray-900", "text-gray-100");
    } else {
      document.body.classList.remove("dark", "bg-gray-900", "text-gray-100");
    }
  }, [darkMode]);

  // 4) AI Conversion Handler
  const handleAIConversion = async () => {
    if (!checkQueryLimit()) {
      setError('You have reached the limit of 3 AI queries per session.');
      return;
    }

    try {
      trackQuery();
      const response = await fetch('/api/aiconvert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversion result');
      }

      const data = await response.json();
      setConversionResult(data.result);
    } catch (err) {
      console.error("Error with AI API:", err);
      setError("Something went wrong with the conversion.");
    }
  };

  // 5) doConvert => always re-run if from/to changes
  const doConvert = (val, from, to) => {
    const numericVal = parseFloat(val);
    if (isNaN(numericVal)) {
      setResult(t.invalidInput);
      return;
    }
    const converter = categories[category].convert;
    if (!converter) {
      setResult(t.noConverter);
      return;
    }
    let converted;
    if (category === "Currency") {
      converted = converter(numericVal, from, to, currencyRates);
    } else {
      converted = converter(numericVal, from, to);
    }
    if (isNaN(converted)) {
      setResult(t.error);
    } else {
      setResult(`${converted} ${to}`);
    }
  };

  // 6) Step function
  const stepValue = (delta) => {
    const curr = parseFloat(value) || 0;
    const newVal = curr + delta;
    setValue(String(newVal));
    // Re-run with newVal
    doConvert(String(newVal), fromUnit, toUnit);
  };

  // 7) Handlers
  const handleValueChange = (val) => {
    setValue(val);
    doConvert(val, fromUnit, toUnit);
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const handleFromUnitChange = (e) => {
    const newUnit = e.target.value;
    setFromUnit(newUnit);
    // re-run doConvert with same input
    doConvert(value, newUnit, toUnit);
  };
  const handleToUnitChange = (e) => {
    const newUnit = e.target.value;
    setToUnit(newUnit);
    // re-run doConvert with same input
    doConvert(value, fromUnit, newUnit);
  };

  return (
    <Card className="p-6 shadow-md bg-white max-w-4xl mx-auto">
      <CardContent>
        {/* Title / Lang / Dark Mode */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">{t.title}</h2>
          <div className="mt-2 md:mt-0 flex items-center space-x-4">
            {/* Language */}
            <div>
              <label className="mr-1">{t.language}:</label>
              <select
                className="border rounded p-1"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            {/* Dark Mode */}
            <div>
              <label className="mr-1">{t.darkMode}:</label>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-2">
          <label className="block font-semibold mb-1">{t.category}:</label>
          <select
            className="border rounded p-2 w-full"
            value={category}
            onChange={handleCategoryChange}
          >
            <optgroup label="Basic Converters">
              <option value="Length">Length</option>
              <option value="Temperature">Temperature</option>
              <option value="Area">Area</option>
              <option value="Volume">Volume</option>
              <option value="Weight">Weight</option>
              <option value="Time">Time</option>
            </optgroup>
            <optgroup label="Advanced Converters">
              <option value="Data Storage">Data Storage</option>
              <option value="Energy">Energy</option>
              <option value="Power">Power</option>
            </optgroup>
            <optgroup label="Other">
              <option value="Cooking">Cooking</option>
              <option value="Astronomy">Astronomy</option>
              <option value="Printing">Printing</option>
              <option value="Currency">Currency</option>
            </optgroup>
          </select>
          <p className="text-sm text-gray-600 italic mt-1">
            {t.tip}: {categories[category]?.tip}
          </p>
        </div>

        {/* FROM */}
        <div className="mb-2">
          <label className="block font-semibold mb-1">{t.from}:</label>
          <select
            className="border rounded p-2 w-full"
            value={fromUnit}
            onChange={handleFromUnitChange}
          >
            {categories[category].units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* TO */}
        <div className="mb-2">
          <label className="block font-semibold mb-1">{t.to}:</label>
          <select
            className="border rounded p-2 w-full"
            value={toUnit}
            onChange={handleToUnitChange}
          >
            {categories[category].units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Value + Stepper */}
        <div className="mt-4">
          <label className="block font-semibold mb-1">
            {t.placeholder}:
          </label>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder={t.placeholder}
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              className="border p-2 rounded w-40"
            />
            <button
              className="bg-gray-200 border rounded px-3 py-1"
              onClick={() => stepValue(1)}
            >
              {t.stepUp}
            </button>
            <button
              className="bg-gray-200 border rounded px-3 py-1"
              onClick={() => stepValue(-1)}
            >
              {t.stepDown}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-4 text-xl font-semibold">
            {t.result}: {result}
          </div>
        )}

        {/* AI Conversion Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">AI-Powered Unit Conversion</h2>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Helpful Prompt Hints:</h3>
            <ul className="list-disc pl-6">
              <li>What is the average mpg a sedan in the USA will give?</li>
              <li>What is the ideal water-to-milk ratio per gallon so it won't get diluted a lot?</li>
            </ul>
          </div>
          <br></br>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about unit conversion (e.g. 'Convert 1 mile to km')"
            className="border rounded p-2 w-full"
          />
          <button
            onClick={handleAIConversion}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Convert with AI
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {conversionResult && (
            <div className="mt-4 text-xl font-semibold">
              AI Result: {conversionResult}
            </div>
          )}
          
        </div>
      </CardContent>
    </Card>
  );
}

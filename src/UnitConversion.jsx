import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';

/****************************************************************************************
 * Existing categories: Length, Temperature, Area, Volume, Weight, Time
 * New subsection: Advanced Converters -> Data Storage, Energy, Power
 *
 * Each category uses factor-based conversion with a chosen "base unit"
 * (Except Temperature, which uses a custom formula).
 ****************************************************************************************/

/* -----------------------------------------------------------------------------
    LENGTH (base = Meter)
   ----------------------------------------------------------------------------- */
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
  'Light Year': 9.461e15
};

function convertLength(value, from, to) {
  const fromFactor = lengthFactors[from];
  const toFactor = lengthFactors[to];
  if (!fromFactor || !toFactor) return NaN;
  return (value * fromFactor) / toFactor;
}

/* -----------------------------------------------------------------------------
    TEMPERATURE (custom logic)
   ----------------------------------------------------------------------------- */
function convertTemperature(value, from, to) {
  if (from === to) return value;

  // Convert from -> Celsius
  let celsius;
  if (from === 'Celsius') {
    celsius = value;
  } else if (from === 'Fahrenheit') {
    celsius = (value - 32) * (5 / 9);
  } else {
    // from === 'Kelvin'
    celsius = value - 273.15;
  }

  // Convert Celsius -> to
  if (to === 'Celsius') {
    return celsius;
  } else if (to === 'Fahrenheit') {
    return celsius * (9 / 5) + 32;
  } else {
    // to === 'Kelvin'
    return celsius + 273.15;
  }
}

/* -----------------------------------------------------------------------------
    AREA (base = Square Meter)
   ----------------------------------------------------------------------------- */
const areaFactors = {
  'Square Meter': 1,
  'Square Kilometer': 1e6,
  'Square Centimeter': 1e-4,
  'Square Millimeter': 1e-6,
  'Square Micrometer': 1e-12,
  Hectare: 10000,
  'Square Mile': 2.58999e6,
  'Square Yard': 0.836127,
  'Square Foot': 0.092903,
  'Square Inch': 0.00064516,
  Acre: 4046.8564224
};

function convertArea(value, from, to) {
  const fromFactor = areaFactors[from];
  const toFactor = areaFactors[to];
  if (!fromFactor || !toFactor) return NaN;
  return (value * fromFactor) / toFactor;
}

/* -----------------------------------------------------------------------------
    VOLUME (base = Cubic Meter)
   ----------------------------------------------------------------------------- */
const volumeFactors = {
  'Cubic Meter': 1,
  'Cubic Kilometer': 1e9,
  'Cubic Centimeter': 1e-6,
  'Cubic Millimeter': 1e-9,
  Liter: 0.001,
  Milliliter: 1e-6,
  'US Gallon': 0.003785411784,
  'US Quart': 0.000946352946,
  'US Pint': 0.000473176473,
  'US Cup': 0.0002365882365,
  'US Fluid Ounce': 2.9574e-5,
  'US Table Spoon': 1.47868e-5,
  'US Tea Spoon': 4.92892e-6,
  'Imperial Gallon': 0.00454609,
  'Imperial Quart': 0.0011365225,
  'Imperial Pint': 0.00056826125,
  'Imperial Fluid Ounce': 2.84130625e-5,
  'Imperial Table Spoon': 1.77582e-5,
  'Imperial Tea Spoon': 5.9194e-6,
  'Cubic Mile': 4.16818183e9,
  'Cubic Yard': 0.764554857984,
  'Cubic Foot': 0.028316846592,
  'Cubic Inch': 1.6387064e-5
};

function convertVolume(value, from, to) {
  const fromFactor = volumeFactors[from];
  const toFactor = volumeFactors[to];
  if (!fromFactor || !toFactor) return NaN;
  return (value * fromFactor) / toFactor;
}

/* -----------------------------------------------------------------------------
    WEIGHT (base = Kilogram)
   ----------------------------------------------------------------------------- */
const weightFactors = {
  Kilogram: 1,
  Gram: 0.001,
  Milligram: 1e-6,
  'Metric Ton': 1000,
  'Long Ton': 1016.0469088,
  'Short Ton': 907.18474,
  Pound: 0.45359237,
  Ounce: 0.028349523125,
  Carrat: 0.0002,
  'Atomic Mass Unit': 1.6605390666e-27
};

function convertWeight(value, from, to) {
  const fromFactor = weightFactors[from];
  const toFactor = weightFactors[to];
  if (!fromFactor || !toFactor) return NaN;
  return (value * fromFactor) / toFactor;
}

/* -----------------------------------------------------------------------------
    TIME (base = Second)
   ----------------------------------------------------------------------------- */
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
  Month: 2629800,       // ~30.4375 days
  Year: 31557600       // ~365.25 days
};

function convertTime(value, from, to) {
  const fromFactor = timeFactors[from];
  const toFactor = timeFactors[to];
  if (!fromFactor || !toFactor) return NaN;
  return (value * fromFactor) / toFactor;
}

/* -----------------------------------------------------------------------------
    ADVANCED CONVERTERS
    1) DATA STORAGE (base = Byte)
   ----------------------------------------------------------------------------- */

// Example references for 1 Byte = 1
// Many approximate values for floppies, DVDs, etc.
const dataStorageFactors = {
  'bit [b]': 1 / 8,
  nibble: 1 / 2,
  'byte [B]': 1,
  character: 1,          // 1 char = 1 byte (ASCII assumption)
  word: 2,               // typical 16-bit word
  'MAPM-word': 16,       // example placeholder
  'quadruple-word': 8,   // double word is 4 bytes, quadruple = 8
  block: 512,            // typical block size
  'kilobit [kb]': 125,   // 1 kb = 1000 bits = 125 bytes
  'kilobyte [kB]': 1024,
  'kilobyte (10^3 bytes)': 1000,
  'megabit [Mb]': 125000,        // 1e6 bits => 125000 bytes
  'megabyte [MB]': 1024 * 1024,  // 1,048,576
  'megabyte (10^6 bytes)': 1e6,
  'gigabit [Gb]': 125000000,     // 1e9 bits => 125e6 bytes
  'gigabyte [GB]': 1024 ** 3,    // 1,073,741,824
  'gigabyte (10^9 bytes)': 1e9,
  'terabit [Tb]': 125000000000,  // 1e12 bits => 125e9 bytes
  'terabyte [TB]': 1024 ** 4,    // 1,099,511,627,776
  'terabyte (10^12 bytes)': 1e12,
  'petabit [Pb]': 125000000000000,  // 1e15 bits => 125e12 bytes
  'petabyte [PB]': 1024 ** 5,       // 1,125,899,906,842,624
  'petabyte (10^15 bytes)': 1e15,
  'exabit [Eb]': 125000000000000000, // 1e18 bits => 125e15 bytes
  'exabyte [EB]': 1024 ** 6,         // 1,152,921,504,606,846,976
  'exabyte (10^18 bytes)': 1e18,

  // Common floppies
  'floppy disk (3.5\", DD)': 737280,        // ~720 KB
  'floppy disk (3.5\", HD)': 1474560,       // ~1.44 MB
  'floppy disk (3.5\", ED)': 2949120,       // ~2.88 MB
  'floppy disk (5.25\", DD)': 368640,       // ~360 KB
  'floppy disk (5.25\", HD)': 1228800,      // ~1.2 MB
  'Zip 100': 100 * 1024 * 1024,             // 104,857,600
  'Zip 250': 250 * 1024 * 1024,             // 262,144,000
  'Jaz 1GB': 1 * 1024 * 1024 * 1024,         // 1,073,741,824
  'Jaz 2GB': 2 * 1024 * 1024 * 1024,         // 2,147,483,648
  'CD (74 minute)': 650 * 1024 * 1024,      // ~681,574,400
  'CD (80 minute)': 700 * 1024 * 1024,      // ~733,007,680

  // DVDs (marketing sizes – approximate)
  'DVD (1 layer, 1 side)': 4.7e9,  // ~4.7 GB
  'DVD (2 layer, 1 side)': 8.5e9,
  'DVD (1 layer, 2 side)': 9.4e9,
  'DVD (2 layer, 2 side)': 1.71e10
};

function convertDataStorage(value, from, to) {
  const fromFactor = dataStorageFactors[from];
  const toFactor = dataStorageFactors[to];
  if (!fromFactor || !toFactor) return NaN;
  return (value * fromFactor) / toFactor;
}

/* -----------------------------------------------------------------------------
    2) ENERGY (base = Joule [J])
   ----------------------------------------------------------------------------- */
const energyFactors = {
  // base: Joule
  'joule [J]': 1,
  'kilojoule [kJ]': 1e3,
  'kilowatt-hour [kW*h]': 3.6e6,   // 1 kWh = 3.6e6 J
  'watt-hour [W*h]': 3600,         // 1 Wh = 3600 J
  'calorie (nutritional)': 4184,   // 1 food Cal
  'horsepower (metric) hour': 735.49875 * 3600, // ~2.648e6 J
  'Btu (IT)': 1055.05585,
  'Btu (th)': 1054.35026444,       // approximate
  'gigajoule [GJ]': 1e9,
  'megajoule [MJ]': 1e6,
  'millijoule [mJ]': 1e-3,
  'microjoule [µJ]': 1e-6,
  'nanojoule [nJ]': 1e-9,
  'attojoule [aJ]': 1e-18,
  'megaelectron-volt [MeV]': 1.602176634e-13, // 1 MeV in Joules
  'kiloelectron-volt [kEv]': 1.602176634e-16, // 1 keV in Joules
  'electron-volt [eV]': 1.602176634e-19,
  erg: 1e-7, // 1 erg = 1e-7 J
  'gigawatt-hour [GW*h]': 3.6e12,
  'megawatt-hour [MW*h]': 3.6e9,
  'kilowatt-second [kW*s]': 1000,    // 1 kWs = 1000 J
  'watt-second [W*s]': 1,           // 1 Ws = 1 J
  'newton meter [N*m]': 1,          // 1 Nm = 1 J
  'horsepower hour [hp*h]': 745.7 * 3600, // ~2.685e6 J (mechanical HP)
  'kilocalorie (IT) [kcal (IT)]': 4184,
  'kilocalorie (th) [kcal (th)]': 4186.8,   // approximate
  'calorie (IT) [cal (IT)]': 4.1868,       // older definitions vary
  'calorie (th) [cal (th)]': 4.184,
  'mega Btu (IT) [MBtu (IT)]': 1.05505585e9,
  'ton-hour (refrigeration)': 12660670,    // ~12.66 MJ (1 ton of cooling for 1 hour)
  'fuel oil equivalent @kiloliter': 4.1868e10, // approximate
  'fuel oil equivalent @barrel (US)': 6.119e9, // approximate
  gigaton: 4.184e18, // 1 gigaton TNT = 4.184e15 kJ => 4.184e18 J
  megaton: 4.184e15, // 1 megaton TNT
  kiloton: 4.184e12,
  'ton (explosives)': 4.184e9, // 1 ton TNT
  'dyne centimeter [dyn*cm]': 1e-7, // same as erg
  'gram-force meter [gf*m]': 0.00980665, // ~ gf = 9.80665 mN
  'gram-force centimeter': 9.80665e-5,
  'kilogram-force centimeter': 0.0980665,
  'kilogram-force meter': 9.80665,
  'kilopond meter [kp*m]': 9.80665,
  'pound-force foot [lbf*ft]': 1.3558179483314,
  'pound-force inch [lbf*in]': 0.112984829027,
  'ounce-force inch [ozf*in]': 0.0070615518142,
  'foot-pound [ft*lbf]': 1.3558179483314,
  'inch-pound [in*lbf]': 0.112984829027,
  'inch-ounce [in*ozf]': 0.0070615518142,
  'poundal foot [pdl*ft]': 0.0421401100938,
  therm: 105505600,       // 1 therm (EC) ~ 105.5 MJ
  'therm (EC)': 105505600, // synonyms
  'therm (US)': 105480400,
  'Hartree energy': 4.3597447222071e-18,
  Rydberg: 2.1798723611035e-18
};

function convertEnergy(value, from, to) {
  const fromFactor = energyFactors[from];
  const toFactor = energyFactors[to];
  if (!fromFactor || !toFactor) return NaN;
  return (value * fromFactor) / toFactor;
}

/* -----------------------------------------------------------------------------
    3) POWER (base = Watt [W])
   ----------------------------------------------------------------------------- */
const powerFactors = {
  'watt [W]': 1,
  'exawatt [EW]': 1e18,
  'petawatt [PW]': 1e15,
  'terawatt [TW]': 1e12,
  'gigawatt [GW]': 1e9,
  'megawatt [MW]': 1e6,
  'kilowatt [kW]': 1e3,
  'hectowatt [hW]': 100,
  'dekawatt [daW]': 10,
  'deciwatt [dW]': 0.1,
  'centiwatt [cW]': 0.01,
  'milliwatt [mW]': 1e-3,
  'microwatt [µW]': 1e-6,
  'nanowatt [nW]': 1e-9,
  'picowatt [pW]': 1e-12,
  'femtowatt [fW]': 1e-15,
  'attowatt [aW]': 1e-18,
  'horsepower [hp, hp (UK)]': 745.7,       // mechanical HP
  'horsepower (550 ft*lbf/s)': 745.7,      // same factor
  'horsepower (metric)': 735.49875,
  'horsepower (boiler)': 9809.5,           // approx
  'horsepower (electric)': 746,
  'horsepower (water)': 746,               // synonyms vary
  'pferdestarke (ps)': 735.49875,
  'Btu (IT)/hour [Btu/h]': 0.29307107,     // 1 Btu/h ~ 0.2931 W
  'Btu (IT)/minute [Btu/min]': 17.584264,  // multiply by 60
  'Btu (IT)/second [Btu/s]': 1054.96,
  'Btu (th)/hour [Btu (th)/h]': 0.292875,  // approx
  'Btu (th)/minute': 17.5725,
  'Btu (th)/second [Btu (th)/s]': 1054.35,
  'MBtu (IT)/hour [MBtu/h]': 293071.07,    // 1 MBtu/h = 1,000 Btu/h, etc.
  MBH: 293.07107,                          // 1 MBH = 1k Btu/h?
  'ton (refrigeration)': 3516.8528421,     // ~ 3.5169 kW
  'kilocalorie (IT)/hour [kcal/h]': 1.163, // 1 kcal/h ~ 1.163 W
  'kilocalorie (IT)/minute': 69.78,
  'kilocalorie (IT)/second': 4186.8,
  'kilocalorie (th)/hour': 1.16222,        // approx
  'kilocalorie (th)/minute': 69.7333,
  'kilocalorie (th)/second': 4184,
  'calorie (IT)/hour [cal/h]': 0.001163,
  'calorie (IT)/minute [cal/min]': 0.06978,
  'calorie (IT)/second [cal/s]': 4.1868,
  'calorie (th)/hour [cal (th)/h]': 0.00116222,
  'calorie (th)/minute': 0.0697333,
  'calorie (th)/second': 4.184,
  'foot pound-force/hour': 0.0003766161,
  'foot pound-force/minute': 0.022596966,
  'foot pound-force/second': 1.355818,
  'pound-foot/hour [lbf*ft/h]': 0.0003766161,
  'pound-foot/minute': 0.022596966,
  'pound-foot/second': 1.355818,
  'erg/second [erg/s]': 1e-7,
  'kilovolt ampere [kV*A]': 1000,  // 1 kVA ~ 1 kW (assuming PF=1)
  'volt ampere [V*A]': 1,         // 1 VA = 1 W
  'newton meter/second': 1,       // 1 N*m/s = 1 W
  'joule/second [J/s]': 1,        // same as watt
  'exajoule/second [EJ/s]': 1e18,
  'petajoule/second [PJ/s]': 1e15,
  'terajoule/second [TJ/s]': 1e12,
  'gigajoule/second [GJ/s]': 1e9,
  'megajoule/second [MJ/s]': 1e6,
  'kilojoule/second [kJ/s]': 1e3,
  'hectojoule/second [hJ/s]': 100,
  'dekajoule/second [daJ/s]': 10,
  'decijoule/second [dJ/s]': 0.1,
  'centijoule/second [cJ/s]': 0.01,
  'millijoule/second [mJ/s]': 1e-3,
  'microjoule/second [µJ/s]': 1e-6,
  'nanojoule/second [nJ/s]': 1e-9,
  'picojoule/second [pJ/s]': 1e-12,
  'femtojoule/second [fJ/s]': 1e-15,
  'attojoule/second [aJ/s]': 1e-18,
  'joule/hour [J/h]': 1 / 3600,
  'joule/minute [J/min]': 1 / 60,
  'kilojoule/hour [kJ/h]': 1e3 / 3600,
  'kilojoule/minute [kJ/min]': 1e3 / 60
};

function convertPower(value, from, to) {
  const fromFactor = powerFactors[from];
  const toFactor = powerFactors[to];
  if (!fromFactor || !toFactor) return NaN;
  return (value * fromFactor) / toFactor;
}

/****************************************************************************************
   Combine all categories into unitGroups
   (We have the original 6 + new advanced ones)
 ****************************************************************************************/
const unitGroups = {
  // Basic categories:
  Length: {
    units: Object.keys(lengthFactors),
    convert: convertLength
  },
  Temperature: {
    units: ['Celsius','Kelvin','Fahrenheit'],
    convert: convertTemperature
  },
  Area: {
    units: Object.keys(areaFactors),
    convert: convertArea
  },
  Volume: {
    units: Object.keys(volumeFactors),
    convert: convertVolume
  },
  Weight: {
    units: Object.keys(weightFactors),
    convert: convertWeight
  },
  Time: {
    units: Object.keys(timeFactors),
    convert: convertTime
  },

  // Advanced Converters:
  'Data Storage': {
    units: Object.keys(dataStorageFactors),
    convert: convertDataStorage
  },
  Energy: {
    units: Object.keys(energyFactors),
    convert: convertEnergy
  },
  Power: {
    units: Object.keys(powerFactors),
    convert: convertPower
  }
};

/****************************************************************************************
   Unit Converter UI
 ****************************************************************************************/
export default function UnitConverter() {
  // Default to the first category in advanced if you like, or stick with a basic one:
  const defaultCategory = 'Length';

  const [category, setCategory] = useState(defaultCategory);
  const [fromUnit, setFromUnit] = useState(unitGroups[defaultCategory].units[0]);
  const [toUnit, setToUnit] = useState(unitGroups[defaultCategory].units[1]);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  // Basic vs. Advanced categories
  const basicCategories = ['Length', 'Temperature', 'Area', 'Volume', 'Weight', 'Time'];
  const advancedCategories = ['Data Storage', 'Energy', 'Power'];

  // Handle category changes
  const handleCategoryChange = (val) => {
    setCategory(val);
    setFromUnit(unitGroups[val].units[0]);
    setToUnit(unitGroups[val].units[1] || unitGroups[val].units[0]);
    setInputValue('');
    setResult('');
  };

  // Perform conversion
  const handleConvert = () => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) {
      setResult('Invalid Input');
      return;
    }
    const converter = unitGroups[category].convert;
    if (!converter) {
      setResult('No converter function found.');
      return;
    }
    const convertedVal = converter(numericValue, fromUnit, toUnit);
    if (isNaN(convertedVal)) {
      setResult('Conversion Error');
    } else {
      setResult(`${convertedVal} ${toUnit}`);
    }
  };

  return (
    <Card className="p-6">
      <CardContent>
        <h1 className="text-3xl font-bold mb-4">Unit Converter</h1>

        {/* Category Selector with subsections */}
        <Select onValueChange={handleCategoryChange} value={category}>
          <optgroup label="Basic Converters">
            {basicCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </optgroup>
          <optgroup label="Advanced Converters">
            {advancedCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </optgroup>
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Input
            type="text"
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Select onValueChange={setFromUnit} value={fromUnit}>
            {unitGroups[category].units.map((unit) => (
              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
            ))}
          </Select>
          <Select onValueChange={setToUnit} value={toUnit}>
            {unitGroups[category].units.map((unit) => (
              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
            ))}
          </Select>
        </div>

        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded"
          onClick={handleConvert}
        >
          Convert
        </button>

        {result && (
          <div className="mt-4 text-xl font-semibold">
            Result: {result}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

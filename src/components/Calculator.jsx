import React, { useState } from "react";
import ConfidenceCalculator from "./core/ConfidenceCalculator";
import { bodyShapeData } from "./constants/bodyShapeData";
import { standardSizes } from "./constants/standardSizes";

// Function to calculate standard size
const calculateStandardSize = ({ bust, waist, hips }) => {
  const parsedMeasurements = {
    bust: parseFloat(bust),
    waist: parseFloat(waist),
    hips: parseFloat(hips),
  };

  if (Object.values(parsedMeasurements).some((val) => isNaN(val) || val <= 0)) {
    return { size: "N/A", message: "Invalid or missing measurements. Please provide valid values." };
  }

  console.log("Parsed Measurements:", parsedMeasurements);

  let closestSize = null;
  let closestDistance = Infinity;

  const margin = 3; // Allow ±3 units of flexibility

  for (const [size, ranges] of Object.entries(standardSizes)) {
    const bustDistance = Math.abs(parsedMeasurements.bust - (ranges.bust.min + ranges.bust.max) / 2);
    const waistDistance = Math.abs(parsedMeasurements.waist - (ranges.waist.min + ranges.waist.max) / 2);
    const hipsDistance = Math.abs(parsedMeasurements.hips - (ranges.hips.min + ranges.hips.max) / 2);

    const totalDistance = bustDistance + waistDistance + hipsDistance;

    if (totalDistance < closestDistance) {
      closestDistance = totalDistance;
      closestSize = size;
    }

    const withinBustRange =
      parsedMeasurements.bust >= ranges.bust.min - margin &&
      parsedMeasurements.bust <= ranges.bust.max + margin;
    const withinWaistRange =
      parsedMeasurements.waist >= ranges.waist.min - margin &&
      parsedMeasurements.waist <= ranges.waist.max + margin;
    const withinHipsRange =
      parsedMeasurements.hips >= ranges.hips.min - margin &&
      parsedMeasurements.hips <= ranges.hips.max + margin;

    if (withinBustRange && withinWaistRange && withinHipsRange) {
      return { size, message: `You are a ${size} size!` };
    }
  }

  if (closestSize) {
    return {
      size: closestSize,
      message: `Closest match: ${closestSize}. Your measurements are slightly outside the exact range.`,
    };
  }

  return { size: "N/A", message: "Measurements do not match any standard size." };
};  

// Function to calculate BMI
const calculateBMI = (height, weight, unit) => {
  let heightInMeters = height;
  let weightInKg = weight;

  if (unit === "inches") {
    heightInMeters = height / 39.37; // Convert inches to meters
    weightInKg = weight / 2.205;    // Convert pounds to kilograms
  } else if (unit === "cm") {
    heightInMeters = height / 100;  // Convert cm to meters
  }

  const bmi = (weightInKg / (heightInMeters ** 2)).toFixed(1);

  let category = "";
  if (bmi < 16) {
    category = "Severely Underweight";
  } else if (bmi >= 16 && bmi < 18.5) {
    category = "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
  } else if (bmi >= 30 && bmi < 35) {
    category = "Obese (Class I)";
  } else if (bmi >= 35 && bmi < 40) {
    category = "Obese (Class II)";
  } else {
    category = "Obese (Class III)";
  }

  const minIdealWeight = (18.5 * (heightInMeters ** 2)).toFixed(1);
  const maxIdealWeight = (24.9 * (heightInMeters ** 2)).toFixed(1);

  return {
    bmi,
    category,
    minIdealWeight,
    maxIdealWeight,
  };
};

// Function to detect body shape
const detectBodyShape = (measurements) => {
  const { waist, bust, height } = measurements;
  const bustToWaist = (bust / waist).toFixed(2);
  const hipsToWaist = (1.25 * waist).toFixed(2);
  const heightToWaist = (height / waist).toFixed(2);

  let bestMatch = "";
  let highestConfidence = 0;

  Object.entries(bodyShapeData).forEach(([shape, data]) => {
    const { ratios } = data;
    let score = 0;

    if (bustToWaist >= ratios.bustToWaist - 0.1 && bustToWaist <= ratios.bustToWaist + 0.1)
      score += 10;
    if (hipsToWaist >= ratios.hipsToWaist - 0.1 && hipsToWaist <= ratios.hipsToWaist + 0.1)
      score += 10;
    if (heightToWaist >= ratios.heightToWaist - 0.1 && heightToWaist <= ratios.heightToWaist + 0.1)
      score += 10;

    if (score > highestConfidence) {
      highestConfidence = score;
      bestMatch = shape;
    }
  });

  return bestMatch;
};

// Main Component
const SizeCalculator = () => {
  const [measurements, setMeasurements] = useState({
    height: 65,
    weight: 70,
    waist: 30,
    bust: 36,
    unit: "inches",
    ageGroup: "18-24", // Default age group
  });

  const [bmiDetails, setBmiDetails] = useState(null);
  const [detectedBodyShape, setDetectedBodyShape] = useState("N/A");
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalculate = () => {
    const { height, weight, waist, bust, unit, ageGroup } = measurements;

    if (!height || !weight || !waist || !bust) {
      setErrors(["All fields are required."]);
      return;
    }

    const { bmi, category, minIdealWeight, maxIdealWeight } = calculateBMI(height, weight, unit);
    setBmiDetails({ bmi, category, minIdealWeight, maxIdealWeight });

    const bodyShape = detectBodyShape(measurements);
    setDetectedBodyShape(bodyShape || "N/A");

    const hips =
      bodyShape === "hourglass"
        ? Math.round(waist * 1.2)
        : bodyShape === "pear"
        ? Math.round(waist * 1.3)
        : bodyShape === "apple"
        ? Math.round(waist * 0.9)
        : Math.round(waist * 1.1);

    const standardSize = calculateStandardSize({ bust, waist, hips });

    setResults({
      bust,
      waist,
      hips,
      bmi,
      bodyShape,
      ageGroup,
      standardSize: standardSize.size,
      standardSizeMessage: standardSize.message,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Size Calculator</h1>

        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Input Measurements</h2>
            <div className="mb-4">
              <label className="block font-medium">Unit</label>
              <select
                name="unit"
                value={measurements.unit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="inches">Inches</option>
                <option value="cm">Centimeters</option>
              </select>
            </div>
            {["height", "weight", "waist", "bust"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block font-medium capitalize">{field}</label>
                <input
                  type="number"
                  name={field}
                  value={measurements[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
            <div className="mb-4">
              <label className="block font-medium">Age Group</label>
              <select
                name="ageGroup"
                value={measurements.ageGroup}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
              </select>
            </div>
            <button
              onClick={handleCalculate}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Calculate
            </button>
          </div>

          {results && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <div className="bg-gray-50 p-4 rounded mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">BMI</h3>
                {bmiDetails && (
                  <>
                    <p className="text-2xl font-bold text-gray-800">{bmiDetails.bmi}</p>
                    <p className="text-sm text-gray-600">{bmiDetails.category}</p>
                    <p className="text-sm text-gray-600">
                      Ideal weight range: {bmiDetails.minIdealWeight} - {bmiDetails.maxIdealWeight}{" "}
                      {measurements.unit === "inches" ? "kg" : "lbs"}
                    </p>
                  </>
                )}
              </div>
              <p>
                <strong>Standard Size:</strong> {results.standardSize}
              </p>
              <p>{results.standardSizeMessage}</p>
              <p>
                <strong>Detected Body Shape:</strong> {detectedBodyShape}
              </p>
              <p>
                <strong>Age Group:</strong> {results.ageGroup}
              </p>
              <ConfidenceCalculator measurements={measurements} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeCalculator;

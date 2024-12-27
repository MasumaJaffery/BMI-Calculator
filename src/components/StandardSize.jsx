import React, { useState } from "react";
import { standardSizes } from "./constants/standardSizes";

// Function to calculate standard size
const calculateStandardSize = ({ bust, waist, weight, height }) => {
  const parsedMeasurements = {
    bust: parseFloat(bust),
    waist: parseFloat(waist),
    weight: parseFloat(weight),
    height: parseFloat(height),
  };

  if (Object.values(parsedMeasurements).some((val) => isNaN(val) || val <= 0)) {
    return { size: "N/A", message: "Invalid or missing measurements. Please provide valid values." };
  }

  let closestSize = null;
  let closestDistance = Infinity;

  for (const [size, ranges] of Object.entries(standardSizes)) {
    const bustCenter = (ranges.bust.min + ranges.bust.max) / 2;
    const waistCenter = (ranges.waist.min + ranges.waist.max) / 2;
    const weightCenter = (ranges.weight.min + ranges.weight.max) / 2;
    const heightCenter = (ranges.height.min + ranges.height.max) / 2;

    const bustDistance = Math.abs(parsedMeasurements.bust - bustCenter);
    const waistDistance = Math.abs(parsedMeasurements.waist - waistCenter);
    const weightDistance = Math.abs(parsedMeasurements.weight - weightCenter);
    const heightDistance = Math.abs(parsedMeasurements.height - heightCenter);

    const totalDistance = bustDistance + waistDistance + weightDistance + heightDistance;

    if (
      parsedMeasurements.bust >= ranges.bust.min &&
      parsedMeasurements.bust <= ranges.bust.max &&
      parsedMeasurements.waist >= ranges.waist.min &&
      parsedMeasurements.waist <= ranges.waist.max &&
      parsedMeasurements.weight >= ranges.weight.min &&
      parsedMeasurements.weight <= ranges.weight.max &&
      parsedMeasurements.height >= ranges.height.min &&
      parsedMeasurements.height <= ranges.height.max
    ) {
      return { size, message: `You are a ${size} size!` };
    }

    if (totalDistance < closestDistance) {
      closestDistance = totalDistance;
      closestSize = size;
    }
  }

  return closestSize
    ? {
        size: closestSize,
        message: `Closest match: ${closestSize}. Your measurements are slightly outside the exact range.`,
      }
    : { size: "N/A", message: "Measurements do not match any standard size." };
};

// Recommendation logic for style suggestions
const recommendStyle = (size) => {
  switch (size) {
    case "XS":
    case "S":
      return "Fitted garments and structured silhouettes.";
    case "M":
    case "L":
      return "A-line and flowy fabrics.";
    case "XL":
    case "XXL":
      return "Empire waistlines and V-necklines.";
    default:
      return "Please consult with a stylist.";
  }
};

// Main Component
const SizeCalculator = () => {
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    waist: "",
    bust: "",
    unit: "inches",
    ageGroup: "18-24", // Default age group
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    const { waist, bust, weight, height } = measurements;

    if (!waist || !bust || !weight || !height) {
      setErrors(["Bust, waist, weight, and height measurements are required."]);
      return;
    }

    const sizeInfo = calculateStandardSize({ bust, waist, weight, height });

    setResults({
      bust,
      waist,
      weight,
      height,
      size: sizeInfo.size,
      message: sizeInfo.message,
    });
    setErrors([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Size Calculator</h1>

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
            <div className="bg-gray-50 p-4 rounded mb-6">
              <p><strong>Standard Size:</strong> {results.size}</p>
              <p>{results.message}</p>
              {results.size !== "N/A" && (
                <ul>
                  <li>Bust-to-Waist Ratio: {(results.bust / results.waist).toFixed(2)}</li>
                  <li>Weight-Based Adjustment: {results.weight} lbs</li>
                  <li>Recommended Style: {recommendStyle(results.size)}</li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeCalculator;

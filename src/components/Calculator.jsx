import React, { useState, useEffect } from "react";
import {
  validateInputs,
  validateProportions,
  validateVerticalProportions,
  validateBodyShape,
} from "../components/utils/validation";
import { standardSizes } from "../components/constants/standardSizes.js";
import { bodyShapeData } from "../components/constants/bodyShapeData.js";
import { adjustmentFactors } from "../components/constants/adjustmentFactors.js";

const SizeCalculator = () => {
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    waist: "",
    bust: "",
    bodyShape: "average", // Default value
    ageGroup: "18-24", // Default value
  });
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [sizePrediction, setSizePrediction] = useState("");
  const [proportions, setProportions] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [bmi, setBmi] = useState(0);
  const [adjustedResults, setAdjustedResults] = useState(null);
  const [standardSize, setStandardSize] = useState("");
  const [heightCategory, setHeightCategory] = useState("");

  // Input Change Handlers
  const handleBodyShapeChange = (e) => {
    setMeasurements({ ...measurements, bodyShape: e.target.value });
  };

  const handleAgeGroupChange = (e) => {
    setMeasurements({ ...measurements, ageGroup: e.target.value });
  };

  // Main Calculation Logic
  const handleCalculate = () => {
    console.log("Button clicked - Starting calculation");

    const inputErrors = validateInputs(measurements);
    console.log("Input Errors:", inputErrors);

    const proportionWarnings = validateProportions(measurements);
    console.log("Proportion Warnings:", proportionWarnings);

    const verticalProportionWarnings = validateVerticalProportions(measurements);
    console.log("Vertical Proportion Warnings:", verticalProportionWarnings);

    const bodyShapeWarnings = validateBodyShape(measurements);
    console.log("Body Shape Warnings:", bodyShapeWarnings);

    // Error Handling
    if (
      inputErrors.length > 0 ||
      proportionWarnings.length > 0 ||
      verticalProportionWarnings.length > 0 ||
      bodyShapeWarnings.length > 0
    ) {
      setErrors(inputErrors);
      setWarnings([
        ...proportionWarnings,
        ...verticalProportionWarnings,
        ...bodyShapeWarnings,
      ]);
      setResults(null);
      return; // Stop calculation if there are warnings or errors
    }

    const { height, weight, waist, bust, bodyShape } = measurements;

    if (!height || !weight || !waist || !bust || !bodyShape) {
      setErrors(["All input fields are required."]);
      return;
    }

    // Calculate Hips based on Body Shape
    const hips =
      bodyShape === "hourglass"
        ? Math.round(waist * 1.2)
        : bodyShape === "pear"
        ? Math.round(waist * 1.3)
        : bodyShape === "rectangle"
        ? Math.round(waist)
        : bodyShape === "apple"
        ? Math.round(waist * 0.9)
        : Math.round(waist * 1.1); // Default case

    // BMI Calculation
    const calculatedBmi = (weight / (height / 39.37) ** 2).toFixed(1);

    // Additional Calculations
    const shoulderWidth = Math.round(waist * 0.8);
    const upperArm = Math.round(bust * 0.16);
    const thigh = Math.round(waist * 0.27);
    const inseam = Math.round(height * 0.45);

    // Confidence and Size Prediction
    const confidence = Math.round(Math.random() * 100);
    const level = confidence > 75 ? "High" : "Low";
    const size = confidence > 75 ? "L" : "XXL";

    // Proportion Analysis
    const bustToWaistRatio = (bust / waist).toFixed(2);
    const hipsToWaistRatio = (hips / waist).toFixed(2);
    const heightToWaistRatio = (height / waist).toFixed(2);

    // Warning Logic
    const warningsList = [];
    if (bustToWaistRatio < 1.0 || bustToWaistRatio > 1.4) {
      warningsList.push(
        `Bust-to-waist ratio (${bustToWaistRatio}) is unusual. Expected between 1.0 and 1.4.`
      );
    }
    if (hipsToWaistRatio < 1.1 || hipsToWaistRatio > 1.6) {
      warningsList.push(
        `Hips-to-waist ratio (${hipsToWaistRatio}) is unusual. Expected between 1.1 and 1.6.`
      );
    }
    if (heightToWaistRatio < 5.0 || heightToWaistRatio > 7.0) {
      warningsList.push(
        `Height-to-waist ratio (${heightToWaistRatio}) is unusual. Expected between 5.0 and 7.0.`
      );
    }

    // Height Category
    const heightCat =
      height < 63 ? "short" : height > 68 ? "tall" : "average";

    // Update States
    setResults({
      bust,
      waist,
      hips,
      shoulderWidth,
      upperArm,
      thigh,
      inseam,
    });
    setAdjustedResults({
      bust,
      waist,
      hips,
      shoulderWidth,
      upperArm,
      thigh,
      inseam,
    });
    setStandardSize(size);
    setHeightCategory(heightCat);
    setBmi(calculatedBmi);
    setConfidenceScore(confidence);
    setConfidenceLevel(level);
    setSizePrediction(size);
    setWarnings(warningsList);
    setProportions([
      { label: "Bust-to-Waist Ratio", value: bustToWaistRatio },
      { label: "Hips-to-Waist Ratio", value: hipsToWaistRatio },
      { label: "Height-to-Waist Ratio", value: heightToWaistRatio },
    ]);
  };

  // Watch for Results State Update
  useEffect(() => {
    console.log("Results state updated:", results);
  }, [results]);

  return (
    <div className="max-w-4xl mx-auto p-6">
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Size Calculator
      </h1>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Input Measurements
          </h2>
          <div className="mb-4">
            <label className="block font-medium">Height (inches)</label>
            <input
              type="number"
              value={measurements.height}
              id="height"
              className="w-full p-2 border rounded"
              placeholder="Valid range: 58-78 inches"
              onChange={(e) =>
                setMeasurements({ ...measurements, height: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Weight (kg)</label>
            <input
              type="number"
              value={measurements.weight}
              id="weight"
              className="w-full p-2 border rounded"
              placeholder="Valid range: 35-150 kg"
              onChange={(e) =>
                setMeasurements({ ...measurements, weight: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Waist (inches)</label>
            <input
              type="number"
              value={measurements.waist}
              id="waist"
              className="w-full p-2 border rounded"
              placeholder="Valid range: 22-50 inches"
              onChange={(e) =>
                setMeasurements({ ...measurements, waist: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Bust (inches)</label>
            <input
              type="number"
              value={measurements.bust}
              id="bust"
              className="w-full p-2 border rounded"
              placeholder="Valid range: 30-60 inches"
              onChange={(e) =>
                setMeasurements({ ...measurements, bust: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Body Shape</label>
            <select
id="bodyShape"
className="w-full p-2 border rounded"
value={measurements.bodyShape}
onChange={handleBodyShapeChange} // This will now work
>
<option value="average">Average</option>
<option value="hourglass">Hourglass</option>
<option value="pear">Pear</option>
<option value="apple">Apple</option>
<option value="rectangle">Rectangle</option>
</select>
          </div>
          <div className="mb-4">
            <label className="block font-medium">Age Group</label>
            <select
      id="ageGroup"
      className="w-full p-2 border rounded"
      value={measurements.ageGroup}
      onChange={handleAgeGroupChange}
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
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Calculate Measurements
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div>
            {/* BMI */}
            <div className="bg-gray-50 p-4 rounded mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">BMI</h3>
              <p className="text-2xl font-bold text-gray-800">{bmi}</p>
              <p className="text-sm text-gray-600">
                {bmi < 18.5
                  ? "Underweight"
                  : bmi < 24.9
                  ? "Normal"
                  : "Overweight"}
              </p>
            </div>

            {/* Primary Measurements */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Primary Measurements
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Bust", value: results.bust },
                  { label: "Waist", value: results.waist },
                  { label: "Hips", value: results.hips },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-center p-3 rounded"
                  >
                    <p className="text-sm font-medium text-gray-600">
                      {item.label}
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {item.value}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Measurements */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Secondary Measurements
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Shoulder Width", value: results.shoulderWidth },
                  { label: "Upper Arm", value: results.upperArm },
                  { label: "Thigh", value: results.thigh },
                  { label: "Inseam", value: results.inseam },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-center p-3 rounded"
                  >
                    <p className="text-sm font-medium text-gray-600">
                      {item.label}
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {item.value}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-red-100 p-4 rounded mb-6">
              <h3 className="text-lg font-bold text-red-800 mb-2">
                Confidence Score
              </h3>
              <p className="text-xl font-bold text-red-700">
                {confidenceScore}% ({confidenceLevel})
              </p>
            </div>

            {/* Proportion Warnings */}
            {warnings.length > 0 && (
              <div className="bg-yellow-100 p-4 rounded mb-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">
                  Proportion Warnings
                </h3>
                <ul className="list-disc pl-5">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-700 text-sm">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Size Prediction */}
            <div className="bg-blue-100 p-4 rounded text-center mb-6">
              <h3 className="text-lg font-bold text-blue-800">
                Size Prediction
              </h3>
              <p className="text-xl font-bold text-blue-700">
                {sizePrediction}
              </p>
            </div>

            {/* Proportion Analysis */}
            <div className="bg-blue-100 p-4 rounded mb-6">
              <h3 className="text-lg font-bold text-blue-800 mb-4">
                Proportion Analysis
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {proportions.map((prop, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-blue-200 p-2 rounded text-blue-900"
                  >
                    <span className="font-medium">{prop.label}</span>
                    <span className="font-bold">{prop.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
     {adjustedResults && (
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">
          Adjusted Results
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(adjustedResults).map(([key, value], index) => (
            <div
              key={index}
              className="bg-blue-100 text-center p-3 rounded shadow-sm"
            >
              <p className="text-sm font-medium text-gray-600 capitalize">{key}</p>
              <p className="text-xl font-bold text-gray-800">{value}"</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Standard Size
          </h3>
          <div className="bg-blue-100 p-4 rounded shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-800">{standardSize}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Height Category
          </h3>
          <div className="bg-blue-100 p-4 rounded shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-800">{heightCategory}</p>
          </div>
        </div>
      </div>
    )}      
      </div>
    </div>
  </div>
  );
};

export default SizeCalculator;


import React, { useState, useEffect } from "react";
import {
  validateInputs,
  validateProportions,
  validateVerticalProportions,
  validateBodyShape,
} from "../components/utils/validation";

const SizeCalculator = () => {
  const [measurements, setMeasurements] = useState({
    height: 65, // Default height in inches
    weight: 70, // Default weight in kg
    waist: 30, // Default waist in inches
    bust: 36, // Default bust in inches
    bodyShape: "average", // Default body shape
    ageGroup: "18-24", // Default age group
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [sizePrediction, setSizePrediction] = useState("");
  const [bmi, setBmi] = useState(0);
  const [proportions, setProportions] = useState([]);
  const [adjustedResults, setAdjustedResults] = useState(null);
  const [standardSize, setStandardSize] = useState("");
  const [heightCategory, setHeightCategory] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

    setErrors([]);
    setWarnings([]);

    const { height, weight, waist, bust, bodyShape } = measurements;

    // Validate inputs
    if (!height || !weight || !waist || !bust || !bodyShape) {
      setErrors(["All fields are required."]);
      return;
    }

    // Calculate hips based on body shape
    const hips =
      bodyShape === "hourglass"
        ? Math.round(waist * 1.2)
        : bodyShape === "pear"
        ? Math.round(waist * 1.3)
        : bodyShape === "apple"
        ? Math.round(waist * 0.9)
        : Math.round(waist * 1.1); // Default for average/rectangle

    // Calculate BMI
    const calculatedBmi = (weight / (height / 39.37) ** 2).toFixed(1);

    // Additional Measurements
    const shoulderWidth = Math.round(waist * 0.8);
    const upperArm = Math.round(bust * 0.16);
    const thigh = Math.round(waist * 0.27);
    const inseam = Math.round(height * 0.45);

    // Proportion Analysis
    const bustToWaistRatio = (bust / waist).toFixed(2);
    const hipsToWaistRatio = (hips / waist).toFixed(2);
    const heightToWaistRatio = (height / waist).toFixed(2);

    // Warnings
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

    // Confidence and Size Prediction
    const confidence = Math.round(Math.random() * 100);
    const level = confidence > 75 ? "High" : "Low";
    const size = confidence > 75 ? "L" : "XXL";

    // Height Category
    const heightCat =
      height < 63 ? "Short" : height > 68 ? "Tall" : "Average";

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

  useEffect(() => {
    console.log("Results updated:", results);
  }, [results]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Size Calculator</h1>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Input Measurements</h2>
            {["height", "weight", "waist", "bust"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block font-medium capitalize">{field}</label>
                <input
                  type="number"
                  name={field}
                  value={measurements[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
         {false && (
  <div className="mb-4">
    <label className="block font-medium">Body Shape</label>
    <select
      name="bodyShape"
      value={measurements.bodyShape}
      onChange={handleChange}
      className="w-full p-2 border rounded"
    >
      <option value="average">Average</option>
      <option value="hourglass">Hourglass</option>
      <option value="pear">Pear</option>
      <option value="apple">Apple</option>
    </select>
  </div>
)}

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
              Calculate Measurements
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Results</h2>
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
              <h3 className="text-lg font-bold mb-4">
              Primary Measurements</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {["bust", "waist", "hips"].map((field) => (
                  <div key={field} className="bg-blue-100 p-3 rounded text-center">
                    <p className="font-medium">{field}</p>
                    <p className="font-bold">{results[field]}"</p>
                  </div>
                ))}
              </div>

              {/* Secondary Measurements */}
              <h3 className="text-lg font-bold mb-4">
              Secondary Measurements
                </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {["shoulderWidth", "upperArm", "thigh", "inseam"].map((field) => (
                  <div key={field} className="bg-blue-100 p-3 rounded text-center">
                    <p className="font-medium">{field}</p>
                    <p className="font-bold">{results[field]}"</p>
                  </div>
                ))}
              </div>

              {/* Confidence Score */}
              <div className="bg-red-100 p-4 rounded mb-4">
              <h3 className="text-lg font-bold mb-4">
               Confidence Score</h3>
                <p>{confidenceScore}% ({confidenceLevel})</p>
              </div>

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="bg-yellow-100 p-4 rounded mb-4">
                                <h3 className="text-lg font-bold mb-4 text-yellow-800">
              Warnings</h3>
                  {warnings.map((warning, index) => (
                    <p key={index}>{warning}</p>
                  ))}
                </div>
              )}

              {/* Proportion Analysis */}
              <div className="bg-blue-100 p-4 rounded">
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


<div>
              {adjustedResults && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">
                  Standard Size
                </h3>
                <div className="bg-blue-100 p-4 rounded shadow-sm text-center">
                  <p className="text-xl font-bold text-blue-800">{standardSize}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-4">
                  Height Category
                </h3>
                <div className="bg-blue-100 p-4 rounded shadow-sm text-center">
                  <p className="text-xl font-bold text-blue-800">{heightCategory}</p>
                </div>
              </div>
            </div>
          )}
                        </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SizeCalculator;

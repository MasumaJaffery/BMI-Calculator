import React, { useState } from "react";
import { handleCalculate } from "../components/ui/eventHandlers";  // Import the event handler

const SizeCalculator = () => {
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [sizePrediction, setSizePrediction] = useState("");
  const [proportions, setProportions] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [bmi, setBmi] = useState(0);
  const [isLoading, setIsLoading] = useState(false);  // New state for loading indicator

  const handleCalculateClick = () => {
    // Collect input values for the measurements
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const waist = parseFloat(document.getElementById("waist").value);
    const bust = parseFloat(document.getElementById("bust").value);
    const bodyShape = document.getElementById("bodyShape").value;
    const ageGroup = document.getElementById("ageGroup").value;

    const measurements = {
      height,
      weight,
      waist,
      bust,
      bodyShape,
      ageGroup,
    };

    // Pass the measurements to the handleCalculation function from eventHandlers
    handleCalculate(
      measurements,
      setResults,
      setConfidenceScore,
      setConfidenceLevel,
      setIsLoading,
      setErrors
    );
  };

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
                id="height"
                className="w-full p-2 border rounded"
                placeholder="Valid range: 58-78 inches"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                className="w-full p-2 border rounded"
                placeholder="Valid range: 35-150 kg"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Waist (cm)</label>
              <input
                type="number"
                id="waist"
                className="w-full p-2 border rounded"
                placeholder="Valid range: 55-150 cm"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Bust (cm)</label>
              <input
                type="number"
                id="bust"
                className="w-full p-2 border rounded"
                placeholder="Valid range: 50-150 cm"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Body Shape</label>
              <select
                id="bodyShape"
                className="w-full p-2 border rounded"
              >
                <option value="average">Average</option>
                <option value="hourglass">Hourglass</option>
                <option value="pear">Pear</option>
                <option value="apple">Apple</option>
                <option value="invertedTriangle">Inverted Triangle</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Age Group</label>
              <input
                type="text"
                id="ageGroup"
                className="w-full p-2 border rounded"
                placeholder="e.g., 25-35"
              />
            </div>
            <button
              onClick={handleCalculateClick}
              className="bg-blue-500 text-white p-3 rounded-lg"
            >
              {isLoading ? 'Calculating...' : 'Calculate'}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            {results && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Results</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Calculated Measurements:</h3>
                  <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
              </>
            )}

            {/* Display Confidence Score */}
            {confidenceScore && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700">Confidence Score:</h3>
                <p className="text-xl font-semibold">{confidenceScore}</p>
              </div>
            )}
            {/* Display Confidence Level */}
            {confidenceLevel && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700">Confidence Level:</h3>
                <p className="text-xl font-semibold">{confidenceLevel}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeCalculator;

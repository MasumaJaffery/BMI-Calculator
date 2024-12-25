import React, { useState } from "react";
import BMI from "../components/BMI";
import PrimaryCalculation from "../components/Primary";

const SizeCalculator = () => {
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    waist: "",
    bust: "",
    unit: "inches",
    ageGroup: "18-24",
  });

  const [errors, setErrors] = useState([]);
  const [bmiData, setBmiData] = useState(null);
  const [primaryData, setPrimaryData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    const { height, weight, waist, bust, unit } = measurements;

    // Clear previous errors
    setErrors([]);

    if (!height || !weight || !waist || !bust) {
      setErrors(["All fields are required to perform calculations."]);
      setBmiData(null); // Clear BMI results
      setPrimaryData(null); // Clear Primary Calculation results
      return;
    }

    // Prepare data for BMI and Primary Calculation
    const bmiResults = { height: Number(height), weight: Number(weight), unit };
    const primaryResults = { waist: Number(waist), bust: Number(bust) };

    setBmiData(bmiResults);
    setPrimaryData(primaryResults);
  };

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

        {/* Input Section */}
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
            <button
              onClick={handleCalculate}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Calculate
            </button>
          </div>

          {/* Results Section */}
          <div>
            {bmiData && <BMI height={bmiData.height} weight={bmiData.weight} unit={bmiData.unit} />}
            {primaryData && <PrimaryCalculation waist={primaryData.waist} bust={primaryData.bust} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeCalculator;

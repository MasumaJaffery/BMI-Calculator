import React, { useState, useEffect } from 'react';

const ConfidenceCalculator = ({ measurements, additionalFactors = {} }) => {
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(null);

  const calculateConfidence = (measurements, additionalFactors) => {
    let score = 0;
    let maxScore = 0;

    const basePoints = {
      height: { points: 15, weight: 0.8 },
      weight: { points: 15, weight: 0.9 },
      waist: { points: 15, weight: 1.0 },
      bust: { points: 15, weight: 1.0 },
    };

    console.log("Measurements:", measurements);

    // Base points calculation
    Object.entries(basePoints).forEach(([measure, { points, weight }]) => {
      maxScore += points;
      if (measurements[measure]) {
        score += points * weight;
        console.log(`Added ${points * weight} for ${measure}`);
      }
    });

    // Proportion validation (max 20)
    const validationPoints = validateProportions(measurements);
    console.log("Proportion Validation Points:", validationPoints);
    score += validationPoints;
    maxScore += 20;

    // Weight and height correlation (max 10)
    if (measurements.weight && measurements.height) {
      const bmi = measurements.weight / ((measurements.height / 100) ** 2);
      console.log("BMI:", bmi);
      if (bmi >= 18.5 && bmi <= 25) {
        score += 10;
      } else if (bmi >= 17 && bmi <= 30) {
        score += 5;
      }
    }
    maxScore += 10;

    // Additional measurements bonus (max 5)
    const additionalMeasures = ['underbust', 'highHip', 'neck'];
    const additionalPoints = additionalMeasures.reduce((acc, measure) => {
      if (measurements[measure]) acc += 1.67;
      return acc;
    }, 0);
    score += Math.min(additionalPoints, 5);
    maxScore += 5;

    // Body shape specificity and validation (max 5)
    if (measurements.bodyShape && measurements.bodyShape !== 'average') {
      const shapeValidation = validateBodyShape(measurements);
      score += shapeValidation ? 5 : 2;
    }
    maxScore += 5;

    // Additional factors bonus (max 5)
    if (additionalFactors.age && additionalFactors.age !== 'unspecified') score += 1.5;
    if (additionalFactors.bodyType && additionalFactors.bodyType !== 'average') score += 2;
    if (additionalFactors.heightCategory) score += 1.5;
    maxScore += 5;

    // Deductions for invalid ratios or measurements
    const deductions = calculateDeductions(measurements);
    console.log("Deductions Applied:", deductions);
    score = Math.max(0, score - deductions);

    console.log("Final Score:", score, "Max Score:", maxScore);
    return Math.min(Math.round((score / maxScore) * 100), 100);
  };

  const validateProportions = (measurements) => {
    let points = 20;
    const { height, weight, bust, waist, hips } = measurements;

    // Bust to waist ratio
    if (bust && waist) {
      const bustWaistRatio = bust / waist;
      if (!isRatioValid(bustWaistRatio, 1.1, 1.5)) points -= 3; // Relaxed threshold
    }

    // Hips to waist ratio
    if (hips && waist) {
      const hipsWaistRatio = hips / waist;
      if (!isRatioValid(hipsWaistRatio, 1.1, 1.6)) points -= 3; // Relaxed threshold
    }

    // Waist to height ratio
    if (height && waist) {
      const waistHeightRatio = waist / height;
      if (!isRatioValid(waistHeightRatio, 0.3, 0.5)) points -= 3;
    }

    // BMI validity
    if (weight && height) {
      const bmi = weight / ((height / 100) ** 2);
      if (!isRatioValid(bmi, 16, 35)) points -= 3;
    }

    return Math.max(0, points);
  };

  const calculateDeductions = (measurements) => {
    let deductions = 0;
    const maxDeductions = 20; // Cap deductions
    const { height, weight, bust, waist, hips } = measurements;

    if (bust && waist && bust <= waist) deductions += 10;
    if (hips && waist && hips <= waist) deductions += 10;
    if (height && waist && waist >= height * 0.5) deductions += 10;

    if (weight && height) {
      const bmi = weight / ((height / 100) ** 2);
      if (bmi < 16 || bmi > 40) deductions += 10;
    }

    return Math.min(deductions, maxDeductions);
  };

  const validateBodyShape = (measurements) => {
    const { bust, waist, hips } = measurements;
    if (!bust || !waist || !hips) return false;

    const bodyShape = measurements.bodyShape;
    const bustWaistDiff = bust - waist;
    const hipsWaistDiff = hips - waist;
    const bustHipsDiff = Math.abs(bust - hips);

    switch (bodyShape) {
      case 'hourglass':
        return bustWaistDiff >= 7 && hipsWaistDiff >= 7 && bustHipsDiff <= 5;
      case 'pear':
        return hips > bust && hipsWaistDiff >= 7;
      case 'apple':
        return bust > hips && bustWaistDiff >= 4;
      case 'rectangle':
        return bustHipsDiff <= 5 && bustWaistDiff < 7 && hipsWaistDiff < 7;
      default:
        return true;
    }
  };

  const isRatioValid = (ratio, min, max) => ratio >= min && ratio <= max;

  const getConfidenceLevel = (score) => {
    if (score >= 90) return { text: 'High Confidence', class: 'alert-success', description: 'All key measurements provided with consistent proportions.' };
    if (score >= 75) return { text: 'Good Confidence', class: 'alert-info', description: 'Most measurements provided with reasonable proportions.' };
    if (score >= 60) return { text: 'Moderate Confidence', class: 'alert-warning', description: 'Basic measurements provided. Add weight/height for better accuracy.' };
    return { text: 'Low Confidence', class: 'alert-error', description: 'Limited or inconsistent measurements. Please verify inputs.' };
  };

  useEffect(() => {
    const score = calculateConfidence(measurements, additionalFactors);
    setConfidenceScore(score);
    setConfidenceLevel(getConfidenceLevel(score));
  }, [measurements, additionalFactors]);

  return (
    <div className='bg-gray-50 p-4 rounded shadow-sm'>
      <h3 className='mb-3'><strong>Confidence Score:</strong> {confidenceScore !== null ? `${confidenceScore}%` : 'Calculating...'}</h3>
      {confidenceLevel && (
        <div className={`alert ${confidenceLevel.class}`}>
          <h4>{confidenceLevel.text}</h4>
          <p>{confidenceLevel.description}</p>
        </div>
      )}
    </div>
  );
};

export default ConfidenceCalculator;

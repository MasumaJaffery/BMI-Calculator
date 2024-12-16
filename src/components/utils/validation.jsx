import React from 'react';
import { validationRules } from '../constants/validationRules.js';

const Validation = ({ measurements }) => {
  const inputErrors = validateInputs(measurements);
  const proportionWarnings = validateProportions(measurements);
  const verticalProportionWarnings = validateVerticalProportions(measurements);
  const bodyShapeWarnings = validateBodyShape(measurements);

  

  return (
    <div>
      {inputErrors.length > 0 && (
        <div className="error">
          <h3>Input Errors:</h3>
          <ul>
            {inputErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {proportionWarnings.length > 0 && (
        <div className="warning">
          <h3>Proportion Warnings:</h3>
          <ul>
            {proportionWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {verticalProportionWarnings.length > 0 && (
        <div className="warning">
          <h3>Vertical Proportion Warnings:</h3>
          <ul>
            {verticalProportionWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {bodyShapeWarnings.length > 0 && (
        <div className="warning">
          <h3>Body Shape Warnings:</h3>
          <ul>
            {bodyShapeWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Validation;

// Helper function (no need for state)
export function isInRange(value, range) {
  return value >= range.min && value <= range.max;
}

// validateInputs function (no need for state)
export function validateInputs(measurements) {
  const errors = [];
  const { height, waist, bust } = measurements;

  if (!height && !waist && !bust) {
    errors.push("Please provide at least one measurement");
    return errors;
  }

  if (height && !isInRange(height, validationRules.measurements.height)) {
    errors.push(`Height must be between ${validationRules.measurements.height.min}" and ${validationRules.measurements.height.max}"`);
  }

  if (waist && !isInRange(waist, validationRules.measurements.waist)) {
    errors.push(`Waist must be between ${validationRules.measurements.waist.min}" and ${validationRules.measurements.waist.max}"`);
  }

  if (bust && !isInRange(bust, validationRules.measurements.bust)) {
    errors.push(`Bust must be between ${validationRules.measurements.bust.min}" and ${validationRules.measurements.bust.max}"`);
  }

  return errors;
}

// validateProportions function (no need for state)
export function validateProportions(measurements) {
  const warnings = [];
  const { height, bust, waist, hips } = measurements;

  if (bust && waist) {
    const bustToWaist = bust / waist;
    if (!isInRange(bustToWaist, validationRules.ratios.bustToWaist)) {
      warnings.push(`Bust to waist ratio (${bustToWaist.toFixed(2)}) is unusual. Expected between ${validationRules.ratios.bustToWaist.min} and ${validationRules.ratios.bustToWaist.max}`);
    }
  }

  if (hips && waist) {
    const hipsToWaist = hips / waist;
    const ratios = validationRules.ratios.hipsToWaist[measurements.bodyShape] ||
                    validationRules.ratios.hipsToWaist.average;
    if (!isInRange(hipsToWaist, ratios)) {
      warnings.push(`Hips to waist ratio (${hipsToWaist.toFixed(2)}) is unusual. Expected between ${ratios.min} and ${ratios.max}`);
    }
  }

  if (height && waist) {
    const waistHeightRatio = waist / height;
    if (!isInRange(waistHeightRatio, validationRules.proportions.waistToHeight)) {
      warnings.push(`Waist to height ratio (${waistHeightRatio.toFixed(2)}) is unusual. Expected between ${validationRules.proportions.waistToHeight.min} and ${validationRules.proportions.waistToHeight.max}`);
    }
  }

  if (height && bust) {
    const bustHeightRatio = bust / height;
    if (!isInRange(bustHeightRatio, validationRules.proportions.bustToHeight)) {
      warnings.push(`Bust to height ratio (${bustHeightRatio.toFixed(2)}) is unusual. Expected between ${validationRules.proportions.bustToHeight.min} and ${validationRules.proportions.bustToHeight.max}`);
    }
  }

  return warnings;
}

// validateVerticalProportions function (no need for state)
export function validateVerticalProportions(measurements) {
  const warnings = [];
  const { height } = measurements;

  if (height) {
    const torsoLength = height * 0.288;
    const legLength = height * 0.472;

    const torsoRatio = torsoLength / height;
    const legRatio = legLength / height;

    if (!isInRange(torsoRatio, validationRules.verticalProportions.torsoToHeight)) {
      warnings.push("Torso to height proportion is unusual");
    }

    if (!isInRange(legRatio, validationRules.verticalProportions.legsToHeight)) {
      warnings.push("Leg to height proportion is unusual");
    }
  }

  return warnings;
}

// validateBodyShape function (no need for state)
export function validateBodyShape(measurements) {
  const warnings = [];
  const { bust, waist, hips } = measurements;

  if (bust && waist && hips) {
    const bustHipDiff = Math.abs(bust - hips);
    const waistBustDiff = bust - waist;
    const waistHipDiff = hips - waist;

    const shapeRatios = validationRules.bodyShapeRatios[measurements.bodyShape];
    if (shapeRatios) {
      if (shapeRatios.bustHipDiff && !isInRange(bustHipDiff, shapeRatios.bustHipDiff)) {
        warnings.push("Bust to hip difference doesn't match selected body shape");
      }
      if (shapeRatios.waistBustDiff && !isInRange(waistBustDiff, shapeRatios.waistBustDiff)) {
        warnings.push("Waist to bust difference doesn't match selected body shape");
      }
      if (shapeRatios.waistHipDiff && !isInRange(waistHipDiff, shapeRatios.waistHipDiff)) {
        warnings.push("Waist to hip difference doesn't match selected body shape");
      }
      if (shapeRatios.maxDifference && Math.max(bustHipDiff, waistBustDiff, waistHipDiff) > shapeRatios.maxDifference.max) {
        warnings.push("Measurements suggest a different body shape");
      }
    }
  }

  return warnings;
}
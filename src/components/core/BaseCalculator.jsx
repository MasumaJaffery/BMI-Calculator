// BaseCalculator.jsx
import React, { Component } from 'react';
import { validationRules } from '../constants/validationRules.js';
import { standardSizes } from '../constants/standardSizes.js';
import { bodyShapeData } from '../constants/bodyShapeData.js';
import { adjustmentFactors } from '../constants/adjustmentFactors.js';

class BaseCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measurements: props.initialMeasurements, // Use initial measurements from props
    };
  }

  validateAndAdjustResults = (results, actualMeasurements, bodyShape) => {
    const adjusted = { ...results };
    const ratios = validationRules.ratios.hipsToWaist[bodyShape] || validationRules.ratios.hipsToWaist.average;

    Object.entries(actualMeasurements).forEach(([key, value]) => {
      if (value) adjusted[key] = value;
    });

    if (adjusted.waist && adjusted.bust) {
      const bustWaistRatio = adjusted.bust / adjusted.waist;
      if (bustWaistRatio < validationRules.ratios.bustToWaist.min || bustWaistRatio > validationRules.ratios.bustToWaist.max) {
        adjusted.bust = adjusted.waist * validationRules.ratios.bustToWaist.min;
      }
    }

    if (adjusted.waist && adjusted.hips) {
      const hipWaistRatio = adjusted.hips / adjusted.waist;
      if (hipWaistRatio < ratios.min || hipWaistRatio > ratios.max) {
        adjusted.hips = adjusted.waist * (hipWaistRatio < ratios.min ? ratios.min : ratios.max);
      }
    }

    Object.keys(adjusted).forEach(key => {
      adjusted[key] = Math.round(adjusted[key] * 10) / 10;
    });

    return adjusted;
  };

  applyAdjustments = (measurements, bodyShape, additionalFactors) => {
    let adjusted = { ...measurements };
    const shapeData = bodyShapeData[bodyShape];

    Object.entries(shapeData.adjustments).forEach(([key, value]) => {
      if (adjusted[key]) adjusted[key] *= value;
    });

    if (additionalFactors.age && adjustmentFactors.age[additionalFactors.age]) {
      const ageAdjustments = adjustmentFactors.age[additionalFactors.age];
      Object.entries(ageAdjustments).forEach(([key, value]) => {
        if (key !== 'confidenceBonus' && adjusted[key]) {
          adjusted[key] *= value;
        }
      });
    }

    if (additionalFactors.bodyType && adjustmentFactors.bodyType[additionalFactors.bodyType]) {
      const bodyTypeAdjustment = adjustmentFactors.bodyType[additionalFactors.bodyType].overall;
      Object.keys(adjusted).forEach(key => {
        adjusted[key] *= bodyTypeAdjustment;
      });
    }

    Object.keys(adjusted).forEach(key => {
      adjusted[key] = Math.round(adjusted[key] * 10) / 10;
    });

    return adjusted;
  };

  getStandardSize = (measurements) => {
    const { bust, waist, hips } = measurements;
    let bestSize = 'M';
    let bestMatch = 0;

    Object.entries(standardSizes).forEach(([size, ranges]) => {
      let matches = 0;
      let total = 0;

      if (bust) {
        total++;
        if (bust >= ranges.bust.min && bust <= ranges.bust.max) matches++;
      }
      if (waist) {
        total++;
        if (waist >= ranges.waist.min && waist <= ranges.waist.max) matches++;
      }
      if (hips) {
        total++;
        if (hips >= ranges.hips.min && hips <= ranges.hips.max) matches++;
      }

      const matchRate = total > 0 ? matches / total : 0;
      if (matchRate > bestMatch) {
        bestMatch = matchRate;
        bestSize = size;
      }
    });

    return bestSize;
  };

  getHeightCategory = (height) => {
    if (!height) return 'average';
    if (height < 63) return 'short';
    if (height > 68) return 'tall';
    return 'average';
  };

  render() {
    const { measurements } = this.state;
    const { bodyShape, additionalFactors, initialMeasurements } = this.props;

    // Calculate results
    const adjustedResults = this.validateAndAdjustResults(measurements, initialMeasurements, bodyShape);
    const finalAdjustments = this.applyAdjustments(adjustedResults, bodyShape, additionalFactors);
    const standardSize = this.getStandardSize(finalAdjustments);

    return (
      <div>
        <h3>Adjusted Measurements</h3>
        <pre>{JSON.stringify(finalAdjustments, null, 2)}</pre>
        <h3>Standard Size: {standardSize}</h3>
        <h3>Height Category: {this.getHeightCategory(measurements.height)}</h3>
      </div>
    );
  }
}

export default BaseCalculator;

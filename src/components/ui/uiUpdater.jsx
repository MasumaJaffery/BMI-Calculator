import React, { useState, useEffect } from 'react';
import { validateProportions } from '../utils/validation.jsx';

export const createProportionRow = (label, value) => (
    <div className="flex justify-between items-center mb-2 bg-white bg-opacity-50 rounded p-2">
        <span className="font-medium">{label}</span>
        <span className="font-bold">{value}</span>
    </div>
);

export const generateImprovementSuggestions = (measurements) => {
    const suggestions = [];
    if (!measurements.height) suggestions.push('Add height measurement');
    if (!measurements.bust) suggestions.push('Add bust measurement');
    if (!measurements.waist) suggestions.push('Add waist measurement');
    if (measurements.bodyShape === 'average') suggestions.push('Specify a more precise body shape');

    return (
        <div className="mt-4 bg-white bg-opacity-50 rounded-lg p-3">
            <div className="font-semibold mb-2">To improve accuracy:</div>
            <ul className="list-disc pl-5 space-y-1">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </div>
    );
};

export const getConfidenceColor = (score) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 75) return '#3B82F6'; // Blue
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
};

export const UIUpdater = ({
    primaryResults = {}, // Default empty object if undefined
    secondaryResults = {}, // Default empty object if undefined
    confidenceScore,
    confidenceLevel,
    measurements = {}, // Default empty object if undefined
    errors = [],
}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = loading ? 'flex' : 'none';
        }
    }, [loading]);

    const showErrors = () => (
        <div id="errorMessages" className="block">
            {errors.map((error, index) => (
                <div key={index} className="flex items-center mb-1">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div>{error}</div>
                </div>
            ))}
        </div>
    );

    const updatePrimaryMeasurements = () => {
        const measures = ['bust', 'waist', 'hips'];
        return (
            <div id="primaryMeasurements">
                {measures.map((measure) => (
                    <div key={measure} id={`result-${measure}`} className="mb-2">
                        {primaryResults[measure] ? `${primaryResults[measure].toFixed(1)}"` : '-'}
                    </div>
                ))}
            </div>
        );
    };

    const updateSecondaryMeasurements = () => {
        const measures = ['shoulder', 'upperarm', 'thigh', 'inseam'];
        return (
            <div id="secondaryMeasurements">
                {measures.map((measure) => (
                    <div key={measure} id={`result-${measure}`} className="mb-2">
                        {secondaryResults[measure] ? `${secondaryResults[measure].toFixed(1)}"` : '-'}
                    </div>
                ))}
            </div>
        );
    };

    const updateConfidenceDisplay = () => {
        // Check if confidenceLevel is null or undefined
        if (!confidenceLevel) {
            return null; // Return null if confidenceLevel is not defined
        }
    
        const confidenceBarStyle = {
            width: `${confidenceScore}%`,
            backgroundColor: getConfidenceColor(confidenceScore),
        };
    
        return (
            <div id="confidence-alert" className={`alert ${confidenceLevel.class} mb-4`}>
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <div className="font-bold text-lg">{confidenceLevel.text}</div>
                        <div className="text-sm mt-1">{confidenceLevel.description}</div>
                    </div>
                    <div className="text-3xl font-bold">{confidenceScore}%</div>
                </div>
                <div className="confidence-bar">
                    <div className="confidence-fill" style={confidenceBarStyle}></div>
                </div>
                {confidenceScore < 90 && generateImprovementSuggestions(measurements)}
            </div>
        );
    };
    

    const updateSizePrediction = () => {
        return (
            <div id="size-prediction">
                <div className="font-bold text-lg mb-2">Size Prediction</div>
                <div className="text-2xl font-bold mb-2">
                    {primaryResults.size || 'M'}
                </div>
                <div className="text-sm">Based on your measurements and body proportions</div>
            </div>
        );
    };

    const warnings = validateProportions({ ...measurements, ...primaryResults });
    const proportionElements = [];

    if (primaryResults.bust && primaryResults.waist) {
        proportionElements.push(
            createProportionRow('Bust-to-Waist Ratio', (primaryResults.bust / primaryResults.waist).toFixed(2))
        );
    }

    if (primaryResults.hips && primaryResults.waist) {
        proportionElements.push(
            createProportionRow('Hips-to-Waist Ratio', (primaryResults.hips / primaryResults.waist).toFixed(2))
        );
    }

    if (measurements.height && primaryResults.waist) {
        proportionElements.push(
            createProportionRow('Height-to-Waist Ratio', (measurements.height / primaryResults.waist).toFixed(2))
        );
    }

    return (
        <div>
            {loading && <div id="loadingOverlay">Loading...</div>}
            {errors.length > 0 && showErrors()}
            {updatePrimaryMeasurements()}
            {updateSecondaryMeasurements()}
            {updateConfidenceDisplay()}
            {updateSizePrediction()}
            {warnings.length > 0 && (
                <div id="warnings" className="alert alert-warning mb-4">
                    <div className="font-bold text-lg mb-2">Proportion Warnings</div>
                    <ul className="list-disc pl-5 space-y-1">
                        {warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                        ))}
                    </ul>
                    <div className="text-sm mt-2 italic">
                        These warnings can be measurement errors or unique body proportions.
                    </div>
                </div>
            )}
        </div>
    );
};

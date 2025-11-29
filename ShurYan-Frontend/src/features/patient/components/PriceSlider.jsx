/**
 * PriceSlider Component
 * A clean, debounced price range slider with smooth UX
 * 
 * Features:
 * - Immediate visual feedback (local state)
 * - Debounced API calls (800ms after user stops dragging)
 * - Smooth slider interaction without lag
 */

import { useState, useEffect, useRef } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const PriceSlider = ({
    value = [0, 1000],
    onChange,
    min = 0,
    max = 1000,
    debounceMs = 800
}) => {
    // Local state for immediate visual feedback
    const [localValue, setLocalValue] = useState(value);
    const debounceTimerRef = useRef(null);

    // Sync local value when prop changes (e.g., reset filters)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    /**
     * Handle slider change with debounce
     * - Updates local state immediately for smooth UX
     * - Debounces the onChange callback to avoid excessive API calls
     */
    const handleSliderChange = (newValue) => {
        // Update local state immediately for smooth slider movement
        setLocalValue(newValue);

        // Clear existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new debounce timer
        debounceTimerRef.current = setTimeout(() => {
            // Call parent onChange with new array instance
            onChange([...newValue]);
        }, debounceMs);
    };

    return (
        <div className="w-full">
            {/* Price Range Display */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                    <span className="text-xs text-slate-500 block mb-1">من</span>
                    <span className="text-lg font-bold text-[#00d5be]">{localValue[0]}</span>
                    <span className="text-xs text-slate-500 mr-1">جنيه</span>
                </div>
                <div className="flex-1 mx-4 h-px bg-slate-200"></div>
                <div className="text-center">
                    <span className="text-xs text-slate-500 block mb-1">إلى</span>
                    <span className="text-lg font-bold text-[#00d5be]">{localValue[1]}</span>
                    <span className="text-xs text-slate-500 mr-1">جنيه</span>
                </div>
            </div>

            {/* Slider */}
            <div className="px-2">
                <Slider
                    range
                    min={min}
                    max={max}
                    value={localValue}
                    onChange={handleSliderChange}
                    trackStyle={[{
                        backgroundColor: '#00d5be',
                        height: 6
                    }]}
                    handleStyle={[
                        {
                            backgroundColor: '#00d5be',
                            borderColor: '#00d5be',
                            width: 20,
                            height: 20,
                            marginTop: -7,
                            boxShadow: '0 2px 8px rgba(0, 213, 190, 0.3)',
                            opacity: 1
                        },
                        {
                            backgroundColor: '#00d5be',
                            borderColor: '#00d5be',
                            width: 20,
                            height: 20,
                            marginTop: -7,
                            boxShadow: '0 2px 8px rgba(0, 213, 190, 0.3)',
                            opacity: 1
                        }
                    ]}
                    railStyle={{
                        backgroundColor: '#e2e8f0',
                        height: 6
                    }}
                />
            </div>

            {/* Min/Max Labels */}
            <div className="flex justify-between items-center mt-3 px-2">
                <span className="text-xs text-slate-400">{min} جنيه</span>
                <span className="text-xs text-slate-400">{max} جنيه</span>
            </div>
        </div>
    );
};

export default PriceSlider;

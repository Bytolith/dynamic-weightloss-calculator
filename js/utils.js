export function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

export function initSlider(sliderId, displayId, unit, isFloat, callback){
    assert(typeof sliderId === "string", "Slider ID must be a string.");
    assert(typeof displayId === "string", "Display ID must be a string.");
    assert(typeof unit === "string", "Unit must be a string.");
    assert(typeof callback === "function", "Callback must be a function.");

    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    slider.addEventListener("input", function(){
        let sliderVal = parseFloat(slider.value);
        callback(sliderVal);
        display.textContent = isFloat ? sliderVal.toFixed(1) + " " + unit : sliderVal + " " + unit;
    })
}

// Conversion functions
export function inchesToMeters(inches){
    assert(typeof inches === "number" && inches >= 0, "Inches must be a non-negative number.");
    return inches * 0.0254;
}
export function poundsToKilograms(pounds){
    assert(typeof pounds === "number" && pounds >= 0, "Pounds must be a non-negative number.");
    return pounds * 0.453592;
}
export function mphToMps(mph) {
    assert(typeof mph === "number" && mph >= 0, "Walk speed must be a non-negative number.");
    return mph * 0.44704;
}
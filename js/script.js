//data
let gender = "male";
let age = 25;
let height = 72;
let currentWeight = 220;
let goalWeight = 180;

let calorieIntake = 2000;
let walkTime = 60;
let walkSpeed = 3;

// Data for Mifflin-St Jeor Equation (BMR)
// Equation: Women: 10*kg + 6.25*cm - 5*age - 161
// Equation:   Men: 10*kg + 6.25*cm - 5*age + 5
//         Sedentary *1.2
//         Lightly active *1.375
//         Moderately active *1.55
//         Active *1.725
//         Very active *1.9

// Ludlow & Weyand Equation (Walking)
// VO2 = 7.35 + (5.97 × Speed(m/2)² ÷ Height(m))
// Burn = VO2 × Weight(kg) × Minutes × 0.005

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function MifflinStJeor(gender, age, height, weight) {
    assert(typeof gender === "string", "Gender must be a string.");
    assert(typeof age === "number" && age > 0, "Age must be a positive number.");
    assert(typeof height === "number" && height > 0, "Height must be a positive number.");
    assert(typeof weight === "number" && weight > 0, "Weight must be a positive number.");

    let bmr;
    if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } 
    else if (gender === "female") {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return bmr;
}

function setGender(gender) {
    assert(typeof gender === "string", "Gender must be a string.");

    let is_male = (gender === "male")
    document.getElementById('buttonMale').classList.toggle('active', is_male);
    document.getElementById('buttonFemale').classList.toggle('active', !is_male);
}

function updateHeight(){
    const feet = parseInt(document.getElementById('heightFt').value);
    const inches = parseInt(document.getElementById('heightIn').value);

    let val = (feet * 12) + inches;

    height = val;
}

function initSlider(sliderId, displayId, unit, callback){
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    slider.addEventListener("input", function(){
        let sliderVal = parseInt(slider.value);
        callback(sliderVal);
        display.textContent = sliderVal + " " + unit;
    })
}

initSlider('ageSlider', 'ageVal', 'yrs', function(val){age = val});
initSlider('currentWeight', 'currentWeightValue', 'lbs', function(val){currentWeight = val});
initSlider('goalWeight', 'goalWeightValue', 'lbs', function(val){goalWeight = val});
initSlider('calorieIntake', 'calorieIntakeValue', 'kcal', function(val){calorieIntake = val});
initSlider('walkTime', 'walkTimeValue', 'min', function(val){walkTime = val});
initSlider('walkSpeed', 'walkSpeedValue', 'mph', function(val){walkSpeed = val});

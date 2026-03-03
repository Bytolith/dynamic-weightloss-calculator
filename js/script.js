import * as utils from "./utils.js";

//data
let gender = "male";
let age = 25;
let height = 72;
let currentWeight = 220;
let goalWeight = 180;

let calorieIntake = 2000;
let walkTime = 60; 
let walkSpeed = 3;

function MifflinStJeor(gender, age, height, weight) {
    utils.assert(typeof gender === "string", "Gender must be a string.");
    utils.assert(typeof age === "number" && age >= 0, "Age must be a non-negative number.");
    utils.assert(typeof height === "number" && height >= 0, "Height must be a non-negative number.");
    utils.assert(typeof weight === "number" && weight >= 0, "Weight must be a non-negative number.");

    const weight_kg = utils.poundsToKilograms(weight);
    const height_m = utils.inchesToMeters(height) * 100;

    let bmr;
    if (gender === "male") {
        bmr = 10 * weight_kg + 6.25 * height_m - 5 * age + 5;
    } 
    else if (gender === "female") {
        bmr = 10 * weight_kg + 6.25 * height_m - 5 * age - 161;
    }
    return bmr;
}

function LudlowWeyand(speed, height, weight, time) {
    utils.assert(typeof speed === "number" && speed >= 0, "Speed must be a non-negative number.");
    utils.assert(typeof height === "number" && height > 0, "Height must be a positive number.");
    utils.assert(typeof weight === "number" && weight >= 0, "Weight must be a non-negative number.");
    utils.assert(typeof time === "number" && time >= 0, "Time must be a non-negative number.");

    const speed_mps = utils.mphToMps(speed);
    const height_m = utils.inchesToMeters(height);
    const weight_kg = utils.poundsToKilograms(weight);

    const vo2 = 7.35 + (5.97 * Math.pow(speed_mps, 2) / height_m);
    const caloriesBurned = vo2 * weight_kg * time * 0.005;

    // optional debug: uncomment to check sensitivity
    console.log({ speed, speed_mps, height_m, weight_kg, vo2, caloriesBurned });

    return caloriesBurned;
}

function ACSMWalkingCalories(speedMph, weightLbs, timeMin, grade = 0) {
    utils.assert(typeof speedMph === "number" && speedMph >= 0, "speedMph must be a non-negative number.");
    utils.assert(typeof weightLbs === "number" && weightLbs >= 0, "weightLbs must be a non-negative number.");
    utils.assert(typeof timeMin === "number" && timeMin >= 0, "timeMin must be a non-negative number.");
    utils.assert(typeof grade === "number" && grade >= 0, "grade must be a non-negative number.");

    const weightKg = utils.poundsToKilograms(weightLbs);
    const speed_m_per_min = utils.mphToMps(speedMph) * 60;
    const vo2 = 3.5 + 0.1 * speed_m_per_min + 1.8 * speed_m_per_min * grade;
    const kcalPerMin = vo2 * weightKg * 0.005;
    return kcalPerMin * timeMin;
}


function updateResults(){
    let bmrvalue = document.getElementById('restingBMRValue');
    let walkingCaloriesBurnedValue = document.getElementById('walkingCaloriesBurnedValue');
    let totalCaloriesBurnedValue = document.getElementById('totalCaloriesBurnedValue');
    let netCaloriesValue = document.getElementById('netCaloriesValue');
    
    let bmr = MifflinStJeor(gender, age, height, currentWeight);

    // let walkingCaloriesBurned = LudlowWeyand(walkSpeed, height, currentWeight, walkTime);
    let walkingCaloriesBurned = ACSMWalkingCalories(walkSpeed, currentWeight, walkTime);

    let totalCaloriesBurned = bmr + walkingCaloriesBurned;
    let netCalories = -(calorieIntake - totalCaloriesBurned);
    
    bmrvalue.textContent = bmr.toFixed(0) + " kcal/day";
    walkingCaloriesBurnedValue.textContent = walkingCaloriesBurned.toFixed(0) + " kcal";
    totalCaloriesBurnedValue.textContent = totalCaloriesBurned.toFixed(0) + " kcal";
    netCaloriesValue.textContent = netCalories.toFixed(0) + " kcal";
}


function setGender(g) {
    utils.assert(typeof g === "string", "Gender must be a string.");
    utils.assert(g === "male" || g === "female", "Gender must be 'male' or 'female'.");

    document.getElementById('buttonMale').classList.toggle('active', g === "male");
    document.getElementById('buttonFemale').classList.toggle('active', g === "female");
    gender = g;

    updateResults();
}

function updateHeight(){
    const feet = parseInt(document.getElementById('heightFt').value);
    const inches = parseInt(document.getElementById('heightIn').value);

    let val = (feet * 12) + inches;

    height = val;

    updateResults();
}

window.setGender = setGender;
window.updateHeight = updateHeight;

utils.initSlider('ageSlider', 'ageVal', 'yrs', false, function(val){age = val; updateResults()});
utils.initSlider('currentWeight', 'currentWeightValue', 'lbs', false, function(val){currentWeight = val; updateResults()});
utils.initSlider('goalWeight', 'goalWeightValue', 'lbs', false, function(val){goalWeight = val; updateResults()});
utils.initSlider('calorieIntake', 'calorieIntakeValue', 'kcal', false, function(val){calorieIntake = val; updateResults()});
utils.initSlider('walkTime', 'walkTimeValue', 'min', false, function(val){walkTime = val; updateResults()});
utils.initSlider('walkSpeed', 'walkSpeedValue', 'mph', true, function(val){walkSpeed = val; updateResults()});


import * as utils from "./utils.js";

//data
let gender = "male";
let age = 25;
let height = 72;
let currentWeight = 220;
let goalWeight = 180;

let calorieIntake = 1500;
let walkTime = 60; 
let walkSpeed = 1.5;

let daysToGoal = 0;
let avgDailyDeficit = 0;

const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Weight (lbs)',
                data: [],
                borderColor: '#81f376',
                pointRadius: 0,
                backgroundColor: '#81f37621',
                tension: 0.3,
                fill: true
            },
            { 
                label: 'Goal',
                data: [],
                borderColor: 'rgba(27, 114, 42, 0.28)',
                borderDash: [6,4],
                borderWidth: 1.5,
                pointRadius: 0,
                fill: false 
            }

        ]
    },
    options: {
        responsive: true, maintainAspectRatio:false,
        plugins: {
            legend: { display: false }
        },
        scales:{
            x:{ticks:{color:'#6b7569',maxTicksLimit:12},grid:{color:'rgba(255,255,255,0.04)'}},
            y:{ticks:{color:'#6b7569',maxTicksLimit:8,callback:v=>v+' lbs'},grid:{color:'rgba(255,255,255,0.06)'}}
        }
    }
});

function MifflinStJeor(gender, age, height, weight) {
    utils.assert(typeof gender === "string", "Gender must be a string.");
    utils.assert(typeof age === "number" && age >= 0, "Age must be a non-negative number.");
    utils.assert(typeof height === "number" && height >= 0, "Height must be a non-negative number.");
    utils.assert(typeof weight === "number" && weight >= 0, "Weight must be a non-negative number.");

    const weight_kg = utils.poundsToKilograms(weight);
    const height_cm = utils.inchesToMeters(height) * 100;

    let bmr;
    if (gender === "male") {
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
    } 
    else if (gender === "female") {
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
    }

    return bmr * 1.2;
}

function LudlowWeyand(speed, height, weight, time) {
    utils.assert(typeof speed === "number" && speed >= 0, "Speed must be a non-negative number.");
    utils.assert(typeof height === "number" && height > 0, "Height must be a positive number.");
    utils.assert(typeof weight === "number" && weight >= 0, "Weight must be a non-negative number.");
    utils.assert(typeof time === "number" && time >= 0, "Time must be a non-negative number.");

    if(speed == 0 || time == 0){
        return 0;
    }

    const speed_mps = utils.mphToMps(speed);
    const height_m = utils.inchesToMeters(height);
    const weight_kg = utils.poundsToKilograms(weight);

    const vo2 = 7.35 + (5.97 * Math.pow(speed_mps, 2) / height_m);
    let caloriesBurned = vo2 * weight_kg * time * 0.005;

    //Subtract resting because it's already accounted for in bmr
    const restingCaloriesPerMin = 3.5 * weight_kg * 0.005;
    caloriesBurned = Math.max(0, caloriesBurned - restingCaloriesPerMin * time);

    return caloriesBurned;
}


function updateResults(){
    let bmrvalue = document.getElementById('restingBMRValue');
    let walkingCaloriesBurnedValue = document.getElementById('walkingCaloriesBurnedValue');
    let totalCaloriesBurnedValue = document.getElementById('totalCaloriesBurnedValue');
    let netCaloriesValue = document.getElementById('netCaloriesValue');

    let totalAvgDailyDeficit = document.getElementById('avgDailyDeficitValue');
    let totalDaysToGoal = document.getElementById('daysToGoalValue');
    let lbsToLose = document.getElementById('lbsToLoseValue');
    
    let bmr = MifflinStJeor(gender, age, height, currentWeight);

    let walkingCaloriesBurned = LudlowWeyand(walkSpeed, height, currentWeight, walkTime);

    let totalCaloriesBurned = bmr + walkingCaloriesBurned;
    let netCalories = -(calorieIntake - totalCaloriesBurned);
    
    bmrvalue.textContent = Math.round(bmr).toLocaleString('en-US');
    walkingCaloriesBurnedValue.textContent = Math.round(walkingCaloriesBurned).toLocaleString('en-US');
    totalCaloriesBurnedValue.textContent = Math.round(totalCaloriesBurned).toLocaleString('en-US');

    const sign = Math.round(netCalories) > 0 ? "+" : "";
    netCaloriesValue.textContent = sign + Math.round(netCalories).toLocaleString('en-US');

    updateChart();

    lbsToLose.textContent = currentWeight - goalWeight;
    totalDaysToGoal.textContent = daysToGoal;
    totalAvgDailyDeficit.textContent  = avgDailyDeficit.toFixed(0);
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

function generateChartData() {
    const data = [];

    const startWeight = Number(currentWeight);
    const targetWeight = Number(goalWeight);
    const maxDays = 1827;
    let cumulativeCaloriesDeficit = 0;
    let day = 0;
    for (; day < maxDays; day++) {
        const currentEstimate = startWeight - (cumulativeCaloriesDeficit / 3500);
        data.push(Number(currentEstimate.toFixed(2)));

        if (currentEstimate <= targetWeight) {
            break;
        }

        const bmr = MifflinStJeor(gender, age, height, currentEstimate);
        const walkingCalories = LudlowWeyand(walkSpeed, height, currentWeight, walkTime);
        const totalCaloriesBurnedToday = bmr + walkingCalories;

        const netCalories = totalCaloriesBurnedToday - calorieIntake;
        if (netCalories <= 0) {
            console.warn('Simulation stopped: no caloric deficit on day', day + 1);
            break;
        }

        cumulativeCaloriesDeficit += netCalories;
    }

    daysToGoal = day;
    avgDailyDeficit = cumulativeCaloriesDeficit / daysToGoal;

    return data;
}

function updateChart() {
    const chartData = generateChartData();
    chart.data.labels = chartData.map((_, i) => `Day ${i + 1}`);
    chart.data.datasets[0].data = chartData;
    chart.data.datasets[1].data = chartData.map(() => goalWeight);
    chart.update();
}

function main(){
    window.setGender = setGender;
    window.updateHeight = updateHeight;
    
    utils.initSlider('ageSlider', 'ageVal', 'yrs', false, function(val){age = val; updateResults()});
    utils.initSlider('currentWeight', 'currentWeightValue', 'lbs', false, function(val){currentWeight = val; updateResults()});
    utils.initSlider('goalWeight', 'goalWeightValue', 'lbs', false, function(val){goalWeight = val; updateResults()});
    utils.initSlider('calorieIntake', 'calorieIntakeValue', 'kcal', false, function(val){calorieIntake = val; updateResults()});
    utils.initSlider('walkTime', 'walkTimeValue', 'min', false, function(val){walkTime = val; updateResults()});
    utils.initSlider('walkSpeed', 'walkSpeedValue', 'mph', true, function(val){walkSpeed = val; updateResults()});
    
    updateResults();
}

main();




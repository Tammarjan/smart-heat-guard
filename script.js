// ==========================================
// SMART HEAT GUARD - SINDH
// FINAL UPDATED SCRIPT
// ==========================================


// DOM ELEMENTS

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");

const ageInput = document.getElementById("age");
const ageValue = document.getElementById("ageValue");

const sexInput = document.getElementById("sex");
const activityInput = document.getElementById("activity");

const tempValue = document.getElementById("tempValue");
const humidityValue = document.getElementById("humidityValue");

const heatIndex = document.getElementById("heatIndex");
const riskLevel = document.getElementById("riskLevel");
const riskMessage = document.getElementById("riskMessage");
const riskCard = document.getElementById("riskCard");

const waterAmount = document.getElementById("waterAmount");
const waterGuidance = document.getElementById("waterGuidance");

const citySelect = document.getElementById("citySelect");
const fetchWeatherBtn = document.getElementById("fetchWeatherBtn");
const weatherStatus = document.getElementById("weatherStatus");


// ==========================================
// SINDH CITIES
// ==========================================

const cities = {

    karachi: {
        name: "Karachi",
        lat: 24.8607,
        lon: 67.0011
    },

    hyderabad: {
        name: "Hyderabad",
        lat: 25.3960,
        lon: 68.3578
    },

    sukkur: {
        name: "Sukkur",
        lat: 27.7052,
        lon: 68.8574
    },

    larkana: {
        name: "Larkana",
        lat: 27.5589,
        lon: 68.2120
    },

    nawabshah: {
        name: "Nawabshah",
        lat: 26.2442,
        lon: 68.4100
    },

    jacobabad: {
        name: "Jacobabad",
        lat: 28.2769,
        lon: 68.4514
    },

    mithi: {
        name: "Mithi",
        lat: 24.7370,
        lon: 69.7971
    },

    mirpurkhas: {
        name: "Mirpurkhas",
        lat: 25.5260,
        lon: 69.0110
    },

    umerkot: {
        name: "Umerkot",
        lat: 25.3614,
        lon: 69.7360
    }

};


// ==========================================
// NOAA HEAT INDEX CALCULATION
// ==========================================

function calculateHeatIndex(tempC, rh) {

    const T = (tempC * 9 / 5) + 32;
    const R = rh;

    const simpleHI = 0.5 * (
        T + 61 +
        ((T - 68) * 1.2) +
        (R * 0.094)
    );

    const averageHI = (simpleHI + T) / 2;

    if (averageHI < 80) {
        return (averageHI - 32) * 5 / 9;
    }

    let HI =
        -42.379 +
        2.04901523 * T +
        10.14333127 * R -
        0.22475541 * T * R -
        0.00683783 * T * T -
        0.05481717 * R * R +
        0.00122874 * T * T * R +
        0.00085282 * T * R * R -
        0.00000199 * T * T * R * R;

    if (R < 13 && T >= 80 && T <= 112) {

        HI -= ((13 - R) / 4) *
            Math.sqrt((17 - Math.abs(T - 95)) / 17);

    }

    if (R > 85 && T >= 80 && T <= 87) {

        HI += ((R - 85) / 10) *
            ((87 - T) / 5);

    }

    return (HI - 32) * 5 / 9;

}


// ==========================================
// HEAT RISK LEVEL
// ==========================================

function getRisk(hiC) {

    if (hiC < 26.7) {

        return {
            level: "LOW RISK",
            message: "Heat-related risk is relatively low. Maintain normal hydration.",
            color: "yellow"
        };

    }

    if (hiC < 32.2) {

        return {
            level: "CAUTION",
            message: "Fatigue may occur with prolonged exposure or physical activity.",
            color: "yellow"
        };

    }

    if (hiC < 39.4) {

        return {
            level: "EXTREME CAUTION",
            message: "Heat cramps and heat exhaustion are possible. Reduce outdoor activity.",
            color: "orange"
        };

    }

    if (hiC < 51.7) {

        return {
            level: "DANGER",
            message: "Heat cramps and heat exhaustion are likely. Heatstroke is possible with prolonged exposure.",
            color: "orange"
        };

    }

    return {
        level: "EXTREME DANGER",
        message: "Extreme heat conditions. Heatstroke is highly likely with continued exposure. Seek a cool environment.",
        color: "red"
    };

}


// ==========================================
// DAILY WATER REFERENCE
// ==========================================

function getHydrationReference(age, sex) {

    if (age < 0.5) {

        return {
            amount: null,
            message: "For infants below 6 months, breast milk or correctly prepared infant formula provides hydration. Do not give extra plain water unless advised by a clinician."
        };

    }

    if (age < 7 / 12) {

        return {
            amount: 0.7,
            message: "Reference for 0–6 months: approximately 0.7 L total water daily, mainly from breast milk. This is not a plain-water target."
        };

    }

    if (age < 1) {

        return {
            amount: 0.8,
            message: "Reference for 7–12 months: approximately 0.8 L total water daily, including milk, food and beverages."
        };

    }

    if (age < 4) {

        return {
            amount: 1.3,
            message: "Reference for children aged 1–3 years: 1.3 L total water daily, including food and beverages."
        };

    }

    if (age < 9) {

        return {
            amount: 1.7,
            message: "Reference for children aged 4–8 years: 1.7 L total water daily, including food and beverages."
        };

    }

    if (age < 14) {

        if (!sex) {
            return {
                amount: null,
                message: "Please select sex to view the appropriate hydration reference."
            };
        }

        return sex === "male"
            ? {
                amount: 2.4,
                message: "Reference for boys aged 9–13 years: 2.4 L total water daily, including food and beverages."
            }
            : {
                amount: 2.1,
                message: "Reference for girls aged 9–13 years: 2.1 L total water daily, including food and beverages."
            };

    }

    if (age < 19) {

        if (!sex) {
            return {
                amount: null,
                message: "Please select sex to view the appropriate hydration reference."
            };
        }

        return sex === "male"
            ? {
                amount: 3.3,
                message: "Reference for boys aged 14–18 years: 3.3 L total water daily, including food and beverages."
            }
            : {
                amount: 2.3,
                message: "Reference for girls aged 14–18 years: 2.3 L total water daily, including food and beverages."
            };

    }

    if (!sex) {

        return {
            amount: null,
            message: "Please select sex to view the appropriate hydration reference."
        };

    }

    return sex === "male"
        ? {
            amount: 3.7,
            message: "Reference for adult men: 3.7 L total water daily, including food and beverages."
        }
        : {
            amount: 2.7,
            message: "Reference for adult women: 2.7 L total water daily, including food and beverages."
        };

}


// ==========================================
// HYDRATION GUIDANCE
// ==========================================

function updateHydration() {

    const age = Number(ageInput.value);
    const sex = sexInput.value;
    const activity = activityInput.value;

    const temp = Number(temperature.value);
    const rh = Number(humidity.value);

    if (
        ageInput.value === "" ||
        !Number.isFinite(age) ||
        age < 0 ||
        age > 100
    ) {

        waterAmount.textContent = "--";

        waterGuidance.textContent =
            "Please select a valid age.";

        return;

    }

    const reference = getHydrationReference(age, sex);

    if (reference.amount === null) {

        waterAmount.textContent = "--";

        waterGuidance.textContent = reference.message;

        return;

    }

    waterAmount.textContent =
        reference.amount.toFixed(1);

    let message = reference.message;


    // PHYSICAL ACTIVITY

    if (activity === "low") {

        message +=
            " Physical Activity: LOW. Normal daily hydration guidance applies.";

    }

    else if (activity === "moderate") {

        message +=
            " Physical Activity: MODERATE. Drink regularly during activity and replace fluids lost through sweating.";

    }

    else if (activity === "high") {

        message +=
            " Physical Activity: HIGH. Sweating and fluid losses may increase. Drink regularly and consider an individualized hydration plan during prolonged exercise.";

    }


    // HEAT AND HUMIDITY

    if (temp >= 30 || rh >= 70) {

        message +=
            " Hot or humid weather can increase fluid losses. Take cooling breaks and monitor thirst and sweating.";

    }


    // OLDER ADULTS

    if (age >= 65) {

        message +=
            " Older adults may have a reduced sensation of thirst. Pay attention to regular fluid intake.";

    }


    message +=
        " This is a population reference, not a personalized medical prescription. The amount includes water from food and all beverages, not just plain drinking water.";

    waterGuidance.textContent = message;

}


// ==========================================
// UPDATE MAIN APP
// ==========================================

function updateApp() {

    const temp = Number(temperature.value);
    const rh = Number(humidity.value);

    // AGE

    ageValue.textContent =
        Number(ageInput.value).toFixed(1).replace(/\.0$/, "");


    // TEMPERATURE AND HUMIDITY

    tempValue.textContent =
        temp.toFixed(1).replace(/\.0$/, "") + "°C";

    humidityValue.textContent =
        rh + "%";


    // HEAT INDEX

    const hi = calculateHeatIndex(temp, rh);

    heatIndex.textContent =
        hi.toFixed(1);


    // RISK LEVEL

    const risk = getRisk(hi);

    riskLevel.textContent = risk.level;

    riskMessage.textContent = risk.message;

    riskCard.className =
        "risk-card " + risk.color;

    riskLevel.className =
        "risk-badge " + risk.color;


    // HYDRATION

    updateHydration();

}


// ==========================================
// LIVE WEATHER
// ==========================================

let weatherController = null;

let manualWeatherOverride = false;


// FETCH LIVE WEATHER

async function getLiveWeather(force = false) {

    if (manualWeatherOverride && !force) {
        return;
    }

    const cityKey = citySelect.value;

    const city = cities[cityKey];

    if (!city) {

        weatherStatus.textContent =
            "Please select a valid city.";

        return;

    }


    // CANCEL PREVIOUS REQUEST

    if (weatherController) {
        weatherController.abort();
    }

    const controller = new AbortController();

    weatherController = controller;

    const timeout = setTimeout(() => {
        controller.abort();
    }, 12000);


    weatherStatus.textContent =
        "Fetching live weather for " + city.name + "...";

    fetchWeatherBtn.disabled = true;


    try {

        const url =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + city.lat +
            "&longitude=" + city.lon +
            "&current=temperature_2m,relative_humidity_2m" +
            "&timezone=Asia%2FKarachi";


        const response = await fetch(url, {
            signal: controller.signal
        });


        if (!response.ok) {

            throw new Error("Weather service unavailable.");

        }


        const data = await response.json();

        const current = data.current;


        if (
            !current ||
            current.temperature_2m === undefined ||
            current.relative_humidity_2m === undefined
        ) {

            throw new Error("Weather data unavailable.");

        }


        const liveTemp =
            Number(current.temperature_2m);

        const liveHumidity =
            Number(current.relative_humidity_2m);


        // CHECK SLIDER RANGE

        const minTemp = Number(temperature.min);
        const maxTemp = Number(temperature.max);

        if (liveTemp < minTemp || liveTemp > maxTemp) {

            throw new Error(
                "Live temperature is outside the supported slider range."
            );

        }


        // UPDATE VALUES

        temperature.value = liveTemp;

        humidity.value = liveHumidity;

        updateApp();


        weatherStatus.textContent =
            "Live weather updated: " +
            city.name +
            " | " +
            liveTemp.toFixed(1) +
            "°C | Humidity " +
            liveHumidity +
            "%";


    }

    catch (error) {

        if (error.name === "AbortError") {

            weatherStatus.textContent =
                "Weather request timed out. Please try again.";

        }

        else {

            weatherStatus.textContent =
                error.message ||
                "Unable to fetch weather. Please check your internet connection.";

        }

    }

    finally {

        clearTimeout(timeout);

        if (weatherController === controller) {

            weatherController = null;

            fetchWeatherBtn.disabled = false;

        }

    }

}


// ==========================================
// EMERGENCY FIRST AID
// ==========================================

function showEmergency() {

    alert(

        "HEATSTROKE EMERGENCY FIRST AID\n\n" +

        "1. Call emergency medical services immediately.\n\n" +

        "2. Move the person to a cool or shaded place.\n\n" +

        "3. Remove unnecessary clothing.\n\n" +

        "4. Start rapid cooling with cold water, wet cloths or ice packs around the neck, armpits and groin.\n\n" +

        "5. Do NOT give anything to drink if the person is confused, unconscious or unable to swallow safely.\n\n" +

        "6. Continue cooling while waiting for medical help."

    );

}


// ==========================================
// EVENT LISTENERS
// ==========================================


// MANUAL WEATHER INPUT

temperature.addEventListener("input", function () {

    manualWeatherOverride = true;

    updateApp();

});


humidity.addEventListener("input", function () {

    manualWeatherOverride = true;

    updateApp();

});


// PERSONAL INFORMATION

ageInput.addEventListener("input", updateApp);

sexInput.addEventListener("change", updateApp);

activityInput.addEventListener("change", updateApp);


// WEATHER BUTTON

fetchWeatherBtn.addEventListener("click", function () {

    manualWeatherOverride = false;

    getLiveWeather(true);

});


// CITY CHANGE

citySelect.addEventListener("change", function () {

    manualWeatherOverride = false;

    getLiveWeather(true);

});


// ==========================================
// START APP
// ==========================================

updateApp();

getLiveWeather(true);


// AUTO REFRESH EVERY 15 MINUTES
// Only when manual weather adjustment is not active.

setInterval(function () {

    if (!manualWeatherOverride) {

        getLiveWeather();

    }

}, 15 * 60 * 1000);
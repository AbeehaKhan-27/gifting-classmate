const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
];

// Initialize the calendar
function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;
    date.innerHTML = months[month] + " " + year;

    let days = "";

    // Render previous month's days
    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    // Render current month's days
    // Render current month's days
for (let i = 1; i <= lastDate; i++) {
    const dayStr = `${i}-${month + 1}-${year}`;
    const hasEvent = localStorage.getItem(dayStr);
    const todayClass = (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) ? "today" : "";

    // Set the background color based on whether the date has a saved workout
    const dayColorClass = hasEvent ? 'event' : 'no-event';
    
    days += `<div class="day ${todayClass} ${dayColorClass}" data-date="${dayStr}">${i}</div>`;
}


    // Render next month's days
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }

    daysContainer.innerHTML = days;
}

initCalendar();

// Navigation logic
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// Go to today's date
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

// Go to specific date entered by user
dateInput.addEventListener("keyup", (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if (dateInput.value.length === 2) {
        dateInput.value += "/";
    }
    if (dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7);
    }
    if (e.inputType === "deleteContentBackward") {
        if (dateInput.value.length === 3) {
            dateInput.value = dateInput.value.slice(0, 2);
        }
    }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
    const dateArr = dateInput.value.split("/");
    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }

    alert("invalid date");
}

// Handle the event panel (hidden by default)
const eventPanel = document.querySelector(".right.event-panel");
const selectedDateDisplay = document.querySelector(".selected-date");
const eventInput = document.querySelector(".event-input");
const saveEventBtn = document.querySelector(".save-event");
const deleteEventBtn = document.querySelector(".delete-event");
const savedEventContainer = document.querySelector(".saved-event-container");
const savedEventList = document.querySelector(".saved-event-list");

let selectedDate = null;

// Show event panel on day click
daysContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("day") && !e.target.classList.contains("prev-date") && !e.target.classList.contains("next-date")) {
        selectedDate = e.target.getAttribute("data-date");
        selectedDateDisplay.textContent = selectedDate;
        eventInput.value = ""; // Reset the input

        // Display the saved workouts for the selected date
        displaySavedWorkouts(selectedDate);

        // Show the event panel by removing the 'hidden' class
        eventPanel.classList.remove("hidden");
    }
});

// Display saved workouts for the selected date
function displaySavedWorkouts(date) {
    const workouts = JSON.parse(localStorage.getItem(date)) || [];

    // Show the saved workouts under the input box
    if (workouts.length > 0) {
        savedEventContainer.classList.remove("hidden");
        savedEventList.innerHTML = workouts.map((workout, index) => `
            <li>
                ${workout}
                <button class="delete-workout" data-index="${index}">&#128465</button>
            </li>
        `).join('');
    } else {
        savedEventContainer.classList.add("hidden");
    }
}

// Save workout logic
saveEventBtn.addEventListener("click", () => {
    const workout = eventInput.value.trim();
    if (workout) {
        let workouts = JSON.parse(localStorage.getItem(selectedDate)) || [];
        workouts.push(workout);  // Add the new workout to the list
        localStorage.setItem(selectedDate, JSON.stringify(workouts)); // Store the updated list
    }
    eventInput.value = ""; // Reset input after saving
    eventPanel.classList.add("hidden"); // Hide the panel
    initCalendar(); // Re-render calendar to update event highlights
    displaySavedWorkouts(selectedDate); // Refresh the workout list
});

// Delete individual workout logic
savedEventList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-workout")) {
        const index = e.target.getAttribute("data-index");
        let workouts = JSON.parse(localStorage.getItem(selectedDate)) || [];
        workouts.splice(index, 1); // Remove the workout at the given index
        localStorage.setItem(selectedDate, JSON.stringify(workouts)); // Store the updated list
        displaySavedWorkouts(selectedDate); // Refresh the workout list
    }
});

// Delete all workouts for the selected date
deleteEventBtn.addEventListener("click", () => {
    if (selectedDate) {
        localStorage.removeItem(selectedDate); // Remove all workouts for that date
        displaySavedWorkouts(selectedDate); // Clear the displayed workouts
        eventPanel.classList.add("hidden"); // Hide the panel after deleting
        initCalendar(); // Re-render calendar
    }
});



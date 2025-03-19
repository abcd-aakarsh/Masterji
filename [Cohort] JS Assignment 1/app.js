let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
const day = document.querySelector(".calender-dates");

const currdate = document.querySelector(".calender-current-date");

const nav = document.querySelectorAll(".nav");

//calender implementation

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//calender function

const getCalender = () => {
  let dayone = new Date(year, month, 1).getDay();
  let lastdate = new Date(year, month + 1, 0).getDate();

  let dayend = new Date(year, month, lastdate).getDay();
  let monthlastdate = new Date(year, month, 0).getDate();

  let cal = "";

  for (let i = dayone; i > 0; i--) {
    cal += `<li class="inactive > ${monthlastdate - i + 1}</li>`;
  }

  for (let i = 1; i <= lastdate; i++) {
    let isToday =
      i === date.getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
        ? "active"
        : ";";
    cal += `<li class="${isToday}">${i}</li>`;
  }
  for (let i = dayend; i < 6; i++) {
    cal += `<li class="inactive">${i - dayend + 1}</li>`;
  }

  currdate.innerText = `${months[month]} ${year}`;

  day.innerHTML = cal;
};
getCalender();
nav.forEach((icon) => {
  icon.addEventListener("click", () => {
    month = icon.id === "past" ? month - 1 : month + 1;

    if (month < 0 || month > 11) {
      date = new Date(year, month, new Date().getDate());

      year = date.getFullYear();

      month = date.getMonth();
    } else {
      date = new Date();
    }

    getCalender();
  });
});

//mood functions

const moodsList = document.querySelectorAll(".moods");
let moodValue = "";
let data = JSON.parse(localStorage.getItem("moodLog")) || [];
localStorage.setItem("moodLog", JSON.stringify(data));
moodsList.forEach((mood) => {
  mood.addEventListener("click", () => {
    moodValue = mood.innerText;
    alert(`Mood Selected : ${moodValue}`);
  });
});

const submitButton = document.getElementById("submit-button");
const resetButton = document.getElementById("reset-button");

const submitMood = () => {
  if (!moodValue) {
    console.error("No mood selected!");
    return;
  }
  data = JSON.parse(localStorage.getItem("moodLog")) || [];
  const moodData = {
    mood: moodValue,
    date: new Date().toISOString(),
  };
  data.push(moodData);

  //submit mood and make entry in localStorage
  localStorage.setItem("moodLog", JSON.stringify(data));

  //get calender dates
  //match localstorage date to calender date and addemoticon in span
  window.location.reload();
};

const updateCalender = () => {
  const calender = document.querySelector(".calender-dates");
  const calenderDates = [...calender.querySelectorAll("li")];
  const moodLog = JSON.parse(localStorage.getItem("moodLog"));

  moodLog.forEach((entry) => {
    const moodDate = entry.date.split("T")[0]; // Extract YYYY-MM-DD
    const moodi = entry.mood.split("\n\n")[0];
    const emoji = entry.mood.split("\n\n")[1];

    calenderDates.forEach((dateElement) => {
      const day = dateElement.innerText.padStart(2, "0"); // Ensure day is two digits
      const formattedDate = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${day}`;

      if (formattedDate === moodDate) {
        let span = dateElement.querySelector("span");
        if (!span) {
          span = document.createElement("span");
          dateElement.appendChild(span);
        }
        span.innerText = `(${emoji})`; // Show only emoji
        if (moodi == "Sad") {
          dateElement.style.backgroundColor = "#ff8787";
        } else if (moodi == "Happy") {
          dateElement.style.backgroundColor = "#9775fa";
        } else if (moodi == "Excited") {
          dateElement.style.backgroundColor = "#ffd43b";
        } else {
          dateElement.style.backgroundColor = "#4dabf7";
        }
      }
    });
  });
};

const resetMood = () => {
  moodValue = "";
  let moodLog = JSON.parse(localStorage.getItem("moodLog"));
  const todayDate = new Date().toISOString().split("T")[0];

  // Remove today's mood entry
  moodLog = moodLog.filter((entry) => !entry.date.startsWith(todayDate));

  // Update localStorage
  localStorage.setItem("moodLog", JSON.stringify(moodLog));
  window.location.reload();

  // Refresh calendar to reflect the reset
  getCalender();
};

const getTable = () => {
  const moodTableList = document.getElementById("mood-table-list");
  const dateTableList = document.getElementById("date-table-list");

  const moodLog = JSON.parse(localStorage.getItem("moodLog"));

  moodLog.forEach((ele) => {
    const moodi = ele.mood.split("\n\n")[0];
    const emoji = ele.mood.split("\n\n")[1];
    const moodDate = ele.date.split("T")[0];

    const li = document.createElement("li");
    const dateEle = document.createElement("li");

    if (moodi == "Sad") {
      li.style.backgroundColor = "#ff8787";
      dateEle.style.backgroundColor = "#ff8787";
    } else if (moodi == "Happy") {
      li.style.backgroundColor = "#9775fa";
      dateEle.style.backgroundColor = "#9775fa";
    } else if (moodi == "Excited") {
      li.style.backgroundColor = "#ffd43b";
      dateEle.style.backgroundColor = "#ffd43b";
    } else {
      li.style.backgroundColor = "#4dabf7";
      dateEle.style.backgroundColor = "#4dabf7";
    }

    li.innerText = `${moodi} ${emoji}`;
    moodTableList.appendChild(li);
    dateEle.innerText = `${moodDate}`;
    dateTableList.appendChild(dateEle);
  });
};

submitButton.addEventListener("click", submitMood);
resetButton.addEventListener("click", resetMood);
window.addEventListener("load", updateCalender);
window.addEventListener("load", getTable);

document.addEventListener("DOMContentLoaded", function () {
  const timeSelect = document.getElementById("time");
  const dateSelect = document.getElementById("date");
  const form = document.getElementById("bookingForm");

  const times = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30",
    "17:00"
  ];

  function populateTimes() {
    timeSelect.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "請選擇";
    timeSelect.appendChild(opt);
    times.forEach(t => {
      const option = document.createElement("option");
      option.value = t;
      option.textContent = t;
      timeSelect.appendChild(option);
    });
  }

  dateSelect.addEventListener("change", populateTimes);
  populateTimes();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nickname = document.getElementById("nickname").value;
    const reason = document.getElementById("reason").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    if (!nickname || !reason || !date || !time) {
      alert("請完整填寫資料！");
      return;
    }
    alert("報名成功，祝闔家平安！");
    form.reset();
  });
});

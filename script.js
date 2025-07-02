import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  "https://ygtffksgngkwpuxpfuez.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
)

const dateSelect = document.getElementById('dateSelect');
const timeSelect = document.getElementById('timeSelect');
const remainingCount = document.getElementById('remainingCount');

const times = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00"
];

async function updateTimeOptions() {
  const selectedDate = dateSelect.value;
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('date', selectedDate);

  if (error || !Array.isArray(data)) {
    console.error("資料錯誤", error);
    timeSelect.innerHTML = "<option disabled>資料錯誤</option>";
    remainingCount.textContent = "尚餘名額：-- / 15";
    return;
  }

  const total = data.length;
  if (total >= 15) {
    timeSelect.innerHTML = "<option disabled>本日已額滿</option>";
    remainingCount.textContent = `尚餘名額：0 / 15`;
    return;
  }

  remainingCount.textContent = `尚餘名額：${15 - total} / 15`;

  const counts = {};
  data.forEach(d => {
    counts[d.time] = (counts[d.time] || 0) + 1;
  });

  timeSelect.innerHTML = "";
  times.forEach(time => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    if (counts[time] >= 15) option.disabled = true;
    timeSelect.appendChild(option);
  });
}

async function submitForm() {
  const nickname = document.getElementById("nickname").value.trim();
  const reason = document.getElementById("reason").value;
  const date = dateSelect.value;
  const time = timeSelect.value;

  if (!nickname || !date || !time) return alert("請填寫所有欄位");

  const { data: userCount } = await supabase
    .from('bookings')
    .select('*')
    .eq('nickname', nickname);

  if (userCount && userCount.length >= 3) {
    return alert("每人最多報名三個名額！");
  }

  const { error } = await supabase.from("bookings").insert([{ nickname, reason, date, time }]);
  if (error) return alert("送出失敗，請稍後再試");

  alert("報名成功！祝闔家平安");
  updateTimeOptions();
}

document.addEventListener("DOMContentLoaded", updateTimeOptions);
dateSelect.addEventListener("change", updateTimeOptions);
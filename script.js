document.addEventListener("DOMContentLoaded", async () => {
  const dateSelect = document.getElementById("date");
  const timeSlotContainer = document.getElementById("timeSlots");
  const quotaDisplay = document.getElementById("quotaDisplay");
  const totalCount = document.getElementById("totalCount");

  let selectedDate = null;
  let selectedSlot = null;
  let allData = [];

  // 載入可選日期
  availableDates.forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    dateSelect.appendChild(option);
  });

  // 日期切換時更新
  dateSelect.addEventListener("change", async () => {
    selectedDate = dateSelect.value;
    selectedSlot = null;
    await refreshSlots();
  });

  async function refreshSlots() {
    timeSlotContainer.innerHTML = "";
    quotaDisplay.textContent = "";
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("date", selectedDate);

    if (error) {
      console.error("讀取資料錯誤", error);
      return;
    }

    allData = data;
    const total = data.length;
    quotaDisplay.textContent = `本日剩餘名額：${Math.max(0, maxPerDay - total)} / ${maxPerDay}`;
    totalCount.textContent = `目前總報名人數：${(await supabase.from("registrations").select("id")).data.length}`;

    const slotCounts = {};
    data.forEach(entry => {
      slotCounts[entry.time_slot] = (slotCounts[entry.time_slot] || 0) + 1;
    });

    timeSlots.forEach(slot => {
      const btn = document.createElement("button");
      btn.textContent = slot;

      if (slotCounts[slot]) {
        btn.classList.add("full");
        btn.disabled = true;
      }

      btn.addEventListener("click", () => {
        document.querySelectorAll("#timeSlots button").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedSlot = slot;
      });

      timeSlotContainer.appendChild(btn);
    });
  }

  // 預設選第一個日期
  dateSelect.value = availableDates[0];
  selectedDate = availableDates[0];
  await refreshSlots();
});

async function submitForm() {
  const name = document.getElementById("name").value.trim();
  const purpose = document.getElementById("purpose").value;
  const successMessage = document.getElementById("successMessage");

  if (!name || !selectedDate || !selectedSlot) {
    alert("請填寫完整資料並選擇時段");
    return;
  }

  // 限制每人最多三筆
  const { data: myData, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("name", name);

  if (myData.length >= 3) {
    alert("每人最多報名三個名額，您已達上限。");
    return;
  }

  const { error: insertError } = await supabase.from("registrations").insert({
    name,
    purpose,
    date: selectedDate,
    time_slot: selectedSlot
  });

  if (insertError) {
    alert("報名失敗，請稍後再試");
    return;
  }

  successMessage.textContent = "報名成功，祝闔家平安！";
  setTimeout(() => location.reload(), 2000);
}

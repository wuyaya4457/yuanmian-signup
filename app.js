
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  "https://ygtffksgngkwpuxpfuez.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndGZma3Nnbmdrd3B1eHBmdWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjgwMjIsImV4cCI6MjA2Njk0NDAyMn0.o25-6PeqngEQdGGFw5n0JRkn7tdxrJuNGPbzdvTATY8"
);

const dateSelect = document.getElementById("date");
const timeSelect = document.getElementById("time");
const nameInput = document.getElementById("realname");
const typeSelect = document.getElementById("type");
const submitBtn = document.getElementById("submit");
const exportBtn = document.getElementById("export-btn");
const successMsg = document.getElementById("success-msg");
const counter = document.getElementById("counter");

const TIMES = [];
for (let h = 9; h <= 17; h++) {
  for (let m of [0, 30]) {
    if (h === 12) continue;
    TIMES.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
  }
}

async function updateTimeOptions() {
  const date = dateSelect.value;
  const { data } = await supabase.from("signups").select("*").eq("date", date);
  const filled = {};
  TIMES.forEach((t) => (filled[t] = []));
  data.forEach((item) => filled[item.time].push(item.realname));
  timeSelect.innerHTML = "";
  TIMES.forEach((t) => {
    const option = document.createElement("option");
    option.value = t;
    option.textContent = `${t}（${filled[t].length}人）`;
    if (filled[t].length >= 1) option.disabled = true;
    timeSelect.appendChild(option);
  });
  counter.textContent = `本日剩餘名額：${15 - data.length} / 15`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateTimeOptions();
  dateSelect.addEventListener("change", updateTimeOptions);

  submitBtn.addEventListener("click", async () => {
    const date = dateSelect.value;
    const time = timeSelect.value;
    const realname = nameInput.value.trim();
    const type = typeSelect.value;

    if (!realname || !date || !time || !type) {
      alert("請填寫所有欄位");
      return;
    }

    const { data: existing, error: e1 } = await supabase
      .from("signups")
      .select("*")
      .eq("realname", realname);

    if (existing && existing.length >= 3) {
      alert("一人最多三個名額");
      return;
    }

    const { data: slotCheck } = await supabase
      .from("signups")
      .select("*")
      .eq("date", date)
      .eq("time", time);

    if (slotCheck && slotCheck.length >= 1) {
      alert("該時段已滿");
      return;
    }

    const { error } = await supabase
      .from("signups")
    const { error } = await supabase.from('signups').insert([{ realname: nameInput.value, type, date, time }]);

    if (!error) {
      successMsg.textContent = "報名成功，祝闔家平安";
      updateTimeOptions();
    }
  });

  exportBtn.addEventListener("click", async () => {
    const { data } = await supabase.from("signups").select("*");
    const csv = ["﻿姓名/暱稱,事由,日期,時段"];
    data.forEach((row) => {
      csv.push(`${row.realname},${row.type},${row.date},${row.time}`);
    });
    const blob = new Blob(["﻿" + csv.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "報名資料.csv";
    a.click();
  });
});
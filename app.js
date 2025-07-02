
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  "https://ygtffksgngkwpuxpfuez.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndGZma3Nnbmdrd3B1eHBmdWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjgwMjIsImV4cCI6MjA2Njk0NDAyMn0.o25-6PeqngEQdGGFw5n0JRkn7tdxrJuNGPbzdvTATY8"
);

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit");

  submitBtn.addEventListener("click", async () => {
    const realname = document.getElementById("realname").value.trim();
    if (!realname) return alert("請輸入姓名或暱稱");

    const { data: existing, error } = await supabase
      .from("signups")
      .select("*")
      .eq("realname", realname);

    if (error) {
      alert("發生錯誤：" + error.message);
      return;
    }

    if (Array.isArray(existing) && existing.length >= 3) {
      alert("一人最多三個名額");
      return;
    }

    await supabase.from("signups").insert([{ realname }]);
    document.getElementById("success-msg").textContent = "報名成功，祝闔家平安";
  });
});

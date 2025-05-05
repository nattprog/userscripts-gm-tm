// ==UserScript==
// @name     Clic Attendance Sign-in
// @version  1
// @grant    none
// @include  https://osc.mmu.edu.my/*
// @description Made by nat. Signs in automatically upon opening an attendance link.
// ==/UserScript==

(() => {
  if (window.location.origin === "https://osc.mmu.edu.my") {
    try {
      document.querySelector("#N_QRCODE_DRV_USERID").value = "STUDENT ID HERE".toUpperCase();
      document.querySelector("#N_QRCODE_DRV_PASSWORD").value = "Password here";
      document.querySelector("#N_QRCODE_DRV_BUTTON1").click();
      navigator.clipboard.writeText(window.location.href);
      alert("Attendance triggered. Copied link to clipboard.");
    } catch (err) {
      alert(`Error: Unable to sign in. Try doing it manually.\n\n ${err}`);
    }
  }
})();

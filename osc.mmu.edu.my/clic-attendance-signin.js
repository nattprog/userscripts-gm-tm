// ==UserScript==
// @name     Clic Attendance Sign-in
// @version  1
// @grant       GM.setValue
// @grant       GM.getValue
// @include  https://osc.mmu.edu.my/*
// @description Made by nat. Signs in automatically upon opening an attendance link.
// ==/UserScript==

let savedLogs = "";
let savingLogs = "";
let key = "signInKey";

let logins = [
  { name: "lorem", id: "1234IPSUM", password: "asdf" }, // triggered automatically by default
  { name: "", id: "", password: "" },
  { name: "", id: "", password: "" },
  { name: "", id: "", password: "" },
];

(async () => {
  createBtns();
  await createLog();
  await signIn(logins[0]);
})();

async function signIn(user) {
  try {
    document.querySelector("#N_QRCODE_DRV_USERID").value =
      user.id.toUpperCase();
    document.querySelector("#N_QRCODE_DRV_PASSWORD").value = user.password;
    document.querySelector("#N_QRCODE_DRV_BUTTON1").click();
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {
      await log("Error: Unable to save link to clipboard.", true);
    }
    await log(`Signing in ${user.name} : ${user.id}`, true);
  } catch (err) {
    await log(
      `Error: Something went wrong while signing in ${user.name} : ${user.id}`,
      true
    );
  }
}

async function log(msg, saveToLocal = false) {
  try {
    let span = document.createElement("span");
    span.textContent = msg;
    span.style.display = "block";
    document.querySelector("#signin-log").append(span);
  } catch {
    alert("Error: signin-log not found.");
  }

  if (saveToLocal) {
    savingLogs += (savingLogs ? "&" : "") + msg;
    await GM.setValue(key, savingLogs);
  }
}

async function createLog() {
  try {
    let div = document.createElement("div");
    div.id = "signin-log";
    document.querySelector("body").append(div);
  } catch {
    alert("Error: Unable to create log.");
  }
  savedLogs = await GM.getValue(key, "");
  savedLogs = savedLogs.split("&");
  await log("> Previous:", false);
  savedLogs?.forEach(async (msg) => {
    await log(msg, false);
  });
  await log("> Current:", false);
  savedLogs = "";
}

function createBtns() {
  try {
    let frag = document.createDocumentFragment();
    for (let i = 0; i < logins.length; i++) {
      let user = logins[i];
      if (!user.id || !user.password) {
        continue;
      }
      let btn = document.createElement("button");
      btn.setAttribute("type", "button");
      btn.id = `id-${user.id}-${i}`;
      btn.textContent = `${user.name} : ${user.id}`;
      btn.style.display = "block";
      btn.addEventListener("click", handleSigninBtn);
      frag.append(btn);
    }
    document.querySelector("body").append(frag);
  } catch (msg) {
    alert("Error: Unable to create buttons");
    alert(msg);
  }
}

function handleSigninBtn(ev) {
  try {
    ev.preventDefault();
    ev.stopPropagation();
    let index = +ev.currentTarget.id.substr(ev.currentTarget.id.length - 1, 1);
    signIn(logins[index]);
  } catch {
    alert("Error: Button click failed.");
  }
}

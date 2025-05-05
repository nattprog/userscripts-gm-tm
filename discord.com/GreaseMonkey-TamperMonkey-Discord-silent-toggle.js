// ==UserScript==
// @name     Discord silent
// @version  1
// @grant       GM.setValue
// @grant       GM.getValue
// @description Script to add silence button, that inserts @silent at the beginning of messages
// @include  https://discord.com/*
// ==/UserScript==

// Made by Nat

/*
A simple GreaseMonkey or TamperMonkey script to add a "Silent messages" toggle to the textbox of discord.com web.

Setting up:
Copy and paste this entire script to a new script in GreaseMonkey or TamperMonkey.

Usage:
Open discord.com web, open a chat and click in the textbox.
A bell icon should appear on the rightest-most position of the textbox buttons.
Click to toggle "Silent messages" mode On and Off.

Expected behaviour:
With "Silent messages" On, upon any input of text to the textbox, "@Silent " should be inserted automatically to the start of the textbox.

Supports discord.com web mobile view, i.e. textarea element input

Last confirmed working date: 5/5/2025
*/

// localStorage key
let key = "boolSilent";
// check if greasemonkey
const isGM = "undefined" === typeof GM_info.script.author;

// global bool to control mode
let boolSilent = false;

(async () => {
  // main iife
  if (isGM) {
    boolSilent = await GM.getValue(key, false);
  }
  let html = document.querySelector("html");
  // listeners that will prob trigger when user navs to a component containing the textbox
  html?.addEventListener("click", handleAddSilent);
  html?.addEventListener("keypress", handleAddSilent);
})();

function handleAddSilent() {
  let buttons = document.querySelector(".buttons__74017");
  if (!buttons || document.querySelector("#silentButton")) {
    // if buttons are not found or if there already is the silent button
    return;
  }

  let div = document.createElement("div");
  // surrounding styling around svg taken from other icons in the textbox
  div.innerHTML = `<div id="silentButton" class="contents__201d5 button__24af7 button__74017" style="${
    boolSilent ? "color:rgb(90, 100, 232);" : ""
  }"><div style="opacity: 1; transform: none" class="buttonWrapper__24af7"><div style="--__lottieIconColor: currentColor;display: flex;width: 20px;height: 20px;"class="lottieIcon__5eb9b lottieIconColors__5eb9b"><svg xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 24 24"width="24"height="24"style="width: 100%;height: 100%;transform: translate3d(0px, 0px, 0px);content-visibility: visible;"preserveAspectRatio="xMidYMid meet"><path fill="currentColor"d="M22.07 3.29 18.68 7h2.82c.28 0 .5.23.5.5v1a.5.5 0 0 1-.5.5h-5.33a.5.5 0 0 1-.5-.5v-1a1 1 0 0 1 .21-.63l1.1-1.38 1.99-2.5H16.5a.5.5 0 0 1-.5-.5V1.5c0-.28.22-.5.5-.5h5.33c.28 0 .5.22.5.5v1.11a1 1 0 0 1-.26.68Z"class=""></path><path fill="currentColor"d="M19 11.5a.5.5 0 0 0-.5-.5h-2.33a2.5 2.5 0 0 1-2.5-2.5v-1a3 3 0 0 1 .65-1.87l.48-.6c.18-.23.12-.57-.08-.78a2.5 2.5 0 0 1-.7-1.49.94.94 0 0 0-.07-.24 2 2 0 0 0-3.87-.07.62.62 0 0 1-.39.44A7 7 0 0 0 5 9.5v2.09a.5.5 0 0 1-.13.33l-1.1 1.22A3 3 0 0 0 3 15.15v.28c0 .67.34 1.29.95 1.56 1.31.6 4 1.51 8.05 1.51 4.05 0 6.74-.91 8.05-1.5.61-.28.95-.9.95-1.57v-.28a3 3 0 0 0-.77-2l-1.1-1.23a.5.5 0 0 1-.13-.33v-.09ZM9.18 19.84A.16.16 0 0 0 9 20a3 3 0 1 0 6 0c0-.1-.09-.17-.18-.16a24.84 24.84 0 0 1-5.64 0Z"class=""></path></svg></div></div></div>`;
  let inner = div.firstChild; // wacky workaround to create node through html

  buttons.append(inner);

  document
    .querySelector("#silentButton")
    .addEventListener("click", toggleSilent);

  let textbox = document.querySelector('div[role="textbox"]');
  let textarea = document.querySelector("textarea.textArea__74017");
  textbox?.addEventListener("keypress", handleKeypress);
  textarea?.addEventListener("input", handleInput);
}

async function toggleSilent(ev) {
  // self explanatory, toggles button style and boolSilent variable
  let silentButton = ev.currentTarget;
  if (boolSilent) {
    silentButton.style.color = "";
    boolSilent = false;
  } else {
    silentButton.style.color = "rgb(90, 100, 232)";
    boolSilent = true;
  }
  if (isGM) {
    await GM.setValue(key, boolSilent);
  }
}

function handleKeypress(ev) {
  if (!boolSilent) {
    return;
  }

  let textbox = ev.currentTarget;
  try {
    let prop = isGM
      ? unsafeWindow.Object.getOwnPropertyNames(textbox)
      : Object.getOwnPropertyNames(textbox); // check if greasemonkey, then use unsafewindow
    prop = [...prop];
    prop = prop.find((ar) => {
      return ar.startsWith("__reactProps$");
    });
    textbox = isGM ? textbox.wrappedJSObject : textbox; // use wrappedjsob if greasemonkey
    let dotNode = textbox[prop].children.props.node;

    let indexLast = dotNode.history.stack.length - 1;
    let text = dotNode.history.stack[indexLast].value[0].children[0].text;
    let len = text.length;
    if (len === 0) {
      dotNode.insertText("@silent ");
    } else if (!text.startsWith("@silent")) {
      for (let i = 0; i < len; i++) {
        dotNode.deleteBackward(true);
        dotNode.deleteForward(true);
      }
      dotNode.insertText("@silent ");
      dotNode.insertText(text);
    }
  } catch (err) {
    console.log("Error encountered interacting with textbox");
    console.log(err);
  }
}

function handleInput(ev) {
  if (!boolSilent) {
    return;
  }

  let textarea = ev.currentTarget;
  try {
    let val = textarea.value;
    if (val.length === 0) {
      textarea.value = "@silent ";
    } else if (!val.startsWith("@silent")) {
      textarea.value = "@silent " + val;
    }
  } catch (err) {
    console.log("Error encountered interacting with textarea");
    console.log(err);
  }
}
// ==UserScript==
// @name     Discord natro
// @version  1.1
// @grant    none
// @description Script to add silence button, that appends
// @include  https://discord.com/*
// ==/UserScript==

// Made by Nat 28/4/2025

/*
A small script to run via GreaseMonkey or TamperMonkey to scrape nitro-limited emojies and stickers,
inserting into the textbox. 

Setting up:
Copy and paste the entire script within a new script, and save.

Usage: 
Open discord.com and open a chat, click on any nitro-locked emoji or sticker. 
If the url does not appear in the textbox, try clicking again. 

NOTES: 
[Shift + Click] to get the largest possible resolution for the image. 
[Ctrl + Click](Win) or [Command + Click](Mac) to disable script's functionalities/get base discord behaviour.

Supports discord.com web mobile view, i.e. textarea element input

Last confirmed working date: 5/5/2025
*/

// check if greasemonkey
const isGM = "undefined" === typeof GM_info.script.author;

(() => {
  const html = document.querySelector("html");
  html?.addEventListener("click", handleHtml);
  html?.addEventListener("keypress", handleHtml);
})();

function handleHtml() {
  const emojie_picker = document.querySelector("#emoji-picker-grid");
  const sticker_picker = document.querySelector("#sticker-picker-grid");
  emojie_picker?.addEventListener("click", handleEmojie);
  sticker_picker?.addEventListener("click", handleSticker);
}

function handleEmojie(ev) {
  if (ev.ctrlKey || ev.metaKey) {
    return;
  }
  const t = ev.target;
  const nativeSize = "?size=48";
  const fullSize = "?size=1280";
  if (t.nodeName === "BUTTON" && t.getAttribute("data-id")) {
    ev.stopPropagation();
    let src = t.querySelector("img")?.getAttribute("src");

    let ext;

    if (src.includes("animated")) {
      ext = ".gif";
      src = src.split(".webp")[0];
    } else if (src.includes(".webp")) {
      ext = ".webp";
      src = src.split(".webp")[0];
    } else {
      src = src.split("?")[0];
      ext = "." + src.split(".").at(-1);
      src = src.replace(/\.[^.]{1,5}$/, "");
    }

    let size;
    if (ev.shiftKey) {
      size = fullSize;
    } else {
      size = nativeSize;
    }

    if (ext === ".webp" && size === fullSize) {
      ext = ".png";
    } else if (ext === ".png" && size === nativeSize) {
      ext = ".webp";
    }
    src = src + ext + size;

    let output = `[${ev.target.getAttribute("data-name") || "."}](${src})`;
    navigator.clipboard.writeText(output).catch((err) => {
      console.log("Unable to save to clipboard");
      console.log(err);
    });
    let textbox = document.querySelector('div[role="textbox"]');
    let textarea = document.querySelector("textarea.textArea__74017");
    if (textbox) {
      try {
        let prop = isGM
          ? unsafeWindow.Object.getOwnPropertyNames(textbox)
          : Object.getOwnPropertyNames(textbox); // check if greasemonkey, then use unsafewindow
        prop = [...prop];
        prop = prop.find((ar) => {
          return ar.startsWith("__reactProps$");
        });
        textbox = isGM ? textbox.wrappedJSObject : textbox; // use wrappedjsob if greasemonkey

        const dotNode = textbox[prop].children.props.node;
        const indexLast = dotNode.history.stack.length - 1;
        const len =
          dotNode.history.stack[indexLast].value[0].children[0].text.length;
        if (len > 0) {
          output = "\n" + output;
        }
        dotNode.insertText(output);
        textbox.dispatchEvent(new Event('input', { bubbles: true }));
      } catch (err) {
        console.log("Unable to insertText to textbox.");
        console.log(err);
      }
    } else if (textarea) {
      try {
        if (textarea.value.length > 0) {
          output = "\n" + output;
        }
        textarea.value += output;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      } catch (err) {
        console.log("Unable to insert text to textarea.");
        console.log(err);
      }
    }

    //document.querySelector('div[role="textbox"]').__reactProps$kal50mdiy3k.children.props.node.insertText("Hi")
  }
}

function handleSticker(ev) {
  if (ev.ctrlKey || ev.metaKey) {
    return;
  }
  const t = ev.target;
  const nativeSize = "?size=160";
  const fullSize = "?size=1280";
  if (t.nodeName === "IMG" && t.getAttribute("data-id")) {
    ev.stopPropagation();
    let src = t.getAttribute("src");

    let ext;

    if (src.includes("animated")) {
      ext = ".gif";
      src = src.split(".webp")[0];
    } else if (src.includes(".webp")) {
      ext = ".webp";
      src = src.split(".webp")[0];
    } else {
      src = src.split("?")[0];
      ext = "." + src.split(".").at(-1);
      src = src.replace(/\.[^.]{1,5}$/, "");
    }

    let size;
    if (ev.shiftKey) {
      size = fullSize;
    } else {
      size = nativeSize;
    }

    if (ext === ".webp" && size === fullSize) {
      ext = ".png";
    } else if (ext === ".png" && size === nativeSize) {
      ext = ".webp";
    }
    src = src + ext + size;

    let output = `[${
      ev.target.getAttribute("alt").split(", ")[1] || "."
    }](${src})`;
    navigator.clipboard.writeText(output).catch((err) => {
      console.log("Unable to save to clipboard");
      console.log(err);
    });
    let textbox = document.querySelector('div[role="textbox"]');
    let textarea = document.querySelector("textarea.textArea__74017");
    if (textbox) {
      try {
        let textbox = document.querySelector('div[role="textbox"]');
        let prop = isGM
          ? unsafeWindow.Object.getOwnPropertyNames(textbox)
          : Object.getOwnPropertyNames(textbox); // check if greasemonkey, then use unsafewindow
        prop = [...prop];
        prop = prop.find((ar) => {
          return ar.startsWith("__reactProps$");
        });
        textbox = isGM ? textbox.wrappedJSObject : textbox; // use wrappedjsob if greasemonkey

        const dotNode = textbox[prop].children.props.node;
        const indexLast = dotNode.history.stack.length - 1;
        const len =
          dotNode.history.stack[indexLast].value[0].children[0].text.length;
        if (len > 0) {
          output = "\n" + output;
        }
        dotNode.insertText(output);
        textbox.dispatchEvent(new Event('input', { bubbles: true }));
      } catch (err) {
        console.log("Unable to insertText to textbox.");
        console.log(err);
      }
    } else if (textarea) {
      try {
        if (textarea.value.length > 0) {
          output = "\n" + output;
        }
        textarea.value += output;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      } catch (err) {
        console.log("Unable to insert text to textarea.");
        console.log(err);
      }
    }
  }
}

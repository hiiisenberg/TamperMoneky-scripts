// ==UserScript==
// @name         Send Highlighted Text to Discord
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Send highlighted text + page URL to multiple Discord webhooks
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      discord.com
// ==/UserScript==

(function() {
    'use strict';

    // 🔹 Add your Discord webhook URLs here
    const WEBHOOKS = [
        "https://discord.com/api/webhooks/XXXXXXXX/XXXXXXXX"
    ];

    // Create floating button
    const btn = document.createElement("button");
    btn.innerText = "📩 Send to Discord";
    btn.style.position = "absolute";
    btn.style.zIndex = 9999;
    btn.style.display = "none";
    btn.style.background = "#5865F2";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.padding = "6px 10px";
    btn.style.cursor = "pointer";
    document.body.appendChild(btn);

    let selectedText = "";

    document.addEventListener("mouseup", (e) => {
        const sel = window.getSelection().toString().trim();
        if (sel) {
            selectedText = sel;
            btn.style.left = e.pageX + "px";
            btn.style.top = e.pageY + "px";
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    });

    btn.addEventListener("click", () => {
        if (!selectedText) return;

        const content = `**Highlighted Text:**\n${selectedText}\n\n**Page URL:** ${window.location.href}`;

        WEBHOOKS.forEach(url => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ content }),
                onload: (res) => console.log("Sent to Discord:", res.status)
            });
        });

        btn.style.display = "none";
        window.getSelection().removeAllRanges();
    });
})();

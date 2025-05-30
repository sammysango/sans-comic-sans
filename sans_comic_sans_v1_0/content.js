
(() => {
    const replacementStack = "Arial, Helvetica, sans-serif";

    function injectFontFix() {
        const style = document.createElement("style");
        style.id = "comic-sans-replacer-style";
        style.textContent = `
            @font-face {
                font-family: "Comic Sans MS";
                src: local("Arial");
            }
            @font-face {
                font-family: "Comic Sans";
                src: local("Arial");
            }
        `;
        document.documentElement.appendChild(style);
    }

    function removeFontFix() {
        const style = document.getElementById("comic-sans-replacer-style");
        if (style) style.remove();
    }

    function usesComicSans(el) {
        const fam = window.getComputedStyle(el).fontFamily.toLowerCase();
        return fam.includes("comic sans");
    }

    function replaceFont(el) {
        if (usesComicSans(el)) {
            el.style.setProperty("font-family", replacementStack, "important");
        }
    }

    function unreplaceFont(el) {
        if (el.style && el.style.fontFamily === replacementStack) {
            el.style.removeProperty("font-family");
        }
    }

    function scan(root = document.body) {
        if (!root) return;
        replaceFont(root);
        root.querySelectorAll("*").forEach(replaceFont);
    }

    function unscan(root = document.body) {
        if (!root) return;
        unreplaceFont(root);
        root.querySelectorAll("*").forEach(unreplaceFont);
    }

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.action === "enable") {
            injectFontFix();
            scan();
        } else if (msg.action === "disable") {
            removeFontFix();
            unscan();
        }
    });

    chrome.storage.local.get(["enabled"], (res) => {
        if (res.enabled !== false) {
            injectFontFix();
            scan();
        }
    });
})();

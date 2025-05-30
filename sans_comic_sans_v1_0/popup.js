
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("toggle");

    function updateButton(isOn) {
        button.textContent = isOn ? "ON" : "OFF";
        button.className = "toggle-btn " + (isOn ? "on" : "off");
    }

    function getAndUpdateButton() {
        chrome.storage.local.get(["enabled"], (res) => {
            const isOn = res.enabled !== false;
            updateButton(isOn);
        });
    }

    getAndUpdateButton();

    button.onclick = () => {
        chrome.storage.local.get(["enabled"], (res) => {
            const current = res.enabled !== false;
            const newState = !current;
            chrome.storage.local.set({ enabled: newState }, () => {
                updateButton(newState);
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]?.id) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: newState ? "enable" : "disable"
                        });
                    }
                });
            });
        });
    };
});

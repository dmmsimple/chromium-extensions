chrome.tabs.onUpdated.addListener(async (tabId, state, tab) => {
  if (chrome.runtime.lastError) {
    sendResponse({ message: "fail" });
    return;
  }
  if (state.status === 'complete' && /^http/.test(tab.url)) {
    try{

        await chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ['./css/foreground.css'],
        })

        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: [
                './foreground.js'
            ],
        });

        await chrome.tabs.sendMessage(tabId, {
            message: 'thisurl',
            payload: tab.url,
        });

    }
    catch(err){
        console.warn(err);
    }
  }
  return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === 'fetchApodImage'){
        if (chrome.runtime.lastError) {
        sendResponse({ message: "fail" });
        return;
        }
        getApodImage(request).then(sendResponse);
        return true;
    }
})

async function getApodImage(request){
    if (chrome.runtime.lastError) {
        sendResponse({ message: "fail" });
        return;
    }

    const apiUrl = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

    const headers = new Headers();

    const response = await fetch(apiUrl, {
        method: 'get',
        mode: 'cors',
        'Content-Type': 'application/json',
        headers: headers,
    });

    const data = await response.json();

    return data;

}

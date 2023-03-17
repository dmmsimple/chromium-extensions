console.log('hello from foreground');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === 'thisurl'){
        if (chrome.runtime.lastError) {
            sendResponse({ message: "fail" });
            return;
        }
    }
})

getApodImage();

async function getApodImage(){
    const response = await chrome.runtime.sendMessage({
        message: 'fetchApodImage'
    });

    console.log(response);

    let divcontainer = document.createElement('div');
    divcontainer.id = 'MyExtensionDivContainer';
    divcontainer.classList.add('myextapodimage');
    document.body.appendChild(divcontainer);

    let apodimage = document.createElement('img');
    apodimage.src = response?.hdurl;
    divcontainer.appendChild(apodimage);
}
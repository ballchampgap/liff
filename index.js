// Import stylesheets
import "./style.css"

// Body element
const body = document.getElementById('body')

// Button elements
const btnSend = document.getElementById("btnSend")
const btnClose = document.getElementById("btnClose")
const btnShare = document.getElementById("btnShare")
const btnLogIn = document.getElementById("btnLogIn")
const btnLogOut = document.getElementById("btnLogOut")
const btnScanCode = document.getElementById("btnScanCode")
const btnOpenWindow = document.getElementById("btnOpenWindow")

// Profile elements
const email = document.getElementById("email")
const userId = document.getElementById("userId")
const pictureUrl = document.getElementById("pictureUrl")
const displayName = document.getElementById("displayName")
const statusMessage = document.getElementById("statusMessage")

// QR element
const code = document.getElementById("code")
const friendShip = document.getElementById("friendShip")

async function main() {
    // Initialize LIFF app)
    await liff.init({ liffId: "1657027533-Q38qoO29" })

    // Try a LIFF function
    switch (liff.getOS()) {
        case "android":
            body.style.backgroundColor = "#d1f5d3";
            break
        case "ios":
            body.style.backgroundColor = "#eeeeee";
            break
    }

    if (!liff.isInClient()) {
        if (liff.isLoggedIn()) {
            btnShare.style.display = "block"
            btnLogIn.style.display = "none"
            btnLogOut.style.display = "block"
            getUserProfile()
            getFriendship()
        } else {
            btnLogIn.style.display = "block"
            btnLogOut.style.display = "none"
        }
    } else {
        getUserProfile()
        btnSend.style.display = "block"
        btnShare.style.display = "block"
        getFriendship()
    }
    btnScanCode.style.display = "block"

    btnOpenWindow.style.display = "block"
}
main()

async function getUserProfile() {
    const profile = await liff.getProfile()
    pictureUrl.src = profile.pictureUrl
    userId.innerHTML = "<b>userId:</b> " + profile.userId
    statusMessage.innerHTML = "<b>statusMessage:</b> " + profile.statusMessage
    displayName.innerHTML = "<b>displayName:</b> " + profile.displayName
    email.innerHTML = "<b>email:</b> " + liff.getDecodedIDToken().email
}

if (!liff.isInClient()) {
    btnLogIn.onclick = () => {
        liff.login()
    }

    btnLogOut.onclick = () => {
        liff.logout()
        window.location.reload()
    }
}
async function sendMsg() {
    if (liff.getContext().type !== "none" && liff.getContext().type !== "external") {
        await liff.sendMessages([{
                "type": "text",
                "text": "Line Developers University Workshop"
            },
            {
                "type": "text",
                "text": "This message was sent by sendMessages"
            }
        ])
        liff.closeWindow()
    }
}

btnSend.onclick = () => {
    sendMsg()
}

async function shareMsg() {
    await liff.shareTargetPicker([{
            "type": "text",
            "text": "Line Developers University Workshop"
        },
        {
            type: "image",
            originalContentUrl: "https://d.line-scdn.net/stf/line-lp/2016_en_02.jpg",
            previewImageUrl: "https://d.line-scdn.net/stf/line-lp/2016_en_02.jpg"
        }
    ], {
        isMultiple: false
    });
    if (result) {
        liff.closeWindow();
    }
}

btnShare.onclick = () => {
    shareMsg()
}

async function scanCode() {
    const result = await liff.scanCodeV2();
    code.innerHTML = "<b>Code: </b>" + result.value;
}

btnScanCode.onclick = () => {
    scanCode();
};

btnOpenWindow.onclick = () => {
    liff.openWindow({
        url: 'https://codelab.line.me/codelabs/liff/index.html#9',
        external: false
    })
}
async function getFriendship() {
    let msg = "Hooray! You and our chatbot are friend."
    const friend = await liff.getFriendship()
    if (!friend.friendFlag) {
        msg = "<a href=\"https://line.me/R/ti/p/@BOT-ID\">Follow our chatbot here!</a>"
    }
    friendShip.innerHTML = msg;
}
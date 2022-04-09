var token = {
    rockToken: {
        "background": "linear-gradient(90deg, hsl(349, 71%, 52%), hsl(349, 70%, 56%));",
        "url": "/images/icon-rock.svg",
        "strength": 1
    },
    paperToken: {
        "background": "linear-gradient(90deg, hsl(230, 89%, 62%), hsl(230, 89%, 65%))",
        "url": "/images/icon-paper.svg",
        "strength": 3
    },
    scissorsToken: {
        "background": "linear-gradient(90deg,hsl(39, 89%, 49%),hsl(40, 84%, 53%)); ",
        "url": "/images/icon-scissors.svg",
        "strength": 5
    }
}



// Const/ var declared here :

const tempSelect = document.querySelector(".choice-section__scissors-wrapper");

// tempSelect.style.cssText += "box-shadow: 0px 0px 20px 0px blue;"

const scoreTag = document.querySelector(".heading__score__value");
const localStorage = window.localStorage

const rockToken = token.rockToken;
const paperToken = token.paperToken;
const scissorsToken = token.scissorsToken;

const placeholderUser = document.querySelector(".token-placeholder__user-choice");
const placeholderComp = document.querySelector(".token-placeholder__comp-choice");

const tokenSelection = document.querySelector(".choice-section");
const compSelection = document.querySelector(".token-placeholder");

const retrySection = document.querySelector(".result-declaration");
const retry = document.querySelector(".result-declaration__play-again");
const resultWin = document.querySelector(".result-declaration__win");
const resultLose = document.querySelector(".result-declaration__lose");

let playerToken = undefined;
let compToken = undefined;
let roundWinner = undefined

// Functions here :

function createToken(tokenType) {
    var node = document.createElement("img");
    node.setAttribute("src", tokenType.url)
    return node
}

function decorateToken(node, tokenType) {
    let token = createToken(tokenType);
    if (node.firstChild) {
        node.removeChild(node.firstChild)
    }

    node.appendChild(token)

    node.style.cssText = `
    display: flex;
    overflow: hidden;
  
    justify-content: center;
    align-items: center;
  
    aspect-ratio: 1/1;
    width: 70%;
  
    background: ${tokenType.background};
    border-radius: 50%;
    box-shadow: inset rgba(20, 20, 20, 0.3) 0px -7px 0px -1px;
  
    cursor: pointer;
                        `
    // node.addClass("winner-animation")

    node.firstChild.style.cssText = `
    display: inline-block;
 
    aspect-ratio: 1/1;
    width: 70%;
    object-fit: contain;
  
    padding: 16%;
  
    background-color: white;
    border-radius: 50%;
    box-shadow: inset hsl(0, 2%, 32%, 15%) 0px 1em 0px -10px;
                        `
}

let compChoice = () => {
    let tokens = [rockToken, paperToken, scissorsToken]
    let num = Math.floor(Math.random() * 3)
    return (tokens[num])
}

let winner = (playerToken, compToken) => {
    if (playerToken == compToken) {
        return 0
    }

    var sum = playerToken.strength + compToken.strength

    if (sum == 4) {
        return paperToken
    } else if (sum == 6) {
        return rockToken
    } else if (sum == 8) {
        return scissorsToken
    }
}


// Event listners

window.onload = () => {
    if (localStorage) {
        scoreTag.textContent = localStorage.getItem("score")
    }
}

if (tokenSelection) {

    tokenSelection.addEventListener("click", (token) => {
        var tokenType = String(token.target.classList)

        tokenSelection.style.display = "none"
        compSelection.style.display = "grid"

        if (tokenType.includes("rock")) {
            decorateToken(placeholderUser, rockToken)
            playerToken = rockToken
        } else if (tokenType.includes("paper")) {
            decorateToken(placeholderUser, paperToken)
            playerToken = paperToken
        } else if (tokenType.includes("scissors")) {
            decorateToken(placeholderUser, scissorsToken)
            playerToken = scissorsToken
        }
    })
}


const observer = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
        placeholderComp.classList.add("shacking-animation")
        setTimeout(() => {
            placeholderComp.classList.remove("shacking-animation")
            compToken = compChoice()
            decorateToken(placeholderComp, compToken)
            roundWinner = winner(playerToken, compToken)
            console.log("hit")
            if (roundWinner == 0) {
                resultLose.style.display = "none"
                resultWin.style.display = "none"
            } else if (roundWinner == playerToken) {
                placeholderUser.classList.add("winner-animation")
                setTimeout(() => {
                    placeholderUser.classList.remove("winner-animation")
                }, 2000);
                scoreTag.textContent = Number(scoreTag.textContent) + 1
                localStorage.setItem("score", Number(scoreTag.textContent))

                resultLose.style.display = "none"
                resultWin.style.display = "block"

            } else if (roundWinner != playerToken) {
                placeholderComp.classList.add("winner-animation")
                setTimeout(() => {
                    placeholderComp.classList.remove("winner-animation")
                }, 2000);
                scoreTag.textContent = Number(scoreTag.textContent) - 1
                localStorage.setItem("score", Number(scoreTag.textContent))

                resultLose.style.display = "block"
                resultWin.style.display = "none"


            }
            retrySection.style.display = "block"
        }, 1000)
    }
    if (!(entries[0].isIntersecting)) {
        if (placeholderComp.firstChild) {
            placeholderComp.removeChild(placeholderComp.firstChild)
        }
        placeholderComp.style.background = "rgba(0, 0, 0, 0.199)";
        placeholderComp.style.boxShadow = "0px 0px 0px"
        retrySection.style.display = "none"
    }
})
observer.observe(compSelection)

retry.onclick = function () {
    tokenSelection.style.display = "grid"
    compSelection.style.display = "none"
}
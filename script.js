document.addEventListener('DOMContentLoaded', ()=> {
    
const searchButton = document.querySelector('button');
const usernameInput = document.querySelector('input');
const statsContainer = document.querySelector('.stats-container');
const easyProgressCircle = document.querySelector('.progress-easy');
const mediumProgressCircle = document.querySelector('.progress-medium');
const hardProgressCircle = document.querySelector('.progress-hard');
const easyLabel = document.querySelector('#easy-label');
const mediumLabel = document.querySelector('#medium-label');
const hardLabel = document.querySelector('#hard-label');
const statsRank = document.querySelector('.ranking');
const statsAcceptanceRate = document.querySelector('.acceptance-rate');
const msg = document.querySelector('.msg');

function validateUsername(name) {
    if(name.trim()==="") {
        alert("Only ghosts have empty usernames");
        return false;
    }

    const regEx = /^[a-zA-Z0-9_]{3,20}$/; //took this from blackbox.ai

    if(!regEx.test(name)) {
        alert("Invalid Username!")
    } 
    return regEx.test(name);
}

async function fetchUserData(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;

        const response = await fetch(url);
        if(!response.ok) {
            throw new Error("Unable to fetch User Details");
        }

        const data = await response.json();

        if(data.status==='error') {
            msg.innerHTML = `<h2>${data.message}</h2>`;
            console.log(msg.innerHTML)
        } else {
            msg.innerHTML="";
            displayUserData(data);
        }
        

    } catch (error) {
        msg.innerHTML = `${error}`;
    } finally {
        searchButton.textContent = "Search";
        searchButton.disabled = false;
    }
}

function updateProgress(total, solved, label, circle) {
    // circle.style.transition = "2s";
    const progressDegree = (solved/total)*100;
    circle.style.setProperty("--progress-degree",`${progressDegree}%`);
    label.innerHTML = `${solved}/${total}`;

}

function displayUserData(data) {
    statsContainer.style.display = "all";
    statsContainer.style.display = "inline";
    
    const totalQuestions = data.totalQuestions;
    const totalEasyQuestions = data.totalEasy;
    const totalMediumQuestions = data.totalMedium;
    const totalHardQuestions = data.totalHard;
    
    const totalSolved = data.totalSolved;
    const totalEasySolved = data.easySolved;
    const totalMediumSolved = data.mediumSolved;
    const totalHardSolved = data.hardSolved;

    const rank = data.ranking;
    const acceptanceRate = data.acceptanceRate;
    
    updateProgress(totalEasyQuestions, totalEasySolved, easyLabel, easyProgressCircle);
    updateProgress(totalMediumQuestions, totalMediumSolved, mediumLabel, mediumProgressCircle);
    updateProgress(totalHardQuestions, totalHardSolved, hardLabel, hardProgressCircle);
    
    statsRank.innerHTML = `Rank: ${rank}`;
    statsAcceptanceRate.innerHTML = `Acceptance Rate: ${acceptanceRate}`;
}


searchButton.addEventListener('click', ()=>{
    statsContainer.style.display = "none";
        const username = usernameInput.value; 
           if(validateUsername(username)) {
                fetchUserData(username);
           }
       })
})
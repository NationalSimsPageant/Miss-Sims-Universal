const firebaseConfig = {
    apiKey: "AIzaSyAK_FP7yIMwsa19OE137Vb3EQpmlmGw-dw",
    authDomain: "vote-msuniversal25.firebaseapp.com",
    projectId: "vote-msuniversal25",
    storageBucket: "vote-msuniversal25.firebasestorage.app",
    messagingSenderId: "468870680104",
    appId: "1:468870680104:web:e57f73e0339baee97f2f1d",
    databaseURL: "https://msuniversal26-default-rtdb.asia-southeast1.firebasedatabase.app"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();

const countryColors = {
    "Albania":"#ffb3ba","Argentina":"#bae1ff","Armenia":"#ffdfba","Aruba":"#bae1ff","Australia":"#baffc9","Bahamas":"#ffffba","Belgium":"#ffffba","Brazil":"#baffc9","Canada":"#ffb3ba","Chile":"#ffb3ba","China":"#ffb3ba","Colombia":"#ffffba","Costa Rica":"#bae1ff","Croatia":"#ffb3ba","Curaçao":"#bae1ff","Denmark":"#ffb3ba","Dominican Republic":"#bae1ff","Ecuador":"#ffffba","El Salvador":"#bae1ff","France":"#bae1ff","Germany":"#ffffba","Ghana":"#ffffba","Great Britain":"#ffb3ba","Guatemala":"#bae1ff","Iceland":"#bae1ff","India":"#ffdfba","Indonesia":"#ffb3ba","Italy":"#baffc9","Jamaica":"#ffffba","Japan":"#ffb3ba","Kenya":"#baffc9","Kyrgyzstan":"#ffb3ba","Laos":"#ffb3ba","Lebanon":"#ffb3ba","Malaysia":"#ffb3ba","Mexico":"#baffc9","Myanmar":"#ffffba","Namibia":"#baffc9","Nepal":"#ffb3ba","Netherlands":"#ffdfba","New Zealand":"#bae1ff","Nicaragua":"#bae1ff","Nigeria":"#baffc9","Norway":"#ffb3ba","Panama":"#ffb3ba","Paraguay":"#ffb3ba","Peru":"#ffb3ba","Philippines":"#bae1ff","Poland":"#ffb3ba","Portugal":"#baffc9","Puerto Rico":"#ffb3ba","Samoa":"#bae1ff","South Africa":"#baffc9","South Korea":"#fff","Sri Lanka":"#ffffba","Thailand":"#bae1ff","Türkiye":"#ffb3ba","USA":"#bae1ff","Venezuela":"#ffffba","Vietnam":"#ffb3ba"
};

const countries = ["Albania", "Argentina", "Armenia", "Aruba", "Australia", "Bahamas", "Belgium", "Brazil", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Curaçao", "Denmark", "Dominican Republic", "Ecuador", "El Salvador", "France", "Germany", "Ghana", "Great Britain", "Guatemala", "Iceland", "India", "Indonesia", "Italy", "Jamaica", "Japan", "Kenya", "Kyrgyzstan", "Laos", "Lebanon", "Malaysia", "Mexico", "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "Norway", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Samoa", "South Africa", "South Korea", "Sri Lanka", "Thailand", "Türkiye", "USA", "Venezuela", "Vietnam"];
const countryCodes = {"Albania":"al","Argentina":"ar","Armenia":"am","Aruba":"aw","Australia":"au","Bahamas":"bs","Belgium":"be","Brazil":"br","Canada":"ca","Chile":"cl","China":"cn","Colombia":"co","Costa Rica":"cr","Croatia":"hr","Curaçao":"cw","Denmark":"dk","Dominican Republic":"do","Ecuador":"ec","El Salvador":"sv","France":"fr","Germany":"de","Ghana":"gh","Great Britain":"gb","Guatemala":"gt","Iceland":"is","India":"in","Indonesia":"id","Italy":"it","Jamaica":"jm","Japan":"jp","Kenya":"ke","Kyrgyzstan":"kg","Laos":"la","Lebanon":"lb","Malaysia":"my","Mexico":"mx","Myanmar":"mm","Namibia":"na","Nepal":"np","Netherlands":"nl","New Zealand":"nz","Nicaragua":"ni","Nigeria":"ng","Norway":"no","Panama":"pa","Paraguay":"py","Peru":"pe","Philippines":"ph","Poland":"pl","Portugal":"pt","Puerto Rico":"pr","Samoa":"ws","South Africa":"za","South Korea":"kr","Sri Lanka":"lk","Thailand":"th","Türkiye":"tr","USA":"us","Venezuela":"ve","Vietnam":"vn"};

function checkDailyBonus() {
    const lastClaim = localStorage.getItem('last_bonus_date');
    const today = new Date().toDateString();
    const btn = document.getElementById('claim-bonus-btn');
    const text = document.getElementById('bonus-status-text');
    if (lastClaim === today) {
        if(btn) { btn.disabled = true; btn.innerText = "ALREADY CLAIMED TODAY"; }
        if(text) { text.innerText = "Come back tomorrow for another random bonus vote!"; }
    }
}

function claimDailyBonus() {
    const lastClaim = localStorage.getItem('last_bonus_date');
    const today = new Date().toDateString();

    if (lastClaim === today) {
        alert("You have already claimed your daily bonus today!");
        return;
    }

    const countryName = prompt("Enter the country name you want to give your Daily Bonus to:\n(e.g., Thailand, USA, Philippines)");
    if (!countryName) return;

    const matchedCountry = countries.find(c => c.toLowerCase() === countryName.trim().toLowerCase());
    if (!matchedCountry) {
        alert("Country not found! Please check the spelling.");
        return;
    }

    const bonusValues = [10, 20, 50, 100, 500, 1000];
    const randomBonus = bonusValues[Math.floor(Math.random() * bonusValues.length)];

    db.ref('26Votes/' + matchedCountry.replace(/ /g, "_")).transaction(c => (c || 0) + randomBonus).then(() => {
        localStorage.setItem('last_bonus_date', today);
        alert(`🎉 SUCCESS! You got a Daily Bonus of +${randomBonus} votes for ${matchedCountry.toUpperCase()}!`);
        checkDailyBonus();
        const forest = document.getElementById('sakura-forest');
        if(forest) forest.scrollIntoView({ behavior: 'smooth' });
    });
}

db.ref('26Votes').on('value', snap => {
    const votes = snap.val() || {};
    const total = Object.values(votes).reduce((a, b) => a + b, 0);
    const totalEl = document.getElementById('total-v');
    if(totalEl) totalEl.innerText = "TOTAL: " + total.toLocaleString();

    const sorted = [...countries].sort((a, b) => (votes[b.replace(/ /g, "_")] || 0) - (votes[a.replace(/ /g, "_")] || 0));
    const maxVote = votes[sorted[0].replace(/ /g, "_")] || 1;

    let forestHtml = "";
    sorted.forEach((name) => {
        const count = votes[name.replace(/ /g, "_")] || 0;
        const code = countryCodes[name] || "un";
        const h = (count / maxVote) * 280 + 15; 
        const pc = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
        const pColor = countryColors[name] || "#ffb7c5"; 

        forestHtml += `
            <div class="sakura-tree">
                <div class="sakura-blossom-container">
                    <div class="sakura-blossom">
                        <img src="https://flagcdn.com/w80/${code}.png">
                        <span class="percent-overlay">${pc}%</span>
                    </div>
                </div>
                <div class="sakura-trunk" style="height: ${h}px; background: linear-gradient(to top, rgba(255,255,255,0.1), ${pColor}b3);">
                    <div class="vote-label-top">${count.toLocaleString()}</div>
                </div>
                <div class="country-label">${name.toUpperCase()}</div>
            </div>
        `;
    });
    const treeContainer = document.getElementById('tree-container');
    if(treeContainer) treeContainer.innerHTML = forestHtml;
    
    const searchInput = document.getElementById('country-search');
    renderButtons(searchInput ? searchInput.value : "");
});

function renderButtons(filter = "") {
    const grid = document.getElementById('vote-grid');
    if(!grid) return;
    grid.innerHTML = "";
    countries.forEach(name => {
        if (name.toLowerCase().includes(filter.toLowerCase())) {
            const b = document.createElement('button');
            b.className = "vote-btn";
            const code = countryCodes[name] || "un";
            b.innerHTML = `
                <img src="https://flagcdn.com/w40/${code}.png" style="width:24px; margin-right:12px; border-radius:3px;"> 
                <span>${name.toUpperCase()}</span>
            `;
            b.onclick = () => { 
                db.ref('26Votes/' + name.replace(/ /g, "_")).transaction(c => (c || 0) + 1).then(() => {
                    const forest = document.getElementById('sakura-forest');
                    if(forest) forest.scrollIntoView({ behavior: 'smooth' });
                });
            };
            grid.appendChild(b);
        }
    });
}

const searchInput = document.getElementById('country-search');
if(searchInput) {
    searchInput.addEventListener('input', (e) => renderButtons(e.target.value));
}

checkDailyBonus();
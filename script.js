let entryForm = document.getElementById("entryForm");
let titleInput = document.getElementById("titleInput");
let categoryInput = document.getElementById("categoryInput");
let contentInput = document.getElementById("contentInput");
let vaultData = JSON.parse(localStorage.getItem("myVault")) || [];
let cardsContainer = document.querySelector("#cardsContainer");
let wordCount = document.querySelector("#wordCount");

function renderCards(dataArray){
    cardsContainer.innerHTML="";
    if(dataArray.length===0){
        cardsContainer.innerHTML="<p style= 'color:#777' >No Entry found </p>";
        return;
    }
    dataArray.forEach(function(item) {
        let cardHTML=`
        <div class="card">
        <span class="badge">${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.content}</p>
        <button class="delete-btn" onclick="deleteEntry(${item.id})">Delete</button>
      </div>
        `;
        cardsContainer.innerHTML+=cardHTML;
    });
}

entryForm.addEventListener("submit", function(dets){
    dets.preventDefault();
    
    let newEntry={
        id: Date.now(),
        title: titleInput.value,
        category: categoryInput.value,
        content: contentInput.value
    };
    vaultData.push(newEntry)
    localStorage.setItem("myVault", JSON.stringify(vaultData));
    renderCards(vaultData);
    console.log("Saved in storage: ", vaultData);
    entryForm.reset();
    wordCount.textContent = "Words: 0";
})
renderCards(vaultData);

function deleteEntry(id){
    vaultData=vaultData.filter(function(item){
        return item.id !== id;
    });
    localStorage.setItem("myVault", JSON.stringify(vaultData));
    renderCards(vaultData);
}

contentInput.addEventListener("input", function() {
    const text = contentInput.value.trim();
    const words = text === "" ? 0 : text.split(/\s+/).length;
    wordCount.textContent = "Words: " + words;
});

const searchInput = document.getElementById("searchInput");
const tabButtons = document.querySelectorAll(".tab-btn");

let currentCategory = "All";

function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();

  const filteredData = vaultData.filter(function(item) {
    const matchesCategory = (currentCategory === "All") || (item.category === currentCategory);

    // Condition 2: Title ya Content mein search text mile
    const matchesSearch = item.title.toLowerCase().includes(query) || 
                          item.content.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  renderCards(filteredData);
}

searchInput.addEventListener("input", function() {
  applyFilters();
});

tabButtons.forEach(function(btn) {
  btn.addEventListener("click", function() {
    // 1. Pehle sabhi buttons se 'active' class hatao
    tabButtons.forEach(function(b) {
      b.classList.remove("active");
    });

    // 2. Jis button par click hua, uspe 'active' class lagao (CSS highlight ke liye)
    btn.classList.add("active");

    // 3. Button ke data-filter attribute se category nikalo ("All", "Shayari", ya "Book Note")
    currentCategory = btn.getAttribute("data-filter");

    // 4. Filter apply karo
    applyFilters();
  });
});


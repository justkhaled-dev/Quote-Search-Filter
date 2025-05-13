const searchInput = document.getElementById("searchInput");
const quoteList = document.getElementById("quoteList");
const errorDiv = document.getElementById("error");
const quoteModal = document.getElementById("quoteModal");
const modalQuoteText = document.getElementById("modalQuoteText");
const modalQuoteAuthor = document.getElementById("modalQuoteAuthor");
const loadingContainer = document.getElementById("loading");

let quotes = [];

function createSkeletonLoader(count) {
  loadingContainer.innerHTML = `
        <div class="loading-container">
          <div class="loading-progress"></div>
          <div class="skeleton-loading">
            ${Array(count).fill('<div class="skeleton-card"></div>').join("")}
          </div>
        </div>
      `;
}

function fetchQuotes() {
  createSkeletonLoader(6);

  fetch("https://dummyjson.com/quotes")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch quotes.");
      return response.json();
    })
    .then((data) => {
      quotes = data.quotes;
      createSkeletonLoader(quotes.length);

      setTimeout(() => {
        loadingContainer.innerHTML = "";
        displayQuotes(quotes);
      }, 800);
    })
    .catch((error) => {
      errorDiv.textContent = error.message;
      loadingContainer.innerHTML = "";
    });
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = quotes.filter(
    (q) =>
      q.quote.toLowerCase().includes(term) ||
      (q.author && q.author.toLowerCase().includes(term))
  );

  if (filtered.length === 0) {
    quoteList.innerHTML =
      '<p style="grid-column: 1 / -1; text-align: center;">No quotes found matching your search.</p>';
  } else {
    displayQuotes(filtered);
  }
});

function displayQuotes(list) {
  quoteList.innerHTML = "";

  list.forEach((q, idx) => {
    const li = document.createElement("li");
    const quoteTitle = q.author || "General Quote";

    li.innerHTML = `
          <p>
            <span class="quote-text">"${q.quote}"</span>
            <span class="author">— ${quoteTitle} —</span>
          </p>
        `;

    li.addEventListener("click", () => {
      showModal(q.quote, quoteTitle);
    });

    quoteList.appendChild(li);
  });
}

function showModal(quote, author) {
  modalQuoteText.textContent = `"${quote}"`;
  modalQuoteAuthor.textContent = `— ${author} —`;
  quoteModal.style.display = "flex";
}

function closeModal() {
  quoteModal.style.display = "none";
}

window.addEventListener("click", (e) => {
  if (e.target === quoteModal) {
    closeModal();
  }
});

fetchQuotes();

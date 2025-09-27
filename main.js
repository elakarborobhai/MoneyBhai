const app = document.getElementById("app");

function showConsent() {
  app.innerHTML = `
    <h1>Consent & Disclaimer</h1>
    <p>This app stores data locally and does not share anything externally.</p>
    <label><input type="checkbox" id="ageCheck" /> I confirm I am of legal age.</label><br/>
    <label><input type="checkbox" id="privacyCheck" /> I understand this is private and offline-only.</label><br/>
    <label><input type="checkbox" id="responsibleCheck" /> I accept responsible use reminders.</label><br/>
    <button onclick="acceptConsent()">Continue</button>
  `;
}

function acceptConsent() {
  const age = document.getElementById("ageCheck").checked;
  const privacy = document.getElementById("privacyCheck").checked;
  const responsible = document.getElementById("responsibleCheck").checked;
  if (age && privacy && responsible) {
    localStorage.setItem("consentAccepted", "true");
    showTakaManager();
  } else {
    alert("Please accept all conditions to continue.");
  }
}

function showTakaManager() {
  app.innerHTML = `
    <h1>Taka Manager</h1>
    <form id="txnForm">
      <input type="text" id="type" placeholder="Type (Deposit/Withdrawal)" required />
      <input type="number" id="amount" placeholder="Amount (BDT)" required />
      <textarea id="note" placeholder="Note"></textarea>
      <button type="submit">Add Transaction</button>
    </form>
    <section id="summary"></section>
    <section id="transactions"></section>
  `;

  document.getElementById("txnForm").onsubmit = (e) => {
    e.preventDefault();
    const tx = {
      type: document.getElementById("type").value,
      amount: parseFloat(document.getElementById("amount").value),
      note: document.getElementById("note").value,
      time: new Date().toISOString()
    };
    const txns = JSON.parse(localStorage.getItem("transactions") || "[]");
    txns.push(tx);
    localStorage.setItem("transactions", JSON.stringify(txns));
    showTakaManager();
  };

  const txns = JSON.parse(localStorage.getItem("transactions") || "[]");
  const inflow = txns.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const outflow = txns.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const net = inflow - outflow;

  document.getElementById("summary").innerHTML = `
    <h2>Summary</h2>
    <p>Net P&L: ${net} BDT</p>
    <p>Total Inflow: ${inflow} BDT</p>
    <p>Total Outflow: ${outflow} BDT</p>
  `;

  document.getElementById("transactions").innerHTML = `
    <h2>Transactions</h2>
    ${txns.map(t => `<p>${t.type}: ${t.amount} BDT — ${t.note}</p>`).join("")}
  `;
}

if (localStorage.getItem("consentAccepted") === "true") {
  showTakaManager();
} else {
  showConsent();
}

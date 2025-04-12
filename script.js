const btcElement = document.getElementById("btc");
const ethElement = document.getElementById("eth");

const ctx = document.getElementById("cryptoChart").getContext("2d");

const dummyMode = false; // ✅ Set to true to simulate prices

const btcPrices = [];
const ethPrices = [];
const timeLabels = [];

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [
      {
        label: "BTC (₹)",
        data: btcPrices,
        borderColor: "orange",
        fill: false,
        tension: 0.4,
      },
      {
        label: "ETH (₹)",
        data: ethPrices,
        borderColor: "#00ffff",
        fill: false,
        tension: 0.4,
      },
    ],
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (INR)",
        },
      },
    },
  },
});

async function fetchCryptoPrices() {
  if (dummyMode) {
    const btcDummy = 5000000 + Math.random() * 20000;
    const ethDummy = 350000 + Math.random() * 1000;
    updateChart(btcDummy, ethDummy);
    return;
  }

  const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr"
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const btcPrice = data.bitcoin.inr;
    const ethPrice = data.ethereum.inr;

    if (!btcPrice || !ethPrice) throw new Error("Price error");

    updateChart(btcPrice, ethPrice);
  } catch (error) {
    console.error("⚠️ Fetch Error:", error);
    btcElement.innerText = "BTC: Error fetching";
    ethElement.innerText = "ETH: Error fetching";
  }
}

function updateChart(btc, eth) {
  const time = new Date().toLocaleTimeString();

  btcPrices.push(btc);
  ethPrices.push(eth);
  timeLabels.push(time);

  if (btcPrices.length > 20) {
    btcPrices.shift();
    ethPrices.shift();
    timeLabels.shift();
  }

  btcElement.innerText = `BTC: ₹${btc.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  ethElement.innerText = `ETH: ₹${eth.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  chart.update();
}

// Auto fetch every 60s
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 60000);

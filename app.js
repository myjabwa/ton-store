const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "http://199.247.31.182/tonconnect-manifest.json"
});

let wallet = null;

tonConnectUI.onStatusChange(w => {
  wallet = w;
});

document.getElementById("connect").onclick = async () => {
  await tonConnectUI.connectWallet();
};

document.getElementById("buy").onclick = async () => {
  if (!wallet) {
    alert("اربط المحفظة الأول");
    return;
  }

  const payload = "order_" + Date.now();

  await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [{
      address: "UQD1J2QsKLlSonRV16hAU1UaksKr7OrHseN4igBP7bImCpO2",
      amount: "1000000000",
      payload: payload
    }]
  });

  fetch("http://199.247.31.182:5000/confirm", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      payload,
      wallet: wallet.account.address,
      amount: "1 TON"
    })
  });

  alert("تم إرسال الدفع ✅");
};
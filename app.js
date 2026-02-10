// Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// TON Connect UI
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://myjabwa.github.io/ton-store/tonconnect-manifest.json"
});

let wallet = null;

// متابعة حالة المحفظة
tonConnectUI.onStatusChange(w => {
  wallet = w;

  if (wallet) {
    document.getElementById("connect").innerText = "✅ المحفظة متصلة";
    document.getElementById("buy").disabled = false;
    console.log("Wallet connected:", wallet.account.address);
  } else {
    document.getElementById("connect").innerText = "🔗 ربط المحفظة";
    document.getElementById("buy").disabled = true;
    console.log("Wallet disconnected");
  }
});

// زر ربط المحفظة
document.getElementById("connect").onclick = async () => {
  try {
    await tonConnectUI.connectWallet();
  } catch (e) {
    alert("حصل خطأ أثناء ربط المحفظة");
    console.error(e);
  }
};

// زر الشراء
document.getElementById("buy").onclick = async () => {
  if (!wallet) {
    alert("اربط المحفظة الأول");
    return;
  }

  const payload = "order_" + Date.now();

  try {
    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          // 🔴 حط عنوان محفظتك هنا (الفلوس هتوصلك)
          address: "UQD1J2QsKLlSonRV16hAU1UaksKr7OrHseN4igBP7bImCpO2",

          // 1 TON = 1000000000 nanoTON
          amount: "1000000000",

          // تعليق العملية
          payload: payload
        }
      ]
    });

    alert("✅ تم إرسال طلب الدفع، راجع المحفظة");

  } catch (e) {
    alert("❌ تم إلغاء أو فشل الدفع");
    console.error(e);
  }
};
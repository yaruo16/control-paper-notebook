const PAPERS = [
  {
    id: "ziegler-1942",
    short: "Ziegler–Nichols PID 調參法則",
    title: "Optimum Settings for Automatic Controllers",
    authors: "J. G. Ziegler, N. B. Nichols",
    year: 1942,
    venue: "Transactions of the ASME, 64(8), 759–765",
    doi: "",
    tags: ["PID", "調參", "程序控制", "經典論文"],
    status: "精讀",
    summary: "提出量測比例、重設、預動三種控制作用的單位，以及只靠一次現場測試或程序反應曲線就能算出控制器設定的經驗公式。"
  },
  {
    id: "kalman-1960",
    short: "卡爾曼濾波",
    title: "A New Approach to Linear Filtering and Prediction Problems",
    authors: "R. E. Kalman",
    year: 1960,
    venue: "Journal of Basic Engineering, 82 (Series D), 35–45",
    doi: "",
    tags: ["狀態估測", "最佳化", "經典論文"],
    status: "略讀",
    summary: "改用狀態與狀態轉移的觀點重新處理 Wiener 濾波與預測問題，得到能遞迴計算的最佳線性濾波器，並證明它和調節器問題互為對偶。"
  },
  {
    id: "han-2009",
    short: "從 PID 到自抗擾控制",
    title: "From PID to Active Disturbance Rejection Control",
    authors: "J. Han",
    year: 2009,
    venue: "IEEE Transactions on Industrial Electronics, 56(3), 900–906",
    doi: "10.1109/TIE.2008.2011621",
    tags: ["PID", "擾動抑制", "觀測器"],
    status: "精讀",
    summary: "保留 PID 以誤差驅動、不依賴模型的優點，再用觀測器估測並抵消總擾動、搭配非線性回授，提出自抗擾控制（ADRC）作為 PID 的替代方案。"
  }
];

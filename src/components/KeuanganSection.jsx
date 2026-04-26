import { useState, useEffect } from "react";

export default function KeuanganSection({ isLoggedIn, openModal }) {
  const [baseLaba, setBaseLaba] = useState(0);
  const [valModal, setValModal] = useState(50);
  const [valGaji, setValGaji] = useState(30);
  const [valDarurat, setValDarurat] = useState(20);
  const [riwayat, setRiwayat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Baru untuk Fitur AI
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null); // Menyimpan hasil analisis

  const formatRp = (num) => "Rp " + Math.round(num).toLocaleString("id-ID");

  const total = Number(valModal) + Number(valGaji) + Number(valDarurat) || 1;
  const pModal = valModal / total;
  const pGaji = valGaji / total;
  const pDarurat = valDarurat / total;

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockTotalLaba = 6100000;
        setBaseLaba(mockTotalLaba);

        const mockRiwayat = [
          {
            periode_bulan: "2026-03-01",
            persen_modal: 50,
            persen_gaji: 30,
            persen_tabungan: 20,
            total_laba_saat_ini: 5500000,
          },
          {
            periode_bulan: "2026-02-01",
            persen_modal: 60,
            persen_gaji: 25,
            persen_tabungan: 15,
            total_laba_saat_ini: 4800000,
          },
          {
            periode_bulan: "2026-01-01",
            persen_modal: 60,
            persen_gaji: 30,
            persen_tabungan: 10,
            total_laba_saat_ini: 3200000,
          },
        ];

        setRiwayat(mockRiwayat);

        if (mockRiwayat.length > 0) {
          setValModal(mockRiwayat[0].persen_modal);
          setValGaji(mockRiwayat[0].persen_gaji);
          setValDarurat(mockRiwayat[0].persen_tabungan);
        }

        setIsLoading(false);
      }, 500);
    };

    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const handleSimpanAlokasi = () => {
    if (!isLoggedIn) return openModal("auth");

    const newAlokasi = {
      periode_bulan: new Date().toISOString().split("T")[0],
      persen_modal: Math.round(pModal * 100),
      persen_gaji: Math.round(pGaji * 100),
      persen_tabungan: Math.round(pDarurat * 100),
      total_laba_saat_ini: baseLaba,
    };

    setRiwayat([newAlokasi, ...riwayat]);
    // Tetap menggunakan alert untuk simpan agar user tahu data masuk riwayat
    alert("Alokasi Laba Berhasil Disimpan! 🚀");
  };

  // FUNGSI AI INTEGRATION (Updated: Tanpa Pop-up Default)
  // Ganti fungsi handleAICheck dengan yang ini
  const handleAICheck = async () => {
    if (!isLoggedIn) return openModal("auth");
    setIsAiLoading(true);
    setAiResult(null);

    try {
      // DYNAMIC PROMPTING: Memaksa AI memberikan sentimen berbeda
      let narasiKredit = "";
      if (pDarurat * 100 < 10) {
        narasiKredit = `Risiko Tinggi! Pemilik hanya menyisihkan ${Math.round(pDarurat * 100)}% untuk cadangan. Struktur keuangan ini sangat rapuh terhadap utang.`;
      } else if (pDarurat * 100 >= 20) {
        narasiKredit = `Sangat Aman. Dana cadangan mencapai ${Math.round(pDarurat * 100)}%. Bisnis memiliki manajemen risiko yang sangat disiplin dan sehat.`;
      } else {
        narasiKredit = `Kondisi moderat. Cadangan dana ${Math.round(pDarurat * 100)}%. Cukup baik untuk operasional harian namun butuh peningkatan untuk ekspansi.`;
      }

      const res = await fetch("/api/analyze-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          laba: baseLaba,
          customPrompt: narasiKredit, // Mengirim teks dinamis
          pModal: Math.round(pModal * 100),
          pGaji: Math.round(pGaji * 100),
          pDarurat: Math.round(pDarurat * 100),
        }),
      });
      const result = await res.json();
      setAiResult(result);
    } catch (error) {
      console.error("Gagal cek AI", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="animate-fade-in w-full max-w-7xl mx-auto pb-20 mt-10 px-4">
        <div className="bg-smart-card border border-smart-border p-8 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full"></div>
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="w-full lg:w-1/2 text-left z-10">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-8 border border-red-500/20">
                <span className="material-icons-round text-4xl">lock</span>
              </div>
              <h2 className="font-montserrat font-black text-3xl md:text-5xl text-smart-text mb-6">
                Kelola Laba Bersih{" "}
                <span className="text-smart-lime italic font-serif">
                  Lebih Terstruktur.
                </span>
              </h2>
              <p className="text-smart-text-muted mb-10 text-lg leading-relaxed max-w-lg">
                Bagi hasil jualan Anda ke pos{" "}
                <b>Modal, Gaji, dan Dana Darurat</b> secara otomatis.
              </p>
              <button
                onClick={() => openModal("auth")}
                className="bg-smart-text text-smart-bg font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all text-lg shadow-xl"
              >
                Mulai Alokasi Sekarang
              </button>
            </div>
            <div className="w-full lg:w-1/2 relative z-10">
              <div className="bg-smart-bg border-4 border-smart-border rounded-[2rem] shadow-2xl overflow-hidden transform lg:-rotate-2">
                <img
                  src="/Keuangan.png"
                  alt="Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto pb-20 flex flex-col gap-8 px-4">
      {/* HEADER */}
      <div className="bg-smart-card border border-smart-border p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 rounded-full bg-smart-lime/10 flex items-center justify-center border border-smart-lime/20 hidden sm:flex">
            <span className="material-icons-round text-smart-lime text-3xl">
              account_balance_wallet
            </span>
          </div>
          <div>
            <h2 className="font-montserrat font-bold text-2xl text-smart-text mb-1">
              Manajer Alokasi Laba
            </h2>
            <p className="text-smart-text-muted text-sm">
              Data ini sinkron dengan Total Laba Bersih di Dashboard Anda.
            </p>
          </div>
        </div>
        <div className="text-left md:text-right w-full md:w-auto bg-smart-bg p-5 rounded-2xl border border-smart-border shadow-inner">
          <p className="text-smart-text-muted text-xs font-bold uppercase tracking-wider mb-1">
            Total Laba Bersih
          </p>
          <h1 className="font-montserrat font-extrabold text-3xl md:text-4xl text-smart-lime">
            {isLoading ? "Loading..." : formatRp(baseLaba)}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: SLIDERS */}
        <div className="bg-smart-card border border-smart-border p-6 md:p-8 rounded-[2rem] shadow-xl">
          <h3 className="font-montserrat font-bold text-xl mb-8 flex items-center gap-3 text-smart-text">
            <span className="material-icons-round text-smart-text-muted">
              tune
            </span>{" "}
            Atur Persentase Alokasi
          </h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-end mb-3">
                <h4 className="font-bold text-base text-smart-text">
                  Pos Modal
                </h4>
                <span className="font-bold text-smart-lime text-xl">
                  {(pModal * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={valModal}
                onChange={(e) => setValModal(e.target.value)}
                className="w-full accent-smart-lime"
              />
              <p className="text-right text-sm text-smart-text-muted mt-2">
                {formatRp(baseLaba * pModal)}
              </p>
            </div>
            <div>
              <div className="flex justify-between items-end mb-3">
                <h4 className="font-bold text-base text-smart-text">
                  Pos Gaji Pemilik
                </h4>
                <span className="font-bold text-blue-500 text-xl">
                  {(pGaji * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={valGaji}
                onChange={(e) => setValGaji(e.target.value)}
                className="w-full accent-blue-500"
              />
              <p className="text-right text-sm text-smart-text-muted mt-2">
                {formatRp(baseLaba * pGaji)}
              </p>
            </div>
            <div>
              <div className="flex justify-between items-end mb-3">
                <h4 className="font-bold text-base text-smart-text">
                  Pos Dana Darurat
                </h4>
                <span className="font-bold text-purple-500 text-xl">
                  {(pDarurat * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={valDarurat}
                onChange={(e) => setValDarurat(e.target.value)}
                className="w-full accent-purple-500"
              />
              <p className="text-right text-sm text-smart-text-muted mt-2">
                {formatRp(baseLaba * pDarurat)}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: VISUALIZATION & AI RESULT */}
        <div className="flex flex-col gap-6">
          <div className="bg-smart-card border border-smart-border p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col transition-all duration-500">
            <h3 className="font-montserrat font-bold text-xl mb-8 flex items-center gap-3 text-smart-text">
              <span className="material-icons-round text-smart-text-muted">
                donut_large
              </span>{" "}
              Visualisasi Alokasi
            </h3>
            <div className="w-full h-12 rounded-full overflow-hidden flex bg-smart-bg mb-10 border border-smart-border relative">
              <div
                className="bg-smart-lime h-full transition-all"
                style={{ width: `${pModal * 100}%` }}
              ></div>
              <div
                className="bg-blue-500 h-full transition-all"
                style={{ width: `${pGaji * 100}%` }}
              ></div>
              <div
                className="bg-purple-500 h-full transition-all"
                style={{ width: `${pDarurat * 100}%` }}
              ></div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-smart-bg rounded-2xl border border-smart-border">
                <span className="text-sm font-bold text-smart-text">
                  Pos Modal
                </span>
                <span className="text-base font-bold text-smart-text">
                  {formatRp(baseLaba * pModal)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-smart-bg rounded-2xl border border-smart-border">
                <span className="text-sm font-bold text-smart-text">
                  Pos Gaji
                </span>
                <span className="text-base font-bold text-smart-text">
                  {formatRp(baseLaba * pGaji)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-smart-bg rounded-2xl border border-smart-border">
                <span className="text-sm font-bold text-smart-text">
                  Pos Darurat
                </span>
                <span className="text-base font-bold text-smart-text">
                  {formatRp(baseLaba * pDarurat)}
                </span>
              </div>
            </div>

            {/* AI RESULT SECTION */}
            {aiResult && (
              <div className="mb-8 animate-slide-up">
                <div className="bg-smart-bg border-2 border-smart-lime/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-3">
                    <span className="text-[10px] bg-smart-lime/20 text-smart-lime px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-smart-lime/30">
                      Azure AI Credit Analyst
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-smart-lime text-smart-dark rounded-full flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(212,245,66,0.5)]">
                        {aiResult.score}
                      </div>
                      <svg className="absolute top-0 left-0 w-20 h-20 -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="38"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          className="text-smart-border"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="38"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray="238.76"
                          strokeDashoffset={
                            238.76 - (238.76 * aiResult.score) / 100
                          }
                          className="text-smart-lime transition-all duration-1000"
                        />
                      </svg>
                    </div>

                    <div className="text-center md:text-left">
                      <h4 className="text-smart-text font-black text-xl mb-1">
                        Status:{" "}
                        <span
                          className={
                            aiResult.score >= 70
                              ? "text-smart-lime"
                              : "text-red-500"
                          }
                        >
                          {aiResult.status}
                        </span>
                      </h4>
                      <p className="text-smart-text-muted text-sm italic">
                        "{aiResult.message}"
                      </p>
                    </div>
                  </div>

                  {/* ACTION PLAN - Ini fitur barunya */}
                  <div className="bg-smart-card/50 border border-smart-border rounded-2xl p-4 flex gap-4 items-start">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-round text-blue-500 text-xl">
                        tips_and_updates
                      </span>
                    </div>
                    <div>
                      <p className="text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Rencana Aksi AI
                      </p>
                      <p className="text-smart-text text-sm font-medium leading-relaxed">
                        {aiResult.actionPlan}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSimpanAlokasi}
                className="flex-1 bg-smart-text text-smart-bg font-black py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg flex justify-center items-center gap-2"
              >
                <span className="material-icons-round">save</span> Simpan
                Alokasi
              </button>
              <button
                onClick={handleAICheck}
                disabled={isAiLoading}
                className={`flex-1 ${isAiLoading ? "bg-smart-border" : "bg-gradient-to-r from-blue-600 to-indigo-600"} text-white font-black py-4 rounded-xl hover:scale-[1.02] transition-all shadow-[0_10px_20px_rgba(79,70,229,0.3)] flex justify-center items-center gap-2 disabled:opacity-50`}
              >
                <span className="material-icons-round animate-pulse">
                  auto_awesome
                </span>
                {isAiLoading ? "Menganalisis..." : "Cek Kelayakan AI"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="bg-smart-card border border-smart-border p-6 md:p-8 rounded-[2rem] shadow-xl overflow-hidden">
        <h3 className="font-montserrat font-bold text-xl flex items-center gap-3 text-smart-text mb-6">
          <span className="material-icons-round text-smart-text-muted">
            history
          </span>{" "}
          Riwayat Alokasi Bulanan
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[750px]">
            <thead>
              <tr className="text-smart-text-muted border-b border-smart-border/80 uppercase text-xs">
                <th className="pb-4 font-semibold">Bulan</th>
                <th className="pb-4 font-semibold">Total Laba Dashboard</th>
                <th className="pb-4 font-semibold">Modal (%)</th>
                <th className="pb-4 font-semibold">Gaji (%)</th>
                <th className="pb-4 font-semibold">Tabungan (%)</th>
                <th className="pb-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-smart-border/50">
              {riwayat.map((row, index) => (
                <tr
                  key={index}
                  className="group hover:bg-smart-border/30 transition-colors"
                >
                  <td className="py-4 text-smart-text font-semibold">
                    {new Date(row.periode_bulan).toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 font-bold text-smart-lime">
                    {formatRp(row.total_laba_saat_ini || 0)}
                  </td>
                  <td className="py-4 text-smart-text-muted font-medium">
                    {row.persen_modal}%
                  </td>
                  <td className="py-4 text-smart-text-muted font-medium">
                    {row.persen_gaji}%
                  </td>
                  <td className="py-4 text-smart-text-muted font-medium">
                    {row.persen_tabungan}%
                  </td>
                  <td className="py-4">
                    <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold">
                      Tersimpan
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

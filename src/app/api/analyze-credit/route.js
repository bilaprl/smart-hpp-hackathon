import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { laba, pModal, pGaji, pDarurat, customPrompt } = body;

    const endpoint = process.env.AZURE_LANGUAGE_ENDPOINT;
    const apiKey = process.env.AZURE_LANGUAGE_KEY;

    const response = await fetch(
      `${endpoint}/language/:analyze-text?api-version=2023-04-01`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "SentimentAnalysis",
          analysisInput: {
            documents: [{ id: "1", language: "id", text: customPrompt }],
          },
        }),
      }
    );

    const data = await response.json();
    const sentiment = data.results.documents[0].sentiment;
    const scores = data.results.documents[0].confidenceScores;

    // --- LOGIKA PERHITUNGAN SKOR (Didefinisikan dulu sebelum dipakai) ---
    let calculatedScore = 0;
    if (sentiment === "positive") {
      calculatedScore = 80 + scores.positive * 10 + pDarurat / 4;
    } else if (sentiment === "negative") {
      calculatedScore = 10 + scores.negative * 20 + pDarurat / 2;
    } else {
      calculatedScore = 55 + scores.neutral * 20;
    }

    let finalScore = Math.min(Math.floor(calculatedScore), 100);
    let status = "";
    let message = "";
    let actionPlan = ""; 

    // --- LOGIKA STATUS & ACTION PLAN ---
    if (finalScore >= 85) {
      status = "Sangat Layak";
      message = "Analisis Azure menunjukkan struktur modal yang sangat sehat dan siap untuk ekspansi.";
      actionPlan = "Pertahankan rasio ini selama 3 bulan berturut-turut untuk meningkatkan peluang plafon pinjaman lebih besar.";
    } else if (finalScore >= 65) {
      status = "Layak";
      message = "Kondisi stabil, namun ada ruang untuk penguatan modal.";
      actionPlan = pDarurat < 15
        ? `Tingkatkan dana darurat ke 15% (naikkan ${15 - pDarurat}%) untuk mencapai skor 'Sangat Layak'.`
        : "Kurangi sedikit pos biaya operasional untuk mempertebal margin laba bersih.";
    } else {
      status = "Evaluasi Ketat";
      message = "AI mendeteksi kerentanan arus kas yang berisiko bagi pemberi pinjaman.";
      actionPlan = "Prioritas Utama: Segera potong pos Gaji Owner/Biaya Pribadi dan alokasikan minimal 10% ke Dana Darurat.";
    }

    // Pastikan actionPlan juga di-return di sini
    return NextResponse.json({ score: finalScore, status, message, actionPlan });

  } catch (error) {
    // Fallback jika API Azure error atau variabel tidak terbaca
    return NextResponse.json({
      score: 50,
      status: "Perlu Review Manual",
      message: "Sistem sedang sibuk. Pastikan alokasi dana darurat Anda tetap terjaga.",
      actionPlan: "Periksa kembali koneksi internet dan coba analisis ulang."
    });
  }
}
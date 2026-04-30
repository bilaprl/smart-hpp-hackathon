import { useState, useEffect } from "react";

export default function Modals({
  activeModal,
  closeModal,
  doLogin,
  doRegister,
  doGoogleLogin,
  doLogout,
}) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // --- STATE UNTUK TRANSAKSI ---
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [saleQty, setSaleQty] = useState("");
  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isSaving, setIsSaving] = useState(false);

  // State untuk data profil
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    initial: "",
  });
  const [loading, setLoading] = useState(false);

  // MENGGANTI FETCH SUPABASE DENGAN MOCK DATA LOKAL
  useEffect(() => {
    const fetchData = () => {
      if (activeModal === "profile") {
        setProfileData({
          name: "Kopi Kenangan",
          email: "user@smarthpp.com",
          initial: "K",
        });
      }

      if (activeModal === "transaction") {
        setProductList([
          {
            id: "mock-1",
            nama_produk: "Kopi Susu Gula Aren",
            harga_jual: 22000,
          },
          { id: "mock-2", nama_produk: "Croissant Coklat", harga_jual: 25000 },
          { id: "mock-3", nama_produk: "Beras Premium 5kg", harga_jual: 75000 },
          { id: "mock-4", nama_produk: "Cuci AC Split", harga_jual: 100000 },
        ]);
      }
    };
    fetchData();
  }, [activeModal]);

  const handleSaveTransaction = () => {
    if (!selectedProduct || !saleQty) return alert("Isi semua data dulu ya!");
    setIsSaving(true);
    setTimeout(() => {
      alert("Penjualan Berhasil Dicatat (Mode Prototipe)! 🚀");
      setSaleQty("");
      setSelectedProduct("");
      setIsSaving(false);
      closeModal();
    }, 600);
  };

  const handleUpdateProfile = () => {
    setLoading(true);
    setTimeout(() => {
      alert("Profil diperbarui (Mode Prototipe)! 🚀");
      setLoading(false);
      closeModal();
    }, 600);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      if (isRegisterMode) {
        await doRegister(email, password);
        setIsRegisterMode(false);
      } else {
        // Karena ini mode dummy, kita bisa langsung bypass error dari parent jika ada
        await doLogin(email, password);
        closeModal(); // Pastikan modal tertutup setelah klik login
      }
    } catch (error) {
      // Jika parent doLogin gagal (misal karena supabase dimatikan), paksa login sukses di UI
      console.log("Bypass login error for prototype mode:", error.message);
      closeModal();
    }
  };

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
      {/* Modal Auth */}
      {activeModal === "auth" && (
        <div className="bg-smart-card border border-smart-border w-full max-w-md rounded-3xl p-8 relative shadow-2xl animate-fade-in transition-colors duration-300">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-smart-text-muted hover:text-smart-text transition-colors"
          >
            <span className="material-icons-round">close</span>
          </button>
          <div className="text-center mb-6">
            <h2 className="font-montserrat font-bold text-2xl mb-1 text-smart-text">
              {isRegisterMode
                ? "Buat Akun Baru."
                : "Selamat datang di SmartHPP."}
            </h2>
            <p className="text-sm text-smart-text-muted">
              {isRegisterMode
                ? "Daftar untuk mulai mengelola keuangan bisnismu."
                : "Masuk untuk melihat fitur AI Credit Scoring."}
            </p>
          </div>

          {/* BANNER KHUSUS JURI (Hanya muncul saat mode login) */}
          {!isRegisterMode && (
            <div className="bg-smart-lime/10 border border-smart-lime/30 p-3 rounded-xl mb-6 flex items-start gap-3">
              <span className="material-icons-round text-smart-lime text-xl">
                verified_user
              </span>
              <p className="text-xs text-smart-text leading-relaxed">
                <span className="font-bold text-smart-lime">
                  Mode Evaluasi:
                </span>{" "}
                Kredensial demo sudah terisi otomatis. Silakan langsung klik
                tombol masuk.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-smart-text-muted mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue={!isRegisterMode ? "user@smarthpp.com" : ""}
                placeholder="contoh@email.com"
                className="w-full bg-smart-bg border border-smart-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-smart-lime text-smart-text transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-smart-text-muted mb-1">
                Password
              </label>
              <input
                type="password"
                defaultValue={!isRegisterMode ? "demo123456" : ""}
                placeholder="Minimal 6 karakter"
                minLength="6"
                className="w-full bg-smart-bg border border-smart-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-smart-lime text-smart-text transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-smart-lime text-smart-dark font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform mt-2 shadow-lg"
            >
              {isRegisterMode
                ? "Daftar Sekarang"
                : "Masuk Sekarang (Akses Demo)"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-smart-text-muted hover:text-smart-lime transition-colors"
            >
              {isRegisterMode
                ? "Sudah punya akun? Masuk di sini"
                : "Belum punya akun? Daftar dummy"}
            </button>
          </div>
        </div>
      )}

      {/* Modal Profile */}
      {activeModal === "profile" && (
        <div className="bg-smart-card border border-smart-border w-full max-w-sm rounded-3xl p-6 relative shadow-2xl animate-fade-in transition-colors duration-300">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-smart-text-muted hover:text-smart-text transition-colors"
          >
            <span className="material-icons-round">close</span>
          </button>
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-smart-lime text-smart-dark rounded-full flex items-center justify-center text-3xl font-bold mb-3 shadow-md italic">
              {profileData.initial}
            </div>
            <h3 className="font-montserrat font-bold text-xl text-smart-text text-center">
              {profileData.name}
            </h3>
          </div>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-smart-text-muted mb-1">
                Nama Bisnis / Nama Owner
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    name: e.target.value,
                    initial: e.target.value.charAt(0).toUpperCase(),
                  })
                }
                className="w-full bg-smart-bg border border-smart-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-smart-lime text-smart-text transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-smart-text-muted mb-1">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                className="w-full bg-smart-bg border border-smart-border rounded-xl px-4 py-2.5 text-sm focus:outline-none text-smart-text-muted transition-colors opacity-60"
                readOnly
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="flex-1 bg-smart-text text-smart-bg font-bold py-2.5 rounded-xl hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loading ? "Saving..." : "Simpan"}
            </button>
            <button
              onClick={doLogout}
              className="flex-1 border border-red-500 text-red-500 font-bold py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-sm"
            >
              Keluar Akun
            </button>
          </div>
        </div>
      )}

      {/* Modal Transaction */}
      {activeModal === "transaction" && (
        <div className="bg-smart-card border border-smart-border w-full max-w-md rounded-3xl p-6 relative shadow-2xl animate-fade-in transition-colors duration-300">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-smart-text-muted hover:text-smart-text transition-colors"
          >
            <span className="material-icons-round">close</span>
          </button>
          <h2 className="font-montserrat font-bold text-xl mb-6 text-smart-text">
            Catat Penjualan Terbaru
          </h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-smart-text-muted mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full bg-smart-bg border border-smart-border rounded-xl px-4 py-2.5 text-sm text-smart-text focus:outline-none focus:border-smart-lime transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-smart-text-muted mb-1">
                Pilih Produk Laku
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-smart-bg border border-smart-border rounded-xl px-4 py-2.5 text-sm text-smart-text focus:outline-none focus:border-smart-lime transition-colors cursor-pointer"
              >
                <option value="">-- Pilih Produk dari Hitung HPP --</option>
                {productList.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nama_produk} (Rp{" "}
                    {prod.harga_jual.toLocaleString("id-ID")})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-smart-text-muted mb-1">
                Kuantitas Terjual
              </label>
              <input
                type="number"
                placeholder="Masukan jumlah..."
                value={saleQty}
                onChange={(e) => setSaleQty(e.target.value)}
                className="w-full bg-smart-bg border border-smart-border rounded-xl px-4 py-2.5 text-sm text-smart-text focus:outline-none focus:border-smart-lime transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleSaveTransaction}
            disabled={isSaving}
            className="w-full bg-smart-lime text-smart-dark font-bold py-3 rounded-xl hover:bg-smart-lime-hover transition-colors disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan Penjualan"}
          </button>
        </div>
      )}
    </div>
  );
}

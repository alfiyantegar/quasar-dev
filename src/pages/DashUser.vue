<template>
  <q-page>
    <!-- Dropdown filter jenis barang -->
    <q-select
      v-model="filterJenis"
      :options="jenisBarangOptions"
      label="Filter Jenis Barang"
      outlined
      class="q-mb-md"
      emit-value
    />

    <!-- Tampilan barang dalam bentuk kartu -->
    <div class="q-gutter-md row">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <q-card>
          <q-img
            :src="item.photo"
            alt="Foto Barang"
            ratio="16/9"
            :fallback-src="'path/to/default-image.jpg'"
          />
          <q-card-section>
            <div class="text-h6">{{ item.name }}</div>
            <div class="text-subtitle1">{{ item.merk }}</div>
            <div>Nama Barang: {{ item.name }}</div>
            <div>Merk: {{ item.merk }}</div>
            <div>Kode Barang: {{ item.code }}</div>
            <div>Deskripsi: {{ item.description }}</div>
            <div>Jenis Barang: {{ item.jenisbarang }}</div>
            <div>Status: {{ item.status }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Pinjam"
              color="primary"
              @click="handleBorrowClick(item)"
              :disabled="isBorrowDisabled(item)"
            />
            <q-btn
              flat
              label="Kembalikan"
              color="secondary"
              @click="handleReturnClick(item)"
              :disabled="isReturnDisabled(item)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Modal Pinjam Barang -->
    <q-dialog v-model="isModalOpen">
      <q-card>
        <q-card-section>
          <q-input
            v-model="tanggalPinjam"
            type="date"
            label="Tanggal Pinjam"
            :rules="[(val) => !!val || 'Tanggal pinjam harus diisi']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Batal" @click="isModalOpen = false" />
          <q-btn flat label="Pinjam" color="primary" @click="borrowItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Kembalikan Barang -->
    <q-dialog v-model="isReturnModalOpen">
      <q-card>
        <q-card-section>
          <q-input
            v-model="tanggalKembali"
            type="date"
            label="Tanggal Kembali"
            :rules="[(val) => !!val || 'Tanggal kembali harus diisi']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Batal" @click="isReturnModalOpen = false" />
          <q-btn flat label="Kembalikan" color="primary" @click="returnItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isModalOpen: false,
      isReturnModalOpen: false,
      items: [],
      selectedItemId: null,
      selectedItem: null,
      returnItemId: null,
      returnItemData: null,
      availableItems: [],
      availableReturnItems: [],
      tanggalPinjam: null,
      tanggalKembali: null,
      filterJenis: "Semua", // Inisialisasi dengan string
      validUserId: null, // Simpan ID pengguna yang valid
      jenisBarangOptions: [
        { label: "Semua", value: "Semua" },
        { label: "Printer", value: "Printer" },
        { label: "Scanner", value: "Scanner" },
        { label: "PC Unit", value: "PC Unit" },
        { label: "Handphone", value: "Handphone" },
        { label: "Kendaraan", value: "Kendaraan" },
      ],
    };
  },
  computed: {
    filteredItems() {
      if (this.filterJenis === "Semua") {
        return this.items; // Tampilkan semua barang
      } else {
        return this.items.filter(
          (item) => item.jenisbarang === this.filterJenis
        );
      }
    },
  },
  methods: {
    async fetchUserId() {
      try {
        const response = await axios.get("http://localhost:8000/api/login");
        if (response.data && response.data.length > 0) {
          this.validUserId = response.data[0].iduser; // Ambil ID pengguna
        } else {
          alert("ID pengguna tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        alert("Terjadi kesalahan saat mengambil ID pengguna.");
      }
    },
    async fetchItems() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/daftarbarang"
        );
        this.items = response.data;

        this.availableItems = this.items
          .filter((item) => item.status === "Tersedia")
          .map((item) => ({
            label: item.name,
            value: item.id,
          }));

        this.availableReturnItems = this.items
          .filter((item) => item.status === "Dipinjam")
          .map((item) => ({
            label: item.name,
            value: item.id,
          }));
      } catch (error) {
        console.error("Error fetching items:", error);
        alert(
          "Terjadi kesalahan saat mengambil data barang. Silakan coba lagi."
        );
      }
    },
    handleBorrowClick(item) {
      if (item.status === "Diproses") {
        alert("Barang masih dalam proses peminjaman atau pengembalian");
      } else if (item.status === "Dipinjam") {
        alert("Barang sedang Dipinjam");
      } else {
        this.showBorrowModal(item.id);
      }
    },
    handleReturnClick(item) {
      if (item.status === "Diproses") {
        alert("Barang masih dalam proses peminjaman atau pengembalian");
      } else if (item.status === "Tersedia") {
        alert("Barang sedang Tersedia");
      } else {
        this.showReturnModal(item.id);
      }
    },
    isBorrowDisabled(item) {
      return item.status === "Diproses" || item.status === "Dipinjam";
    },
    isReturnDisabled(item) {
      return item.status === "Diproses" || item.status === "Tersedia";
    },
    showBorrowModal(itemId) {
      this.isModalOpen = true;
      this.selectedItemId = itemId; // Simpan ID item yang dipilih
      this.tanggalPinjam = null; // Reset tanggal pinjam
    },
    async borrowItem() {
      if (this.selectedItemId && this.tanggalPinjam) {
        try {
          const keterangan = `Dipinjam pada ${this.tanggalPinjam}`;

          await axios.post("http://localhost:8000/api/riwayatpeminjaman", {
            id: this.selectedItemId,
            iduser: this.validUserId, // Gunakan ID pengguna yang valid
            tanggal_pinjam: this.tanggalPinjam,
            tanggal_kembali: null,
            keterangan: keterangan,
            status: "Diproses",
          });

          await axios.put(
            `http://localhost:8000/api/daftarbarang/pinjam/${this.selectedItemId}`
          );

          alert("Barang berhasil dipinjam!");
          this.isModalOpen = false;
          this.fetchItems();
        } catch (error) {
          console.error("Error borrowing item:", error);
          alert("Terjadi kesalahan saat meminjam barang. Silakan coba lagi.");
        }
      } else {
        alert("Silakan pilih barang dan masukkan tanggal pinjam.");
      }
    },
    showReturnModal(itemId) {
      this.isReturnModalOpen = true;
      this.returnItemId = itemId; // Simpan ID item yang dipilih
      this.tanggalKembali = null; // Reset tanggal kembali
    },
    async returnItem() {
      if (this.returnItemId && this.tanggalKembali) {
        try {
          const keterangan = `Dikembalikan pada ${this.tanggalKembali}`;

          await axios.post("http://localhost:8000/api/riwayatpeminjaman", {
            id: this.returnItemId,
            iduser: this.validUserId, // Gunakan ID pengguna yang valid
            tanggal_pinjam: this.returnItemData.tanggal_pinjam,
            tanggal_kembali: this.tanggalKembali,
            keterangan: keterangan,
            status: "Disetujui",
          });

          await axios.put(
            `http://localhost:8000/api/daftarbarang/kembalikan/${this.returnItemId}`
          );

          alert("Barang berhasil dikembalikan!");
          this.isReturnModalOpen = false;
          this.fetchItems();
        } catch (error) {
          console.error("Error returning item:", error);
          alert(
            "Terjadi kesalahan saat mengembalikan barang. Silakan coba lagi."
          );
        }
      } else {
        alert("Silakan pilih barang dan masukkan tanggal kembali.");
      }
    },
  },
  mounted() {
    this.fetchUserId(); // Ambil ID pengguna saat komponen dimuat
    this.fetchItems(); // Ambil daftar barang saat komponen dimuat
  },
};
</script>

<style scoped>
/* Tambahkan gaya CSS sesuai kebutuhan */
</style>

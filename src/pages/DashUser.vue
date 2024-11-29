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
        :key="item.idbarang"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <q-card>
          <q-img
            :src="item.photo ? item.photo : defaultImagePath(item.jenisbarang)"
            alt="Foto Barang"
            ratio="16/9"
          />
          <q-card-section>
            <div class="text-h6">{{ item.name }}</div>
            <div class="text-subtitle1">{{ item.merk }}</div>
            <div>Jenis: {{ item.jenisbarang }}</div>
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
      returnItemId: null,
      tanggalPinjam: null,
      tanggalKembali: null,
      filterJenis: "Semua",
      validUserId: null,
      jenisBarangOptions: [
        { label: "Semua", value: "Semua" },
        { label: "Printer", value: "Printer" },
        { label: "Scanner", value: "Scanner" },
        { label: "PC Unit", value: "PC Unit" },
        { label: "Handphone", value: "Handphone" },
      ],
    };
  },
  computed: {
    filteredItems() {
      if (this.filterJenis === "Semua") {
        return this.items;
      }
      return this.items.filter((item) => item.jenisbarang === this.filterJenis);
    },
  },
  methods: {
    defaultImagePath(jenisbarang) {
      switch (jenisbarang) {
        case "Printer":
          return "path/to/default-printer.jpg";
        case "Scanner":
          return "path/to/default-scanner.jpg";
        case "PC Unit":
          return "path/to/default-pc.jpg";
        case "Handphone":
          return "path/to/default-handphone.jpg";
        default:
          return "path/to/default-image.jpg";
      }
    },
    async fetchUserId() {
      try {
        const response = await axios.get("http://localhost:8000/api/login");
        if (response.data && response.data.length > 0) {
          this.validUserId = response.data[0].iduser;
        } else {
          alert("ID pengguna tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    },
    async fetchItems() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/daftarbarang"
        );
        this.items = response.data;
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    handleBorrowClick(item) {
      this.selectedItemId = item.idbarang;
      this.isModalOpen = true;
    },
    handleReturnClick(item) {
      this.returnItemId = item.idbarang;
      this.isReturnModalOpen = true;
    },
    isBorrowDisabled(item) {
      return item.status !== "Tersedia";
    },
    isReturnDisabled(item) {
      return item.status !== "Dipinjam";
    },
    async borrowItem() {
      try {
        const keterangan = `Dipinjam pada ${this.tanggalPinjam}`;
        await axios.post("http://localhost:8000/api/riwayatpeminjaman", {
          idbarang: this.selectedItemId,
          iduser: this.validUserId,
          tanggal_pinjam: this.tanggalPinjam,
          status: "Diproses",
          keterangan,
        });
        await axios.put(
          `http://localhost:8000/api/daftarbarang/pinjam/${this.selectedItemId}`
        );
        this.isModalOpen = false;
        this.fetchItems();
        alert("Barang berhasil dipinjam.");
      } catch (error) {
        console.error("Error borrowing item:", error);
      }
    },
    async returnItem() {
      try {
        const keterangan = `Dikembalikan pada ${this.tanggalKembali}`;
        await axios.post("http://localhost:8000/api/riwayatpeminjaman", {
          idbarang: this.returnItemId,
          iduser: this.validUserId,
          tanggal_kembali: this.tanggalKembali,
          status: "Disetujui",
          keterangan,
        });
        await axios.put(
          `http://localhost:8000/api/daftarbarang/kembalikan/${this.returnItemId}`
        );
        this.isReturnModalOpen = false;
        this.fetchItems();
        alert("Barang berhasil dikembalikan.");
      } catch (error) {
        console.error("Error returning item:", error);
      }
    },
  },
  mounted() {
    this.fetchUserId();
    this.fetchItems();
  },
};
</script>

<style scoped>
/* Sesuaikan gaya sesuai kebutuhan */
</style>

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
            :fallback-src="defaultPhotoPath"
          />
          <q-card-section>
            <div class="text-h6">{{ item.name }}</div>
            <div class="text-subtitle1">{{ item.merk }}</div>
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
        { label: "Kendaraan", value: "Kendaraan" },
      ],
      defaultPhotoPath: "/src/assets/default-image.jpg",
    };
  },
  computed: {
    filteredItems() {
      return this.filterJenis === "Semua"
        ? this.items
        : this.items.filter((item) => item.jenisbarang === this.filterJenis);
    },
  },
  methods: {
    async fetchUserId() {
      try {
        const response = await axios.get("http://localhost:8000/api/login");
        this.validUserId = response.data?.[0]?.iduser || null;
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
      if (item.status === "Dipinjam" || item.status === "Diproses") {
        alert("Barang tidak tersedia untuk dipinjam.");
      } else {
        this.showBorrowModal(item.id);
      }
    },
    handleReturnClick(item) {
      if (item.status === "Tersedia") {
        alert("Barang sudah tersedia.");
      } else {
        this.showReturnModal(item.id);
      }
    },
    isBorrowDisabled(item) {
      return item.status !== "Tersedia";
    },
    isReturnDisabled(item) {
      return item.status === "Tersedia";
    },
    showBorrowModal(itemId) {
      this.isModalOpen = true;
      this.selectedItemId = itemId;
    },
    async borrowItem() {
      if (this.tanggalPinjam) {
        try {
          await axios.post("http://localhost:8000/api/riwayatpeminjaman", {
            id: this.selectedItemId,
            iduser: this.validUserId,
            tanggal_pinjam: this.tanggalPinjam,
            status: "Diproses",
          });
          await axios.put(
            `http://localhost:8000/api/daftarbarang/pinjam/${this.selectedItemId}`
          );
          this.isModalOpen = false;
          this.fetchItems();
        } catch (error) {
          console.error("Error borrowing item:", error);
        }
      } else {
        alert("Tanggal pinjam harus diisi.");
      }
    },
    showReturnModal(itemId) {
      this.isReturnModalOpen = true;
      this.returnItemId = itemId;
    },
    async returnItem() {
      if (this.tanggalKembali) {
        try {
          await axios.put(
            `http://localhost:8000/api/daftarbarang/kembalikan/${this.returnItemId}`
          );
          this.isReturnModalOpen = false;
          this.fetchItems();
        } catch (error) {
          console.error("Error returning item:", error);
        }
      } else {
        alert("Tanggal kembali harus diisi.");
      }
    },
  },
  mounted() {
    this.fetchUserId();
    this.fetchItems();
  },
};
</script>

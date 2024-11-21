<template>
  <q-page>
    <q-table
      :rows="items"
      :columns="columns"
      row-key="id"
      @row-click="editItem"
    >
      <template v-slot:top-right>
        <q-btn
          @click="showAddModal"
          label="Tambah Barang Baru"
          color="primary"
        />
      </template>

      <!-- Kolom Aksi untuk Edit dan Hapus -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            label="Edit"
            color="primary"
            @click="editItem(props.row)"
          />
          <q-btn
            flat
            label="Hapus"
            color="negative"
            @click="confirmDelete(props.row.id)"
          />
        </q-td>
      </template>

      <!-- Menampilkan Foto Barang di Tabel -->
      <template v-slot:body-cell-photo="props">
        <q-td :props="props">
          <div class="q-gutter-sm flex items-center">
            <img
              v-if="props.row.photo"
              :src="props.row.photo"
              alt="Foto Barang"
              width="50"
              height="50"
            />
            <span v-else>No Image</span>
          </div>
        </q-td>
      </template>
    </q-table>

    <!-- Modal Add/Edit Item -->
    <q-dialog v-model="isModalOpen">
      <q-card>
        <q-card-section>
          <q-input
            v-model="itemForm.name"
            label="Nama Barang"
            :disabled="itemForm.id !== null"
            :rules="['required']"
          />
          <q-input v-model="itemForm.merk" label="Merk Barang" />
          <q-input v-model="itemForm.code" label="Kode Barang" />
          <q-input v-model="itemForm.description" label="Deskripsi Barang" />

          <!-- Dropdown untuk Jenis Barang -->
          <q-select
            v-model="itemForm.jenisbarang"
            :options="jenisBarangOptions"
            label="Jenis Barang"
            emit-value
            map-options
          />

          <!-- Label Foto Barang dan input untuk upload gambar -->
          <q-input
            label="Foto Barang"
            type="file"
            @change="handleFileChange"
            accept="image/*"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Batal" @click="isModalOpen = false" />
          <q-btn flat label="Simpan" color="primary" @click="saveItem" />
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
      items: [],
      itemForm: {
        id: null,
        name: "",
        merk: "",
        code: "",
        description: "",
        jenisbarang: null,
        photo: null,
      },
      columns: [
        { name: "name", label: "Nama Barang", field: "name", align: "left" },
        { name: "photo", label: "Foto Barang", field: "photo", align: "left" },
        { name: "merk", label: "Merk Barang", field: "merk", align: "left" },
        { name: "code", label: "Kode Barang", field: "code", align: "left" },
        {
          name: "jenisbarang",
          label: "Jenis Barang",
          field: "jenisbarang",
          align: "left",
        },
        {
          name: "description",
          label: "Deskripsi Barang",
          field: "description",
          align: "left",
        },
        { name: "actions", label: "Aksi", align: "center", field: "actions" },
      ],
      jenisBarangOptions: [
        { label: "Printer", value: "Printer" },
        { label: "Scanner", value: "Scanner" },
        { label: "PC Unit", value: "PC Unit" },
        { label: "Handphone", value: "Handphone" },
        { label: "Kendaraan", value: "Kendaraan" },
      ],
    };
  },
  methods: {
    showAddModal() {
      this.isModalOpen = true;
      this.resetItemForm();
    },
    resetItemForm() {
      this.itemForm = {
        id: null,
        name: "",
        merk: "",
        code: "",
        description: "",
        jenisbarang: null,
        photo: null,
      };
    },
    async saveItem() {
      if (!this.itemForm.name) {
        alert("Nama barang harus diisi!");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", this.itemForm.name);
        formData.append("merk", this.itemForm.merk);
        formData.append("code", this.itemForm.code);
        formData.append("description", this.itemForm.description);
        formData.append("jenisbarang", this.itemForm.jenisbarang);
        if (this.itemForm.photo) {
          formData.append("photo", this.itemForm.photo);
        }

        if (this.itemForm.id) {
          await axios.put(
            `http://localhost:8000/api/daftarbarang/${this.itemForm.id}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else {
          await axios.post("http://localhost:8000/api/daftarbarang", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
        this.isModalOpen = false;
        this.fetchItems(); // Refresh data setelah menyimpan
      } catch (error) {
        console.error("Error saving item:", error);
        alert("Terjadi kesalahan saat menyimpan barang.");
      }
    },
    async editItem(item) {
      this.isModalOpen = true;
      this.itemForm = { ...item };
    },
    async confirmDelete(id) {
      const confirm = window.confirm(
        "Apakah Anda yakin ingin menghapus barang ini?"
      );
      if (confirm) {
        this.deleteItem(id);
      }
    },
    async deleteItem(id) {
      try {
        await axios.delete(`http://localhost:8000/api/daftarbarang/${id}`);
        this.items = this.items.filter((item) => item.id !== id);
        alert("Barang berhasil dihapus.");
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Terjadi kesalahan saat menghapus barang.");
      }
    },
    handleFileChange(event) {
      const file = event?.target?.files?.[0];
      this.itemForm.photo = file || null;
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
  },
  mounted() {
    this.fetchItems();
  },
};
</script>

<style scoped>
.q-page {
  padding: 20px;
}

.q-card-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>

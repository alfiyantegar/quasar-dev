<template>
  <q-page>
    <!-- Tabel Daftar Barang -->
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
          icon="add"
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
            icon="edit"
          />
          <q-btn
            flat
            label="Hapus"
            color="negative"
            @click="confirmDelete(props.row.id)"
            icon="delete"
          />
        </q-td>
      </template>

      <!-- Menampilkan Foto Barang di Tabel -->
      <template v-slot:body-cell-photo="props">
        <q-td :props="props">
          <div class="q-gutter-sm flex items-center">
            <q-avatar size="40px">
              <img
                v-if="props.row.photo"
                :src="props.row.photo"
                alt="Foto Barang"
              />
            </q-avatar>
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
            :disabled="isFormDisabled"
            :rules="['required']"
            class="q-mb-md"
          />
          <q-input
            v-model="itemForm.merk"
            label="Merk Barang"
            :disabled="isFormDisabled"
            class="q-mb-md"
          />
          <q-input
            v-model="itemForm.code"
            label="Kode Barang"
            :disabled="isFormDisabled"
            class="q-mb-md"
          />
          <q-input
            v-model="itemForm.description"
            label="Deskripsi Barang"
            :disabled="isFormDisabled"
            class="q-mb-md"
          />

          <!-- Dropdown untuk Jenis Barang -->
          <q-select
            v-model="itemForm.jenisbarang"
            :options="jenisBarangOptions"
            label="Jenis Barang"
            emit-value
            map-options
            :disable="isFormDisabled"
            class="q-mb-md"
          />

          <!-- Label Foto Barang dan input untuk upload gambar -->
          <q-input
            label="Foto Barang"
            type="file"
            @change="handleFileChange"
            accept="image/*"
            :disable="isFormDisabled"
            class="q-mb-md"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Batal" @click="closeModal" />
          <q-btn
            flat
            label="Simpan"
            color="primary"
            @click="saveItem"
            :disable="isFormDisabled"
          />
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
      isFormDisabled: false, // Track if the form should be disabled
      items: [], // Array untuk menyimpan data barang
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
      this.isFormDisabled = false; // Enable form for adding
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
    closeModal() {
      this.isModalOpen = false;
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
        formData.append("status", "Tersedia");

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
        this.fetchItems(); // Fetch updated data after saving
      } catch (error) {
        console.error("Error saving item:", error);
        alert("Terjadi kesalahan saat menyimpan barang.");
      }
    },
    async editItem(item) {
      this.isModalOpen = true;
      this.itemForm = { ...item };
      this.isFormDisabled = false; // Enable form for editing
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
        this.isFormDisabled = true; // Disable form when deleting
        await axios.delete(`http://localhost:8000/api/daftarbarang/${id}`);
        this.items = this.items.filter((item) => item.id !== id);
        alert("Barang berhasil dihapus.");
        this.isModalOpen = false;
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Terjadi kesalahan saat menghapus barang.");
      } finally {
        this.isFormDisabled = false; // Re-enable form after deletion
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
        console.log(response.data); // Cek data yang diterima
        this.items = response.data.data;
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

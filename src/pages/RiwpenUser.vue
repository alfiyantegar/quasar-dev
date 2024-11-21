<template>
  <q-page padding class="bg-grey-1">
    <q-card flat bordered class="q-pa-md q-mb-lg">
      <q-card-section>
        <q-separator class="q-my-md"></q-separator>
        <q-table
          :rows="riwayatPeminjaman"
          :columns="columns"
          row-key="idriwpen"
          square
          flat
          bordered
          v-model:pagination="pagination"
          class="q-pa-none"
          :rows-per-page-options="[5, 10, 20]"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <div v-if="props.row.status === 'Disetujui'" class="text-green">
                <q-icon name="check_circle" /> Disetujui
              </div>
              <div
                v-else-if="props.row.status === 'Tidak Disetujui'"
                class="text-red"
              >
                <q-icon name="cancel" /> Tidak Disetujui
              </div>
              <div v-else class="text-yellow">
                <q-icon name="hourglass_empty" /> Sedang Diproses
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions>
        <q-btn flat label="Kembali" @click="$router.go(-1)" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const pagination = ref({ page: 1, rowsPerPage: 5 });
const riwayatPeminjaman = ref([]);

const columns = [
  {
    name: "idriwpen",
    label: "ID Peminjaman",
    align: "left",
    field: "idriwpen",
    sortable: true,
  },
  { name: "iduser", label: "ID Peminjam", align: "left", field: "iduser" },
  {
    name: "id",
    label: "ID Barang",
    align: "left",
    field: "id",
    sortable: true,
  },
  {
    name: "keterangan",
    label: "Keterangan",
    align: "left",
    field: "keterangan",
  },
  { name: "status", label: "Status", align: "center", field: "status" },
];

// Fungsi untuk mengambil riwayat peminjaman
const fetchRiwayatPeminjaman = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/riwayatpeminjaman"
    );
    riwayatPeminjaman.value = response.data;
  } catch (error) {
    console.error("Error fetching riwayat peminjaman:", error);
  }
};

// Ambil data saat komponen dimuat
onMounted(() => {
  fetchRiwayatPeminjaman();
});
</script>

<style scoped>
.text-green {
  color: green;
  font-weight: bold;
}
.text-red {
  color: red;
  font-weight: bold;
}
.text-yellow {
  color: gold; /* Warna untuk "Sedang Diproses" */
  font-weight: bold;
}
</style>

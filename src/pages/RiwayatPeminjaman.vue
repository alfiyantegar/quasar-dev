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
              <div v-if="props.row.status === 'Sedang Diproses'">
                <q-btn
                  color="primary"
                  label="Setujui"
                  @click="ubahStatusPeminjaman(props.row)"
                  class="q-mr-sm"
                />
                <q-btn
                  color="negative"
                  label="Tidak Setujui"
                  @click="ubahStatusPeminjaman(props.row, 'Tidak Disetujui')"
                />
              </div>
              <div
                v-else-if="props.row.status === 'Disetujui'"
                class="text-green"
              >
                <q-icon name="check_circle" /> Disetujui
              </div>
              <div
                v-else-if="props.row.status === 'Tidak Disetujui'"
                class="text-red"
              >
                <q-icon name="cancel" /> Tidak Disetujui
              </div>
              <div v-else>
                <q-icon name="hourglass_empty" /> Status Tidak Dikenal
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
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

// Fetch data riwayat peminjaman saat komponen dimuat
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

const ubahStatusPeminjaman = async (row, statusBaru) => {
  try {
    let endpoint;

    if (statusBaru === "Tidak Disetujui") {
      endpoint = `http://localhost:8000/api/riwayatpeminjaman/tidak-setujui/${row.idriwpen}`;
      row.status = "Tidak Disetujui"; // Update status secara lokal
      console.log("Peminjaman tidak disetujui.");
    } else if (row.keterangan.includes("Dikembalikan")) {
      if (statusBaru === "Tidak Disetujui") {
        endpoint = `http://localhost:8000/api/riwayatpeminjaman/tidak-setujui-peminjaman/${row.idriwpen}`;
        row.status = "Tidak Disetujui"; // Update status secara lokal
        console.log("Pengembalian tidak disetujui.");
      } else {
        endpoint = `http://localhost:8000/api/riwayatpeminjaman/setujui-pengembalian/${row.idriwpen}`;
        row.status = "Disetujui"; // Update status secara lokal
        console.log("Pengembalian barang telah disetujui.");
      }
    } else {
      endpoint = `http://localhost:8000/api/riwayatpeminjaman/setujui/${row.idriwpen}`;
      row.status = "Disetujui"; // Update status secara lokal
      console.log("Peminjaman disetujui.");
    }

    await axios.post(endpoint);
  } catch (error) {
    console.error(`Error mengubah status: ${error.message}`);
  }
};

// Panggil fetch data saat komponen dimuat
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
</style>

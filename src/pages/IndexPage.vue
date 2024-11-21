<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-col
      v-for="item in items"
      :key="item.name"
      :xs="12"
      :sm="6"
      :md="4"
      :lg="3"
    >
      <q-card class="my-card" style="max-width: 350px">
        <!-- Gambar dengan overlay -->
        <q-img
          :src="item.img"
          style="
            height: 200px;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
          "
          class="card-img"
        >
        </q-img>

        <!-- Konten Informasi -->
        <q-card-section style="padding: 20px 15px">
          <div class="text-h6" style="margin-bottom: 10px; font-weight: bold">
            {{ item.name }}
          </div>
          <div class="q-mb-md">
            <q-chip dense icon="widgets" color="primary" text-color="white"
              >Unit: {{ item.unit }}</q-chip
            >
            <q-chip dense icon="history" color="secondary" text-color="white"
              >Terpinjam: {{ item.borrowed }}</q-chip
            >
          </div>
        </q-card-section>
      </q-card>
    </q-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          name: "Printer",
          unit: 10,
          borrowed: 2,
          img: "https://tse3.mm.bing.net/th?id=OIP.qfVSVIsPcYh5fRPKXk5jVwHaFj&pid=Api&P=0&h=180",
        },
        {
          name: "PC Unit",
          unit: 11,
          borrowed: 3,
          img: "https://tse1.mm.bing.net/th?id=OIP.W5ni-GJSTAKvroPPMiDhVwHaEl&pid=Api&P=0&h=180",
        },
        {
          name: "Handphone",
          unit: 10,
          borrowed: 4,
          img: "https://tse4.mm.bing.net/th?id=OIP.cDWbfFqvp7u8whM5O4tvwQHaEJ&pid=Api&P=0&h=180",
        },
        {
          name: "Kendaraan",
          unit: 5,
          borrowed: 1,
          img: "https://tse4.mm.bing.net/th?id=OIP.13MoUh8upXmbqQ9RFNcp6wHaEK&pid=Api&P=0&h=180",
        },
      ],
    };
  },
};
</script>

<style scoped>
.my-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
}

.my-card:hover {
  transform: translateY(-10px); /* Efek naik saat hover */
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2); /* Bayangan lebih besar */
}

.card-img {
  overflow: hidden;
}

.card-img img {
  transition: transform 0.4s ease;
}

.card-img:hover img {
  transform: scale(1.1); /* Gambar diperbesar saat hover */
}

.text-h6 {
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
}

.q-chip {
  margin-right: 8px;
  font-weight: 500;
}

.q-chip icon {
  margin-right: 4px;
}
</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>{{ pageTitle }}</q-toolbar-title>
        <q-btn
          flat
          dense
          class="q-ml-auto q-hoverable logout-btn"
          color="negative"
          label="Logout"
          @click="logout"
        >
          <q-icon name="logout" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header class="text-h6 q-mb-md">Menu</q-item-label>
        <q-item
          v-for="link in linksList"
          :key="link.title"
          :to="link.link"
          exact
          clickable
          class="q-mb-md q-hoverable menu-item"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" size="32px" class="q-mr-sm" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-caption>{{ link.caption }}</q-item-caption>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

// Define state
const leftDrawerOpen = ref(false);
const router = useRouter();
const route = useRoute();

// Get role from localStorage
const role = localStorage.getItem("role") || "guest"; // Fallback to guest if not found

// Define links for Admin and User based on role
const adminLinks = [
  {
    title: "Dashboard",
    icon: "dashboard",
    link: "/dashboard",
    caption: "Admin Overview",
  },
  {
    title: "Daftar Barang",
    icon: "inventory",
    link: "/daftarbarang",
    caption: "Manage Items",
  },
  {
    title: "Riwayat Peminjaman",
    icon: "history",
    link: "/riwayatpeminjaman",
    caption: "Loan History",
  },
];

const userLinks = [
  {
    title: "Dashboard User",
    icon: "dashboard",
    link: "/dashboarduser",
    caption: "User Overview",
  },
  {
    title: "Riwayat Peminjaman User",
    icon: "history",
    link: "/riwayatpeminjamanuser",
    caption: "User Loan History",
  },
];

const guestLinks = [
  {
    title: "Login",
    icon: "login",
    link: "/login",
    caption: "Access Your Account",
  },
];

// Dynamic links list based on role
const linksList = computed(() => {
  if (role === "admin") return adminLinks;
  if (role === "user") return userLinks;
  return guestLinks; // Default to guest links
});

// Page title based on route
const pageTitle = computed(() => {
  switch (route.path) {
    case "/dashboard":
      return "Admin Dashboard";
    case "/daftarbarang":
      return "Daftar Barang Admin";
    case "/riwayatpeminjaman":
      return "Riwayat Peminjaman Admin";
    case "/dashboarduser":
      return "User Dashboard";
    case "/riwayatpeminjamanuser":
      return "Riwayat Peminjaman User";
    default:
      return "Peminjaman System";
  }
});

// Logout function
function logout() {
  localStorage.removeItem("role");
  router.push("/login"); // Redirect to login page
}

// Toggle left drawer visibility
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
.q-toolbar {
  background-color: #1976d2;
  color: white;
}

.q-drawer {
  background-color: #f5f5f5;
}

.q-item-label {
  font-weight: bold;
  color: #333;
}

.q-list {
  padding: 20px;
}

.menu-item:hover {
  background-color: #e3f2fd;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.2s;
}

.logout-btn {
  background-color: #ffebee;
  border-radius: 8px;
  padding: 8px 16px;
  border: 2px solid #ff5722;
  color: #1976d2;
  transition: transform 0.2s;
}

.logout-btn:hover {
  transform: scale(1.05);
}
</style>

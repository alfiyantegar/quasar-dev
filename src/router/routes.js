const routes = [
  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        redirect: (to) => {
          const role = localStorage.getItem("role");
          return role === "admin" ? "/dashboard" : "/dashboarduser";
        },
      },
      { path: "dashboard", component: () => import("pages/IndexPage.vue") }, // Admin Dashboard
      {
        path: "daftarbarang",
        component: () => import("pages/DaftarBarang.vue"),
      },
      {
        path: "riwayatpeminjaman",
        component: () => import("pages/RiwayatPeminjaman.vue"),
      },
      { path: "dashboarduser", component: () => import("pages/DashUser.vue") }, // User Dashboard
      { path: "daftbaruser", component: () => import("pages/DaftbarUser.vue") },
      {
        path: "riwayatpeminjamanuser",
        component: () => import("pages/RiwpenUser.vue"),
      },
    ],
    beforeEnter: (to, from, next) => {
      const role = localStorage.getItem("role");

      if (!role) {
        // Jika tidak ada role, arahkan ke login
        return next("/login");
      }

      // Role-based navigation
      if (
        role === "admin" &&
        !["/dashboard", "/daftarbarang", "/riwayatpeminjaman"].includes(to.path)
      ) {
        return next("/dashboard");
      }

      if (
        role === "user" &&
        !["/dashboarduser", "/daftbaruser", "/riwayatpeminjamanuser"].includes(
          to.path
        )
      ) {
        return next("/dashboarduser");
      }

      next(); // Lanjutkan jika rute sesuai
    },
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

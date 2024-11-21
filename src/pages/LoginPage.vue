<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-light">
        <q-card class="login-card shadow-2">
          <q-card-section class="login-header">
            <div class="text-h5 text-center text-primary q-mb-sm">
              PinjamGO!
            </div>
            <div class="text-subtitle1 text-center text-grey-7">
              Silahkan Login terlebih dahulu.
            </div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="submitForm">
              <q-input
                filled
                label="Email"
                v-model="email"
                type="email"
                class="q-mb-md"
                dense
                :disable="loading"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please enter your email',
                  (val) =>
                    /.+@.+\..+/.test(val) || 'Please enter a valid email',
                ]"
              />
              <q-input
                filled
                label="Password"
                v-model="password"
                type="password"
                class="q-mb-md"
                dense
                :disable="loading"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please enter your password',
                ]"
              />
              <q-btn
                label="Login"
                type="submit"
                color="primary"
                class="full-width login-btn"
                :disable="!email || !password || loading"
                :loading="loading"
              />
            </q-form>
          </q-card-section>

          <q-card-section v-if="errorMessage" class="text-negative text-center">
            {{ errorMessage }}
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

// Variabel untuk data login
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref(null);
const router = useRouter();

// Fungsi untuk melakukan login
async function submitForm() {
  loading.value = true; // Menambahkan status loading
  errorMessage.value = null; // Reset error message

  try {
    const response = await axios.post("http://localhost:8000/api/login", {
      email: email.value,
      password: password.value,
    });

    loading.value = false; // Matikan loading setelah respons diterima

    if (response.data.user) {
      localStorage.setItem("role", response.data.user.role);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data.user.role === "admin") {
        router.push("/dashboard");
      } else if (response.data.user.role === "user") {
        router.push("/dashboarduser");
      } else {
        errorMessage.value = "Invalid user role";
      }
    } else {
      errorMessage.value = "Invalid email or password";
    }
  } catch (error) {
    loading.value = false; // Matikan loading jika terjadi error
    console.error("Error during login:", error);

    if (error.response) {
      errorMessage.value =
        error.response.data.message ||
        `Error ${error.response.status}: An error occurred. Please try again.`;
    } else {
      errorMessage.value = "Unable to connect to the server. Please try again.";
    }
  }
}
</script>

<style scoped>
/* Tampilan background */
.bg-light {
  background: linear-gradient(to bottom right, #ffffff, #ffffff);
  min-height: 100vh;
}

/* Desain kartu login */
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  background-color: #ffffff;
  padding: 1.5rem;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

/* Header pada kartu login */
.login-header {
  padding: 1rem 0;
  background-color: #e3f2fd;
  border-radius: 15px 15px 0 0;
}

/* Tombol login */
.login-btn {
  border-radius: 25px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.login-btn:hover {
  background-color: #0288d1;
  transform: translateY(-2px);
}

/* Teks kesalahan */
.text-negative {
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: bold;
}

/* Responsivitas */
@media (max-width: 600px) {
  .login-card {
    max-width: 100%;
    padding: 2rem 1rem;
  }
}
</style>

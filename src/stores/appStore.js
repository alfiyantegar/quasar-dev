import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    id: null,
    name: null,
    email: null,
    customer_id: null,
    pam_id: null,
    pam_name: null,

    token: "",
    roles: [],

    is_loggedin: false,
    is_dark: false,
    is_need_csrf: true,
  }),
  actions: {
    resetValue() {
      this.id = null;
      this.name = null;
      this.email = null;
      this.customer_id = null;
      this.pam_id = null;
      this.pam_name = null;
      this.token = "";
      this.roles = [];
      this.is_loggedin = false;
      this.is_dark = false;
      this.is_need_csrf = true;
    },
  },
  persist: [
    {
      // paths: ["is_loggedin", "id", "name", "email", "customer_id"],
      key: "pamijo",
    },
  ],
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  // actions: {
  //   increment() {
  //     this.counter++;
  //   },
  // },
});

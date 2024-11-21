<template>
  <q-page>
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: []
    };
  },
  mounted() {
    axios.get('http://localhost:8000/api/items')
      .then(response => {
        this.items = response.data;
      });
  }
};
</script>

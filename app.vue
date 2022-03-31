<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="flex flex-col grow">
      <Game
        :abc="abc"
        :title="data.name"
        :url="url"
      />
    </main>
  </div>
</template>

<script setup>
const { data } = await useFetch('/api/setting');
</script>

<script>
import Game from "~~/components/GameComponent.vue";
import Header from "~~/components/HeaderComponent.vue";
import { fullAbc, settingUrl } from "~/utils/the-session";

export default {
  components: { Game, Header },
  computed: {
    abc() {
      return fullAbc(this.data);
    },
    url() {
      return settingUrl(this.data);
    },
  },
};
</script>

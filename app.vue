<template>
  <h1>Fiddle</h1>

  <Game
    :abc="abc"
    :title="data.name"
    :url="setting.url"
  />
</template>

<script setup>
const needle = Math.ceil(Math.random() * 99 + 1);

// eslint-disable-next-line no-undef
const { data } = await useAsyncData(
  "myRandomKey",
  () =>
  // eslint-disable-next-line no-undef
    $fetch(`https://thesession.org/tunes/${needle}?format=json`).catch((e) => {
      console.log(e);
    }),
  {
    pick: ["id", "name", "settings"],
  }
);
</script>

<script>
import Game from "~~/components/GameComponent.vue";
import { abcFromData } from "~/utils/abc-from-data";

export default {
  components: { Game },
  computed: {
    abc() {
      return abcFromData(this.setting, this.data.name);
    },
    setting() {
      const index = Math.floor(Math.random() * this.data.settings.length);
      return this.data.settings[index];
    },
  },
};
</script>

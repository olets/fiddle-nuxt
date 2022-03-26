<template>
  <h1>
    <a :href="setting.url">{{ data.name }} ({{ data.id }})</a>
  </h1>

  <Player :abc="abc"></Player>
</template>

<script setup>
const needle = Math.ceil(Math.random() * 99 + 1);
const { data } = await useAsyncData(
  "myRandomKey",
  () =>
    $fetch(`https://thesession.org/tunes/${needle}?format=json`).catch((e) => {
      console.log(e);
    }),
  {
    pick: ["id", "name", "settings"],
  }
);
</script>

<script>
import Player from "@/components/Player.vue";
import { abcFromData } from "~/utils/abc-from-data";

export default {
  components: { Player },
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

<script setup>
const id = Math.ceil(Math.random() * 99 + 1);
const { data } = await useFetch(
  `https://thesession.org/tunes/${id}?format=json`
);
</script>

<template>
  <Player
    :name="data.name"
    :setting="data.settings[Math.floor(Math.random() * data.settings.length)]"
    :id="data.id"
  ></Player>
</template>

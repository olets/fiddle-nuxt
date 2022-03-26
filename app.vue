<script setup>
const id = Math.ceil(Math.random() * 99 + 1);
const { data: tune } = await useAsyncData("myRandomKey", () =>
  $fetch(`https://thesession.org/tunes/${id}?format=json`).catch((e) => {
    console.log(e);
  })
);
</script>

<template>
  <Player
    :name="data.name"
    :setting="data.settings[Math.floor(Math.random() * data.settings.length)]"
    :id="data.id"
  ></Player>
</template>

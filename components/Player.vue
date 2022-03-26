<template>
  <textarea readonly v-model="abc"></textarea>
</template>

<script>
export default {
  props: {
    abc: {
      type: String,
      required: true,
    },
  },
};
</script>

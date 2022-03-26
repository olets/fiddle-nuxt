<template>
  <h1>
    <a :href="setting.url">{{ name }} ({{ id }})</a>
  </h1>
  
  <textarea readonly>{{ tune }}</textarea>
</template>

<script>
const tuneFromSetting = (setting, name) => {
  const tune = `
X:${setting.id}
T:${name}
K:${setting.key}
${setting.abc.replace(/!/g, "\n")}`;

  return tune;
};

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    setting: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tune() {
      return tuneFromSetting(this.setting, this.name);
    },
  },
};
</script>

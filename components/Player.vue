<template>
  <button @click="play">click</button>

  <div id="synth-controller-outlet"></div>

  <textarea readonly v-model="abc"></textarea>
</template>

<script>
import abcjs from "abcjs";
import "abcjs/abcjs-audio.css";

export default {
  props: {
    abc: {
      type: String,
      required: true,
    },
  },
  methods: {
    play() {
      if (abcjs.synth.supportsAudio()) {
        this.synthController.load("#synth-controller-outlet", null, {
          displayProgress: true,
        });

        this.synthController.disable(true);

        this.synth.init({ visualObj: this.visualObj }).then(() => {
          this.synthController.setTune(this.visualObj, true).then(() => {
            this.synthController.play();
          })
        });
      } else {
        console.log("Audio is not supported on this browser");
      }
    },
  },
  computed: {
    synth() {
      return new abcjs.synth.CreateSynth();
    },
    synthController() {
      return new abcjs.synth.SynthController();
    },
    visualObj() {
      return abcjs.renderAbc("*", this.abc)[0];
    },
  },
};
</script>

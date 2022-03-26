<template>
  <button @click="play" :disabled="playing">Play</button>
  <button @click="increment" :disabled="playing">Increment</button>

  <div id="synth-controller-outlet"></div>

  <textarea readonly v-model="abc"></textarea>
</template>

<script>
import abcjs from "abcjs";
import "abcjs/abcjs-audio.css";
import { sleep } from "~~/utils/sleep.js";

export default {
  data() {
    return {
      duration: 1000,
      durationIncrements: [1000, 2000, 3000, 4000, 5000],
      playing: false,
    };
  },
  props: {
    abc: {
      type: String,
      required: true,
    },
  },
  methods: {
    increment() {
      this.duration += this.durationIncrements.shift();
    },
    play() {
      if (abcjs.synth.supportsAudio()) {
        this.playing = true;

        this.synthController.load("#synth-controller-outlet", null, {
          displayProgress: true,
        });

        this.synthController.disable(true);

        this.synth.init({ visualObj: this.visualObj }).then(() => {
          this.synthController.setTune(this.visualObj, true).then(() => {
            this.synthController.play();

            sleep(this.duration).then(() => {
              this.synthController.pause();
              this.synthController.setProgress();
              this.playing = false;
            });
          });
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

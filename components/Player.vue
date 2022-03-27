<template>
  <button
    @click="play"
    :disabled="playing"
    :class="`${
      playing ? 'text-slate-500 cursor-not-allowed' : 'hover:text-link'
    } aspect-square w-16 overflow-hidden rounded-full transition-colors`"
  >
    <!-- 
      Sittipong Haus, CC0, via Wikimedia Commons
      https://commons.wikimedia.org/wiki/File:Play_-_The_Noun_Project.svg
    -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 90 90"
      enable-background="new 0 0 90 90"
      xml:space="preserve"
      fill="currentColor"
    >
      <path
        d="M45,6.421c21.273,0,38.579,17.306,38.579,38.579S66.273,83.578,45,83.578c-21.273,0-38.579-17.306-38.579-38.579  S23.727,6.421,45,6.421 M45,0C20.148,0,0,20.146,0,44.999s20.148,44.999,45,44.999c24.852,0,45-20.146,45-44.999S69.852,0,45,0L45,0  z M65.5,44.999l-31.5-18v36L65.5,44.999z"
      />
    </svg>
  </button>

  <div>
    <button
      @click="increment"
      :disabled="playing"
      :class="`${
        playing
          ? 'text-slate-500 cursor-not-allowed'
          : 'hover:bg-link hover:text-white'
      } border border-link rounded-full p-2 shadow transition-colors`"
    >
      {{ skipButtonText }}
    </button>
  </div>

  <div class="hidden" id="synth-controller-outlet"></div>

  <div class="border border-black h-5 relative">
    <div
      class="left-0 w-full h-full absolute bg-slate-900 border-white"
      :style="`width: calc(100% * ${duration} / 16000)`"
    ></div>
    <div
      :class="`${
        playing ? 'animate-slide' : ''
      } w-full h-full absolute bg-green-400 -translate-x-full`"
    ></div>

    <div class="left-0 w-full h-full absolute grid gap-px grid-cols-16">
      <div
        class="border border-transparent border-r-slate-400 col-span-1"
      ></div>
      <div
        class="border border-transparent border-r-slate-400 col-span-1"
      ></div>
      <div
        class="border border-transparent border-r-slate-400 col-span-2"
      ></div>
      <div
        class="border border-transparent border-r-slate-400 col-span-3"
      ></div>
      <div
        class="border border-transparent border-r-slate-400 col-span-4"
      ></div>
    </div>
  </div>

  <!-- <pre>{{ abc }}</pre> -->
</template>

<script>
import abcjs from "abcjs";
import "abcjs/abcjs-audio.css";
import { sleep } from "~/utils/sleep.js";

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
        this.synthController.load("#synth-controller-outlet", null, {
          displayProgress: true,
        });

        this.synthController.disable(true);

        this.synth.init({ visualObj: this.visualObj }).then(() => {
          this.synthController.setTune(this.visualObj, true).then(() => {
            this.synthController.play();
            this.playing = true;

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
    skipButtonText() {
      let text = "Skip";

      if (this.durationIncrements.length) {
        const sec = this.durationIncrements[0] / 1000;
        text += ` (+${sec}s)`;
      }

      return text;
    },
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

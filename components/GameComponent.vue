<template>
  <ul>
    <li
      v-for="guess in guesses"
      :key="guess"
    >
      {{ guess }}
    </li>
  </ul>

  <button
    :disabled="playing"
    :class="`${
      playing ? 'text-slate-500 cursor-not-allowed' : 'hover:text-link'
    } aspect-square w-16 overflow-hidden rounded-full transition-colors`"
    @click="activateAndPlay"
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
      :disabled="playing || finished"
      :class="`${
        playing
          ? 'text-slate-500 cursor-not-allowed'
          : 'hover:bg-link hover:text-white'
      } border border-link rounded-full p-2 shadow transition-colors`"
      @click="increment"
    >
      {{ skipButtonText }}
    </button>
  </div>

  <form @submit.prevent="submitGuess">
    <label>
      Title
      <input
        id="guessInput"
        ref="guessInput"
        class="border rounded"
        type="text"
        value=""
        :disabled="playing || finished"
      >
    </label>

    <button
      class="border border-link disabled:opacity-50 px-4 py-2 rounded-lg transition-opacity"
      :disabled="playing || finished"
      type="submit"
    >
      Guess
    </button>
  </form>

  <div :class="`${finished ? 'hidden' : ''} border border-black h-5 relative`">
    <div
      class="left-0 w-full h-full absolute bg-slate-900 border-white"
      :style="`width: calc(100% * ${duration} / 16000)`"
    />
    <div
      :class="`${
        playing ? 'animate-slide' : ''
      } w-full h-full absolute bg-green-400 -translate-x-full`"
    />

    <div class="left-0 w-full h-full absolute grid gap-px grid-cols-16">
      <div class="border border-transparent border-r-slate-400 col-span-1" />
      <div class="border border-transparent border-r-slate-400 col-span-1" />
      <div class="border border-transparent border-r-slate-400 col-span-2" />
      <div class="border border-transparent border-r-slate-400 col-span-3" />
      <div class="border border-transparent border-r-slate-400 col-span-4" />
    </div>
  </div>

  <div :class="`${finished ? '' : 'hidden'}`">
    <div ref="player" />

    <a
      class="underline decoration-link hover:text-link transition-colors"
      :href="url"
    >{{ title }}</a>

    <div ref="notation" />
  </div>
</template>

<script>
import abcjs from "abcjs";
import "abcjs/abcjs-audio.css";
import { sleep } from "~/utils/sleep.js";

export default {
  props: {
    abc: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activated: false,
      duration: 1000,
      durationIncrements: [1000, 2000, 3000, 4000, 5000],
      finished: false,
      guesses: [],
      playing: false,
      synth: null,
      synthController: null,
      visualObj: null,
    };
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
  },
  watch: {
    finished() {
      this.duration = null;
      this.activateAndPlay();
    },
    guesses() {
      if (!this.durationIncrements.length) {
        this.finished = true;
      }
    },
  },
  mounted() {
    this.synth = new abcjs.synth.CreateSynth();

    this.synthController = new abcjs.synth.SynthController();
    this.visualObj = abcjs.renderAbc("*", this.abc)[0];

    this.synthController.load(this.$refs.player, null, {
      displayRestart: true,
      displayPlay: true,
      displayProgress: true,
      displayClock: false
    });

    abcjs.renderAbc(this.$refs.notation, this.abc, { responsive: "resize" });
  },
  methods: {
    submitGuess() {
      const { value } = this.$refs.guessInput;
      const correct = value.toLowerCase() === this.title.toLowerCase();

      this.guesses = [...this.guesses, value];

      this.$refs.guessInput.value = null;
      
      this.finished = correct;
    },
    increment() {
      this.duration += this.durationIncrements.shift();
      this.guesses = [...this.guesses, "Skipped"];
    },
    activateAndPlay() {
      const play = () => {
        this.synthController.setTune(this.visualObj, true).then(() => {
          this.synthController.play();
          this.playing = true;

          if (this.duration) {
            sleep(this.duration).then(() => {
              this.synthController.pause();
              this.synthController.setProgress();
              this.playing = false;
            });
          }
        });
      };

      if (abcjs.synth.supportsAudio()) {
        if (this.activated) {
          play();
          return;
        }

        this.activated = true;

        this.synth.init({ visualObj: this.visualObj }).then(() => {
          play();
        });
      } else {
        console.log("Audio is not supported on this browser");
      }
    },
  },
};
</script>

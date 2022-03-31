<template>
  <div class="flex flex-col grow">
    <div class="grow max-w-xl mx-auto w-full">
      <!-- Answer -->
      <div :class="`${finished ? '' : 'hidden'} mb-8`">
        <a
          class="underline decoration-link hover:text-link transition-colors"
          :href="url"
        >{{ title }}</a>

        <div ref="notation" />
      </div>

      <!-- Guesses -->
      <ul :class="`${finished ? 'hidden' : ''} space-y-2`">
        <li
          v-for="g in guesses"
          :key="g"
          class="p-2 border"
        >
          {{ g }}
        </li>

        <li
          v-for="d in durationIncrementsRemaining"
          :key="d"
          class="p-2 border select-none"
        >
          &nbsp;
        </li>
      </ul>
    </div>

    <div class="py-2">
      <!-- Progress bar -->
      <div class="border-y">
        <!-- Short for while guessing -->
        <div
          :class="`${
            finished ? 'hidden' : ''
          } h-3 max-w-xl mx-auto overflow-hidden relative`"
        >
          <!-- Unlocked duration -->
          <div
            class="left-0 h-full absolute bg-slate-900"
            :style="`width: calc(100% * ${unlockedDuration} / ${fullDuration})`"
          />

          <!-- Play progress -->
          <div
            :class="`${
              playing ? 'animate-slide' : ''
            } w-full h-full absolute bg-green-400 -translate-x-full`"
            :style="`animation-duration: ${fullDuration * durationFactor}s`"
          />

          <!-- Duration increments -->
          <div
            class="absolute grid h-full left-0 w-full"
            :style="`grid-template-columns: repeat(${fullDuration}, minmax(0, 1fr)`"
          >
            <div
              v-for="d in durationIncrementsDisplayed"
              :key="d"
              class="border-r"
              :style="`grid-column: span ${d} / span ${d}`"
            />
          </div>
        </div>

        <!-- Full for when finish -->
        <div
          ref="player"
          :class="`${finished ? '' : 'hidden'} max-w-xl mx-auto`"
        />
      </div>

      <!-- Guessing interface -->
      <div class="max-w-xl mx-auto">
        <!-- Hard option -->
        <label class="block">
          Hard?
          <input
            v-model="hard"
            type="checkbox"
          >
        </label>

        <!-- Play button -->
        <div class="text-center">
          <button
            :disabled="playing"
            :class="`${
              playing ? 'text-slate-500 cursor-not-allowed' : 'hover:text-link'
            } aspect-square overflow-hidden rounded-full transition-colors w-14`"
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
        </div>

        <!-- Guess -->
        <form
          :class="`${finished ? 'hidden' : ''}`"
          @submit.prevent="makeGuess"
        >
          <label>
            <div class="sr-only">Title</div>

            <input
              v-model="guess"
              class="border px-4 py-3 w-full"
              placeholder="Title"
              type="text"
              :disabled="playing || finished"
            >
          </label>

          <div class="flex justify-between mt-2">
            <!-- Skip button -->
            <button
              :disabled="playing || finished"
              class="bg-slate-500 disabled:cursor-not-allowed font-bold px-4 py-2 text-sm text-white tracking-widest transition-opacity"
              type="button"
              @click="skip"
            >
              <span class="uppercase">Skip</span> {{ skipDetails }}
            </button>

            <!-- Guess button -->
            <button
              class="bg-green-500 disabled:cursor-not-allowed font-bold px-4 py-2 text-sm text-white tracking-widest transition-opacity uppercase"
              :disabled="playing || finished || !guess"
              type="submit"
            >
              Guess
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import abcjs from "abcjs";
import "abcjs/abcjs-audio.css";
import { sleep } from "~/utils/sleep.js";
import { sum } from "~/utils/sum.js";

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
      durationIncrementsRemaining: [1, 1, 2, 3, 4, 5],
      durationIncrementsUnlocked: [],
      finished: false,
      fullDuration: null,
      guess: "",
      guesses: [],
      hard: false,
      playing: false,
      synth: null,
      synthController: null,
      visualObj: null,
    };
  },
  computed: {
    unlockedDuration() {
      return sum(this.durationIncrementsUnlocked);
    },
    durationFactor() {
      return this.hard ? 0.65 : 1.3;
    },
    durationIncrementsDisplayed() {
      return this.durationIncrementsUnlocked
        .concat(this.durationIncrementsRemaining)
        .filter((el) => el);
    },
    skipDetails() {
      let details = "";

      if (this.durationIncrementsRemaining.length) {
        const increments = this.durationIncrementsRemaining[0];

        if (increments > 0) {
          const measures = this.hard ? increments / 2 : increments
          const measuresRounded = Math.round(measures / 0.5) * 0.5;

          details += ` (+ approx. ${measuresRounded} ${measuresRounded > 1 ? "measures" : "measure"})`;
        }
      }

      return details;
    },
  },
  watch: {
    finished() {
      abcjs.renderAbc(this.$refs.notation, this.abc, { responsive: "resize" });
      this.activateAndPlay();
    },
    guesses() {
      if (!this.durationIncrementsRemaining.length) {
        this.finished = true;
      }
    },
  },
  created() {
    this.durationIncrementsRemaining.push(0);
    this.fullDuration = sum(this.durationIncrementsRemaining);
    this.unlockNextDurationIncrement();
  },
  mounted() {
    this.synth = new abcjs.synth.CreateSynth();

    this.synthController = new abcjs.synth.SynthController();
    this.visualObj = abcjs.renderAbc("*", this.abc)[0];

    this.synthController.load(this.$refs.player, null, {
      displayRestart: true,
      displayPlay: true,
      displayProgress: true,
      displayClock: false,
    });
  },
  methods: {
    activateAndPlay() {
      const play = () => {
        this.synthController.setTune(this.visualObj, true).then(() => {
          this.synthController.play();
          this.playing = true;

          if (this.unlockedDuration) {
            // duration is in seconds, sleep needs milliseconds
            sleep(this.unlockedDuration * this.durationFactor * 1000).then(() => {
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

        this.synth
          .init({
            visualObj: this.visualObj,
            millisecondsPerMeasure: 800,
          })
          .then(() => {
            play();
          });
      } else {
        console.log("Audio is not supported on this browser");
      }
    },
    makeGuess() {
      const correct = this.guess.toLowerCase() === this.title.toLowerCase();

      this.guesses = [...this.guesses, this.guess];

      this.guess = null;

      this.finished = correct;

      if (!correct) {
        this.unlockNextDurationIncrement();
      }
    },
    skip() {
      this.guesses = [...this.guesses, "Skipped"];
      this.unlockNextDurationIncrement();
    },
    unlockNextDurationIncrement() {
      this.durationIncrementsUnlocked.push(
        this.durationIncrementsRemaining.shift()
      );
    },
  },
};
</script>

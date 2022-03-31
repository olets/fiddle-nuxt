const fs = require("fs");
const popularTunes = require("../data/popular-tunes-2022-03-30.json");
const allSettings = require("../data/tunes-2022-03-30.json");

let selectedSettings = [];

popularTunes
  .map((t) => t.tune_id)
  .forEach((id) => {
    const settings = allSettings.filter((s) => s.tune_id === id);
    selectedSettings.push(settings[0]);
  });

fs.writeFile("./data/data.json", JSON.stringify(selectedSettings), (err) => {
  if (err) {
    console.error(err);
    throw err;
  }

  console.log("Done.");
});

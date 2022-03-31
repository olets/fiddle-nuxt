import settings from "~~/data/data.json";
// import usedIds from "~~/data/used-ids.json";

// const unusedTunes = settings.filter((t) => !usedIds.includes(t.tune_id));
// const index = Math.floor(Math.random() * settings.unusedTunes);
// const setting = ususedTunes[index];

const index = Math.floor(Math.random() * settings.length);
const data = settings[index]

console.log(data)

export default (_req, _res) => data;

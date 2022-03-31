export function fullAbc(setting) {
  return `
X:${setting.tune_id}
T:${setting.name}
K:${setting.mode}
M:${setting.meter}
L:1/8=120
${setting.abc.replace(/!/g, "\n")}`;
};

export function settingUrl(setting) {
  return `https://thesession.org/tunes/${setting.tune_id}#${setting.setting_id}`
}
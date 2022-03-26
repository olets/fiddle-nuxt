export const abcFromData = (setting, name) => {
  return `
X:${setting.id}
T:${name}
K:${setting.key}
${setting.abc.replace(/!/g, "\n")}`;
};

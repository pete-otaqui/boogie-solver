import glob from "glob";

const files = glob.sync("./src/**/*.test.ts");

files.forEach(file => {
  require(file);
});

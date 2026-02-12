module.exports = function (eleventyConfig) {
  // Copy static assets through to _site
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Dev server port
  eleventyConfig.setServerOptions({ port: 8080 });

  // Nunjucks date filter used by base.njk
  eleventyConfig.addFilter("date", (value, format = "YYYY") => {
    // Accept Date objects, strings, or numbers; fall back safely.
    let d;

    if (value instanceof Date) {
      d = value;
    } else if (typeof value === "string" || typeof value === "number") {
      d = new Date(value);
    } else {
      d = new Date();
    }

    if (Number.isNaN(d.getTime())) {
      d = new Date(); // final fallback
    }

    if (format === "YYYY") return String(d.getFullYear());
    return d.toISOString().slice(0, 10);
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
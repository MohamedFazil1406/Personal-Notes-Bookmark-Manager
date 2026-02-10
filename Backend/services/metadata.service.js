const axios = require("axios");
const cheerio = require("cheerio");

exports.fetchTitle = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $("title").text() || "Untitled";
  } catch (error) {
    return "Untitled";
  }
};

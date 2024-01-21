const fs = require("fs").promises;
const path = require("path");

const cors = require("cors"); // Import the cors middleware
const pathFile = path.join("./assets/songs");
const express = require("express");
const { json } = require("body-parser");
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://param442.github.io/Spotify-clone");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
let files;
const port = 3001;
app.use(cors()); // Enable CORS for all routes
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.get("/", (req, res) => {
  async function readDirectory() {
    try {
      files = await fs.readdir(pathFile);
    } catch (err) {
      console.error(err);
    }
  }

  async function arr() {
    await readDirectory();
  }

  async function main() {
    await arr();
    console.log(files);
    let subFl = [];
    let info = [];
    let musicInfo = [];

    for (const element of files) {
      const fullPath = path.join(pathFile, element);
      try {
        const subFiles = await fs.readdir(fullPath);
        subFl.push({ path: fullPath, files: subFiles });
      } catch (err) {
        console.error(`Error reading ${fullPath}:`, err);
      }
    }

    console.log(subFl);
    let route = [];
    let part = [];
    let list = [];
    for (const key in subFl) {
      if (Object.hasOwnProperty.call(subFl, key)) {
        const element = subFl[key];
        part.push(element.files);
        route.push(element.path);
      }
    }
    console.log(route);

    for (let i = 0; i < part.length; i++) {
      const element = part[i];
      const join = path.join(route[i], element[1]);
      const text = await fs.readFile(join);
      let ans = JSON.parse(text);
      let imagePath = `${path.join(route[i], element[0])}`;

      let html = ` <div class="card">
      <div class="play">
        <img src="./assets/img/play.svg" alt="" />
      </div>
      <img src="${imagePath}" alt="" />
      <h2>${ans.title}</h2>
      <p>${ans.description}</p>
      </div>"`;
      info.push(html);
      let music = await fs.readdir(path.join(route[i], element[2]));
      list.push(music);
      let ans1 = music.map((e) => {
        return path.join(route[i], element[2], e);
      });
      console.log(ans1);
      musicInfo.push(ans1);
    }

    console.log(musicInfo);

    const responseData = {
      info: info,
      musicInfo: musicInfo,
      list: list,
    };

    res.status(200).send(responseData);
  }

  main();
});
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

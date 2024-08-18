const express = require("express");
const app = express();

const port = 3000;
app.use(express.json());

app.get("/user/:user", async (req, res) => {
  const { user } = req.params;
  const result = await fetch(`https://api.github.com/users/${user}/repos`);
  const data = await result.json();
  const languages = {};
  data.forEach((e) => {
    if (e.language) {
      if (languages.hasOwnProperty(e.language)) {
        languages[e.language]++;
      } else {
        languages[e.language] = 1;
      }
    }
  });

  const totalRepos = Object.keys(languages).reduce(
    (acc, curr) => languages[curr] + acc,
    0
  );
  const languagesPercentage = {};
  Object.keys(languages).forEach(
    (e) =>
      (languagesPercentage[e] = ((languages[e] * 100) / totalRepos).toFixed(2))
  );

  let resultStr = [`Total of public repositories(that have a recognizable main language by GitHub): ${totalRepos}.`];

  Object.keys(languagesPercentage)
    .sort((a, b) => languages[b] - languages[a])
    .forEach((e) =>
      resultStr.push(
        `${languagesPercentage[e]}% (${languages[e]}) of repos were made with ${e}.`
      )
    );
  res.json({ message: resultStr });
});

app.listen(port, () => {
  console.log(`Server started and listen on: http://localhost:${port}.`);
});

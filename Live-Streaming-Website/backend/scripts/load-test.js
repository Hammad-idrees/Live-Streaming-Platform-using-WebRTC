const autocannon = require("autocannon");

const url = "http://localhost:5000/api/v1/viewer/live";

autocannon(
  {
    url,
    connections: 50,
    duration: 10,
  },
  (err, result) => {
    if (err) throw err;
    console.log(autocannon.printResult(result));
  }
);

const port = 5000;

import app from "./app";

const main = async () => {
  try {
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("An error occured", error);
    process.exit(1);
  }
};

main();

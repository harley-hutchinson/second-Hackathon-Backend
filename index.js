const fs = require("fs");
const { uuid } = require("uuidv4");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 8600;

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.POST.FRONTEND_URL }));

app.get("/transactions", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

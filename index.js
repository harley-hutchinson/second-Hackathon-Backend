const express = require("express");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 8600;

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

// 1
app.get("/transactions", (req, res) => {
  fs.readFile("./data/data.json", (err, data) => {
    if (err) {
      return res.status(500).json({
        error: true,
        Message: "Could not read your transactions from database",
      });
    }

    const transactions = JSON.parse(data);
    res.json(transactions);
  });
});

// 2
app.post("/transactions", (req, res) => {
  const { title, amount, category, description, isIncome } = req.body;

  const newTransactions = {
    id: uuid(),
    title: title,
    amount: amount,
    category: category,
    description: description,
    isIncome: isIncome,
  };

  fs.readFile("./data/data.json", (err, data) => {
    if (err) {
      return (
        res.status(500),
        json({
          error: true,
          Message: "Could not read your transactions from database",
        })
      );
    }

    const transactions = JSON.parse(data);

    transactions.push(newTransactions);

    fs.writeFile("./data/data.json", JSON.stringify(transactions), (err) => {
      if (err) {
        return res.status(500).json({
          error: true,
          Message: "Could not write your transaction(s) from database",
        });
      }
      res.status(201).json(newTransactions);
    });
  });
});

// 3
app.delete("/transactions/:transactionsID", (req, res) => {
  const transactionsID = req.params.transactionsID;

  fs.readFile("./data/data.json", (err, data) => {
    if (err) {
      return res.status(500).json({
        error: true,
        Message: "Could not delete transaction from database",
      });
    }

    const transactions = JSON.parse(data);

    const transactionIndex = transactions.findIndex((transaction) => transaction.id === transactionsID);

    if (transactionIndex === -1) {
      return res.status(404).json({
        error: true,
        Message: "Transaction not found",
      });
    }

    transactions.splice(transactionIndex, 1);

    fs.writeFile("./data/data.json", JSON.stringify(transactions), (err) => {
      if (err) {
        return res.status(500).json({
          error: true,
          Message: "Could not update deleted transaction from database",
        });
      }
      res.status(204).end();
    });
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

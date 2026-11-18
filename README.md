# Santa's Financial Dashboard

This project is the workbench of Santa's personal financial consultant: a thorough Christmas elf who analyzes Santa's finances instead of wrapping presents. The goal is to build a clear, reliable financial dashboard from the provided transaction data.

The dashboard should help Santa understand his current and historical balances, income, spending, categories, trends, and notable financial risks.

## Repository structure

```text
.
├── data/
│   ├── datensatz.csv
│   └── santa_datensatz.csv
├── index.html
├── script.js
├── styles.css
└── README.md
```

## Dashboard deliverables

The dashboard must include:

- `index.html` as the main dashboard entry point
- `styles.css` containing the dashboard styling
- `script.js` loads and parses the CSV in the browser, then derives the metrics, chart, filters, and transaction table.

These files are required so the human supervisor, Santa's university professor, can inspect and assess the work. Keep both files readable and organized. Any additional JavaScript should be clearly named and documented.

## Dataset

The file [`data/datensatz.csv`](data/datensatz.csv) contains the original transaction records and is unchanged. The companion file [`data/santa_datensatz.csv`](data/santa_datensatz.csv) uses the same columns and contains a full January–December 2024 fictional North Pole ledger (122 rows including its opening balance):

- Santa's main income is represented by North Pole Treasury workshop grants and Christmas advances, with the largest Christmas Magic Fund deposits arriving in November and December. Seasonal advances and Magic Fund receipts are split across multiple dates to make cash flow less concentrated.
- Seasonal spending increases in autumn and peaks in December for toy materials, gift wrapping, elf salary bonuses, reindeer food, sleigh maintenance, and postal delivery.
- Additional irregular fictional receipts and expenses include royalties, museum tickets, recycling credits, repairs, canteen costs, and North Pole event activity. Easter Bunny logistics charges and reimbursements are small fictional Easter eggs.
- The opening balance is `120000.00`; every subsequent balance has been recalculated as the preceding balance plus the transaction amount. The ending balance is `8845.00` after the year-end savings transfer.

These additions and the split seasonal deposits are deliberate synthetic changes for the dashboard exercise, not claims about real transactions. Transaction dates and amounts are explicit in the CSV, and all balances can be reproduced by summing the rows in date order. The source file `data/datensatz.csv` was preserved as provided.

Both datasets use the following columns:

| Column | Description |
| --- | --- |
| `transaction_id` | Unique identifier for the transaction |
| `date` | Transaction date |
| `description` | Description or merchant name |
| `amount` | Transaction amount; income is positive and spending is negative |
| `category` | Transaction category, such as `income`, `food`, or `transport` |
| `balance` | Account balance after the transaction |

## Quick start

Because the browser blocks `fetch()` for local files, serve the folder with any simple static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Load the dataset with Python and pandas:

```python
import pandas as pd

transactions = pd.read_csv("data/santa_datensatz.csv", parse_dates=["date"])
print(transactions.head())
```

## Notes

- The CSV uses commas as separators.
- Monetary values use decimal notation with two decimal places.
- The dataset includes an initial balance record whose transaction amount and category are empty.
- Financial values should be calculated from the dataset rather than invented.
- Any assumptions or data transformations should be documented.
- Dashboard figures should be checked against the source data before review.

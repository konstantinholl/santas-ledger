# Santa's Financial Dashboard

This project is a fictional financial dashboard for Santa. It presents account balance history, income, spending, spending categories, and the transaction ledger for the 2024 calendar year.

## Publication contents

Publish **only the contents of the `publication/` directory**. That self-contained folder includes the website, its stylesheet and JavaScript, this dataset documentation, and the fictional ledger. The project root also contains coursework source material that is intentionally excluded from the publication package.

## Dataset

`publication/data/santa_datensatz.csv` is a generated, fictional North Pole ledger. It contains 122 records, including one opening balance record, dated from 1 January through 31 December 2024. Its columns are:

| Column | Description |
| --- | --- |
| `transaction_id` | Unique transaction identifier |
| `date` | Transaction date |
| `description` | Fictional transaction description |
| `amount` | Amount in euros; income is positive and spending is negative |
| `category` | Transaction category |
| `balance` | Account balance after the transaction |

The opening balance is €120,000.00. It has no amount or category. For each later row, the balance equals the prior balance plus the transaction amount; the closing balance is €8,845.00. The dashboard calculates income and spending from rows with an amount, so the opening balance is excluded from transaction totals. No real account or transaction information is used in the publication dataset.

## Website and operation

The dashboard is a static HTML, CSS, and JavaScript site. It has no backend, account, or login. A static web host can serve the `publication/` directory directly. For local review, run:

```bash
cd publication
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Use a web server because browsers generally block the dashboard's CSV `fetch()` when opening `index.html` directly as a local file. The site uses system fonts and makes no third-party font requests.

## AI notice and publication notes

The Santa transaction data is fictional and AI-generated for this project. AI also assisted with the website's creation. Dashboard figures are derived from the included CSV; no real financial values are represented. This is a temporary university project, not a permanent commercial service. No Impressum is included, in line with the course instruction.

## Files

```text
publication/
├── data/santa_datensatz.csv
├── index.html
├── script.js
├── styles.css
└── README.md
```

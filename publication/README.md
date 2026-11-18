# Santa's Financial Dashboard

This is a temporary university project: a fictional financial dashboard for Santa, showing account balance history, income, spending, spending categories, and the 2024 transaction ledger.

## Dataset

`data/santa_datensatz.csv` is a generated, fictional North Pole ledger. It contains 122 records, including one opening balance record, from 1 January through 31 December 2024. Its columns are `transaction_id` (unique identifier), `date`, `description`, `amount` (euros; income positive and spending negative), `category`, and `balance` (after each transaction).

The opening balance is €120,000.00 and has no amount or category. Each subsequent balance equals the prior balance plus the transaction amount. The closing balance is €8,845.00. The dashboard excludes the opening balance from income and spending totals. No real account or transaction information is used in this dataset.

## Website and operation

This is a static HTML, CSS, and JavaScript website with no backend, account, or login. A static web host can serve this folder directly. To review it locally, run this command from this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. A web server is needed because browsers generally block the dashboard's CSV `fetch()` when `index.html` is opened directly as a local file. The site uses system fonts and does not request fonts from third-party servers.

## AI notice

The transaction data is fictional and AI-generated for this project. AI also assisted with the website's creation. Dashboard figures are calculated from the included CSV; no real financial values are represented.

This temporary university project has no Impressum, in line with the course instruction.

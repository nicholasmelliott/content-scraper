# Shirts4Mike Scraper

This is a Node.js scraper script that retrieves data from the Shirts4Mike website. It collects information about different shirts available on the website, such as the title, price, image URL, and the URL of each shirt.

## Installation

1. Clone or download the repository to your local machine.
2. Open the terminal or command prompt and navigate to the project directory.
3. Run the following command to install the required dependencies:

   ```
   npm install
   ```

## Usage

To start the scraper, run the following command in the terminal or command prompt:

```
node scraper.js
```

The scraper will retrieve the shirt data from the Shirts4Mike website and store it in CSV files inside the `data` directory. Each CSV file will be named with the current date in the format `YYYY-MM-DD.csv`.

The scraper will run once initially and then run again every 24 hours to update the data.

## Troubleshooting

If an error occurs during the scraping process, it will be logged in the `data/scraper-error.log` file.

If you encounter any issues or need further assistance, please create an issue in the repository's issue tracker.

## Dependencies

The scraper script relies on the following npm packages:

- `request`: For making HTTP requests to retrieve web page content.
- `cheerio`: For parsing and manipulating HTML content.
- `json2csv`: For converting JSON data to CSV format.
- `fs`: For interacting with the file system.
- `http`: For creating an HTTP server.

These dependencies will be installed automatically when running `npm install`.

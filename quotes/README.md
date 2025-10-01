# Quotes datasets

This folder contains two datasets:

- quotes.json: curated “golden sentences” (10,246 entries expected in full dataset)
- masters.json: sayings by notable figures (>1,000 entries in full dataset)

Schemas:
- JSON: array of objects with fields: id, author, text, tags[]
- SQL: MySQL-compatible schema with indexes on author and tags

Note: The repository ships with small samples for development. Replace with your licensed/full datasets as needed.



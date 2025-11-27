.PHONY: format check help

help:
	@echo "Usage:"
	@echo "  make format  - Format all HTML, CSS, and JS files"
	@echo "  make check   - Check formatting without making changes"

format:
	@echo "Formatting files..."
	npx prettier --write .
	@echo "Done!"

check:
	@echo "Checking formatting..."
	npx prettier --check .

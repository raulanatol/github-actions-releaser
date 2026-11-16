.DEFAULT_GOAL := check

start:
	@echo "🏃‍♀️ Starting project"
	npm install

init:
	@echo "Initialising the project"
	@npm install

test:
	@echo "Testing..."
	npm test

build:
	@echo "👩‍🏭 Building..."
	@npm run build

check: --pre_check test build
	@echo "✅"

clean:
	@echo "🛁 Cleaning..."
	@npm run clean

clean_all: clean
	@echo "🧨 Clean all"
	@rm -Rf node_modules package-lock.json

release_patch: release

release_minor: check
	@.scripts/finish-release minor

release_major: check
	@.scripts/finish-release major

release: check
	@.scripts/finish-release patch

# Install first: `clean` runs shx, which only exists once node_modules is in place.
--pre_check:
	@npm install
	@npm run clean
	@npm run lint
	@npm run type-check

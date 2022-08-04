.PHONY: all
all: install audit build

.PHONY: install
install:
	npm install --no-audit

.PHONY: build
build:
	npm run build

.PHONY: update
update:
	npm update

.PHONY: audit
audit:
	npm audit --omit=dev

.PHONY: run
run:
	npm start

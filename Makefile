install:
	npm ci

publish:
	npm publish --dry-run	

lint:
	npx eslint .

watch:
	npx nodemon src/index.js

test:
	NODE_OPTIONS=--experimental-vm-modules npx jest

test-coverage:
	npm test -- --coverage --coverageProvider=v8
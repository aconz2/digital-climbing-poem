c="./node_modules/.bin/component"

build: components index.js
	@$c build --dev

components: component.json
	@$c install --dev

clean:
	rm -fr build components

.PHONY: clean

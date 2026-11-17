.PHONY: run migrate test check

run:
	go run ./cmd/server

migrate:
	go run ./cmd/migrate

test:
	go test -race ./...

check:
	go vet ./...
	go test -race ./...

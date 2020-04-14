FILE=tmp/cc-test-reporter
if [ ! -f "$FILE" ]; then
    mkdir -p tmp/
    curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./tmp/cc-test-reporter
    chmod +x ./tmp/cc-test-reporter
fi
#!/bin/bash

# Get the GitHub tag of the latest release
WEAVIATE_RELEASE_VERSION=$(curl -s https://api.github.com/repos/semi-technologies/weaviate/releases/latest | jq -r '.tag_name')
echo "Weaviate release: $WEAVIATE_RELEASE_VERSION"

echo "Download the Weaviate configuration file"
curl -sO https://raw.githubusercontent.com/semi-technologies/weaviate/$WEAVIATE_RELEASE_VERSION/docker-compose/runtime/en/config.yaml
echo "Download the Weaviate docker-compose file"
curl -sO https://raw.githubusercontent.com/semi-technologies/weaviate/$WEAVIATE_RELEASE_VERSION/docker-compose/runtime/en/docker-compose.yml
echo "Stop existing session if running"
docker-compose down

echo "Run Docker compose"
docker-compose up -d

echo "Wait until weaviate is up"

# pulling all images usually takes < 3 min
# starting weaviate usuall takes < 2 min
i="0"
curl localhost:8080/v1/meta >/dev/null 2>&1
while [ $? -ne 0 ]; do
  i=$[$i+5]
  echo "Sleep $i"
  sleep 5
  if [ $i -gt 300 ]; then
    echo "Weaviate did not start in time"
    docker-compose logs
    exit 1
  fi
  curl localhost:8080/v1/meta >/dev/null 2>&1
done
echo "Weaviate is up and running"

# React-IMS-Production
IMS Production


# Installation instructions 


## 1) MySQL installation

docker run -d --name mysql_server -e MYSQL_DATABASE='ims' -e MYSQL_USER='ims' -e MYSQL_PASSWORD='<REDACTED>' -e MYSQL_ROOT_PASSWORD='<REDACTED>' -v $HOME/mysql-data:/var/lib/mysql --network node-api-network mysql:8.0

Place MySQL DB backup into user's home directory, run the following command to stream the creation commands to MySQL:
```sudo sh -c 'cat DB_bu.sql | docker exec -i mysql_server /usr/bin/mysql -u root --password=secret ims' ```

  
```docker -ps``` (check if running)
  
## 2) Elasticsearch installation
  
```docker network create elastic```
  
```docker run -d --name "elasticsearch" --network "elastic" --publish "9200:9200"  --volume "es-data:/usr/share/elasticsearch/data:rw"  --volume "es-config:/usr/share/elasticsearch/config:rw" --env "discovery.type=single-node" --tty --rm "docker.elastic.co/elasticsearch/elasticsearch:8.0.0"```
 
docker ps (get Elastic container ID)
docker inspect CONTAINER_ID | grep "IPAddress" (make a note of Elasticsearch IP address for later use)


## 3) Kibana installation
   
```docker run --name "kibana" --network "elastic" --publish "5601:5601" --interactive --tty --env "ENTERPRISESEARCH_HOST=http://enterprise-search:3002" "docker.elastic.co/kibana/kibana:8.0.0" ```
  
Follow installation logs and make note of the encryption ID.

## 4) Enterprise-search installation
```docker run --name "enterprise-search" --network "elastic" --publish "3002:3002" --volume "es-config:/usr/share/enterprise-search/es-config:ro" --interactive --tty --rm --env "secret_management.encryption_keys=['<INSERT ENC KEY>']" --env "allow_es_settings_modification=true" --env "elasticsearch.host=https://<ADD ES HOST ADDR>:9200" --env "elasticsearch.username=elastic" --env "elasticsearch.password=<ADD INITIAL PWD>" --env "elasticsearch.ssl.enabled=true" --env "elasticsearch.ssl.certificate_authority=/usr/share/enterprise-search/es-config/certs/http_ca.crt" --env "kibana.external_url=http://kibana:5601" "docker.elastic.co/enterprise-search/enterprise-search:8.0.0"```

  
  All instances should be set up with local volume mapping. When closing, they can simply be started using:
  ```docker run CONTAINER_NAME```
  
  Create search engine:
  http://HOST_URL:3002/
  Enterprise Search -> Search Engines -> Create Search Engine
  Store public API key (for search)
  

## 5 App installation
  
  docker run -p 3000:3000 -e github='https://github.com/krlwshu/react-ims-production.git' -it karlwshu/react-ims-production
  Update API key in config/engine.config

  
## Data set-up:
  ### Create search engine instance
```curl -X POST '<ENTERPRISE_SEARCH_BASE_URL>/api/as/v1/engines' \
   -H 'Content-Type: application/json' \
   -H 'Authorization: Bearer private-xxxxxxxxxxxxxxxxxxxx' \
   -d '{"name": "-ims-search-engine"}' ```
  
  ### Syncronise data (one-time activity):
  ``` curl -X POST '<Express Server IP>:5000/searchSync' \
-H 'Content-Type: application/json' \
-H 'x-access-token: <JWT Token>' \
-d '{
  "name": "-ims-search-engine"
}' ```
**Note:** JWT can be can be retrieved from an authenticated session. Dev tools > Application > Session Storage (Copy and pasted JWT token above)
  
  
# Known issues:
  
  After stopping the containers, sometimes services become unreachable when restarted. If so perform the followin restart process:
  
  - sudo systemctl restart docker
  - docker run elasticsearch
  - docker run kibana
  - docker run enterprise-search
  (Depending on your sudoers configuration or Linux distro, you may need to prefix the above commands with **sudo**)

  ## Resources:
  https://www.elastic.co/guide/en/app-search/current/engines.html

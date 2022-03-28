# React-IMS-Production
IMS Production


# Installation instructions 


## 1) MySQL installation

docker run -d --name mysql_server -e MYSQL_DATABASE='ims' -e MYSQL_USER='ims' -e MYSQL_PASSWORD='<REDACTED>' -e MYSQL_ROOT_PASSWORD='<REDACTED>' -v $HOME/mysql-data:/var/lib/mysql --network node-api-network mysql:8.0

docker -ps (check if running)
  
## 2) Elasticsearch installation
  
docker network create elastic
  
docker run -d --name "elasticsearch" --network "elastic" --publish "9200:9200"  --volume "es-data:/usr/share/elasticsearch/data:rw"  --volume "es-config:/usr/share/elasticsearch/config:rw" --env "discovery.type=single-node" --tty --rm "docker.elastic.co/elasticsearch/elasticsearch:8.0.0"![image](https://user-images.githubusercontent.com/93937576/160456978-612ca707-1cd2-497f-b70b-7ca0c24de298.png)


## 3) Kibana installation
  
docker run --name "kibana" --network "elastic" --publish "5601:5601" --interactive --tty --env "ENTERPRISESEARCH_HOST=http://enterprise-search:3002" "docker.elastic.co/kibana/kibana:8.0.0"![image](https://user-images.githubusercontent.com/93937576/160456717-65801e5b-5c78-40ba-8815-a9ffc636426b.png)

  
docker run --name "enterprise-search" --network "elastic" --publish "3002:3002" --volume "es-config:/usr/share/enterprise-search/es-config:ro" --interactive --tty --rm --env "secret_management.encryption_keys=['66ad614b43fa3e27222b03e258f4719af0c77dbad7359b042dce53dd0fabd0cc']" --env "allow_es_settings_modification=true" --env "elasticsearch.host=https://172.22.0.3:9200" --env "elasticsearch.username=elastic" --env "elasticsearch.password=Karl1234" --env "elasticsearch.ssl.enabled=true" --env "elasticsearch.ssl.certificate_authority=/usr/share/enterprise-search/es-config/certs/http_ca.crt" --env "kibana.external_url=http://kibana:5601" "docker.elastic.co/enterprise-search/enterprise-search:8.0.0"

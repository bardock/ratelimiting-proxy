nginx setup
===========

1. Install OpenResty: http://openresty.org/en/linux-packages.html
	1. http://openresty.org/en/getting-started.html
	1. Redis client: https://github.com/openresty/lua-resty-redis
1. Configure redis host into `config.lua`
1. Start server: 
	1. mkdir logs
	1. openresty -p `pwd`/ -c nginx.conf
1. Start mock-server: 
	1. mkdir logs/mock-server
	1. openresty -p `pwd`/ -c mock-server.conf
1. Test: 
	* curl http://localhost:8080/debug
	* curl http://localhost:8080/debug/redis
	* curl http://localhost:8080/debug/bans
	* curl http://localhost:8080/any/proxied/path
1. Stop servers: 
	1. openresty -p `pwd`/ -c conf/nginx.conf -s stop
	1. openresty -p `pwd`/ -c conf/mock-server.conf -s stop
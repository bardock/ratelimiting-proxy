nginx setup
===========

1. Install OpenResty: http://openresty.org/en/linux-packages.html
	1. http://openresty.org/en/getting-started.html
	1. Redis client: https://github.com/openresty/lua-resty-redis
1. Configure redis host into nginx.config
1. Start server: openresty -p `pwd`/ -c nginx.conf
1. curl http://localhost:8080
1. Stop server: openresty -p `pwd`/ -c conf/nginx.conf -s stop


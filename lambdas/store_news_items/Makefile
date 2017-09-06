
PROJECT = src
VIRTUAL_ENV = venv
FUNCTION_NAME = store_news_items
AWS_REGION = us-east-1
FUNCTION_HANDLER = lambda_handler
LAMBDA_ROLE = arn:aws:iam::641007673464:role/service-role/stock-news-classifier-lambda-with-s3

# Default commands
build: clean_package build_package_tmp copy_python remove_unused zip

deploy: deploy_package clean_package


deploy_package:
	aws lambda update-function-code --zip-file=fileb://package/$(PROJECT).zip --function-name $(FUNCTION_NAME)

clean_package:
	rm -rf ./package/*

build_package_tmp:
	mkdir -p ./package/tmp
	cp -a ./$(PROJECT)/. ./package/tmp/

copy_python:
	if test -d $(VIRTUAL_ENV)/lib; then \
		cp -a $(VIRTUAL_ENV)/lib/python3.5/site-packages/. ./package/tmp/; \
	fi
	if test -d $(VIRTUAL_ENV)/lib64; then \
		cp -a $(VIRTUAL_ENV)/lib64/python3.5/site-packages/. ./package/tmp/; \
	fi

remove_unused:
	rm -rf ./package/tmp/wheel*
	rm -rf ./package/tmp/easy-install*
	rm -rf ./package/tmp/setuptools*

zip:
	cd ./package/tmp && zip -r ../$(PROJECT).zip .

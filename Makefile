PROJECT = src
VIRTUAL_ENV = venv
FUNCTION_NAME = $(shell basename $(CURDIR))

init_lambda: copy_lambda_skeleton new_virtual_env


copy_lambda_skeleton:
	echo "Creating new local lambda: $(NAME)"
	cp -r lambdas/lambda_skeleton $(NAME)
	rm -rf lambdas/$(NAME)/venv
	rm -rf lambdas/$(NAME)/package

new_virtual_env:
	echo "Creating new virtual env"
	cd lambdas/$(NAME)
	pyton3 -m venv venv
	cd ../../

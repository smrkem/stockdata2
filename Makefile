init_lambda: copy_lambda_skeleton new_virtual_env

copy_lambda_skeleton:
	echo "Creating new local lambda: $(NAME)"
	cp -r lambdas/lambda_skeleton lambdas/$(NAME)

new_virtual_env:
	echo "Creating new virtual env"
	cd lambdas/$(NAME) && python3 -m venv venv

.PHONY: clean synth deploy cfn

clean:
	rm -rf cdk.out

synth:
	cdk synth

deploy:
	cdk deploy --require-approval never --method direct


cfn:
	aws cloudformation deploy --template-file setup.yml --stack-name "FinlandSkiMapSetup" --capabilities "CAPABILITY_NAMED_IAM" --region=eu-west-1

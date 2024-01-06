package main

import (
	"strings"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awscertificatemanager"
	"github.com/aws/aws-cdk-go/awscdk/v2/awscloudfront"
	"github.com/aws/aws-cdk-go/awscdk/v2/awscloudfrontorigins"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsroute53"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsroute53targets"
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3"
	"github.com/aws/jsii-runtime-go"
)

func setupCloudFront(stack awscdk.Stack) {

	bucket := awss3.NewBucket(stack, jsii.String("Bucket"), &awss3.BucketProps{})

	hostedZone := awsroute53.HostedZone_FromLookup(stack, jsii.String("HostedZone"), &awsroute53.HostedZoneProviderProps{DomainName: jsii.String("ockenden.io")})

	originAccessIdentity := awscloudfront.NewOriginAccessIdentity(stack, jsii.String("MyOriginAccessIdentity"), nil)
	s3Origin := awscloudfrontorigins.NewS3Origin(bucket, &awscloudfrontorigins.S3OriginProps{OriginAccessIdentity: originAccessIdentity})
	noCacheBehaviour := awscloudfront.BehaviorOptions{
		Origin:               s3Origin,
		Compress:             jsii.Bool(true),
		ViewerProtocolPolicy: awscloudfront.ViewerProtocolPolicy_REDIRECT_TO_HTTPS,
		CachedMethods:        awscloudfront.CachedMethods_CACHE_GET_HEAD(),
		CachePolicy:          awscloudfront.CachePolicy_CACHING_DISABLED(),
	}

	domainNames := []string{
		"skimap.ockenden.io",
	}

	certArn := "arn:aws:acm:us-east-1:574363388371:certificate/36dc1386-d9a8-45e5-af25-cf9c6285122e"

	cfDist := awscloudfront.NewDistribution(stack, jsii.String("CFDistribution"), &awscloudfront.DistributionProps{
		DefaultBehavior: &awscloudfront.BehaviorOptions{
			Origin:               s3Origin,
			Compress:             jsii.Bool(true),
			ViewerProtocolPolicy: awscloudfront.ViewerProtocolPolicy_REDIRECT_TO_HTTPS,
			AllowedMethods:       awscloudfront.AllowedMethods_ALLOW_GET_HEAD(),
			CachedMethods:        awscloudfront.CachedMethods_CACHE_GET_HEAD(),
			CachePolicy:          awscloudfront.CachePolicy_CACHING_OPTIMIZED(),
		},
		AdditionalBehaviors: &map[string]*awscloudfront.BehaviorOptions{
			"live.json":  &noCacheBehaviour,
			"index.html": &noCacheBehaviour,
		},
		PriceClass:  awscloudfront.PriceClass_PRICE_CLASS_100,
		HttpVersion: awscloudfront.HttpVersion_HTTP2_AND_3,
		DomainNames: func() *[]*string {
			a := []*string{}
			for _, name := range domainNames {
				a = append(a, &name)
			}
			return &a
		}(),
		Certificate:       awscertificatemanager.Certificate_FromCertificateArn(stack, jsii.String("Certificate"), &certArn),
		DefaultRootObject: jsii.String("index.html"),
	})

	for _, name := range domainNames {
		recordId := "ARecord-" + strings.Split(name, ".")[0]
		awsroute53.NewARecord(stack, &recordId, &awsroute53.ARecordProps{
			Target:     awsroute53.RecordTarget_FromAlias(awsroute53targets.NewCloudFrontTarget(cfDist)),
			Zone:       hostedZone,
			RecordName: jsii.String(name + "."),
		})
	}
	cfDist.DomainName()

}

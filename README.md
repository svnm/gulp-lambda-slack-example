# lambda-pageViews
an example of using aws-lambda slack and gulp to deploy simple node.js functions

## usage

install the dependencies

```sh
$ `npm install`
```

copy the lambda.example to lambda.js config

```sh
$ `cp lambda.example.js lambda.js`
```

update `lambda.js` with your aws accessKeyId, secretAccessKey and your iam role

Note: To get your iam role, jump in to IAM in aws, go to roles and copy the string for the role you need. It will be something like `arn:aws:iam::333999:role/simpleFunction`
You can create a default lambda function in the aws console first to set up a default role, or assign any role you have created.

## deploy

$ `npm install gulp -g` if you don't have gulp installed

$ `gulp deploy`

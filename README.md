# AWS Automation Recipes

## Create a Service Role

* Create a json file that will allow CodeDeploy to work on your behalf.
* In the command's output, copy the value of the Arn entry under the Role object.


```bash
aws iam create-role --role-name CodeDeployServiceRole --assume-role-policy-document file://codedeploy/codedeploytrust.json

```
Output ...
Note: The XXXXX in the arn would be your AWS account number
```json
{
    "Role": {
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "sts:AssumeRole",
                    "Principal": {
                        "Service": [
                            "codedeploy.us-east-2.amazonaws.com",
                            "codedeploy.us-east-1.amazonaws.com",
                            "codedeploy.us-west-1.amazonaws.com",
                            "codedeploy.us-west-2.amazonaws.com"
                        ]
                    },
                    "Effect": "Allow",
                    "Sid": ""
                }
            ]
        },
        "RoleId": "AROAI2TLU6VACVU6RM5UM",
        "CreateDate": "2017-05-21T01:36:28.938Z",
        "RoleName": "CodeDeployServiceRole",
        "Path": "/",
        "Arn": "arn:aws:iam::XXXXXXXXX:role/CodeDeployServiceRole"
    }
}
```

* Call the attach role with 
```bash

aws iam attach-role-policy --role-name CodeDeployServiceRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole


```

* Check to ensure role exists 

```bash
aws iam get-role --role-name CodeDeployServiceRole --query "Role.Arn" --output text
arn:aws:iam::XXXXXXXXX:role/CodeDeployServiceRole
```



##Tips

######AWS CLI Autocomplete tools


[saws](https://github.com/donnemartin/saws)

[command completer](http://docs.aws.amazon.com/cli/latest/userguide/cli-command-completion.html)


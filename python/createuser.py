import boto
import json
import boto3
#Connect with IAM with boto

iam = boto.connect_iam()


# create user

user_response = iam.create_user('dtest-devon44')

key_response = iam.create_access_key('dtest-devon44')

json_str = json.dumps(key_response)

resp = json.loads(json_str)
print(key_response)

print(resp)
print(resp['create_access_key_response']['secret_access_key'])

export type AmplifyDependentResourcesAttributes = {
    "storage": {
        "360s3": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "api": {
        "index": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    },
    "function": {
        "indexLambda": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    }
}
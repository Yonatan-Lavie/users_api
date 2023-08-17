import * as lambda from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 layer we've written
    const businessLogicLayer = new lambda.LayerVersion(this, 'business-logic-layer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_14_X,
        lambda.Runtime.NODEJS_16_X,
      ],
      code: lambda.Code.fromAsset('src/layers/business-logic'),
      description: 'business-logic will contains database modules etc..',
    });

    // 👇 3rd party library layer
    const sharedLibrariesLayer = new lambda.LayerVersion(this, 'shared-libraries-layer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_14_X,
        lambda.Runtime.NODEJS_16_X,
      ],
      code: lambda.Code.fromAsset('src/layers/shared-libraries'),
      description: 'Uses a 3rd party libraries for shareing among lambdas functions',
    });

    // 👇 Lambda function
    new NodejsFunction(this, 'my-function', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      entry: path.join(__dirname, `/../src/my-lambda/index.ts`),
      bundling: {
        minify: false,
        // 👇 don't bundle `yup` layer
        // layers are already available in the lambda env
        externalModules: ['aws-sdk'],
      },
      layers: [businessLogicLayer, sharedLibrariesLayer],
    });
  }
}
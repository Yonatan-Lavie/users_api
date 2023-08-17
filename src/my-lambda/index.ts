import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
/* eslint-disable import/extensions, import/no-absolute-path */
import { getUUID } from '/opt/nodejs/business-logic';
/* eslint-disable import/extensions, import/no-absolute-path */
import {mongoose, axios} from '/opt/nodejs/shared-libraries';



export async function main(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  console.log(event);
  const uuid_num = getUUID()

  return {
    // 👇 using calc layer
    body: JSON.stringify({uuid_num: uuid_num}),
    statusCode: 200,
  };
}
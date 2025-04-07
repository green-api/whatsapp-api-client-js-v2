[**GREEN-API WhatsApp SDK v2 v1.0.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / GreenApiPartnerClient

# Class: GreenApiPartnerClient

Defined in: [client/green-api-partner-client.ts:25](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-partner-client.ts#L25)

Client for partner-specific operations with GREEN-API.
Provides methods for managing instances as a GREEN-API partner.

## Example

```typescript
const partnerClient = new GreenApiPartnerClient({
  partnerToken: "your-partner-token",
  partnerApiUrl: "https://api.green-api.com" // Optional, defaults to this URL
});

const instances = await partnerClient.getInstances();
```

## Constructors

### Constructor

> **new GreenApiPartnerClient**(`credentials`): `GreenApiPartnerClient`

Defined in: [client/green-api-partner-client.ts:35](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-partner-client.ts#L35)

Creates a new GREEN-API partner client instance.

#### Parameters

##### credentials

[`PartnerCredentials`](../interfaces/PartnerCredentials.md)

Partner credentials containing partnerToken and optional partnerApiUrl

#### Returns

`GreenApiPartnerClient`

## Methods

### createInstance()

> **createInstance**(`params`): `Promise`\<[`CreateInstanceResponse`](../interfaces/CreateInstanceResponse.md)\>

Defined in: [client/green-api-partner-client.ts:103](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-partner-client.ts#L103)

Creates a new messenger account instance as a partner.
After creation, the instance must be authorized by scanning a QR code.

#### Parameters

##### params

[`CreateInstanceParams`](../interfaces/CreateInstanceParams.md)

Instance creation parameters including name and webhook settings

#### Returns

`Promise`\<[`CreateInstanceResponse`](../interfaces/CreateInstanceResponse.md)\>

Promise resolving to the created instance details

#### Example

```typescript
const instance = await partnerClient.createInstance({
  name: "Marketing Campaign",
  webhookUrl: "https://example.com/webhooks/green-api",
  delaySendMessagesMilliseconds: 3000,
  incomingWebhook: "yes",
  outgoingWebhook: "yes"
});

console.log(`Created instance ID: ${instance.idInstance}`);
console.log(`API Token: ${instance.apiTokenInstance}`);
```

***

### deleteInstanceAccount()

> **deleteInstanceAccount**(`params`): `Promise`\<[`DeleteInstanceAccountResponse`](../interfaces/DeleteInstanceAccountResponse.md)\>

Defined in: [client/green-api-partner-client.ts:145](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-partner-client.ts#L145)

Deletes a messenger account instance created by the partner.

#### Parameters

##### params

[`DeleteInstanceAccountParams`](../interfaces/DeleteInstanceAccountParams.md)

Parameters containing the ID of the instance to delete

#### Returns

`Promise`\<[`DeleteInstanceAccountResponse`](../interfaces/DeleteInstanceAccountResponse.md)\>

Promise resolving to deletion status

#### Example

```typescript
const result = await partnerClient.deleteInstanceAccount({
  idInstance: 1101000000
});

if (result.deleteInstanceAccount) {
  console.log("Instance successfully deleted");
}
```

***

### getInstances()

> **getInstances**(): `Promise`\<[`PartnerInstance`](../interfaces/PartnerInstance.md)[]\>

Defined in: [client/green-api-partner-client.ts:61](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-partner-client.ts#L61)

Gets all account instances created by the partner.
Returns both active and deleted instances (deleted instances shown for the last 3 months).
Instance status can be determined by the 'deleted' field in the response.

#### Returns

`Promise`\<[`PartnerInstance`](../interfaces/PartnerInstance.md)[]\>

Promise resolving to an array of instance objects

#### Example

```typescript
const instances = await partnerClient.getInstances();

// Get only active instances
const activeInstances = instances.filter(instance => !instance.deleted);

console.log(`Total instances: ${instances.length}`);
console.log(`Active instances: ${activeInstances.length}`);
```

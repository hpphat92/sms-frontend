declare let apiGateway: any;
declare let uritemplate: any;

export class ApiClient {
  public client: any;
  public pathComponent: string;
  public config: any;
  public authType: any;

  constructor(config?) {
    this.config = config;
    if (!this.config) {
      this.config = {
        accessKey: '',
        secretKey: '',
        sessionToken: '',
        region: '',
        apiKey: undefined,
        defaultContentType: 'application/json',
        defaultAcceptType: 'application/json'
      };
    }
    if (this.config.accessKey === undefined) {
      this.config.accessKey = '';
    }
    if (this.config.secretKey === undefined) {
      this.config.secretKey = '';
    }
    if (this.config.apiKey === undefined) {
      this.config.apiKey = '';
    }
    if (this.config.sessionToken === undefined) {
      this.config.sessionToken = '';
    }
    if (this.config.region === undefined) {
      this.config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if (this.config.defaultContentType === undefined) {
      this.config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if (this.config.defaultAcceptType === undefined) {
      this.config.defaultAcceptType = 'application/json';
    }


    // extract endpoint and path from url
    let invokeUrl = VARS.API_DOMAIN;
    let endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    this.pathComponent = invokeUrl.substring(endpoint.length);

    let sigV4ClientConfig = {
      accessKey: this.config.accessKey,
      secretKey: this.config.secretKey,
      sessionToken: this.config.sessionToken,
      serviceName: 'execute-api',
      region: this.config.region,
      endpoint: endpoint,
      defaultContentType: this.config.defaultContentType,
      defaultAcceptType: this.config.defaultAcceptType
    };

    let authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
      authType = 'AWS_IAM';
    }

    let simpleHttpClientConfig = {
      endpoint: endpoint,
      defaultContentType: this.config.defaultContentType,
      defaultAcceptType: this.config.defaultAcceptType
    };

    this.client = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);
  }

  makeRequest(requestOptions, additionalParams?) {
    if (additionalParams) {
      additionalParams = {headers: {"Authorization": "Bearer " + localStorage.getItem('id_token')}};
    } else {
      Object.assign(additionalParams, {headers: {"Authorization": "Bearer " + localStorage.removeItem('id_token')}});
    }

    // apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

    // let requestOptions = {
    //   verb: 'options'.toUpperCase(),
    //   path: this.pathComponent + uritemplate(path).expand(apiGateway.core.utils.parseParametersToObject(params, [])),
    //   headers: apiGateway.core.utils.parseParametersToObject(params, []),
    //   queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
    //   body
    // };

    return this.client.makeRequest(requestOptions, this.authType, additionalParams, this.config.apiKey);
  }

  get(requestOptions, additionalParams?) {
    requestOptions.verb = 'GET';
    return this.makeRequest(requestOptions, additionalParams);
  }

  post(requestOptions, additionalParams?) {
    requestOptions.verb = 'POST';
    return this.makeRequest(requestOptions, additionalParams);
  }

  delete(requestOptions, additionalParams?) {
    requestOptions.verb = 'DELETE';
    return this.makeRequest(requestOptions, additionalParams);
  }

  patch(requestOptions, additionalParams?) {
    requestOptions.verb = 'PATCH';
    return this.makeRequest(requestOptions, additionalParams);
  }
}

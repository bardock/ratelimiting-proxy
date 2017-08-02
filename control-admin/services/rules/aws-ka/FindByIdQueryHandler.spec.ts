import config from '../../../config';
import client from './client';
import { IRule, IRuleConfig, RuleStatus, TimeUnit } from '../../../models/rule';
import { FindByIdQueryHandler } from './FindByIdQueryHandler';
import { DescribeApplicationResponse, DescribeApplicationRequest, ApplicationDetail } from "aws-sdk/clients/kinesisanalytics";

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

var sut: FindByIdQueryHandler;
var sandbox = sinon.sandbox.create();

beforeEach(function() {
  sut = new FindByIdQueryHandler();
});

afterEach(function() {
  sandbox.restore();
});

describe('FindByIdQueryHandler', function() {

  describe('handle()', function() {

    it('should return a valid IRule for existing app id', async function() {

      const fixture = createValidFixture();
      const stub = mockAws_describeApplication({
        arg: { ApplicationName: fixture.appDetail.ApplicationName },
        returns: { ApplicationDetail: fixture.appDetail }
      });
      
      const actual = await sut.handle({id: fixture.id});

      stub.should.have.been.calledOnce;
      actual.should.be.deep.equal(<IRule>{
        id: fixture.id,
        status: fixture.appDetail.ApplicationStatus,
        config: JSON.parse(fixture.appDetail.ApplicationDescription),
        metadata: {awsKa: fixture.appDetail }
      });

    });

  });

  function createValidFixture() {
    const id = "123";
    return {
      id: id,
      appDetail: {
        ApplicationName: `${config.proxyName}-ratelimitingproxy-${id}`,
        ApplicationStatus: RuleStatus.STARTING,
        ApplicationDescription: JSON.stringify(<IRuleConfig>{ 
          criterias: { "ip": "*" }, 
          requestsLimit: 1, 
          windowTimeSize: 1, 
          windowTimeUnit: TimeUnit.MINUTE 
        }),
        ApplicationVersionId: 1
      }
    };
  }

  /**
   * @returns an stubbed aws-sdk Response with a promise that resolves to specified value
   */
  function awsResponse(value) {
    return { promise: sandbox.stub().resolves(value) };
  }

  function mockAws_describeApplication(setup: {
    arg: DescribeApplicationRequest;
    returns: any;
  }) {
    return sandbox
      .stub(client, "describeApplication")
      .withArgs(setup.arg)
      .returns(awsResponse(setup.returns));
  }
});
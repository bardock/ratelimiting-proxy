import { CreateCommand } from "./CreateCommand";
import { IRuleConfig, TimeUnit } from '../../models/rule';

import * as faker from 'faker';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

var sandbox = sinon.sandbox.create();

beforeEach(function() {
});

afterEach(function() {
  sandbox.restore();
});

describe('CreateCommand', function() {

  describe('ctor()', function() {

    it('should succed for valid arguments', async function() {

      const ruleConfig = createValidFixture();
      
      const actual = new CreateCommand(ruleConfig);

      actual.should.be.deep.include({
        config: ruleConfig,
        configJson: JSON.stringify(ruleConfig)
      });
      actual.id.should.be.an('string').that.is.not.empty;
    });

    ["", 1, null].forEach((criterias: any) => {

      it(`should throw Error for criterias = ${criterias}`, async function() {

        const ruleConfig = createValidFixture();
        ruleConfig.criterias = criterias;
        
        const actual = () => new CreateCommand(ruleConfig);

        actual.should.throw(Error, "criterias must be an object");
      });

    });

    // TODO...

  });

  function createValidFixture() {
    const $ = faker.random;
    const id = $.word();
    return <IRuleConfig>{
      criterias: { "ip": "*" }, 
      requestsLimit: $.number(), 
      windowTimeSize: $.number(), 
      windowTimeUnit: TimeUnit[$.arrayElement(Object.keys(TimeUnit))]
    };
  }
});
'use strict';

require('mocha');
const assert = require('assert');
const utils = require('../lib/utils');

describe('utils', function() {
  it('should not mess with proxy', () => {
	  var t=utils.merge({foo:"bar"},{happy:new
		  Proxy({att:true},{get(obj,key){
			  if (key==="att")
				  return false;
		  }
		  })
	  });
	  var t2=utils.merge({},{color:"red"},t);
	  assert.equal(utils.merge({},t,t2).happy.att,false); });

});

var expect= require('expect');
var {generateMessage}= require('./message');

describe('generateMessage',()=>{
 it('should generate message object',()=>{
var from="jon";
var text="some text";
//store result in a variable
var message = generateMessage(from,text);

	//assert createdAt is a number

	//expect(message.createdAt).toBeAn('number');
	//expect(message).toInclude({from,text});
	 expect(message).toHaveProperty('from');
  	
 });
});
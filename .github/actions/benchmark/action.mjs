import core from '@actions/core';
import github from '@actions/github';

try {
	const nameToGreet = core.getInput('who-to-greet');

	console.log(`Hello ${nameToGreet}!`);

	const time = (new Date()).toTimeString();

	core.setOutput("time", time);

	const payload = JSON.stringify(github.context.payload, undefined, 2)

	console.log(`The event payload: ${payload}`);
} catch (error) {
	core.setFailed(error.message);
}

import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./App";

(async () => {
	const appElement = document.getElementById('app');
	if (!!appElement) {
		const app = (
			<App/>
		);
		ReactDOM.render(app, appElement);
	}
})();
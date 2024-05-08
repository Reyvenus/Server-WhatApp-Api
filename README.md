**Simple server to handle the WhatApp api call, you need to replace the environment variables that you will get
from the meta developer page. Avoid calling {URL_API_OPENAI_STREAM} if you don't have a response server configured 
for that call.**

**In the package there is an unused dependency -->ngrok, it is optional, but it is used to put your local server online,
see the documentation -->https://ngrok.com/**

***note: avoid using the ngrok sdk, because it doesn't have code lines to take the server off line. 
I recommend using chocolatey.com installation, read ngrok documentation.***


# Timed Captcha

A quick experimentation around the concept of a server-side only CAPTCHA.
It works by measuring the time between 2 document queries from the client.

The workflow is as follows : 
1. On the initial client connection, the timestamp and hashed IP address are stored in a key-value storage (currently in memory, ideally in a Redis or equivalent)
![image](https://github.com/user-attachments/assets/1b6ea8b0-39cf-4e81-a9c4-519d366de286)

2. On any subsequent request, the previous timestamp is fetched and compared to the current timestamp. If a sufficiently long time has passed (currently 1 second), then the page is returned
![image](https://github.com/user-attachments/assets/5ca5a94a-1fe8-4f75-974c-edefa9c4563f)

3. Else, the client is redirected to a fallback CAPTCHA (currently, a bunch of honeypots)
![image](https://github.com/user-attachments/assets/c12838ae-c7c8-4d77-910d-da9f0407652f)

## Limitations

The current implementation uses the IP address of the client as the unique identifier of a user.
It will then count 2 separate computers that share the same IP as a single user and may therefore block them if they attemps to access the site simultaneously.
This becomes problematic to users of a shared VPN or to users connected to the same company network for instance.
This implementation will also consider any number of computer using different IPs as separate users, making it unable to detect distributed attacks.

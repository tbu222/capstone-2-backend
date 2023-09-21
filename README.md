# capstone2-backend
a. The title of your site and a link to the URL where it is deployed
Youtube clone
https://youtube-clone-frontend-u1ec.onrender.com

b. Describe what your website does
the website offering some basic function for a video sharing site

c. List the features you implemented and explain why you chose those
features to implement
user can do basic function such as 
login/signup/logout
subscribe/unsubscribe to a channel they like
get random video popup/view trending video sort by views/check your recent history of watched video/ view any video have been saved to your library
search for a video through keyword
watching a video/leave a like or dislike/leave a comment to express their opinions/ saved video to their library
upload your own video to share with other users 
lightmode/darkmode

Those feature has been chosen due to the fact it is related to each other to create a simple video sharing site.
user will need to exist since without user there is no point in sharing video, they would need login/signup/logout method
user will need an ability to subscribe/unsubscribe because the user would want to keep up to date with what the channel they interested in had to offer
user will need an ability to recheck their watched/saved video, popup random or trending video to see what would caught their interested
above all else, search function is critical when the number of video reach a certain amount
normally after watching a video, user would want to somewhat express their opinion, either through like/dislike or leave a comment.
user would need an ability to upload video, else their will be no video to begin with.
lightmode/darkmode is simply for preference

d. Where your tests are and how to run them

e. Walk someone through the standard user flow for the website
User flow:
Homepage: -> watch any video you want -> want to leave some form of identity -> required to signin/sign up -> perform any function the user is authenticated listed above
          |
          -> sign in/signup -> perform any function the user is authenticated listed above

f. Keep the API in there, and if you have anything to say about the API then
add some notes. If you have created your own API, please document the
process.
https://youtube-clone-backend-15lp.onrender.com/api

This is simply a rest api that communicate via HTTP requests to perform standard database functions like creating, reading, updating, and deleting records within a resource.

g. Identify the technology stack used to create your website
      node
      mongodb
      react
      firebase
      express


h. Include anything else that you feel is important to share
Server side will need to run first before run the client side:
Set up server:
1. yarn
2. node index.js

Set up client:
1. yarn build

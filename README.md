# mywebsite

This used to say "my p crappy website", but I have actually become a bit proud of what it has turned into. There are quite a lot of fun stuff integrated into it and I have geeked out quite a bit.

## Landing page

This really does not have much other than my github, email, and a link to something called "fun stuff" which is where all the magic of my website happens. I like the color scheme a lot. It is also the color scheme I use for my editor (zenburn gray background, and blue font)

## "Interesting/Main" page

This page most likely has the most technically cool things that happening. A lot of this is generated with BabylonJS.

### Localized tiling

There is an autogenerated map floor that is created based on your browsers longitude and latitude. It is also a slippy tiling map, so that should reduce most of the bad pixelation that would happen otherwise. It defaults to Manhattan if there is no location given. The tiles are autogenerated using a function that converts longitude and latitude into tile numbers. Not all places are mapped however, and that can result in some not so pretty red and black error tiles. However, if you stay within most population dense areas, it is usually represented.

### Animation

When you land on the site, there is a black tesla that then drives through the map and to the main scene. This depending on your computer's power will either load well or very poorly. On mine, it tends to load very poorly, however it is still cool to see the tesla drop you off and then ride into the horizon.

### Music

There is randomly selected music that plays/stops if you press the music button. This used to be integrated through spotify, but I wasn't enjoying if very much, so I just host some mp3s.

### Buttons

They are animated to move when clicked. Fun stuff.

### Other stuff

The skybox is made by just meshing four pictures of the sky.
The camera follows an exponential curve as to never go below the floor.
There is a secret button at the bottom of the box.

## About page

The coolest thing about this is that all that animated text is not a 3d graphic that I just move. Instead, it is actually all rendered in real time. I connect this to my github account, and whenever I want to change the text I can just change it there and it will automatically change the page. Also, it will take care of spacing and animation times automatically. So ya, there is definitely some cool stuff happening there as well, even if may seem a little boring. Also ya, all that text is 3d.

## Hosting

I host all of this in aws, cause imma aws fanboy. All of the actual data is stored in s3 buckets. Then depending on whether it is an accessed page or not (all the ones you have seen are) I create a cloudfront distribution for it and route it through api gateway. All of this costs me fairly little and I am have a pretty scalable easy to manage website. Because it goes through api gateway, I can integrate a lot of lambda functions throughout my website and do a lot of aws integration I would not have been able to do otherwise (like the AWS IOT stuff that will come up soon on my camera page). AWS is really a lot of fun for me, and I think it is by far one of the most powerful tools at my disposal right now

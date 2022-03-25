_Link to video tutorial : https://www.youtube.com/watch?v=bGz7mv2vD6g
Link to The Coding Train Youtube channel: https://www.youtube.com/c/TheCodingTrain_

**The Coding Train has many very helpful online courses and tutorials on a large variety of computer science subjects. I highly reccomend checking it out.

To eaily and most simple way to run this simulation is to copy all the code in SmartRockets.js and paste it into a js file on https://editor.p5js.org/**


This projects simulates natural selection in a population of "rockets" who's "survival rating/fitness" (and their chance at reproducing) relies on getting as close as possible to a given target. Each rocket is initialized with an array of 400 random vectors representing their DNA. Each rocket starts from the bottom of the window, and must attempt to reach a target without hitting an obstacle. The vectors or "DNA" are applied every frame until 400 frames have gone by or the rocket "crashes." The closer the rocket is at the end of each round, the higher the chance it has as "repopulating" which is represented by two Parent rocket DNA's being mixed half and half into a new Rocket object for the next round. There is also a small mutation chance, resulting in occasioinal random changes in some of the DNA. 


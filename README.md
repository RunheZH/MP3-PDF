# MP3-PDF
COMP 4905 Honours Project (Winter 2020)\
Author:     Runhe Zhong\
Student #:  101016659

# MP3 player/PDF viewer
Updated: 4 March 2020

## TODO
1. "Learning" how the playback and the PDF document correspond (*)
2. Identify the measures (bars)
3. Come up with an algorithm that calculates and splits the chart into parts
4. Split the chart into smaller parts and resume playing the music
5. Prepare a presentation
6. Work on the final report
7. Submit the presentation, code, and final report

## OVERVIEW
The purpose of this project is to build an application,  which can combine the playback and PDF charts or chord sheets together. Users should be able to point at any part of the document and the corresponding music should resume playing from that point.

## GOALS
1. use OCR to identify measures
2. resume playing music from any part of the document

## SPECIFICATIONS
This project will be a node.js based web application, which combines playback with PDF documents. The tool that will be used is PDFtk for handling PDFs and SVG might be used for scores in this project. Users should be able to point at the chart and resume playing from that point using this application. Since this is a four-month individual project and I am also taking other courses simultaneously, the application won't be able to handle handwritten chord sheets. This feature might be implemented if I got some extra time after I finished the committed features.

## INSTALLATION
1. Go to the project root directory and run `npm install` to install packages.
2. Run `npm test` to run the server.
3. Go to _http://localhost:3000/musics_ to run the application.
4. Use `ctrl + C` to kill the server.

## MILESTONES
### ~~Week 2 - Week 3 (Jan 6 - Jan 19)~~
~~_Jan 17 - Proposal submission deadline_~~
1. ~~Doing some research and preparing the project proposal.~~
2. ~~Set up environment~~
3. ~~Start thinking about how to implement the project~~
4. ~~Build a basic server and client web page~~
5. ~~Build a basic database~~
### ~~Week 4 - Week 5 (Jan 20 - Feb 2)~~
1. ~~Be able to point at the document and send the coordinates to the server~~
2. "Learning" how the playback and the PDF document correspond (*)
### ~~Week 6 - Week 7 (Feb 3 - Feb 16)~~
1. Identify the measures (bars)
2. Come up with an algorithm that calculates and splits the chart into parts
3. ~Resume playing the music if a part has been clicked~
### ~~Week 8 - Week 9 (Feb 17 - Mar 1)~~
_Feb 28 - Mid-term report deadline_
1. Split the chart into smaller parts and resume playing the music
2. Work on the final report
### Week 10 - Week 11 (Mar 2 - Mar 15)
1. Prepare a presentation and work on the final report
### Week 12 - Week 13 (Mar 16 - Mar 29)
1. Prepare a presentation and work on the final report
### Week 14 - Week 15 (Mar 30 - Apr 12)
_Apr 3 - First draft of final report deadline_
1. Finish the project
2. Prepare the presentation and work on the final report
### Week 16 (Apr 13 - Apr 19)
_Apr 17 - Final report deadline_
1. Submit the presentation, code, and final report
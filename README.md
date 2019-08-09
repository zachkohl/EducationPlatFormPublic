# teen-aid
Teen aid survey project

This educational platform was my first serious NodeJS project. It is currently being used by Teen-Aid to manage their needs for testing high schoolers after they have studied various curriculum. The client needed a system that would force the students to take each question in order and log their results. These results then needed to be delivered back to the client in a very specific CSV file format. 

At first the client and I discussed hard coding the questions, but it rapidly became apparent that they would need more flexibilty as they where still in the process of developing their curriculm. As such I designed a special question editor which allows them to build their own questions. Several different kinds of questions are allowed, including multiple choice, multiple answer, and essay. 

Another requirement they had is that they wanted different catagories of students who would see different types of questions. To accomidate this, I built a special catagory enditor. Users with "student" level premissions are also assigned a catagory. Questions are allowed to be assigned to multiple catagories. This flexibility in structure allows the client to use the software in all sorts of creative ways. 

As the students progress through the course, they are presented with questions till the reach the end of a section. At this point they are presented with content that looks like a question but is really just an "announcement". This announcement contains a link that can be used to download a powerpoint with additonal curriculm. The powerpoint is hosted seperately by the client. 

This project was a ton of fun and I can put you in touch with the client if you want to ask them how their experience was working with me.

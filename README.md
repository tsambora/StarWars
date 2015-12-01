# StarWars
http://starshipsofstarwars.gq/

This web app is a utilization of Star Wars API (www.swapi.co). It presents information about spaceships in the Star Wars universe.

Development stack: 

1. front-end: Angular.js, Materialize.js 
2. backend: Firebase, Node.js 
3. web framework: Express.js
4. server host: Digital Ocean

Features:

1. Feed: present starships with an infinite list.
2. Chatbox: Firebase powered real-time message sharing.
3. Starship detail: present starship data via modal also in new page for more detailed info.
4. Similar starship: present starships similar with the currently viewed starship.

Limitations:

Due to some incompleteness of the API data: (such as starship ID, etc) 

1. Detail page has to be rendered with a not pretty URL.
2. Opening modal in new tab will result in an empty modal.
3. Similar starships presented in a “load more” style.

let Photo = require('./models/Photo');
let Message = require('./models/Message');

module.exports = app => {

  // a list of open connections
  let connections = [];

  app.get('/api/sse', (req, res) => {
    // don't connect users that are not logged in
    if (!req.session.user) {
      res.json({ error: 'Not logged in!' });
      return;
    }
    // create a connection object -> request + response
    // and up unitl which time stamp the connection/user has
    // gotten messages and photos
    let connection = { req, res, hasMessagesUntil: 0, hasPhotosUntil: 0 };
    // add the connection to the connections list
    connections.push(connection);
    // remove the connection from the list when the request closes
    req.on('close', () => connections = connections.filter(x => x !== connection));
    // send headers telling the browser this is SSE and no cache
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    });
    // send initial 'backlog' of photos and messages
    sendPhotos(connection);
    sendMessages(connection);
  });

  // Send a message via SSE
  function sendSSE(res, eventType, data) {
    // remove passwords fields
    data = JSON.parse(JSON.stringify(data,
      (key, val) => key === 'password' ? undefined : val));
    // send
    res.write(
      `event: ${eventType}\n` +
      'data: ' + JSON.stringify(data) + '\n\n'
    );
  }

  // Calculate which photos to send to a connection/user
  // (all the ones he/she doesn't have for now)
  async function sendPhotos(connection) {
    let photos = await Photo.find({
      posted: { $gte: new Date(connection.hasPhotosUntil) }
    }).populate('author');
    connection.hasPhotosUntil = Date.now();
    sendSSE(connection.res, 'photos', photos);
  }

  // Calculate which messages to send to a connection/user
  // (all the one he/she doesn't have with the user as
  //  a recipient or as the author)
  async function sendMessages(connection) {
    let userId = connection.req.session.user._id;
    let messages = await Message.find({
      sent: { $gte: new Date(connection.hasMessagesUntil) },
      $or: [
        { author: userId },
        { recipients: { $elemMatch: { $eq: userId } } }
      ]
    }).populate('author recipients');
    connection.hasMessagesUntil = Date.now();
    sendSSE(connection.res, 'messages', messages);
  }

  // Change listeners - listen to DB changes
  Photo.watch().on('change', () => connections.forEach(sendPhotos));
  Message.watch().on('change', () => connections.forEach(sendMessages))

  // Heartbeat (send empty messages with 20 second delays)
  // helps keep the connection alive - some proxies close it otherwise
  setInterval(() => connections.forEach(({ res }) =>
    sendSSE(res, 'heartbeat', new Date())), 20000);

};
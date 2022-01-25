rs.initiate({
  _id: "koding-replication",
  members: [{ _id: 0, host: "mongo:27017" }],
});

const store = {
  users: [],
  profiles: [],
  friendEdges: [],
  groups: [],
};

function resetStore() {
  store.users.length = 0;
  store.profiles.length = 0;
  store.friendEdges.length = 0;
  store.groups.length = 0;
}

module.exports = {
  store,
  resetStore,
};

const users = [
    {username: 'sepp', id:'1', password: 'sepp', firstname: 'Sepp', lastname: 'Hintner' },
    {username: 'resi', id:'2',password: 'resi', firstname: 'Resi', lastname: 'Rettich' },
    {username: 'rudi', id:'3',password: 'rudi', firstname: 'Rudi', lastname: 'Rüpel' }
   ];
   function get(username) {
    const user = users.find(user => user.username === username);
    return user ? Object.assign({}, user) : null;
   }
   module.exports = { get };
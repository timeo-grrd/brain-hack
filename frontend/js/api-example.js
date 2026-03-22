// Exemple d'appel fetch pour l'inscription
fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'toto', password: 'secret' })
})
.then(res => res.json())
.then(data => console.log(data));

document.querySelector('.chat[data-chat=person0]').classList.add('active-chat');
document.querySelector('.person[data-chat=person0]').classList.add('active');

var friends = {
  list: document.querySelector('ul.people'),
  all: document.querySelectorAll('.left .person'),
  name: '' },

chat = {
  container: document.querySelector('.container .right'),
  current: null,
  person: null,
  name: document.querySelector('.container .right .top .name') };


friends.all.forEach(function (f) {
  f.addEventListener('mousedown', function () {
    f.classList.contains('active') || setAciveChat(f);
  });
});

checkLinkUsersModal()

function setAciveChat(f) {
  friends.list.querySelector('.active').classList.remove('active');
  f.classList.add('active');
  chat.current = chat.container.querySelector('.active-chat');
  chat.person = f.getAttribute('data-chat');
  chat.current.classList.remove('active-chat');
  chat.container.querySelector('[data-chat="' + chat.person + '"]').classList.add('active-chat');
  friends.name = f.querySelector('.name').innerText;
  chat.name.innerHTML = friends.name;
  checkLinkUsersModal()
}

// Vérification de l'usabilité du lien vers le modal users
function checkLinkUsersModal() {
  if (chat.person == 'person0' || chat.person == null) {
    chat.name.addEventListener('click', openUsersModal, false)
    chat.name.style.cursor = 'pointer'
  } else {
    chat.name.removeEventListener('click', openUsersModal, false)
    chat.name.style.cursor = 'default'
  }
}

/* Modal */

var modalContainer = document.body.querySelector('#modal-container'),
    listUsers = modalContainer.querySelector('#contentUsers ul')

// Ouverture du modal sur la demande de l'username
function openUsernameModal() {
  modalContainer.querySelector('#contentUsername').classList.remove('none')
  modalContainer.querySelector('#contentUsers').classList.add('none')
  modalContainer.classList.remove('out')
  document.body.classList.add('modal-active')
}

// Ouverture du modal sur la liste des utilisateurs connectés
function openUsersModal() {
  modalContainer.querySelector('#contentUsername').classList.add('none')
  modalContainer.querySelector('#contentUsers').classList.remove('none')
  modalContainer.classList.remove('out')
  document.body.classList.add('modal-active')
}

// Fermeture du modal
function closeModal() {
  modalContainer.classList.add('out')
  document.body.classList.remove('modal-active')
}

// Mise à jour des utilisateurs présents
function updateUsers(users) {

  // Mise à jour du modal listant les users
  listUsers.innerHTML = ''
  for (let i in users) {
    listUsers.innerHTML += '<li>'+users[i]+'</li>'
  }

  // Mise à jour du texte à gauche
  let text = 'Discussion générale (' + users.length + ')'
  friends.all[0].querySelector('.name').innerHTML = text

  // Mise à jour du texte en haut (si c'est le chat actif)
  if (chat.person == 'person0' || chat.person == null)
    document.body.querySelector('#infoPersonTop').innerHTML = text

}

//Messages

var globalChat = chat.container.querySelector('.chat[data-chat=person0]')

// Message d'un nouvel utilisateur
function messageNewUser(newUsername) {
  let message = '<div class="conversation-start"><span>'+newUsername+' est là !</span></div>'
  globalChat.insertAdjacentHTML('beforeend', message)
}

//Affichage du message du user courant
function showMyMessage(text) {
  let message = '<div class="bubble me">' + text + '</div>'
  globalChat.insertAdjacentHTML('beforeend', message)
}
//Affichage d'un msg exterieur'
function showNewMessage(text, usernamesSender) {
  let message = '<div class="bubble name you"><span class="username"></span>' + usernamesSender + '</div>'
  globalChat.insertAdjacentHTML('beforeend', message)
}
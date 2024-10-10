const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    socket.emit('join-room', roomId);

    const chatForm = document.getElementById('chatForm');
    const messages = document.getElementById('messages');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = document.getElementById('message').value;
        socket.emit('signal', { roomId, message });
        document.getElementById('message').value = '';
    });

    socket.on('signal', (data) => {
        const li = document.createElement('li');
        li.textContent = data.message;
        messages.appendChild(li);
    });

    socket.on('user-connected', (userId) => {
        const li = document.createElement('li');
        li.textContent = `User ${userId} connected`;
        messages.appendChild(li);
    });

    socket.on('user-disconnected', (userId) => {
        const li = document.createElement('li');
        li.textContent = `User ${userId} disconnected`;
        messages.appendChild(li);
    });
});
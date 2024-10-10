document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const response = await fetch('/api/rooms', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const rooms = await response.json();
    const roomsList = document.getElementById('roomsList');
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.textContent = room.name;
        li.addEventListener('click', () => {
            window.location.href = `room.html?roomId=${room._id}`;
        });
        roomsList.appendChild(li);
    });

    document.getElementById('createRoomForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const capacity = document.getElementById('capacity').value;

        const createResponse = await fetch('/api/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, capacity })
        });

        if (createResponse.ok) {
            const newRoom = await createResponse.json();
            const li = document.createElement('li');
            li.textContent = newRoom.name;
            li.addEventListener('click', () => {
                window.location.href = `room.html?roomId=${newRoom._id}`;
            });
            roomsList.appendChild(li);
        } else {
            const errorData = await createResponse.json();
            alert(errorData.message);
        }
    });
});
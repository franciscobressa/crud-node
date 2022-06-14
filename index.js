const express = require('express')

const server = express()

server.use(express.json());

const users = [{
        id: 1,
        name: "Diego",
        email: "diego@email.com",
        password: "123456",
        user_name: "diego",
    },
    {
        id: 2,
        name: "Gabriel",
        email: "gabriel@email.com",
        password: "123456",
        user_name: "gabriel",
    }
];

// busca todos usuários cadastrados
server.get("/users", (req, res) => {

    return res.json(
        users.map(user => ({
            ...user,
            password: undefined
        }))
    )
})

// busca usuário pelo ID
server.get('/users/:id', (req, res) => {
    const { id } = req.params;
    let user = [users.find(
        user => user.id == id
    )]


    return res.json(
        user.map(user => ({
            ...user,
            password: undefined,
        }))
    )
})

// cadastra usuário
server.post("/users", (req, res) => {
    const { name, email, password, user_name } = req.body;
    const user = {
        id: users.length + 1,
        name,
        email,
        password,
        user_name
    }

    // não pode ser undefined
    if (password != undefined && email != undefined && name != undefined && user_name != undefined) {
        console.log(password)
            // senha com no minimo 6 digitos
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        if (users.find(user => user.email == email) || users.find(user => user.user_name == user_name)) {
            return res.status(400).json({ error: 'User with same email or username already exists' });
        }
    } else {
        return res.status(400).json({ error: 'Missing parameters' });
    }
    users.push(user);
    return res.json('User created with success');
})

// edita usuário
server.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, password, user_name } = req.body;
    const user = users.find(user => user.id == id);

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    if (password != undefined && email != undefined && name != undefined && user_name != undefined) {

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        if (
            (users.find(user => user.email == email) && user.email != email) ||
            (users.find(user => user.user_name == user_name && user.user_name != user_name))) {
            return res.status(400).json({ error: 'User with same email or username already exists' });
        }
    } else {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    user.name = name;
    user.email = email;
    user.password = password;
    user.user_name = user_name;

    return res.json('User updated with success');
})

// deleta usuário
server.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id == id);

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    users.splice(users.indexOf(user), 1);

    return res.json('User deleted with success');
})

server.listen(3000)
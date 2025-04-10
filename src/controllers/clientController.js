import Client from "../models/clientModel.js";
import { EventEmitter } from 'events';
import axios from 'axios';


// EVENT EMITTER PARA LA CREACION AUTOMATICA DE UN NUEVO USUARIO
const eventEmitter = new EventEmitter();


export const getClients = async (req, res) => {
    try {
        const clients = await Client.findAll({ where: { status: true } });

        if (clients.length === 0) {
            return res.status(204).json({ message: "No se encontraron clientes" });
        }

        res.status(200).json(clients);
    } catch (error) {
        console.error("Error al listar Clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
};

export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(204).json({ message: "Cliente no encontrado" });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        res.status(500).json({ message: "Error al obtener el cliente" });
    }
};

//CREAR UN CLIENTE CON LA INFO DE TODA LA TABLA

export const createClient = async (req, res) => {
    try {
        const { name, lastName, email, phone, birthDate, address, rol } = req.body; // Agregar rol

        // Crear el cliente en la base de datos
        const newClient = await Client.create({
            name,
            lastName,
            email,
            phone,
            birthDate,
            address,
            status: true, // Nuevo cliente siempre inicia activo
        });

        // Emitimos el evento cuando se crea un cliente
        eventEmitter.emit('clientCreated', { client: newClient, rol });

        console.log(newClient);

        res.status(201).json(newClient);
    } catch (error) {
        console.error("Error al crear Cliente:", error);
        res.status(500).json({ message: "Error al crear el cliente" });
    }
};

// Escuchar el evento para crear un usuario automáticamente
eventEmitter.on('clientCreated', async ({ client, rol }) => {
    try {
        const randomPassword = Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria de 8 caracteres

        await axios.post('http://localhost:3004/users/newUser', {
            username: client.email,
            password: randomPassword,
            phone: client.phone,
            rol: rol
        });

        console.log(`Usuario creado automáticamente para el cliente ${client.name} ${client.lastName} con rol ${rol}`);

    } catch (error) {
        console.error('Error al crear usuario automáticamente:', error);
    }
});


export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, lastName, email, phone, birthDate, address } = req.body;

        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(204).json({ message: "Cliente no encontrado" });
        }

        await client.update({ name, lastName, email, phone, birthDate, address });

        res.status(200).json({ message: "Cliente actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar Cliente:", error);
        res.status(500).json({ message: "Error al actualizar el cliente" });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);

        if (!client) {
            return res.status(204).json({ message: "Cliente no encontrado" });
        }

        await client.update({ status: false });

        res.status(200).json({ message: "Cliente dado de baja correctamente" });
    } catch (error) {
        console.error("Error al dar de baja Cliente:", error);
        res.status(500).json({ message: "Error al dar de baja el cliente" });
    }
};

import React, { useState, useEffect } from 'react';
import '../styles/phoneBook.css';

const API_URL = 'http://localhost:3001/';

const PhoneBook = () => {
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editContact, setEditContact] = useState({ first_name: '', last_name: '', phone_number: '' });
    const [editIndex, setEditIndex] = useState(null);
    const [newContact, setNewContact] = useState({ first_name: '', last_name: '', phone_number: '' });
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch(API_URL + 'users');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setContacts(data);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        fetchContacts();
        setRefresh(false);
    }, [refresh]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewContact((old) => ({ ...old, [name]: value }));
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        const filteredContacts = contacts.filter((contact) =>
            contact.last_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredContacts(filteredContacts);
    }, [searchQuery, contacts]);

    const handleAddContact = async (contact) => {
        try {
            const response = await fetch(API_URL + 'user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contact),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setNewContact({ first_name: '', last_name: '', phone_number: '' });
            setRefresh(true);
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    }

    const beginEdit = (index) => {
        setEditMode(true);
        setEditIndex(index);
    }

    const handleEdit = async (index) => {
        let contactToEdit = filteredContacts[index];
        contactToEdit.first_name = editContact.first_name;
        contactToEdit.last_name = editContact.last_name;
        contactToEdit.phone_number = editContact.phone_number;
        try {
            const response = await fetch(API_URL + 'user/' + contactToEdit.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactToEdit),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setEditMode(false);
            setRefresh(true);
        } catch (error) {
            console.error('Error editing contact:', error);
        }
    }

    const handleDelete = async (index) => {
        const newContacts = contacts[index];
        try {
            const response = await fetch(API_URL + 'user/' + newContacts.id, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setRefresh(true);
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    return (
        <div className="phone-book">
            <h1>Phone Book App</h1>
            <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={newContact.first_name}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={newContact.last_name}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="phone_number"
                placeholder="Phone"
                value={newContact.phone_number}
                onChange={handleInputChange}
            />
            <button className="add-contact" onClick={() => handleAddContact(newContact)}>+ Add Contact</button>
            <input type="text" placeholder="Search for contact by last name..." onChange={(e) => handleSearch(e.target.value)}/>
            <ul>
                {filteredContacts.map((contact, index) => (
                    <li key={index}>
                        {editMode && index === editIndex ? (
                            <div className="edit-container">
                                <div className="edit-input-container">
                                    <input type="text" placeholder="First Name" value={editContact.first_name} onChange={(e) => setEditContact({ ...editContact, first_name: e.target.value })} />
                                    <input type="text" placeholder="Last Name" value={editContact.last_name} onChange={(e) => setEditContact({ ...editContact, last_name: e.target.value })} />
                                    <input type="text" placeholder="Phone Number" value={editContact.phone_number} onChange={(e) => setEditContact({ ...editContact, phone_number: e.target.value })} />
                                </div>
                                <div className="button-container">
                                    <button className="save-contact" onClick={() => handleEdit(index)}>Save</button>
                                    <button className="cancel-contact" onClick={() => setEditMode(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <span>{contact.first_name} {contact.last_name}</span>
                                <span>📞{contact.phone_number}</span>
                                <div className="button-container">
                                    <button onClick={() => beginEdit(index)}>✏️</button>
                                    <button onClick={() => handleDelete(index)}>🗑️</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PhoneBook;
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import Contact from '../db/models/Contact.js';

const contactsPath = path.join('./db/contacts.json');

async function listContacts() {
  const allContacts = await Contact.findAll();

  if (!allContacts || allContacts.length === 0) {
    await fillContacts();
    return await Contact.findAll();
  }

  return allContacts;
}

async function fillContacts() {
  const data = await fs.readFile(contactsPath);
  JSON.parse(data).forEach(async c => {
    await Contact.create(c);
  });
}

async function getContactById(contactId) {
  return Contact.findByPk(contactId);
}

async function removeContact(contactId) {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }
  await Contact.destroy({ where: { id: contactId } });
  return contact;
}

async function addContact(name, email, phone) {
  return await Contact.create({
    id: nanoid(),
    name,
    email,
    phone,
  });
}

async function updateContact(contactId, data) {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }
  return await contact.update(data, { returning: true });
}

async function updateStatusContact(contactId, data) {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }
  return await contact.update({ favorite: data.favorite }, { returning: true });
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import Contact from '../db/models/Contact.js';

const contactsPath = path.join('./db/contacts.json');

async function listContacts(userId) {
  const allContacts = await Contact.findAll({ where: { owner: userId } });

  if (!allContacts || allContacts.length === 0) {
    await fillContacts(userId);
    return await Contact.findAll({ where: { owner: userId } });
  }

  return allContacts;
}

async function fillContacts(userId) {
  const data = await fs.readFile(contactsPath);
  JSON.parse(data).forEach(async c => {
    await Contact.create({ ...c, owner: userId });
  });
}

async function getContactById(contactId, userId) {
  return Contact.findOne({ where: { id: contactId, owner: userId } });
}

async function removeContact(contactId, userId) {
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    return null;
  }
  await Contact.destroy({ where: { id: contactId, owner: userId } });
  return contact;
}

async function addContact(name, email, phone, userId) {
  return await Contact.create({
    id: nanoid(),
    name,
    email,
    phone,
    owner: userId,
  });
}

async function updateContact(contactId, data, userId) {
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    return null;
  }
  return await contact.update(data, { returning: true });
}

async function updateStatusContact(contactId, data, userId) {
  const contact = await getContactById(contactId, userId);
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

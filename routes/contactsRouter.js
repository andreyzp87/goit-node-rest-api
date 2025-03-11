import express from 'express';
import validateBody from '../helpers/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteContact,
} from '../controllers/contactsControllers.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);
contactsRouter.get('/:id', getOneContact);
contactsRouter.delete('/:id', deleteContact);
contactsRouter.post('/', validateBody(createContactSchema), createContact);
contactsRouter.put('/:id', validateBody(updateContactSchema), updateContact);
contactsRouter.patch(
  '/:id/favorite',
  validateBody(updateContactSchema),
  updateFavoriteContact
);

export default contactsRouter;

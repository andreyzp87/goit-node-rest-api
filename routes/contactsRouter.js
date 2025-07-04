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
import authenticate from '../middlewares/authenticate.js';

const contactsRouter = express.Router();

// Apply authentication middleware to all routes
contactsRouter.use(authenticate);

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

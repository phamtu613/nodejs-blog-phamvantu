import { config } from 'dotenv'
import { ContactType } from '~/models/schemas/Contact.schema'
import databaseService from '~/services/database.services'

config()

class ContactsService {
  async createContact(contact: ContactType) {
    console.log(contact)
    await databaseService.contacts.insertOne({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      content: contact.content,
      created_at: new Date(),
      updated_at: new Date()
    })
  }
}

const contactsService = new ContactsService()
export default contactsService

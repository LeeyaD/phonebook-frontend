import Contact from './Contact'

function Contacts({ searchName, contacts, handleDelete }) {
  const contactsToShow = (searchName.length > 0) ? filterNames() : contacts

  function filterNames() {
    return contacts.filter(contact => {
      let search = new RegExp(searchName.toLowerCase(), 'g')
      return search.test(contact.name.toLowerCase())
    })
  }

  return (
    <div>
      <h2>Contacts</h2>
      <ul>
        {contactsToShow.map(contact =>
          <Contact key={contact.id} contact={contact} handleDelete={handleDelete}/>
        )}
      </ul>
    </div>
  )
}

export default Contacts
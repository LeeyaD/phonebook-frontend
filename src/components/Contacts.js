import { useState } from 'react'
import FilterContacts from './FilterContacts'
import { Link } from 'react-router-dom'

function Contacts({ contacts }) {
  const [ searchName, setSearchName ] = useState('')
  const contactsToShow = (searchName.length > 0) ? filterNames() : contacts

  const handleSearchBar = (event) => {
    setSearchName(event.target.value)
  }

  function filterNames() {
    return contacts.filter(contact => {
      let search = new RegExp(searchName.toLowerCase(), 'g')
      return search.test(contact.name.toLowerCase())
    })
  }

  return (
    <div>
      <h2>Contacts</h2>
      <FilterContacts state={searchName} eventHandler={handleSearchBar}/>
      <ul>
        {contactsToShow.map(contact =>
          <li key={contact.id}>
            <Link to={`/contacts/${contact.id}`}>{contact.name}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Contacts
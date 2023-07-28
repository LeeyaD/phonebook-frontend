import { useState, useEffect } from 'react'
import {
  Routes, Route, Link, useMatch
} from 'react-router-dom'

import contactServices from './services/contacts'
import Contact from './components/Contact'
import Contacts from './components/Contacts'
import ContactForm from './components/ContactForm'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'

function App() {
  const [ contacts, setContacts ] = useState([])
  const [ successMessage, setSuccessMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ user, setUser ] = useState(null)

  const padding = {
    padding: 5
  }

  useEffect(() => {
    contactServices
      .getAll()
      .then(returnedData => {
        setContacts(returnedData)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedPhonebookAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      contactServices.setToken(user.token)
    }
  }, [])

  if (!contacts) {
    return null
  }

  const addContact = (personObj) => {
    let names = contacts.reduce((arr, person) => {
      arr.push(person.name)
      return arr
    }, [])

    if (user) {
      if (names.includes(personObj.name)) {
        if (window.confirm(`${personObj.name} is already added to phonebook, replace the old number with a new one?`)) {
          let person = contacts.find(p => p.name === personObj.name)
          let updatedPersonObj = { ...person, ...personObj }
          contactServices
            .update(person.id, updatedPersonObj)
            .then(returnedData => {
              setContacts(contacts.map(p => p.id !== person.id ? p : returnedData))
              setSuccessMessage(`Updated ${person.name}`)
            })
            .catch(error => {
              setErrorMessage(error.response.data.error)
            })
        }
      } else {
        contactServices
          .create(personObj)
          .then(returnedData => {
            setContacts(contacts.concat(returnedData))
            setSuccessMessage(`Added ${returnedData.name}`)
          })
          .catch(error => {
            setErrorMessage(error.response.data.error)
          })
      }
    } else {
      setErrorMessage('Must be logged in to add to contact')
    }

    setTimeout(() => {
      setSuccessMessage(null)
      setErrorMessage(null)
    }, 5000)
  }

  const handleDelete = (event) => {
    const id = event.target.dataset.id
    const person = contacts.find(p => p.id === id)

    if (user.name === person.user.name) {
      console.log(`Deleting ${id}`)
      console.log(`Deleting ${person.name}`)

      if (window.confirm(`Delete ${person.name}?`)) {
        contactServices.remove(id)
        setContacts(contacts.filter(p => p.id !== id))
      }
    } else {
      setErrorMessage('Must be the creator can this contact to delete it')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedPhonebookAppUser', JSON.stringify(user)
      )
      contactServices.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logout = () => (
    <button type="reset" onClick={logUserOut}>
      logout
    </button>
  )

  const logUserOut = () => {
    window.localStorage.clear()
    contactServices.setToken(null)
    setUser(null)
  }

  const match = useMatch('/contacts/:id')
  const contact = match
    ? contacts.find(c => c.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/contacts">contacts</Link>
        <Link style={padding} to="/create">add contact</Link>
        {user
          ? <em>{user.name} logged in {logout()}</em>
          : <Link style={padding} to="/login">login</Link>
        }
      </div>

      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />

      <Routes>
        <Route path='/contacts/:id' element={<Contact
          contact={contact}
          handleDelete={handleDelete} />}
        />
        <Route path="/contacts" element={<Contacts
          contacts={contacts}/>}
        />
        <Route path='/create' element={<ContactForm
          createContact={addContact}/>}
        />
        <Route path="/login" element={<LoginForm
          login={handleLogin} />}
        />
      </Routes>
      <footer>
        <br />
        <em>Phonebook app, Department of Computer Science 2023</em>
      </footer>
    </div>
  )
}

export default App

import { useState, useEffect, useRef } from 'react'

import contactServices from './services/contacts'
import Contacts from './components/Contacts'
import FilterContacts from './components/FilterContacts'
import ContactForm from './components/ContactForm'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

function App() {
  const [ contacts, setContacts ] = useState([])
  const [ searchName, setSearchName ] = useState('')
  const [ successMessage, setSuccessMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ user, setUser ] = useState(null)

  // reference by App component created
  const contactFormRef = useRef()

  useEffect(() => {
    contactServices
      .getAll()
      .then(returnedData => {
        console.log(returnedData)
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

  const handleSearchBar = (event) => {
    setSearchName(event.target.value)
  }

  const addContact = (personObj) => {
    contactFormRef.current.toggleVisibility()

    let names = contacts.reduce((arr, person) => {
      arr.push(person.name)
      return arr
    }, [])

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
    setTimeout(() => {
      setSuccessMessage(null)
      setErrorMessage(null)
    }, 5000)
  }

  const handleDelete = (event) => {
    const id = event.target.dataset.id
    console.log(`Deleting ${event.target.dataset.id}`)
    console.log(`Deleting ${event.target.dataset.name}`)
    const person = contacts.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      contactServices.remove(id)
      setContacts(contacts.filter(p => p.id !== id))
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

  const loginForm = () => {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm
          login={handleLogin}
        />
      </Togglable>
    )
  }

  const contactForm = () => (
    // App passes reference to 'Togglable'
    <Togglable buttonLabel='new contact' ref={contactFormRef}>
      <ContactForm createContact={addContact} />
    </Togglable>
  )

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

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />

      {user
        ? <div>
          <p>{user.name} logged in {logout()}</p>
          {contactForm()}
        </div>
        : loginForm()}

      <FilterContacts state={searchName} eventHandler={handleSearchBar}/>
      <Contacts
        searchName={searchName}
        contacts={contacts}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App

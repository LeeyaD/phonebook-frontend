import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ContactForm from './ContactForm'
import userEvent from '@testing-library/user-event'

test('<ContactForm /> updates parent state and calls onSubmit', async () => {
  const createContact = jest.fn()
  const user = userEvent.setup()

  render(<ContactForm createContact={createContact} />)

  // 'getAll*' gathers all inputs, 'getByRole' for 1
  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('add')
  
  await user.type(inputs[0], 'testing a form...')
  await user.click(sendButton)
  
  expect(createContact.mock.calls).toHaveLength(1)
  expect(createContact.mock.calls[0][0].name).toBe('testing a form...')
})
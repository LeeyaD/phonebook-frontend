import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contact from './Contact'

test('renders a contact', () => {
  const contact = {
    name: 'Bruce Lee',
    number: '555-1234'
  }

  // renders component not to the DOM but in a format good for tests
  const { container } = render(<Contact contact={contact} />)
  // screen gives us access to the rendered component
  const element = container.querySelector('li')
  // screen.debug(element)
  expect(element).toBeDefined()
})

test('clicking the button calls event handler once', async () => {
  const contact = {
    name: 'Bruce Lee',
    number: '555-1234'
  }

  const mockHandler = jest.fn()

  render(
    <Contact contact={contact} handleDelete={mockHandler} />
  )

  // session started to interact w/ rendered component
  const user = userEvent.setup()
  const button = screen.getByText('delete')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
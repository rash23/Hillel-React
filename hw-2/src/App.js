import './App.css'
import React from 'react'
import List from './List'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			todos: [],
			inputValueID: '',
			inputValue: '',
			fakeId: 1,
			errorTitle: '',
			errorID: '',
		}
	}

	request = async (url, initRequest) => {
		const response = await fetch(url, initRequest)
		if (response.ok) {
			console.log(`Status: ${response.status}`)

			const contentType = response.headers.get('content-type')

			if (contentType?.includes('application/json')) {
				return await response.json()
			}
			return await response.text()
		}

		throw this.generateFetchError(response)
	}

	generateFetchError(response) {
		const error = new Error('Request Failed')
		error.statusCode = response.status
		error.statusMessage = response.statusText

		return error
	}

	addTodo = async () => {
		if (this.state.inputValue) {
			this.state.fakeId++
			this.setState({ fakeId: this.state.fakeId })
			const data = await this.request('https://jsonplaceholder.typicode.com/todos/', {
				method: 'POST',
				body: JSON.stringify({
					title: this.state.inputValue,
					fakeId: this.state.fakeId,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			})

			this.setState({
				fakeId: this.state.fakeId,
				todos: [data, ...this.state.todos],
				inputValueID: '',
				inputValue: '',
				errorID: '',
			})
		} else {
			this.setState({
				errorTitle: 'Please enter title',
				errorID: '',
			})
		}
	}

	deleteTodoByID = async () => {
		if (this.state.inputValueID) {
			const id = this.state.inputValueID

			if (id > this.state.fakeId) {
				this.setState({
					errorID: 'ID not found',
				})
			}
			await this.request(`https://jsonplaceholder.typicode.com/todos/${id}`, {
				method: 'DELETE',
			})

			this.setState({
				todos: [...this.state.todos.filter((todo) => todo.fakeId !== id)],
			})

			this.state.inputValueID = ''
		} else {
			this.setState({
				errorID: 'Please enter ID',
				errorTitle: '',
			})
		}
	}

	changeTodoByID = async () => {
		if (this.state.inputValueID && this.state.inputValue) {
			const id = this.state.inputValueID
			await this.request(`https://jsonplaceholder.typicode.com/todos/${id}`, {
				method: 'PUT',
				body: JSON.stringify({
					title: this.state.inputValue,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			})

			this.setState({
				todos: this.state.todos.map((todo) => {
					if (todo.fakeId === this.state.inputValueID) {
						todo.title = this.state.inputValue
					}
					return todo
				}),
			})

			this.setState({
				inputValueID: '',
				inputValue: '',
			})
		} else {
			this.setState({
				errorID: 'Please enter ID',
				errorTitle: 'Please enter title',
			})
		}
	}

	getAllTodos = async (limit) => {
		const todos = await this.request(`https://jsonplaceholder.typicode.com/todos/?_limit=${limit}`)

		return todos
	}

	async componentDidMount() {
		const tasks = await this.getAllTodos(10)

		const newTasks = tasks.map((todo) => {
			todo.fakeId = todo.id
			this.setState({ fakeId: todo.id })
			return todo
		})

		this.setState({ todos: newTasks.reverse() })
	}

	render() {
		return (
			<div className="container">
				<div className="wrapper">
					<div className="buttons">
						<button onClick={this.addTodo}>Add</button>
						<button onClick={this.deleteTodoByID}>Delete</button>
						<button onClick={this.changeTodoByID}>Change</button>
					</div>
					<input
						type="number"
						placeholder="Please enter ID"
						value={this.state.inputValueID}
						onChange={(event) =>
							this.setState({ inputValueID: Number(event.target.value), errorID: '' })
						}
					/>
					<span className="error">{this.state.errorID}</span>

					<input
						placeholder="Please enter title"
						value={this.state.inputValue}
						onChange={(event) => this.setState({ inputValue: event.target.value, errorTitle: '' })}
					/>
					<span className="error">{this.state.errorTitle}</span>
				</div>
				<ul className="todo">
					{this.state.todos.map((todo) => (
						<List key={todo.fakeId} id={todo.fakeId} title={todo.title} />
					))}
				</ul>
			</div>
		)
	}
}

export default App

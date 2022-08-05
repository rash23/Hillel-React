import React from 'react'
import './List.css'

class List extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<li className="item">
				<div className="item-id">{this.props.id}</div>
				<div className="item-title">{this.props.title}</div>
			</li>
		)
	}
}

export default List

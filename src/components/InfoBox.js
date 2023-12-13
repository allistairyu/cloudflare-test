import React from 'react'

export default function InfoBox(props) {
	const node = props.node
	let name
	switch(node.type) {
		case 'employee':
			name = 'Name: '
			break
		case 'department':
			name = 'Department: '
			break
	}

	return (
		<div>
			<ul>{name} {node.name}</ul>
			<ul>{node.managerName ? 'Manager: ' + node.managerName : node.managerName}</ul>
			<ul>{node.department ? 'Department: ' + node.department : node.department}</ul>
			<ul>{node.salary ? 'Salary: ' + node.salary : node.salary}</ul>
			<ul>{node.office ? 'Office: ' + node.office : node.office}</ul>
			<ul>{node.position ? 'Position: ' + node.position : node.position}</ul>
			<ul>{node.skills ? 'Skills: ' + node.skills : node.skills}</ul>
		</div>
  	)
}

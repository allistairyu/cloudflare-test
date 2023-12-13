import React from 'react'
import { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import InfoBox from './InfoBox';

export default function OrgChart() {
	const [originalOrg, setOriginalOrg] = useState(null)
	const [org, setOrg] = useState(null)
	const [nodeData, setNodeData] = useState(null)
	const [name, setName] = useState("")
	const [minSalary, setMinSalary] = useState(0)
	const [maxSalary, setMaxSalary] = useState(999999999)
	const [department, setDepartment] = useState("")
	const [office, setOffice] = useState("")
	const [skill, setSkill] = useState("")

	const jsonToDatasource = (json) => {
		let ds = {
			name: "Organization",
			children: []
		}
		json.organization.departments.forEach(d => {
			let new_department = {
				name: d.name,
				managerName: d.managerName,
				type: "department"
			}
			d.employees.forEach(e => {
				e.type = "employee"
			})
			new_department.children = d.employees
			ds.children.push(new_department)
		});
		return ds
	}

	useEffect(() => {
		async function getOrg() {
			try {
				const response = await fetch("/organization-chart");
				let json = await response.json()
				const ds = jsonToDatasource(json)
				console.log(ds)
				setOriginalOrg(ds)
				setOrg(ds)
			} catch (e) {
				console.error(e)
			}
		}
		getOrg()
	}, []);

	const hover = (node) => {
		setNodeData(node.data)
	}

	const leave = () => {
		setNodeData(null)
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		
		let newOrg = { name: "Organization", children: []}
		const nameRegex = new RegExp(name, 'i')
		const departmentRegex = new RegExp(department, 'i')
		const officeRegex = new RegExp(office, 'i')
		const skillRegex = new RegExp(skill, 'i')


		originalOrg.children.forEach((d) => {
			if (departmentRegex.test(d.name)) {
				let e = d.children.filter(employee => {
					const skillsTest = employee.skills.some(skill => skillRegex.test(skill))
					return nameRegex.test(employee.name) && officeRegex.test(employee.office) && employee.salary >= Number(minSalary) && employee.salary <= Number(maxSalary) && skillsTest
				})
				if (e.length > 0) {
					newOrg.children.push({
						managerName: d.managerName, 
						name: d.name,
						type: 'department',
						children: e
					})
				}
			}
		})
		console.log(newOrg)
		setOrg(newOrg)
	}

	const handleReset = () => {
		setName("")
		setDepartment("")
		setMaxSalary(999999999)
		setMinSalary(0)
		setOffice("")
		setSkill("")
		setOrg(originalOrg)
		console.log(originalOrg)
	}

	return (
		<div>
			<h2>
				Hover over a node to learn more about the department/individual
			</h2>
			<h2>
				Click a node to collapse/expand
			</h2>
			<h2>
				Scroll to zoom in/out
			</h2>
			<h2>
				Search for employees by fields with regular expressions
			</h2>
			<div id="treeWrapper" style={{ width: '100%', height: '40vh', borderStyle: 'solid' }}>
				{org !== null && <Tree 
									data={org} 
									orientation="vertical"
									zoom={.5}
									pathFunc="step"
									onNodeMouseOver={hover}
									onNodeMouseOut={leave}
									// nodeSize={{x: 200, y: 400}}
									separation={{nonSiblings: 1.75, siblings: 1.5}}
								/>}
			</div>
			<div style={{margin: 'auto', display: 'flex', padding: '10px'}}>
				<div style={{
					margin: 'auto', 
					border: '5px solid',
					width: '30vh', 
					height: '20vh',
					padding: '10px',
					display: 'flex'
				}}>
					{nodeData !== null && <InfoBox node={nodeData} />}
					</div>


					<div style={{
					margin: 'auto', 
					border: '5px solid',
					width: '30vh', 
					height: '30vh',
					padding: '10px',
					display: 'flex'
				}}>
						<form onSubmit={handleSubmit}>
							<label>
								Name:{"\t"}
								<input
									type="text" 
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
								<br></br>
							</label>
							<label>
								Department:{"\t"}
								<input
									type="text" 
									value={department}
									onChange={(e) => setDepartment(e.target.value)}
								/>
								<br></br>
							</label>
							<label>
								Office:{"\t"}
								<input
									type="text" 
									value={office}
									onChange={(e) => setOffice(e.target.value)}
								/>
								<br></br>
							</label>
							<label>
								Skill:{"\t"}
								<input
									type="text" 
									value={skill}
									onChange={(e) => setSkill(e.target.value)}
								/>
								<br></br>
							</label>
							<label>
								Min Salary:{"\t"}
								<input
									type="text" 
									value={minSalary}
									onChange={(e) => setMinSalary(Number(e.target.value))}
								/>
								<br></br>
							</label>
							<label>
								Max Salary:{"\t"}
								<input
									type="text" 
									value={maxSalary}
									onChange={(e) => setMaxSalary(Number(e.target.value))}
								/>
								<br></br>
							</label>
						</form>
						<button onClick={handleSubmit}>Submit</button>
						<button onClick={handleReset}>Reset</button>
					</div>
			</div>
		</div>
	)
}

async function onRequestGet(context) {
	console.log("onRequestGet")
	try {
		const value = await context.env.ORG.get("organization-chart");
		const json = JSON.parse(value)
		return Response.json(json)
	} catch (e) {
		return Response.json({})
	}
}

async function onRequestPost(context) {
	try {
		const body = await context.request.json()
		const csv = body["organizationData"]
		if (typeof csv === 'undefined') {
			return new Response("Request body must be in format of { 'organizationData' : string }")
		}
		const json = csvStrToJSON(csv)
		return Response.json(json)
	} catch (e) {
		return new Response(e)
	}
}

const csvStrToJSON = (csv) => {
	let lines = csv.split(/\r?\n/)
	let json = {}
	let departments = {}

	// skip header
	lines.slice(1).forEach(row => {
		row = row.split(",")
		let [name, department, salary, office, isManagerStr] = row.slice(0, 5)
		let skills = row.slice(5)
		if (!departments.hasOwnProperty(department)) {
			let new_dep = {
				'name': department,
                'managerName': '',
                'employees': [],
			}
			departments[department] = new_dep
		}
		const isManager = isManagerStr === 'TRUE' ? true : false
		if (isManager) {
			departments[department]['managerName'] = name
		}
		let employee = {
			'name': name,
            'department': department,
            'salary': Number(salary),
            'office': office,
            'isManager': isManager,
            'skills': skills,
		}
		departments[department]['employees'].push(employee)
	})
	let organization = {
		'departments': Object.values(departments)
	}
	json['organization'] = organization
	return json
}

export { onRequestGet, onRequestPost }
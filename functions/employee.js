export async function onRequestPost(context) {
	try {
		const request = await context.request.json()
		const orgJSONStr = await context.env.ORG.get("organization-chart");
		const orgJSON = JSON.parse(orgJSONStr)
		const org = orgJSON['organization']
		// { "name" : string, "department": string, "minSalary": number,
		// "maxSalary": number, "office": string, "skill": string}
		let name = (typeof request.name === 'undefined') ? "" : request.name
		let department = (typeof request.department === 'undefined') ? "" : request.department
		let office = (typeof request.office === 'undefined') ? "" : request.office
		let skill = (typeof request.skill === 'undefined') ? "" : request.skill
		let minSalary = (typeof request.minSalary === 'undefined') ? 0 : request.minSalary
		let maxSalary = (typeof request.maxSalary === 'undefined') ? Infinity : request.maxSalary

		const nameRegex = new RegExp(name)
		const departmentRegex = new RegExp(department)
		const officeRegex = new RegExp(office)
		const skillRegex = new RegExp(skill)
		
		let employees = []
		org.departments.forEach(d => {
			if (departmentRegex.test(d)) {
				let e = d.employees.filter((e) => {
					const skillsTest = e.skills.some(skill => skillRegex.test(skill))
					return nameRegex.test(e.name) && officeRegex.test(e.office) && skillsTest && e.salary >= minSalary && e.salary <= maxSalary
				})
				employees = employees.concat(e)
			}
		});
		const json = {"employees": employees}
		return Response.json(json)
	} catch (e) {
		return new Response(e)
	}
}
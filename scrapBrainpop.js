const { exec } = require('child_process')
const rp = require('request-promise')
const { promisify } = require("es6-promisify");

execPromise = promisify(exec)

const getMpegTitle = html => html.match(/[0-9]*.mp4"/g)[3].trim().slice(0, -1)
const getSubURLs = html => html.match(/"url":"[^"]*/g).filter(x => !x.includes('https')).map(x => x.split('').filter(x => !x.includes("\\")).join('').split(':"')[1])
const getData = html => JSON.parse(`{${html.match(/"synopsis":".+?(?="name_app")/)[0].slice(0, -1)}}`)
const getECToken = html => html.match(/ec_token:[^,]*/g)[0].split('\'')[1].slice(0, -1)
const formatFileName = string => string.split(' ').join('')

async function scrapMovies() {
	const baseURL = "https://www.brainpop.com/"
	const rootDirs = ["science", "english", "math", "health", "socialstudies", "artsandmusic", "technology"]

	for (let rootDir of rootDirs) {
		const html = await rp(`${baseURL}${rootDir} `)

		for (let topic of getSubURLs(html)) {
			const html = await rp(`${baseURL}${topic} `)


			for (let moviePage of getSubURLs(html)) {
				console.log(moviePage)
				const html = await execPromise(`curl 'https://www.brainpop.com${moviePage}' -H 'Connection: keep-alive' -H 'Cache-Control: max-age=0' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36' -H 'Sec-Fetch-User: ?1' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' -H 'Sec-Fetch-Site: none' -H 'Sec-Fetch-Mode: navigate' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9' -H 'Cookie: country=United+States; _ga=GA1.2.976613403.1579148380; _gid=GA1.2.1694949471.1579148380; bp_session=p1msje448trhala85fapvm8rj2; user_session=757456a9dec6f324bf39a3738b2e9ea9; incap_ses_482_1430439=GaaSR+DrxHjGE5AAjGmwBsc6IV4AAAAAWa9Fa7/lQHO4YVaXPoGkkg==; incap_ses_144_1430439=wo7EY/n9x2KYMFOpkJj/AStHIV4AAAAAn6wkyHhr7k0kDv44oiwSwQ==; incap_ses_886_1430439=i1L9OGOeN298xhbISbVLDMZNIV4AAAAAgYp/xv2DsTF1nxaw1qE85A==; incap_ses_890_1430439=XPAjWD/QLSeKaeX7T+tZDGJWIV4AAAAAAl5G2aW9GmHrBVgokaNCGQ==; incap_ses_484_1430439=z3fKeCDGJBEP31FJkIS3BmNWIV4AAAAA9dSniegLRKQpNiHMHGUKLg==; incap_ses_483_1430439=YyjJR/r85BSsnmRzpPezBmNWIV4AAAAAZyYBuVugP+0zvxQPM422JA==; incap_ses_1212_1430439=lERceyq9D2DHmjmmiOTREJ5WIV4AAAAANSMd2K7nMosL81ufgUJLJQ==; incap_ses_889_1430439=EC2yfwQt+in/qcxQ311WDLhXIV4AAAAAgWCOHi3meF33IP/jIJDLHw==; incap_ses_624_1430439=KYtTCLYpiyl25s+aBeaoCMZXIV4AAAAAt76tSaQEs5JkvPGj90yCIw==; incap_ses_236_1430439=+0qFDiHy4S6ZR/PTL3JGA4xZIV4AAAAAKKzsNdNK3UCFf/V6sgApWQ==; incap_ses_622_1430439=2TJ3c966W3QIvwwG+MqhCG1dIV4AAAAARTTRcYnoZNAZqFFlgIR61g==' --compressed`)

				console.log(getECToken(html))
				// const data = getData(html)

				// console.log(`https://hls.brainpop.com${moviePage}movies/${getMpegTitle(html)}+0.ts?${getECToken(html)}`)
				// await execPromise(`source bashScrap.sh && scrapbrainpop ${moviePage} ${getMpegTitle(html)} ${getECToken(html)} ${formatFileName(data.name)}`)
				process.abort('Abort!')
			}
		}
	}
}

scrapMovies()
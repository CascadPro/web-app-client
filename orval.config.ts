import { defineConfig } from "orval"

export default defineConfig({
	api: {
		input: "http://localhost:8000/swagger/doc.json",
		output: {
			target: "./src/api/generated.ts",
			client: "axios"
		}
	}
})

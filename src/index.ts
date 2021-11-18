require('dotenv').config()
import express, { Application, Request, Response } from "express";
import acClient from './activeCollabClient';
import { handleGitlabWebhook } from "./api";

const app: Application = express();
const port = 80;


(async()=>{
	await acClient.issueToken();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	
	app.get(
		"/",
		async (req: Request, res: Response): Promise<Response> => {
			return res.status(200).send({
				message: "Hello World!",
			});
		}
	);

	app.get(
		"/webhook",
		async (req: Request, res: Response): Promise<Response> => {
			try {
				const data=await handleGitlabWebhook(req.body);
				return res.status(200).json(data);
			} catch (error) {
				return res.status(500);
			}
			
		}
	);

	app.post(
		"/webhook",
		async (req: Request, res: Response): Promise<Response> => {
			try {
				const data=await handleGitlabWebhook(req.body);
				console.log(req.body)
				return res.status(200).json(data);
			} catch (error) {
				return res.status(500);
			}
			
		}
	);
	
	try {
		app.listen(port, (): void => {
			console.log(`Connected successfully on port ${port}`);
		});
	} catch (error: any) {
		console.error(`Error occured: ${error.message}`);
	}
	
})()


